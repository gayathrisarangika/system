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

// ✅ Fetch member and symposium_id
$stmt = $conn->prepare("SELECT * FROM symposium_committee WHERE id=?");
$stmt->bind_param("i", $member_id);
$stmt->execute();
$member = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$member){
    die("Member not found.");
}

$symposium_id = $member['symposium_id'];

// ✅ Verify editor owns this symposium
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$symposium){
    die("You are not authorized to delete this member.");
}

// ✅ Delete member
$stmt = $conn->prepare("DELETE FROM symposium_committee WHERE id=?");
$stmt->bind_param("i", $member_id);

if($stmt->execute()){
    $stmt->close();
    echo "<p style='color:green;'>Member deleted successfully!</p>";
    echo "<a href='update_symposium.php?symposium_id=$symposium_id'>⬅ Back to Symposium</a>";
} else {
    $stmt->close();
    die("Error deleting member: " . $conn->error);
}
?>