<?php
session_start();
include "config.php";

// ✅ Only editor can access
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$member_id = intval($_GET['member_id'] ?? 0);

if(!$member_id){
    die("Invalid request.");
}

// ✅ Load member data and get symposium_id
$stmt = $conn->prepare("SELECT * FROM symposium_committee WHERE id=?");
$stmt->bind_param("i", $member_id);
$stmt->execute();
$member = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$member){
    die("Member not found.");
}

$symposium_id = $member['symposium_id'];

// ✅ Verify symposium belongs to this editor
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$symposium){
    die("You are not authorized to edit this member.");
}

// ✅ Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $name = $conn->real_escape_string($_POST['name']);
    $role = $_POST['role']; // enum: 'Chair' or 'Co-Chair'
    $qualification = $conn->real_escape_string($_POST['department']);
    $faculty = $conn->real_escape_string($_POST['university']);
    

    $stmt = $conn->prepare("
        UPDATE symposium_committee 
        SET name=?, role=?, department=?, university=?
        WHERE id=?
    ");
    $stmt->bind_param("ssssi", $name, $role, $qualification, $faculty, $member_id);
    if($stmt->execute()){
        $stmt->close();
        header("Location: update_symposium.php?symposium_id=$symposium_id");
        exit;
    } else {
        $error = "Error updating member: " . $conn->error;
    }
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Edit Symposium Committee Member - <?= htmlspecialchars($member['name']) ?></title>
</head>
<body>

<h2>Edit Committee Member for <?= htmlspecialchars($symposium['symposium_title']) ?></h2>

<?php if(isset($error)) echo "<p style='color:red;'>$error</p>"; ?>

<form method="post">
    Name:<br>
    <input type="text" name="name" value="<?= htmlspecialchars($member['name']) ?>" required><br><br>

    Role:<br>
    <select name="role" required>
        <option value="Chair" <?= $member['role']=='Chair'?'selected':'' ?>>Chair</option>
        <option value="Secretary" <?= $member['role']=='Secretary'?'selected':'' ?>>Secretary</option>
    </select><br><br>

    Department:<br>
    <input type="text" name="department" value="<?= htmlspecialchars($member['department']) ?>"><br><br>

    University:<br>
    <input type="text" name="university" value="<?= htmlspecialchars($member['university']) ?>"><br><br>

    <input type="submit" value="Update Member">
</form>

<hr>
<a href="update_symposium.php?symposium_id=<?= $symposium_id ?>">⬅ Back to Symposium</a>

</body>
</html>