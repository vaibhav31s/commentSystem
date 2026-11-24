<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

/**
 * CORS for the React frontend. Allowed origins come from CORS_ORIGINS
 * (comma separated); answers preflight OPTIONS requests directly.
 */
$corsMiddleware = function (Request $request, RequestHandler $handler) {
    $allowed = array_filter(array_map('trim', explode(',', getenv('CORS_ORIGINS') ?: '')));
    $origin = $request->getHeaderLine('Origin');

    $response = strtoupper($request->getMethod()) === 'OPTIONS'
        ? (new SlimResponse())->withStatus(204)
        : $handler->handle($request);

    if ($origin !== '' && (in_array($origin, $allowed, true) || preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin))) {
        $response = $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Vary', 'Origin')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withHeader('Access-Control-Max-Age', '86400');
    }
    return $response;
};
