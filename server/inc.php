<?php
header('Content-Type: application/json');


$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));

  $decoded = json_decode($content, true);
  //echo json_encode($decoded);

  //If json_decode failed, the JSON is invalid.
  if( is_array($decoded)) {
	  
	$val=Increment($decoded['reaction'], $decoded['location']);  
	echo json_encode($val);
  } else {
    // Send error back to user.
	echo json_encode("1:error");
  }
}

function Increment($name, $location){
	try {
		$servername = "localhost";
		$username = "root";
		$password = "";
		$conn = new PDO("mysql:host=$servername;dbname=radio", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$user=$conn->prepare("SELECT id FROM users WHERE fingerprint=");
		$stmt = $conn->prepare("SELECT id, count FROM counters WHERE name='".$name."' AND site='".$location."'"); 
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		$id=$result['id'];
		$count=$result['count'];
		$incremented=$count+1;
		$sql = "UPDATE counters SET count=".$incremented." WHERE id=".$id;
		$upd = $conn->prepare($sql); 
		$upd->execute();
		if( $upd->rowCount()==1){
			$result=$incremented;
		}
		else{
			$result="Counter was not updated";
		}
    }
	catch(PDOException $e){
		$result ="Connection failed: " . $e->getMessage();
    }
	return $result;
}

?>