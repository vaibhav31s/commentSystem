<?php


use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';




$app -> post('/api/createPost', function(Request $request, Response $response) {
    $jsonBody = $request->getBody();
    $data = json_decode($jsonBody, true);
    $title = $data['title']; 
    $description = $data['description'];
    $userId = $data['userId'];
    $tags = $data['tags'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $date = date("Y-m-d H:i:s");
    $queryBuilder
    ->insert('Blog')
    ->values(
        [
            'Title' => '?',
            'Description' => '?',
            'authorId' => '?',
            'timestamp' => '?',
            'tags' => '?'

        ]
    )
    ->setParameter(0, $title)
    ->setParameter(1, $description)
    ->setParameter(2, $userId)
    ->setParameter(3, $date)
    ->setParameter(4, $tags);
        

    $results = $queryBuilder->executeStatement();
    
   
    if($results) {
        $response->getBody()->write('
        {
            "message": "Post Created Successfully!"
        }');
        return $response->withHeader('Content-Type', 'application/json');
    } 

    
     
    $response->getBody()->write(json_encode("There is problem in creating post!"));
    return $response->withHeader('Content-Type', 'application/json');
}) -> add($jsonBodyParser);

$app -> get('/api/blogs', function(Request $request, Response $response) {
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('*')
        ->from('Blog')
        ->orderBy('timestamp', 'ASC');

    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});

//get blogs by user id  
$app -> get('/api/user/{id}', function(Request $request, Response $response, $args) {
    $id = $args['id'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('*')
        ->from('Blog')
        ->where('authorId = ?')
        ->setParameter(0, $id)
        ->orderBy('timestamp', 'ASC');

    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});

//get blog by blog id
$app -> get('/api/blog/{id}', function(Request $request, Response $response, $args) {
    $id = $args['id'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('*')
        ->from('Blog')
        ->where('Id = ?')
        ->setParameter(0, $id);

    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});

