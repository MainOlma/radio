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
	$val=new stdClass();
	foreach ($decoded['reactions'] as $value){
		$el=new stdClass();
		$el->name=$value;
		$el->counter=GetValue($value, $decoded['location']);
		$array[] = $el;
	}

	//$val->value=GetValue();  
	$val->reactions = $array;
	$val->location = $decoded;
	echo json_encode($val);
  } else {
    // Send error back to user.
	echo json_encode("1:error");
  }
}

function GetValue($name,$location){
	$result=0;
	try {
		$servername = "localhost";
		$username = "root";
		$password = "";
		$conn = new PDO("mysql:host=$servername;dbname=radio", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("SELECT id, count FROM counters WHERE name='".$name."' AND site='".$location."'"); 
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		$id=$result['id'];
		$result=$result['count'];
    }
	catch(PDOException $e){
		$result ="Connection failed: " . $e->getMessage();
    }
	return $result;
}


?>