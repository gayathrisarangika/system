<?php
session_start();
include "config.php";

// ✅ Only editor can access
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$member_id = intval($_GET['member_id'] ?? 0);
$conference_id = intval($_GET['conference_id'] ?? 0);

if(!$member_id || !$conference_id){
    die("Invalid request.");
}

// ✅ Verify this conference belongs to this editor
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference){
    die("You are not authorized to edit this member.");
}

// ✅ Load member data
$member = $conn->query("SELECT * FROM conference_committee WHERE id=$member_id AND conference_id=$conference_id")->fetch_assoc();
if(!$member){
    die("Member not found.");
}

// ✅ Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $name = $conn->real_escape_string($_POST['name']);
    $role = $conn->real_escape_string($_POST['role']);
    $qualification = $conn->real_escape_string($_POST['qualification']);
    $faculty = $conn->real_escape_string($_POST['faculty']);
    $address = $conn->real_escape_string($_POST['address']);

    $sql = "
        UPDATE conference_committee
        SET name='$name', role='$role', qualification='$qualification', faculty='$faculty', address='$address'
        WHERE id=$member_id AND conference_id=$conference_id
    ";

    if($conn->query($sql)){
        header("Location: conference_committee.php?id=$conference_id");
        exit;
    } else {
        $error = "Error updating member: " . $conn->error;
    }
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Edit Committee Member - <?= htmlspecialchars($member['name']) ?></title>
</head>
<body>

<h2>Edit Conference Committee Member</h2>

<?php if(isset($error)) echo "<p style='color:red;'>$error</p>"; ?>

<form method="post">
    Name:<br>
    <input type="text" name="name" value="<?= htmlspecialchars($member['name']) ?>" required><br><br>

    Role:<br>
    <input type="text" name="role" value="<?= htmlspecialchars($member['role']) ?>" required><br><br>

    Qualification:<br>
    <input type="text" name="qualification" value="<?= htmlspecialchars($member['qualification']) ?>"><br><br>

    Faculty:<br>
    <input type="text" name="faculty" value="<?= htmlspecialchars($member['faculty']) ?>"><br><br>

    Address:<br>
    <input type="text" name="address" value="<?= htmlspecialchars($member['address']) ?>"><br><br>

    <input type="submit" value="Update Member">
</form>

<hr>
<a href="update_conference.php?id=<?= $conference_id ?>">⬅ Back to Committee Management</a>

</body>
</html>