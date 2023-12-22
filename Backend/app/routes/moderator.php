<?php
//all api routes will be defined here
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';    
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';

$app->get('/moderatorcheck/{id}', function (Request $request, Response $response, $args) {
    $authorId = $args['id'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    
   

//     $repliesId =$queryBuilder->executeQuery()->fetchAllAssociative();

//     $replyIds ="";

// foreach ($repliesId as $item) {
//     if (isset($item['replyId']) && $item['replyId'] !== null) {
//         $replyIds .= $item["replyId"] .",";
//     }
// }


$queryBuilder-> select('(replyId)')
->from('Replies')
->distinct()
->where( 'replyId  IN (SELECT replyId FROM Vote WHERE voteType = "up")  AND authorId != ?  ')
->setParameter('0', $authorId);
// $result = $queryBuilder->execute()->fetchAllAssociative();

        
$results = $queryBuilder->executeQuery()->fetchAllAssociative();
$len = count($results);

// $response->getBody()->write(json_encode('"count" : $len '));

$response->getBody()->write('
{
    "count": '.$len.'
}');

return $response->withHeader('Content-Type', 'application/json');
});