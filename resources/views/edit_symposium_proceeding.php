<?php
session_start();
include "config.php";

// ✅ Only editor can access
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_GET['symposium_id'] ?? 0);
$proceeding_id = intval($_GET['proceeding_id'] ?? 0);

if($symposium_id <= 0 || $proceeding_id <= 0) die("Invalid IDs.");

// Load symposium
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();
if(!$symposium) die("Symposium not found.");

// Load proceeding
$stmt = $conn->prepare("SELECT * FROM symposium_proceedings WHERE id=? AND symposium_id=?");
$stmt->bind_param("ii", $proceeding_id, $symposium_id);
$stmt->execute();
$proceeding = $stmt->get_result()->fetch_assoc();
$stmt->close();
if(!$proceeding) die("Proceeding not found.");

// Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $year = intval($_POST['year']);
    $is_current = intval($_POST['is_current']);

    // Handle uploads
    $cover_image = $_FILES['cover']['tmp_name'] ? "uploads/symposium_covers/" . basename($_FILES['cover']['name']) : $proceeding['cover_image'];
    if($_FILES['cover']['tmp_name']) move_uploaded_file($_FILES['cover']['tmp_name'], $cover_image);

    $pdf_link = $_FILES['pdf']['tmp_name'] ? "uploads/symposium_pdfs/" . basename($_FILES['pdf']['name']) : $proceeding['pdf_link'];
    if($_FILES['pdf']['tmp_name']) move_uploaded_file($_FILES['pdf']['tmp_name'], $pdf_link);

    // Update proceeding
    $stmt = $conn->prepare("
        UPDATE symposium_proceedings 
        SET year=?, cover_image=?, pdf_link=?, is_current=? 
        WHERE id=? AND symposium_id=?
    ");
    $stmt->bind_param("issiii", $year, $cover_image, $pdf_link, $is_current, $proceeding_id, $symposium_id);
    $stmt->execute();
    $stmt->close();

    echo "<p style='color:green;'>Proceeding updated successfully!</p>";
    echo "<a href='update_symposium.php?symposium_id=$symposium_id'>⬅ Back to Symposium</a>";
    exit;
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Edit Symposium Proceeding - <?= htmlspecialchars($symposium['symposium_title']) ?></title>
</head>
<body>

<h2>Edit Proceeding for <?= htmlspecialchars($symposium['symposium_title']) ?></h2>

<form method="post" enctype="multipart/form-data">
    Year:<br>
    <input type="number" name="year" value="<?= htmlspecialchars($proceeding['year']) ?>" required><br><br>

    Cover Image:<br>
    <?php if($proceeding['cover_image']) echo "<img src='{$proceeding['cover_image']}' width='120'><br>"; ?>
    <input type="file" name="cover"><br><br>

    PDF File:<br>
    <?php if($proceeding['pdf_link']) echo "<a href='{$proceeding['pdf_link']}' target='_blank'>Current PDF</a><br>"; ?>
    <input type="file" name="pdf"><br><br>

    Current Proceeding:<br>
    <select name="is_current">
        <option value="1" <?= ($proceeding['is_current']==1) ? "selected" : "" ?>>Yes</option>
        <option value="0" <?= ($proceeding['is_current']==0) ? "selected" : "" ?>>No</option>
    </select><br><br>

    <input type="submit" value="Update Proceeding">
</form>

<hr>
<a href="update_symposium.php?symposium_id=<?= $symposium_id ?>">⬅ Back to Symposium</a>

</body>
</html>