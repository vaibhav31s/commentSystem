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
 
$app -> post('/login', function(Request $request, Response $response, array $args) {
    $data = $request->getParsedBody();
    $email = $data['email'];
    $password = $data['password'];
    


    
    // $name = $request->getQueryParams()['name'];
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('Password', 'Id', 'Name')
        ->from('Users')
        ->where('Email = :email')
        ->setParameter('email', $email);

    

    $results = $queryBuilder->executeQuery()->fetchAllAssociative();

    // if email does not exist then return
    if(count($results) == 0) {
        $response->getBody()->write('
        {
            "message": "User not found! Try creating an account."
        }');
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    $hashed =  $results[0]['Password'];
    


    if(password_verify($password, $hashed)) {
        $response->getBody()->write(json_encode(["Id" => $results[0]["Id"]] + ["Name" => $results[0]["Name"]] + ["Name" => $results[0]["Name"]] + ["Email" => $email] + ["message" => "Login Successful!"]));
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    $response->getBody()->write(json_encode("Wrong Password"));
    return $response->withHeader('Content-Type', 'application/json');

});

$app -> post('/register', function(Request $request, Response $response) {
    $data = $request->getParsedBody();
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
    if(count($results) > 0) {
        $response->getBody()->write('
        {
            "message": "Email already exist"
        }');
        return $response->withHeader('Content-Type', 'application/json');   
    }


  

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
    
   
    if($results) {
        $response->getBody()->write('
        {
            "message": "User Created Successfully!"
        }');
        return $response->withHeader('Content-Type', 'application/json');
    } 

    
     
    $response->getBody()->write(json_encode("There is problem in creating user!"));
    return $response->withHeader('Content-Type', 'application/json');
}) -> add($jsonBodyParser);

$app -> get('/users', function(Request $request, Response $response) {
    $queryBuilder = $this->get('DB')->getQueryBuilder();
    $queryBuilder->select('*')
        ->from('Users');


    $results = $queryBuilder->executeQuery()->fetchAllAssociative();
    $response->getBody()->write(json_encode($results));
    return $response->withHeader('Content-Type', 'application/json');
});