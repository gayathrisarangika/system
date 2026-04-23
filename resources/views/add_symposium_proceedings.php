<?php
session_start();
include "config.php";

// ✅ Only editors can add
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_GET['symposium_id'] ?? 0);

if(!$symposium_id){
    die("Invalid symposium ID.");
}

// ✅ Verify this symposium belongs to the editor
$symposium = $conn->query("SELECT * FROM symposiums WHERE id=$symposium_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$symposium){
    die("You are not authorized to add proceedings for this symposium.");
}

// Handle form submission
$message = '';
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $year = intval($_POST['year'] ?? 0);
    $is_current = intval($_POST['is_current'] ?? 0);

    // Upload cover image
    if(!empty($_FILES['cover']['name'])){
        $cover_image = "uploads/symposium_covers/" . basename($_FILES['cover']['name']);
        move_uploaded_file($_FILES['cover']['tmp_name'], $cover_image);
    } else {
        $cover_image = null;
    }

    // Upload PDF
    if(!empty($_FILES['pdf']['name'])){
        $pdf_link = "uploads/symposium_pdfs/" . basename($_FILES['pdf']['name']);
        move_uploaded_file($_FILES['pdf']['tmp_name'], $pdf_link);
    } else {
        $pdf_link = null;
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO symposium_proceedings (symposium_id, year, cover_image, pdf_link, is_current) VALUES (?,?,?,?,?)");
    $stmt->bind_param("isssi", $symposium_id, $year, $cover_image, $pdf_link, $is_current);
    if($stmt->execute()){
        $message = "Proceeding added successfully!";
    } else {
        $message = "Error adding proceeding: ".$conn->error;
    }
    $stmt->close();
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Add New Symposium Proceeding - <?= htmlspecialchars($symposium['symposium_title']) ?></title>
</head>
<body>
<h2>Add New Proceeding for <?= htmlspecialchars($symposium['symposium_title']) ?></h2>

<?php if($message) echo "<p style='color:green;'>$message</p>"; ?>

<form method="post" enctype="multipart/form-data">
    Year:<br>
    <input type="number" name="year" required><br><br>

    Cover Image:<br>
    <input type="file" name="cover" required><br><br>

    PDF File:<br>
    <input type="file" name="pdf" required><br><br>

    Current Proceeding:<br>
    <select name="is_current">
        <option value="1">Yes</option>
        <option value="0" selected>No</option>
    </select><br><br>

    <input type="submit" value="Add Proceeding">
</form>

<hr>
<a href="update_symposium.php?symposium_id=<?= $symposium_id ?>">⬅ Back to Symposium</a>

</body>
</html>