<?php
class Member {
    private $conn;
    private $table_name = "spzroenkhausen_planer.tblMembers";

    public string $forename;
    public string $surname;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    function read() : PDOStatement
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY surname, forename";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function create() : bool
    {
        $query = "INSERT INTO " . $this->table_name . " (forename, surname) VALUES (:forename, :surname)";
        $stmt = $this->conn->prepare($query);
        $this->forename=htmlspecialchars(strip_tags($this->forename));
        $this->surname=htmlspecialchars(strip_tags($this->surname));
        $stmt->bindParam(":forename", $this->forename);
        $stmt->bindParam(":surname", $this->surname);
        
        if($stmt->execute())
        {
            return true;
        }

        return false;
    }

    function delete() : bool
    {
        return false;
    }
}
?>