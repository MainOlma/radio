<?php
header('Content-Type: application/json');
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
$response=new stdClass();

if ($contentType === "application/json") {
  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));
  $decoded = json_decode($content, true);

  //If json_decode failed, the JSON is invalid.
  if( is_array($decoded)) {
	$val=new stdClass();
	foreach ($decoded['reactions'] as $value){
		$el=new stdClass();
		$el->name=$value;
		$el->counter=GetValue($value);
		$array[] = $el;
	}
	$val->reactions = $array;
	$val->error=null;

	echo json_encode($val);
  } else {
    // Send error back to user.
	$response->error="Error: JSON is invalid";
	echo json_encode($response);
  }
}

function GetValue($name){
	$result=0;
	try {
		include 'db.php';
		$conn = new PDO("mysql:host=$servername;dbname=$basename", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("SELECT id, count FROM counters WHERE name='".$name."'"); 
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