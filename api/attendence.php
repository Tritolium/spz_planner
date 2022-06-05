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

    $query = 'SELECT tblAttendence.event_id, tblAttendence.attendence FROM tblAttendence JOIN tblMembers ON tblAttendence.member_id=tblMembers.member_id WHERE tblMembers.api_token=:api_token';
    $statement = $db_conn->prepare($query);
    $statement->bindParam(':api_token', $api_token);

    if($statement->execute()){
        $attendence_arr = array();
        while($row = $statement->fetch(PDO::FETCH_ASSOC)) {
           extract($row);
           $attendence_item = array(
               "Event_ID"   => intval($event_id),
               "Attendence" => $attendence
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