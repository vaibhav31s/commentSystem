<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->get('/vaibhav', function(Request $request, Response $response, $args) {
    $response->getBody()->write("Hello Vaibhav!");
    return $response;
});

$app -> get('/users/{id}', function(Request $request, Response $response, $args) {
    $id = $args['id'];
    $response->getBody()->write("Hello user $id!");
    return $response;
});

$app->run();