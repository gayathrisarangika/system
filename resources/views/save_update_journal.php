<?php
session_start();
include "config.php";

// ✅ Check if logged in as editor
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$u = $_SESSION['user'];
$journal_id = intval($_POST['journal_id'] ?? 0);

// Fetch existing journal
$stmt = $conn->prepare("SELECT * FROM journals WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $journal_id, $u['id']);
$stmt->execute();
$journal = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$journal){
    die("Journal not found.");
}

// ---------- COVER IMAGE ----------
$cover_image = $journal['cover_image'];
if(isset($_FILES['cover_image']) && !empty($_FILES['cover_image']['name'])){
    // Delete old file (optional)
    if(file_exists($cover_image)) unlink($cover_image);

    $cover_image = "uploads/" . basename($_FILES['cover_image']['name']);
    move_uploaded_file($_FILES['cover_image']['tmp_name'], $cover_image);
}

// ---------- UNIVERSITY LOGO ----------
$uni_logo = $journal['university_logo'];
if(isset($_FILES['uni_logo']) && !empty($_FILES['uni_logo']['name'])){
    // Delete old file (optional)
    if(file_exists($uni_logo)) unlink($uni_logo);

    $uni_logo = "uploads/" . basename($_FILES['uni_logo']['name']);
    move_uploaded_file($_FILES['uni_logo']['tmp_name'], $uni_logo);
}

// ---------- UPDATE JOURNAL ----------
$stmt = $conn->prepare("
    UPDATE journals
    SET 
        journal_title = ?,
        university_name = ?,
        cover_image = ?,
        university_logo = ?,
        journal_details = ?,
        aim_scope = ?,
        mission = ?,
        footer_text = ?
    WHERE id = ? AND editor_id = ?
");

$stmt->bind_param(
    "ssssssssii",
    $_POST['title'],
    $_POST['uni_name'],
    $cover_image,
    $uni_logo,
    $_POST['details'],
    $_POST['aim_scope'],
    $_POST['mission'],
    $_POST['footer_text'],
    $journal_id,
    $u['id']
);

if($stmt->execute()){
    echo "<p style='color:green;'>Journal updated successfully!</p>";
}else{
    echo "<p style='color:red;'>Update failed: ".$stmt->error."</p>";
}

$stmt->close();
?>

<a href="editor_dashboard.php">⬅ Back to Dashboard</a>