<?php
session_start();
include "config.php";

// ✅ Only editors can delete
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$proceeding_id = intval($_GET['proceeding_id'] ?? 0);
$conference_id = intval($_GET['conference_id'] ?? 0);

if(!$proceeding_id || !$conference_id){
    die("Invalid request.");
}

// ✅ Verify this conference belongs to the editor
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference){
    die("You are not authorized to delete proceedings for this conference.");
}

// ✅ Fetch the proceeding (to remove files if needed)
$proceeding = $conn->query("SELECT * FROM conference_proceedings WHERE id=$proceeding_id AND conference_id=$conference_id")->fetch_assoc();
if(!$proceeding){
    die("Proceeding not found.");
}

// ✅ Delete files (cover and PDF) if they exist
if(!empty($proceeding['cover_image']) && file_exists($proceeding['cover_image'])){
    unlink($proceeding['cover_image']);
}
if(!empty($proceeding['pdf_link']) && file_exists($proceeding['pdf_link'])){
    unlink($proceeding['pdf_link']);
}

// ✅ Delete record from DB
$stmt = $conn->prepare("DELETE FROM conference_proceedings WHERE id=? AND conference_id=?");
$stmt->bind_param("ii", $proceeding_id, $conference_id);

if($stmt->execute()){
    $stmt->close();
    header("Location: update_conference.php?conference_id=$conference_id");
    exit;
} else {
    die("Error deleting proceeding: ".$conn->error);
}