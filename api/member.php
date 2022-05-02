<?php
include_once './config/database.php';
include_once './model/member.php';

$database = new Database();

$db_conn = $database->getConnection();

$member = new Member($db_conn);

$data = json_decode(file_get_contents("php://input"));

header('content-type: application/json');

$auth_level = authorize($_GET['api_token']);

if($auth_level == 0)
{
    http_response_code(403);
    exit();
}

switch($_SERVER['REQUEST_METHOD'])
{
    case 'POST':
        // INSERT
        if(!empty($data->forename))
        {
            $member->forename = $data->forename;
            $member->surname = $data->surname;

            if($member->create())
            {
                response(201, "");
            } else {
                response(500, "");
            }
        } else {
            response(400, "");
        }
        break;
    case 'GET':
        // SELECT
        $stmt = $member->read();
        $num = $stmt->rowCount();

        if($num > 0) {
            $member_arr = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $member_item = array(
                    "Forename"  => $forename,
                    "Surname"   => $surname
                );
                array_push($member_arr, $member_item);
            }

            response_with_data(200, $member_arr);
        } else {
            http_response_code(204);
        }
        break;
    case 'DELETE':
        // DELETE
        break;
}
?>