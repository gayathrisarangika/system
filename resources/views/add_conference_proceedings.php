<?php
session_start();
include "config.php";

$message = ""; // ✅ Initialize at the top

if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied. Please login as editor.");
}

$editor = $_SESSION['user'];
$conference_id = intval($_GET['conference_id'] ?? 0);

// Load conference
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference) die("Conference not found.");

// Check if editing an existing proceeding
$proceeding_id = intval($_GET['proceeding_id'] ?? 0);
$proceeding = null;

if($proceeding_id){
    $stmt = $conn->prepare("SELECT * FROM conference_proceedings WHERE id=? AND conference_id=?");
    $stmt->bind_param("ii", $proceeding_id, $conference_id);
    $stmt->execute();
    $proceeding = $stmt->get_result()->fetch_assoc();
    $stmt->close();
}

// Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    // Upload PDF
    $pdf = $proceeding['pdf_link'] ?? null;
    if(!empty($_FILES['pdf']['name'])){
        $pdf = "uploads/pdfs/" . basename($_FILES['pdf']['name']);
        if(!move_uploaded_file($_FILES['pdf']['tmp_name'], $pdf)){
            $message = "❌ Failed to upload PDF!";
        }
    }

    // Upload cover image
    $cover = $proceeding['cover_image'] ?? null;
    if(!empty($_FILES['cover']['name'])){
        $cover = "uploads/covers/" . basename($_FILES['cover']['name']);
        if(!move_uploaded_file($_FILES['cover']['tmp_name'], $cover)){
            $message = "❌ Failed to upload cover image!";
        }
    }

    $current = intval($_POST['current']);

    if(empty($message)){ // Only proceed if no upload error
        if($proceeding_id){
            $stmt = $conn->prepare("
                UPDATE conference_proceedings 
                SET year=?, cover_image=?, pdf_link=?, is_current=? 
                WHERE id=? AND conference_id=?
            ");
            $stmt->bind_param("isiiii", $_POST['year'], $cover, $pdf, $current, $proceeding_id, $conference_id);
            if($stmt->execute()){
                $message = "✅ Conference proceeding updated successfully!";
            } else {
                $message = "❌ Update failed: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $stmt = $conn->prepare("
                INSERT INTO conference_proceedings (conference_id, year, cover_image, pdf_link, is_current)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->bind_param("iisii", $conference_id, $_POST['year'], $cover, $pdf, $current);
            if($stmt->execute()){
                $message = "✅ Conference proceeding added successfully!";
            } else {
                $message = "❌ Insert failed: " . $stmt->error;
            }
            $stmt->close();
        }
    }
}
?>

<html>
<head>
    <title>Add Conference Proceeding</title>
    <link rel="stylesheet" href="system.css">
</head>
<body>
    <h2>Add / Edit Conference Proceeding for: <?= htmlspecialchars($conference['conference_title']) ?></h2>

    <?php if($message): ?>
        <p style="color: <?= strpos($message, '❌')===0 ? 'red' : 'green' ?>"><?= $message ?></p>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data">
        Year:<br>
        <input type="number" name="year" value="<?= htmlspecialchars($proceeding['year'] ?? '') ?>" required><br><br>

        Cover Image:<br>
        <input type="file" name="cover"><br>
        <?php if(!empty($proceeding['cover_image'])): ?>
            <img src="<?= htmlspecialchars($proceeding['cover_image']) ?>" width="100"><br>
        <?php endif; ?>
        <br>

        PDF File:<br>
        <input type="file" name="pdf"><br>
        <?php if(!empty($proceeding['pdf_link'])): ?>
            <a href="<?= htmlspecialchars($proceeding['pdf_link']) ?>" target="_blank">View Existing PDF</a><br>
        <?php endif; ?>
        <br>

        Is Current:<br>
        <select name="current">
            <option value="1" <?= (!empty($proceeding['is_current']) && $proceeding['is_current']==1) ? 'selected' : '' ?>>Yes</option>
            <option value="0" <?= (empty($proceeding['is_current']) || $proceeding['is_current']==0) ? 'selected' : '' ?>>No</option>
        </select><br><br>

        <input type="submit" value="<?= $proceeding_id ? 'Update' : 'Add' ?> Proceeding">
    </form>

    <hr>
    <a href="editor_dashboard_conference.php">⬅ Back to Dashboard</a>
</body>
</html>