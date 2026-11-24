<?php

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

const AUTH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days

function authSecret(): string
{
    $secret = getenv('JWT_SECRET') ?: '';
    if (strlen($secret) < 32) {
        throw new RuntimeException('JWT_SECRET must be set to a long random value');
    }
    return $secret;
}

/** Signed login token for a user (HS256, 7-day expiry). */
function issueAuthToken(int|string $userId, string $name): string
{
    $now = time();
    return JWT::encode([
        'sub' => (string) $userId,
        'name' => $name,
        'iat' => $now,
        'exp' => $now + AUTH_TOKEN_TTL,
    ], authSecret(), 'HS256');
}

function jsonResponse(Response $response, array $body, int $status = 200): Response
{
    $response->getBody()->write(json_encode($body));
    return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
}

/**
 * Requires `Authorization: Bearer <token>`. On success the request gets
 * `userId` and `userName` attributes; handlers must use these instead of
 * any user id sent in the request body.
 */
$authMiddleware = function (Request $request, RequestHandler $handler): Response {
    $header = $request->getHeaderLine('Authorization');
    if (!preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
        return jsonResponse(new SlimResponse(), ['error' => 'Unauthorised', 'message' => 'Please log in.'], 401);
    }
    try {
        $claims = JWT::decode($m[1], new Key(authSecret(), 'HS256'));
    } catch (ExpiredException $e) {
        return jsonResponse(new SlimResponse(), ['error' => 'Unauthorised', 'message' => 'Your session has expired. Please log in again.'], 401);
    } catch (Throwable $e) {
        return jsonResponse(new SlimResponse(), ['error' => 'Unauthorised', 'message' => 'Invalid session. Please log in again.'], 401);
    }
    if (empty($claims->sub)) {
        return jsonResponse(new SlimResponse(), ['error' => 'Unauthorised', 'message' => 'Invalid session.'], 401);
    }
    $request = $request
        ->withAttribute('userId', (string) $claims->sub)
        ->withAttribute('userName', (string) ($claims->name ?? ''));
    return $handler->handle($request);
};
