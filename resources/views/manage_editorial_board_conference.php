<?php
session_start();
include "config.php";

/* CHECK LOGIN */
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied. Please login as editor.");
}

$u = $_SESSION['user'];

/* GET EDITOR'S CONFERENCE */
$stmt = $conn->prepare("SELECT * FROM conferences WHERE editor_id=? LIMIT 1");
$stmt->bind_param("i", $u['id']);
$stmt->execute();
$conf_res = $stmt->get_result();

if(!$conf_res){
    die("Conference Error: " . $conn->error);
}

if($conf_res->num_rows == 0){
    die("Please create a conference first.");
}

$conference = $conf_res->fetch_assoc();
$conference_id = $conference['id'];


/* ADD MEMBER */
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $name = trim($_POST['name']);
    $role = trim($_POST['role']);
    $department = trim($_POST['department']);
    $university = trim($_POST['university']);

    $stmt = $conn->prepare("
        INSERT INTO conference_committee
        (conference_id, name, role, department, university)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param("issss",
        $conference_id,
        $name,
        $role,
        $department,
        $university
    );

    if($stmt->execute()){
        echo "<p style='color:green;'>Member Added Successfully!</p>";
    }else{
        echo "<p style='color:red;'>Error: ".$stmt->error."</p>";
    }

    $stmt->close();
}


/* FETCH MEMBERS GROUPED BY ROLE */
$roles = [
'Conference Chair',
'Conference Co-Chair',
'Conference Secretary',
'Conference Co-Secretary',
'International Relations',
'Technical Program',
'Editorial and Publication',
'Design and Publicity',
'Workshop Management',
'Finance',
'Online Resource Management',
'Web and Information Management',
'Registration',
'Logistics and Inauguration'
];

$members_by_role = [];

foreach($roles as $r){

    $res = $conn->prepare("
        SELECT * FROM conference_committee
        WHERE conference_id=? AND role=?
    ");

    $res->bind_param("is", $conference_id, $r);
    $res->execute();

    $result = $res->get_result();
    $members_by_role[$r] = $result->fetch_all(MYSQLI_ASSOC);

    $res->close();
}
?>

<html>
<head>
<title>Manage Conference Committee</title>
<link rel="stylesheet" href="system.css">
</head>

<body>

<h2>Manage Conference Committee</h2>

<form method="post">

Name:<br>
<input type="text" name="name" required><br><br>

Role:<br>
<select name="role">

<option value="Conference Chair">Conference Chair</option>
<option value="Conference Co-Chair">Conference Co-Chair</option>
<option value="Conference Secretary">Conference Secretary</option>
<option value="Conference Co-Secretary">Conference Co-Secretary</option>
<option value="International Relations">International Relations</option>
<option value="Technical Program">Technical Program</option>
<option value="Editorial and Publication">Editorial and Publication</option>
<option value="Design and Publicity">Design and Publicity</option>
<option value="Workshop Management">Workshop Management</option>
<option value="Finance">Finance</option>
<option value="Online Resource Management">Online Resource Management</option>
<option value="Web and Information Management">Web and Information Management</option>
<option value="Registration">Registration</option>
<option value="Logistics and Inauguration">Logistics and Inauguration</option>

</select><br><br>

Department:<br>
<input type="text" name="department" required><br><br>

University:<br>
<input type="text" name="university" required><br><br>

<input type="submit" value="Add Member">

</form>

<hr>

<a href="editor_dashboard_conference.php">⬅ Back to Dashboard</a>

</body>
</html>