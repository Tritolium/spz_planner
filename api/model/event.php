<?php
class Event {
    private $conn;
    private $table_name = "spzroenkhausen_planer.tblEvents";

    public int $event_id;
    public string $type;
    public string $location;
    public string $date;
    public string $begin;
    public string $departure;
    public string $leave_dep;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    function readCurrent() : PDOStatement
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE date >= :_now ORDER BY date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":_now", date("Y-m-d"));
        $stmt->execute();
        return $stmt;
    }

    function readPast() : PDOStatement
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE date < :_now ORDER BY date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":_now", date("Y-m-d"));
        $stmt->execute();
        return $stmt;
    }

    function readAll() : PDOStatement
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function read($id, $filter) : PDOStatement
    {
        if ($id >= 0) {
            $query = "SELECT * FROM " . $this->table_name . " WHERE event_id = :event_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":event_id", $id);
        } else {
            switch($filter){
            case "current":
                $query = "SELECT * FROM " . $this->table_name . " WHERE date >= :_now ORDER BY date";
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(":_now", date("Y-m-d"));
                break;
            case "past":
                $query = "SELECT * FROM " . $this->table_name . " WHERE date < :_now ORDER BY date";
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(":_now", date("Y-m-d"));
                break;
            default:
            case "all":
                $query = "SELECT * FROM " . $this->table_name;
                $stmt = $this->conn->prepare($query);
                break;
            }
        }
        $stmt->execute();
        return $stmt;
    }

    function update($event_data) : bool
    {
        $query = "UPDATE " . $this->table_name . " SET type = :type, location = :location, date = :date, begin = :begin, departure = :departure, leave_dep = :leave_dep WHERE event_id = :event_id";
        $stmt = $this->conn->prepare($query);

        extract($event_data);

        $stmt->bindParam(":type", $Event_ID);
        $stmt->bindParam(":location", $Location);
        $stmt->bindParam(":date", $Date);
        $stmt->bindParam(":begin", $Begin);
        $stmt->bindParam(":departure", $Departure);
        $stmt->bindParam(":leave_dep", $Leave_dep);

        if($stmt->execute()){
            return true;
        }

        return false;
    }
}
?>