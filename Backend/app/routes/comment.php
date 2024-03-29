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
    $name = $data['authorName'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $date = date("Y-m-d H:i:s");
    $queryBuilder -> insert('Comment')
    -> values(
        [
            'authorId' => '?',
            'blogId' => '?',
            'comment' => '?',
            'timestamp' => '?',
            'authorName' => '?',
        ]
    )
    -> setParameter(0, $authorId)
    -> setParameter(1, $blogId)
    -> setParameter(2, $comment)
    -> setParameter(3, $date)
    ->setParameter(4, $name);
    
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

$app -> get('/blog/{id}/comments', function(Request $request, Response $response, array $args) {
    $id = $args['id'];
  
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder -> select('*')
    -> from('Comment')
    -> where('blogId = ?')
    -> setParameter(1, $id);
    
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});

$app -> get('/blog/{id}/votes', function(Request $request, Response $response, array $args) {
    $id = $args['id'];
  
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('replyId')
    ->addSelect('SUM(CASE WHEN voteType = \'up\' THEN 1 ELSE 0 END) as up')
    ->addSelect('SUM(CASE WHEN voteType = \'down\' THEN 1 ELSE 0 END) as down')
    ->from('Vote')
    ->where('blogId = ?')
    ->setParameter(1, $id)
    ->groupBy('replyId')
    ->having('COUNT(*) > 0');
    
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});
