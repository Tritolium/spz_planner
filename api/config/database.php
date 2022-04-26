<?php
class Database{
    private $host = "localhost";
    private $db_name = "spzroenkhausen_planer";
    private $username = "spzroenkhausen_admin";
    private $password = "Spielmannszug";
    public $conn;

    public function getConnection(){
        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}

/**
 * @param int $code
 * @param string $response
 */
function response($code, $response) 
{
    http_response_code($code);
    echo json_encode(array("response" => $response));
}

/**
 * @param int $code
 * @param string $response
 */
function response_with_data($code, $data)
{
    http_response_code($code);
    echo json_encode($data);
}
?>