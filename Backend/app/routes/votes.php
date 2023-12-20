<?php
//all api routes will be defined here
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';

$app -> post('/reply/votes', function (Request $request, Response $response, $args) {
    $jsonBody = $request->getBody();
    $body = json_decode($jsonBody, true);
    $replyId = $body['replyId'];
    $authorId = $body['authorId'];
    $voteType = $body['voteType'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();    
    $queryBuilder -> select('voteType')
    -> from('Vote')
    -> where('replyId = ?')
    -> andWhere('authorId = ?')
    -> setParameter(0, $replyId)
    -> setParameter(1, $authorId);
    
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    // echo  json_encode($results);
    if(count($results) > 0 ){
        if($results[0]['voteType'] == $voteType){
            $response->getBody()->write('
            {
                "message": "You have already voted!"
            }');
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        } else {
            $vote = $results[0]['voteType'];
            if($vote == "up")   $vote = 'down';
            else $vote = 'up';
            $queryBuilder -> 
            update('Vote')
            ->set('voteType', '?')
            ->where('replyId = ? and authorId = ?')
            ->setParameter(0, $vote)
            ->setParameter(1, $replyId)
            ->setParameter(2, $authorId);
            $results = $queryBuilder->executeStatement();
            if($results) {
                $response->getBody()->write('
                {
                    "message": "Vote Updated Successfully!"
                }');
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                $response->getBody()->write(json_encode("There is problem in updating vote!"));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
            }
        }
    }



    $queryBuilder -> insert('Vote') 
        -> values(
            [
                'replyId' => '?',
                'authorId' => '?',
                'voteType' => '?',
            ]
        )
        -> setParameter(0, $replyId)
        -> setParameter(1, $authorId)
        -> setParameter(2, $voteType);

        $results = $queryBuilder->executeStatement();
                
        if($results) {
            $response->getBody()->write('
            {
                "message": "Vote Created Successfully!"
            }');
            return $response->withHeader('Content-Type', 'application/json');
        } else {
            $response->getBody()->write(json_encode("There is No Comment in creating vote!"));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }

});

$app->get('/reply/{id}/votes', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder 
    ->select('COUNT(*) as votes')
    -> from('Vote')
    -> where('replyId = ?')
    -> setParameter(0, $id);
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});

$app-> delete('/vote/delete', function (Request $request, Response $response, $args) {
    $jsonBody = $request->getBody();
    $body = json_decode($jsonBody, true);
    $replyId = $body['replyId'];
    $authorId = $body['authorId'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder -> delete('Vote')
    -> where('replyId = ?')
    -> andWhere('authorId = ?')
    -> setParameter(0, $replyId)
    -> setParameter(1, $authorId);
    $results = $queryBuilder->executeStatement();
    if($results) {
        $response->getBody()->write('
        {
            "message": "Vote Deleted Successfully!"
        }');
        return $response->withHeader('Content-Type', 'application/json');
    } else {
        $response->getBody()->write('
        {
            "message": "There is problem in deleting vote! Possible that there is no vote with this reply!""
        }');
 
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
});
