<?php
session_start();
include "config.php";

// ✅ Only editor can update
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_POST['symposium_id'] ?? $_GET['symposium_id'] ?? 0);
if($symposium_id <= 0) die("Invalid symposium ID.");

// ✅ Fetch existing symposium
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
if(!$stmt) die("Prepare failed: " . $conn->error);

$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$symposium) die("Symposium not found.");

// ✅ Handle file uploads
$header_image = $_FILES['header_image']['name'] ? "uploads/" . basename($_FILES['header_image']['name']) : $symposium['header_image'];
if(isset($_FILES['header_image']) && $_FILES['header_image']['tmp_name']){
    move_uploaded_file($_FILES['header_image']['tmp_name'], $header_image);
}

$cover_image = $_FILES['cover_image']['name'] ? "uploads/" . basename($_FILES['cover_image']['name']) : $symposium['cover_image'];
if(isset($_FILES['cover_image']) && $_FILES['cover_image']['tmp_name']){
    move_uploaded_file($_FILES['cover_image']['tmp_name'], $cover_image);
}

// ✅ Update symposium
$stmt = $conn->prepare("
    UPDATE symposiums
    SET symposium_title=?, symposium_details=?, header_image=?, cover_image=?, aim_scope=?, mission=?
    WHERE id=? AND editor_id=?
");
if(!$stmt) die("Prepare failed: " . $conn->error);

$stmt->bind_param(
    "ssssssii",
    $_POST['symposium_title'],
    $_POST['symposium_details'],
    $header_image,
    $cover_image,
    $_POST['aim_scope'],
    $_POST['mission'],
    $symposium_id,
    $editor['id']
);

$stmt->execute();
$stmt->close();

echo "<p style='color:green;'>Symposium updated successfully!</p>";
echo "<p>
        <a href='editor_dashboard.php'>⬅ Back to Dashboard</a> | 
        <a href='update_symposium.php?symposium_id=$symposium_id'>⬅ Back to Symposium</a>
      </p>";
?>