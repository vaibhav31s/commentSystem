<?php

use Doctrine\DBAL\DriverManager  as DriverManager;

class DB {
    private $conn;
    private $connectionParams;

    public function __construct(Config $config) {
        $this->connectionParams = $config->getDbConfig();
        
        $this->conn = DriverManager::getConnection
        ($this->connectionParams);
        
    }
    /** A fresh query builder per call, so one route's query can't leak into another's. */
    public function getQueryBuilder() {
        return $this->conn->createQueryBuilder();
    }

    public function getConnection() {
        return $this->conn;
    }
    
    
}