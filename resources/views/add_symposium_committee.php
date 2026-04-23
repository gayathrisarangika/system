<?php
session_start();
include "config.php";

// ✅ Only editor can access
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_GET['symposium_id'] ?? 0);
if($symposium_id <= 0){
    die("Invalid symposium ID.");
}

// ✅ Verify this symposium belongs to the editor
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$symposium){
    die("You are not authorized to add members to this symposium.");
}

// ✅ Handle form submission
$message = '';
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $name = $conn->real_escape_string($_POST['name']);
    $role = $_POST['role']; // enum: Chair / Co-Chair
    $qualification = $conn->real_escape_string($_POST['qualification']);
    $faculty = $conn->real_escape_string($_POST['faculty']);
    $address = $conn->real_escape_string($_POST['address']);

    $stmt = $conn->prepare("
        INSERT INTO symposium_committee (symposium_id, name, role, qualification, faculty, address)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("isssss", $symposium_id, $name, $role, $qualification, $faculty, $address);

    if($stmt->execute()){
        $message = "Member added successfully!";
    } else {
        $message = "Error adding member: " . $conn->error;
    }
    $stmt->close();
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Add Symposium Committee Member - <?= htmlspecialchars($symposium['symposium_title']) ?></title>
</head>
<body>

<h2>Add New Committee Member for <?= htmlspecialchars($symposium['symposium_title']) ?></h2>

<?php if($message) echo "<p style='color:green;'>$message</p>"; ?>

<form method="post">
    Name:<br>
    <input type="text" name="name" required><br><br>

    Role:<br>
    <select name="role" required>
        <option value="Chair">Chair</option>
        <option value="Co-Chair">Co-Chair</option>
    </select><br><br>

    Qualification:<br>
    <input type="text" name="qualification"><br><br>

    Faculty:<br>
    <input type="text" name="faculty"><br><br>

    Address:<br>
    <input type="text" name="address"><br><br>

    <input type="submit" value="Add Member">
</form>

<hr>
<a href="update_symposium.php?symposium_id=<?= $symposium_id ?>">⬅ Back to Symposium</a>

</body>
</html>