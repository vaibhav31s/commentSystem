<?php

class Config {
    private $dbSettings;
    private $errorSettings;
    
    public function __construct() {
       $password = getenv('DB_PASSWORD');
       if ($password === false || $password === '') {
            throw new RuntimeException('DB_PASSWORD environment variable is not set (see .env.example)');
       }
       $this->dbSettings = [
            'dbname' => getenv('DB_NAME') ?: 'slimphp',
            'user' => getenv('DB_USER') ?: 'vaibhav',
            'password' => $password,
            'host' => getenv('DB_HOST') ?: 'mysql',
            'driver' => getenv('DB_DRIVER') ?: 'pdo_mysql'
       ];
    }

    public function getDbConfig() {
        return $this ->  dbSettings;
    }
}