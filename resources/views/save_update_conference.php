<?php
session_start();
include "config.php";

// ✅ Check editor login
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$u = $_SESSION['user'];
$conference_id = intval($_POST['conference_id'] ?? 0);

// ✅ Fetch existing conference
$stmt = $conn->prepare("SELECT * FROM conferences WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $conference_id, $u['id']);
$stmt->execute();
$conference = $stmt->get_result()->fetch_assoc();
$stmt->close();
if(!$conference) die("Conference not found.");

// ✅ Handle file uploads
$header_image = $_FILES['header_image']['name'] ? "uploads/".$_FILES['header_image']['name'] : $conference['header_image'];
if(isset($_FILES['header_image']) && $_FILES['header_image']['tmp_name']) move_uploaded_file($_FILES['header_image']['tmp_name'],$header_image);

$cover_image = $_FILES['cover_image']['name'] ? "uploads/".$_FILES['cover_image']['name'] : $conference['cover_image'];
if(isset($_FILES['cover_image']) && $_FILES['cover_image']['tmp_name']) move_uploaded_file($_FILES['cover_image']['tmp_name'],$cover_image);

// ✅ Update conference details
$stmt = $conn->prepare("
    UPDATE conferences
    SET conference_title=?, header_image=?, cover_image=?, conference_details=?, aim_scope=?, mission=?
    WHERE id=? AND editor_id=?
");
$stmt->bind_param(
    "ssssssii",
    $_POST['title'],
    $header_image,
    $cover_image,
    $_POST['details'],
    $_POST['aim_scope'],
    $_POST['mission'],
    $conference_id,
    $u['id']
);
$stmt->execute();
$stmt->close();

echo "<p style='color:green;'>Conference updated successfully!</p>";
echo "<a href='editor_dashboard.php'>⬅ Back to Dashboard</a>";
?>