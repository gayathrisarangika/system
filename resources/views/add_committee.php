<?php
session_start();
include "config.php";

// ✅ Only editor can access
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$conference_id = intval($_GET['conference_id'] ?? 0);

if(!$conference_id){
    die("Invalid request.");
}

// ✅ Verify this conference belongs to this editor
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference){
    die("You are not authorized to add members to this conference.");
}

// ✅ Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $name = $conn->real_escape_string($_POST['name']);
    $role = $conn->real_escape_string($_POST['role']);
    $qualification = $conn->real_escape_string($_POST['qualification']);
    $faculty = $conn->real_escape_string($_POST['faculty']);
    $address = $conn->real_escape_string($_POST['address']);

    $sql = "
        INSERT INTO conference_committee (conference_id, name, role, qualification, faculty, address)
        VALUES ($conference_id, '$name', '$role', '$qualification', '$faculty', '$address')
    ";

    if($conn->query($sql)){
        header("Location: conference_committee.php?id=$conference_id");
        exit;
    } else {
        $error = "Error adding member: " . $conn->error;
    }
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Add Committee Member - <?= htmlspecialchars($conference['conference_title']) ?></title>
</head>
<body>

<h2>Add Committee Member</h2>

<?php if(isset($error)) echo "<p style='color:red;'>$error</p>"; ?>

<form method="post">
    Name:<br>
    <input type="text" name="name" required><br><br>

    Role:<br>
    <input type="text" name="role" required><br><br>

    Qualification:<br>
    <input type="text" name="qualification"><br><br>

    Faculty:<br>
    <input type="text" name="faculty"><br><br>

    Address:<br>
    <input type="text" name="address"><br><br>

    <input type="submit" value="Add Member">
</form>

<hr>
<a href="conference_committee.php?id=<?= $conference_id ?>">⬅ Back to Committee</a>

</body>
</html>