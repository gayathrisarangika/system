<?php
session_start();
include "config.php";

// ✅ Only editor can add
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$journal_id = intval($_GET['journal_id'] ?? 0);

if(!$journal_id){
    die("Invalid journal.");
}

// ✅ Check that this journal belongs to this editor
$journal = $conn->query("SELECT * FROM journals WHERE id=$journal_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$journal){
    die("You are not authorized to add members to this journal.");
}

// ✅ Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $name = $conn->real_escape_string($_POST['name']);
    $role = $conn->real_escape_string($_POST['role']);
    $qualification = $conn->real_escape_string($_POST['qualification']);
    $faculty = $conn->real_escape_string($_POST['faculty']);
    $address = $conn->real_escape_string($_POST['address']);

    $sql = "
        INSERT INTO editorial_board
        (journal_id, name, role, qualification, faculty, address)
        VALUES
        ($journal_id, '$name', '$role', '$qualification', '$faculty', '$address')
    ";

    if($conn->query($sql)){
        header("Location: update_journal.php?journal_id=$journal_id"); // back to management page
        exit;
    } else {
        $error = "Error adding member: " . $conn->error;
    }
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Add New Member</title>
</head>
<body>

<h2>Add New Editorial Board Member</h2>

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
<a href="update_journal.php?journal_id=<?= $journal_id ?>">⬅ Back to Journal Management</a>

</body>
</html>