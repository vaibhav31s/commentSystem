<?php


use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/../src/config.php';
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../middlewares/jsonBodyParser.php';



$app->post('/login', function (Request $request, Response $response, $args) {
    $jsonBody = $request->getBody();
    $data = json_decode($jsonBody, true);
    $email = $data['email'];
    $password = $data['password'];

    // $name = $request->getQueryParams()['name'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('*')
        ->from('Users')
        ->where('Email = :email')
        ->setParameter('email', $email);



    $results = $queryBuilder->executeQuery()->fetchAllAssociative();

    // if email does not exist then return
    if (count($results) == 0) {
        $response->getBody()->write('
        {
            "message": "User not found! Try creating an account.",
            "error" : "Unauthorised"
        }');

        //make this error

        return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
    }

    $hashed = $results[0]['Password'];



    if (password_verify($password, $hashed)) {
        $response->getBody()->write(json_encode(["Id" => $results[0]["Id"]] + ["Name" => $results[0]["Name"]] + ["Name" => $results[0]["Name"]] + ["avatar" => $results[0]["avatar"]]+["Email" => $email] + ["message" => "Login Successful!"]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    $response->getBody()->write('{
        "message": "Wrong Password!",
        "error" : "Unauthorised"
    }');
    return $response->withHeader('Content-Type', 'application/json') ->withStatus(401);

});


$app->post('/register', function (Request $request, Response $response) {
    $jsonBody = $request->getBody();
    $data = json_decode($jsonBody, true);
    $name = $data['name'];
    $password = $data['password'];
    $email = $data['email'];
    $hash = password_hash($password, PASSWORD_DEFAULT);




    $queryBuilder = $this->get('DB')->getQueryBuilder();

    // checks if email allready exist in the database
    $queryBuilder->select('Id')
        ->from('Users')
        ->where('email = ?')
        ->setParameter(0, $email);
    $results = $queryBuilder->executeQuery()->fetchAllAssociative();


    // if email exist then return 
    // if(count($results) > 0) {
    //     $response->getBody()->write('
    //     {
    //         "message": "Email already exist"
    //     }');
    //     return $response->withHeader('Content-Type', 'application/json');   
    // }




    $queryBuilder
        ->insert('Users')
        ->values(
            [
                'Name' => '?',
                'Password' => '?',
                'Email' => '?'
            ]
        )
        ->setParameter(0, $name)
        ->setParameter(1, $hash)
        ->setParameter(2, $email);


    $results = $queryBuilder->executeStatement();


    if ($results) {
        $response->getBody()->write('
        {
            "message": "User Created Successfully!"
        }');
        return $response->withHeader('Content-Type', 'application/json');
    }



    $response->getBody()->write(json_encode("There is problem in creating user!"));
    return $response->withHeader('Content-Type', 'application/json');
})->add($jsonBodyParser);

$app->get('/users', function (Request $request, Response $response) {
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('*')
        ->from('Users');


    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});