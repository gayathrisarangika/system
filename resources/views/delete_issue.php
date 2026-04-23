<?php
session_start();
include "config.php";

// ✅ Only editor can delete
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$issue_id = intval($_GET['issue_id'] ?? 0);
$journal_id = intval($_GET['journal_id'] ?? 0);

if(!$issue_id || !$journal_id){
    die("Invalid request.");
}

// ✅ Check that this issue belongs to this editor's journal
$journal = $conn->query("SELECT * FROM journals WHERE id=$journal_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$journal){
    die("You are not authorized to delete this issue.");
}

// ✅ Delete the issue
if($conn->query("DELETE FROM issues WHERE id=$issue_id AND journal_id=$journal_id")){
    // Optionally, delete PDF and cover image files from server
    // $issue = $conn->query("SELECT * FROM issues WHERE id=$issue_id")->fetch_assoc();
    // if(file_exists($issue['pdf_link'])) unlink($issue['pdf_link']);
    // if(file_exists($issue['cover_image'])) unlink($issue['cover_image']);

    header("Location: update_journal.php?journal_id=$journal_id"); // back to journal management page
    exit;
} else {
    die("Error deleting issue: " . $conn->error);
}
?>