<?php
session_start();
include "config.php";

// ✅ Only editor can delete
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$member_id = intval($_GET['member_id'] ?? 0);
$journal_id = intval($_GET['journal_id'] ?? 0);

if(!$member_id || !$journal_id){
    die("Invalid request.");
}

// ✅ Check that this journal belongs to this editor
$journal = $conn->query("SELECT * FROM journals WHERE id=$journal_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$journal){
    die("You are not authorized to delete this member.");
}

// ✅ Delete the member
if($conn->query("DELETE FROM editorial_board WHERE id=$member_id AND journal_id=$journal_id")){
    header("Location: update_website.php?journal_id=$journal_id"); // back to journal management page
    exit;
} else {
    die("Error deleting member: " . $conn->error);
}
?>