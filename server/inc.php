<?php
header('Content-Type: application/json');
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
$response=new stdClass();
if ($contentType === "application/json") {
  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));

  $decoded = json_decode($content, true);
  //echo json_encode($decoded);

  //If json_decode failed, the JSON is invalid.
  if( is_array($decoded)) {
	  
	$response=Increment($decoded['reaction'], $decoded['fingerprint']);  
	echo json_encode($response);
  } else {
    // Send error back to user.
	$response->error="Error: JSON is invalid";
	echo json_encode($response);
  }
}

function Increment($name, $fingerprint){
	$response=new stdClass();
	try {
		$servername = "localhost";
		$username = "root";
		$password = "";
		$conn = new PDO("mysql:host=$servername;dbname=radio", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$user=$conn->prepare("SELECT id FROM users WHERE fingerprint='".$fingerprint."'");
		$user->execute();
		$user_result = $user->fetch(PDO::FETCH_ASSOC);
		$user_id=$user_result['id'];
		if ($user_id!=null){
			$response->error="You already voted";
			return $response;
		}
		else {
			$user=$conn->prepare("INSERT into users (fingerprint) VALUES  ('".$fingerprint."')");
			$user->execute();
		}
		
		$stmt = $conn->prepare("SELECT id, count FROM counters WHERE name='".$name."'"); 
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		$id=$result['id'];
		$count=$result['count'];
		$incremented=$count+1;
		$sql = "UPDATE counters SET count=".$incremented." WHERE id=".$id;
		$upd = $conn->prepare($sql); 
		$upd->execute();
		
		if( $upd->rowCount()==1){
			$response->incremented_value=$incremented;
			$response->error=null;
		}
		else{
			$response->error="Counter was not updated";
		}
    }
	catch(PDOException $e){
		$response->error ="Connection failed: " . $e->getMessage();
    }
	return $response;
}

?>