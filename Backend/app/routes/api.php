<?php
//all api routes will be defined here
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/vaibhav', function(Request $request, Response $response, $args) {
    $response->getBody()->write("Hello Vaibhav!");
    return $response->withHeader('Content-Type', 'application/json');
});

$app -> get('/users/{id}', function(Request $request, Response $response, $args) {
    $id = $args['id'];
    $response->getBody()->write("Hello user $id!");
    return $response->withHeader('Content-Type', 'application/json');
});

//users api routes
include __DIR__ . '/user.php';

//blogs api routes
include __DIR__ . '/blog.php';

//comments api routes
include __DIR__ . '/comment.php';

//replies api routes
include __DIR__ . '/reply.php';

//votes api routes
include __DIR__ . '/votes.php';

//moderator api routes
include __DIR__ . '/moderator.php';