<?php
session_start();
include "config.php";

// ✅ Only editors can add
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$conference_id = intval($_GET['conference_id'] ?? 0);

if(!$conference_id){
    die("Invalid conference ID.");
}

// ✅ Verify this conference belongs to the editor
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference){
    die("You are not authorized to add proceedings for this conference.");
}

// Handle form submission
$message = '';
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $year = intval($_POST['year'] ?? 0);

    // Upload cover image
    if(!empty($_FILES['cover_image']['name'])){
        $cover_image = "uploads/conference_covers/" . basename($_FILES['cover_image']['name']);
        move_uploaded_file($_FILES['cover_image']['tmp_name'], $cover_image);
    } else {
        $cover_image = null;
    }

    // Upload PDF
    if(!empty($_FILES['pdf_file']['name'])){
        $pdf_link = "uploads/conference_pdfs/" . basename($_FILES['pdf_file']['name']);
        move_uploaded_file($_FILES['pdf_file']['tmp_name'], $pdf_link);
    } else {
        $pdf_link = null;
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO conference_proceedings (conference_id, year, cover_image, pdf_link) VALUES (?,?,?,?)");
    $stmt->bind_param("isss", $conference_id, $year, $cover_image, $pdf_link);
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
    <title>Add New Proceeding - <?= htmlspecialchars($conference['conference_title']) ?></title>
</head>
<body>
<h2>Add New Proceeding for <?= htmlspecialchars($conference['conference_title']) ?></h2>

<?php if($message) echo "<p style='color:green;'>$message</p>"; ?>

<form method="post" enctype="multipart/form-data">
    Year:<br>
    <input type="number" name="year" required><br><br>

    Cover Image:<br>
    <input type="file" name="cover_image" required><br><br>

    PDF File:<br>
    <input type="file" name="pdf_file" required><br><br>

    <input type="submit" value="Add Proceeding">
</form>

<hr>
<a href="update_conference.php?conference_id=<?= $conference_id ?>">⬅ Back to Conference Dashboard</a>

</body>
</html>