<?php


use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';


$app -> post('/createComment', function(Request $request, Response $response) {
    $jsonBody = $request->getBody();
    $data = json_decode($jsonBody, true);
    $authorId = $data['authorId'];
    $blogId = $data['blogId'];
    $comment = $data['comment'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $date = date("Y-m-d H:i:s");
    $queryBuilder -> insert('Comment')
    -> values(
        [
            'authorId' => '?',
            'blogId' => '?',
            'comment' => '?',
            'timestamp' => '?',
        ]
    )
    -> setParameter(0, $authorId)
    -> setParameter(1, $blogId)
    -> setParameter(2, $comment)
    -> setParameter(3, $date);
    
    $results = $queryBuilder->executeStatement();
    if($results) {
        $response->getBody()->write('
        {
            "message": "Comment Created Successfully!"
        }');
        return $response->withHeader('Content-Type', 'application/json');
    }
    $response->getBody()->write(json_encode("There is problem in creating comment!"));
    return $response->withHeader('Content-Type', 'application/json');
}) -> add($jsonBodyParser);