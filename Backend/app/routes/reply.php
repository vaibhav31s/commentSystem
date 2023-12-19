<?php


use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';

function buildNestedReplies($flatResults, $parentId = null)
{
    $nestedResults = [];

    foreach ($flatResults as $result) {
        if ($result['replyId'] == $parentId) {
            $result['replies'] = buildNestedReplies($flatResults, $result['mainReplyId']);
            $nestedResults[] = $result;
        }
    }

    return $nestedResults;
}
$app -> get('/replies/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
  
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder
    ->select ( 'r.id as mainReplyId','reply', 'replyId', 'r.authorName', 'r.timestamp', 'r.commentId')
    ->distinct()
    ->from('Replies', 'r')
    ->innerJoin('r', 'Blog', 'b', 'r.blogId = b.id')
    ->innerJoin('r', 'Comment','c', 'r.blogId = c.blogId')
    ->where('r.commentId = ?')
    ->setParameter(1, $id);


    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $nestedResults = buildNestedReplies($results);
    $response->getBody()->write(json_encode($nestedResults));
    
    return $response->withHeader('Content-Type', 'application/json');

});
     
