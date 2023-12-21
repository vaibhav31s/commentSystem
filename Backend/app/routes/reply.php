<?php
//all api routes will be defined here
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';

function getVotesForReply($replyId, $flatResults)
{
    $votes = [
        'upvotes' => 0,
        'downvotes' => 0,
    ];

    foreach ($flatResults as $result) {
        if ($result['mainReplyId'] == $replyId) {
            if ($result['voteType'] == 'up') {
                $votes['upvotes']++;
            } elseif ($result['voteType'] == 'down') {
                $votes['downvotes']++;
            }
        }
    }

    return $votes;
}
function buildNestedReplies($flatResults, $parentId = null)
{
    $nestedResults = [];

    //build nested replies
    foreach ($flatResults as $result) {
        if ($result['replyId'] == $parentId) {
            
            $result['replies'] = buildNestedReplies($flatResults, $result['mainReplyId']);
            $result['votes'] = getVotesForReply($result['mainReplyId'], $flatResults);

            $nestedResults[] = $result;
            
            
        }
    }

    return $nestedResults;
}

function countNestedReplies($nestedResults){
    $count = 0;
    foreach($nestedResults as $result){
        $count++;
        if(isset($result['replies'])){
            $count += countNestedReplies($result['replies']);
        }
    }

    return $count;
}

$app -> get('/api/replies/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
  
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder
    ->select ( 'r.id as mainReplyId','reply', 'r.replyId', 'r.authorName', 'r.timestamp', "r.blogId", "r.authorId" , 'v.voteType' )
    ->distinct()
    ->from('Replies', 'r')
    ->innerJoin('r', 'Blog', 'b', 'r.blogId = b.id')
    ->innerJoin('r', 'Comment','c', 'r.blogId = c.blogId')
    ->leftJoin('r', 'Vote', 'v', 'r.id = v.replyId')
    ->where('r.blogId = ?')
    ->setParameter(1, $id);
    


    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $nestedResults = buildNestedReplies($results);
    
    for($i = 0; $i < count($nestedResults); $i++){
        $nestedResults[$i]['replyCount'] = countNestedReplies($nestedResults[$i]['replies']);
    }
    
    
    $response->getBody()->write(json_encode($nestedResults));
    
    return $response->withHeader('Content-Type', 'application/json');

});

$app -> post('/api/create/reply', function (Request $request, Response $response, $args) {
    $jsonBody = $request->getBody();
    $body = json_decode($jsonBody, true);
    $reply = $body['reply'];
    $replyId = $body['replyId'];
    $authorName = $body['authorName'];
    $blogId = $body['blogId'];
    $timestamp = $body['timestamp'];
    $authorId = $body['authorId'];


    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder
    ->insert('Replies')
    ->values([
        'reply' => '?',
        'replyId' => '?',
        'authorName' => '?',
        'blogId' => '?',
        'timestamp' => '?',
        'authorId' => '?'
    ])
    ->setParameter(0, $reply)
    ->setParameter(1, $replyId)
    ->setParameter(2, $authorName)
    ->setParameter(3, $blogId)
    ->setParameter(4, $timestamp)
    ->setParameter(5, $authorId)
    ;
    $results = $queryBuilder->execute();
    if($results > 0){
    $response->getBody()->write(json_encode("Created Successfully!"));
    return $response->withHeader('Content-Type', 'application/json');
    }

    return $response->withHeader('Content-Type', 'application/json')->withStatus(500);

});

$app->post('/api/reply/getlastkey', function (Request $request, Response $response) {
    $jsonBody = $request->getBody();
    $body = json_decode($jsonBody, true);
    $blogId = $body['blogId'];
    $timestamp = $body['timestamp'];
    $authorId = $body['authorId'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();

    $queryBuilder -> select('id')
    ->from('Replies')
    ->where('blogId = ? and timestamp = ? and authorId = ?')
 
    ->setParameter(0, $blogId)
    ->setParameter(1, $timestamp)
    ->setParameter(2, $authorId)
    ;

  
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});


$app->post('/api/reply/delete', function (Request $request, Response $response) {
    $jsonBody = $request->getBody();
    $body = json_decode($jsonBody, true);
    $replyId = $body['replyId'];

    $queryBuilder = $this->get('DB')->getQueryBuilder();
    
    $queryBuilder -> 
    update('Replies')
    ->set('reply', '?')
    ->where('id = ?')
    ->setParameter(1, 'This reply has been deleted')
    ->setParameter(2, $replyId);

    
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/api/reply/edit', function (Request $request, Response $response) {
    $jsonBody = $request->getBody();
    $body = json_decode($jsonBody, true);
    $replyId = $body['replyId'];
    $reply = $body['reply'];

    $queryBuilder = $this->get('DB')->getQueryBuilder();
    
    $queryBuilder -> 
    update('Replies')
    ->set('reply', '?')
    ->where('id = ?')
    ->setParameter(1, $reply)
    ->setParameter(2, $replyId);

    
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});


