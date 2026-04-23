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
    die("You are not authorized to delete this member.");
}

// ✅ Delete member
$sql = "DELETE FROM conference_committee WHERE id=$member_id AND conference_id=$conference_id";
if($conn->query($sql)){
    header("Location: conference_committee.php?id=$conference_id");
    exit;
} else {
    echo "<p style='color:red;'>Error deleting member: {$conn->error}</p>";
    echo "<a href='conference_committee.php?id=$conference_id'>Back to Committee</a>";
}
?>