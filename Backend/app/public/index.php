<?php

use DI\Container;
use DI\ContainerBuilder;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
use Tuupola\Middleware\CorsMiddleware;
use PhpNexus\CorsPsr7\Middleware\CorsMiddleware as PhpNexusMiddleware;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

require __DIR__ . '/../vendor/autoload.php';

$containerBuilder = new ContainerBuilder();
$containerBuilder->addDefinitions(__DIR__ . '/../src/definitions.php');
$container = $containerBuilder->build();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

AppFactory::setContainer($container);   

$app = AppFactory::create();

// $app->add(new Tuupola\Middleware\CorsMiddleware([
//     "Access-Control-Allow-Origin" => ["*"],
//     "Access-Control-Allow-Origin" => ["*"],
// ]));


//add routes
include __DIR__ . '/../routes/api.php';
include __DIR__ . '/../routes/web.php';
$app->run();