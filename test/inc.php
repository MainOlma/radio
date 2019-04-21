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
		include 'db.php';
		$conn = new PDO("mysql:host=$servername;dbname=$basename", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$user=$conn->prepare("SELECT id, emoji FROM users WHERE fingerprint='".$fingerprint."'");
		$user->execute();
		$user_result = $user->fetch(PDO::FETCH_ASSOC);
		$user_id=$user_result['id'];
		$user_emoji=$user_result['emoji'];
		if ($user_id!=null){
			$response->error="You already voted '".$user_emoji."', your fingerprint is ".$fingerprint ;
			if ($user_emoji==$name){
				$response=Decrement($user_emoji, $fingerprint);
			}
			else{
				$response_1=Decrement($user_emoji, $fingerprint);
				$response_2=Increment($name, $fingerprint);
				$response = array_merge((array)$response_1,(array)$response_2);
			}
			
			return $response;
		}
		else {
			$user=$conn->prepare("INSERT into users (fingerprint,emoji) VALUES  ('".$fingerprint."','".$name."')");
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
			$response->incremented_emoji=$name;
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

function Decrement($name, $fingerprint){
	include 'db.php';
		$conn = new PDO("mysql:host=$servername;dbname=$basename", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$response=new stdClass();
	$stmt = $conn->prepare("SELECT id, count FROM counters WHERE name='".$name."'"); 
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	$id=$result['id'];
	$count=$result['count'];
	$decremented=$count-1;
	$sql = "UPDATE counters SET count=".$decremented." WHERE id=".$id;
	$upd = $conn->prepare($sql); 
	$upd->execute();
	
	if( $upd->rowCount()==1){
			$del_fpr="DELETE FROM users WHERE fingerprint='".$fingerprint."'";
			$del = $conn->prepare($del_fpr); 
			$del->execute();
			$response->decremented_value=$decremented;
			$response->decremented_emoji=$name;
			$response->error=null;
		}
		else{
			$response->error="Counter was not decremented";
		}
		return $response;
}

?>