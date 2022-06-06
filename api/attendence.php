<?php
include_once './config/database.php';

if(!isset($_GET['api_token'])){
    http_response_code(401);
    exit();
}

switch($_SERVER['REQUEST_METHOD']){
case 'GET':
    readAttendence($_GET['api_token']);
    break;
}

function readAttendence($api_token)
{
    $database = new Database();
    $db_conn = $database->getConnection();

    $query = "SELECT attendence, tblEvents.event_id, type, location, date FROM (SELECT * FROM `viewAttendence` WHERE `api_token` = :api_token) AS Att RIGHT JOIN tblEvents ON Att.event_id = tblEvents.event_id WHERE accepted = 1 AND date > :_now ORDER BY date";
    $statement = $db_conn->prepare($query);
    $statement->bindParam(':api_token', $api_token);
    $statement->bindValue(":_now", date("Y-m-d"));

    if($statement->execute()){
        $attendence_arr = array();
        while($row = $statement->fetch(PDO::FETCH_ASSOC)) {
           extract($row);
           $attendence_item = array(
               "Event_ID"   => intval($event_id),
               "Attendence" => intval($attendence),
               "Type"       => $type,
               "Location"   => $location,
               "Date"       => $date
           );
           array_push($attendence_arr, $attendence_item);
       }
       response_with_data(200, $attendence_arr);
       exit();
    } else {
        http_response_code(500);
        exit();
    }
}