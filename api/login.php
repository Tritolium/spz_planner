<?php
include_once './config/database.php';

if($_SERVER['REQUEST_METHOD'] != 'GET'){
    http_response_code(501);
    exit();
}

$database = new Database();
$db_conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;

$statement = $db_conn->prepare('SELECT api_token, forename, surname WHERE forename + ' ' + surname = %:name%');
$statement->bindParam(":name", $name);

if($statement->execute()){
    if($statement->rowCount() == 1){
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        extract($row);
        $response_body = array(
            "Forename" => $forename,
            "Surname" => $surname,
            "API_token" => $api_token
        )

        response_with_data(200, $response_body);
    } else {
        http_response_code(404);
        exit();
    }
}

?>