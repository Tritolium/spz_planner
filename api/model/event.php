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
        $query = "SELECT * FROM " . $this->table_name . " WHERE date >= :_now SORT BY date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":_now", date("Y-m-d"));
        $stmt->execute();
        return $stmt;
    }

    function readPast() : PDOStatement
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE date < :_now SORT BY date";
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
}
?>