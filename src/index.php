<?php
$servername = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$servername;dbname=radio", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully"; 
	$stmt = $conn->prepare("SELECT id, count FROM counters"); 
    $stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	echo $result['count']."->";
	$id=$result['id'];
	$count=$result['count'];
	$incremented=$count+1;
	$sql = "UPDATE counters SET count=".$incremented." WHERE id=".$id;
	$upd = $conn->prepare($sql); 
    $upd->execute();
	echo $upd->rowCount() . " records UPDATED successfully";
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
?>