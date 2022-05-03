<?php
include_once './config/database.php';

if($_SERVER['REQUEST_METHOD'] != 'GET'){
    http_response_code(501);
    exit();
}

$database = new Database();
$db_conn = $database->getConnection();

if(!isset($_GET['name'])){
    http_response_code(400);
    exit();
}
$name = '%' . $_GET['name'] . '%';

$statement = $db_conn->prepare('SELECT * FROM tblMembers WHERE CONCAT(forename, \' \', surname) LIKE :full_name');
$statement->bindParam(":full_name", $name);

if($statement->execute()){
    if($statement->rowCount() == 1){
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        extract($row);
        $response_body = array(
            "Forename" => $forename,
            "Surname" => $surname,
            "API_token" => $api_token
        );

        response_with_data(200, $response_body);
    } else {
        http_response_code(404);
        exit();
    }
}

?>