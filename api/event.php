<?php
include_once './config/database.php';
include_once './model/event.php';

$database = new Database();

$db_conn = $database->getConnection();

$event = new Event($db_conn);

$data = json_decode(file_get_contents("php://input"));

header('content-type: application/json');

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET':
        $stmt = $event->read();
        $num = $stmt->rowCount();

        if($num > 0) {
            $event_arr = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $event_item = array(
                    "event_id"  => intval($event_id),
                    "type"      => $type,
                    "location"  => $location,
                    "date"      => $date,
                    "begin"     => $begin,
                    "departure" => $departure,
                    "leave_dep" => $leave_dep
                );
                array_push($event_arr, $event_item);
            }
            response_with_data(200, $event_arr);
        } else {
            http_response_code(204);
        }
        break;
    default:
        http_response_code(501);
}
?>