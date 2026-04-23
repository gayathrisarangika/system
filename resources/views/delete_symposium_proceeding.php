<?php
session_start();
include "config.php";

// ✅ Only editors can delete
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_GET['symposium_id'] ?? 0);
$proceeding_id = intval($_GET['proceeding_id'] ?? 0);

if(!$symposium_id || !$proceeding_id){
    die("Invalid symposium or proceeding ID.");
}

// ✅ Verify symposium belongs to editor
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$symposium) die("Symposium not found or you are not authorized.");

// ✅ Delete the proceeding
$stmt = $conn->prepare("DELETE FROM symposium_proceedings WHERE id=? AND symposium_id=?");
$stmt->bind_param("ii", $proceeding_id, $symposium_id);

if($stmt->execute()){
    echo "<p style='color:green;'>Proceeding deleted successfully!</p>";
} else {
    echo "<p style='color:red;'>Error deleting proceeding: ".$conn->error."</p>";
}

$stmt->close();

echo "<a href='update_symposium.php?symposium_id=$symposium_id'>⬅ Back to Symposium Dashboard</a>";
?>