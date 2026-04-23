<?php
session_start();
include "config.php";

if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$conference_id = intval($_GET['conference_id'] ?? 0);

// Load conference
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference) die("Conference not found.");

// Check if editing existing proceeding
$proceeding_id = intval($_GET['proceeding_id'] ?? 0);
$proceeding = null;
if($proceeding_id){
    $stmt = $conn->prepare("SELECT * FROM conference_proceedings WHERE id=? AND conference_id=?");
    $stmt->bind_param("ii",$proceeding_id,$conference_id);
    $stmt->execute();
    $proceeding = $stmt->get_result()->fetch_assoc();
    $stmt->close();
}

// Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $year = intval($_POST['year']);
    $pdf_link = $_FILES['pdf']['name'] ? "uploads/pdfs/".$_FILES['pdf']['name'] : ($proceeding['pdf_link'] ?? null);
    if(!empty($_FILES['pdf']['tmp_name'])) move_uploaded_file($_FILES['pdf']['tmp_name'],$pdf_link);

    $cover_image = $_FILES['cover']['name'] ? "uploads/covers/".$_FILES['cover']['name'] : ($proceeding['cover_image'] ?? null);
    if(!empty($_FILES['cover']['tmp_name'])) move_uploaded_file($_FILES['cover']['tmp_name'],$cover_image);

    if($proceeding_id){
        // Update existing
        $stmt = $conn->prepare("
            UPDATE conference_proceedings 
            SET year=?, pdf_link=?, cover_image=? 
            WHERE id=? AND conference_id=?
        ");
        $stmt->bind_param("issii",$year,$pdf_link,$cover_image,$proceeding_id,$conference_id);
        $stmt->execute();
        $stmt->close();
        $message = "Proceeding updated successfully!";
    } else {
        // Add new
        $stmt = $conn->prepare("
            INSERT INTO conference_proceedings (conference_id, year, pdf_link, cover_image)
            VALUES (?,?,?,?)
        ");
        $stmt->bind_param("iiss",$conference_id,$year,$pdf_link,$cover_image);
        $stmt->execute();
        $stmt->close();
        $message = "Proceeding added successfully!";
    }
}
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title><?= $proceeding_id ? "Edit Proceeding" : "Add New Proceeding" ?> - <?= htmlspecialchars($conference['conference_title']) ?></title>
</head>
<body>
<h2><?= $proceeding_id ? "Edit Proceeding" : "Add New Proceeding" ?> for <?= htmlspecialchars($conference['conference_title']) ?></h2>

<?php if(!empty($message)) echo "<p style='color:green;'>$message</p>"; ?>

<form method="post" enctype="multipart/form-data">
    Year:<br>
    <input type="number" name="year" value="<?= $proceeding['year'] ?? '' ?>" required><br><br>

    PDF File:<br>
    <?php if(!empty($proceeding['pdf_link'])) echo "<a href='{$proceeding['pdf_link']}' target='_blank'>Current PDF</a><br>"; ?>
    <input type="file" name="pdf"><br><br>

    Cover Image:<br>
    <?php if(!empty($proceeding['cover_image'])) echo "<img src='{$proceeding['cover_image']}' width='120'><br>"; ?>
    <input type="file" name="cover"><br><br>

    <input type="submit" value="<?= $proceeding_id ? "Update Proceeding" : "Add Proceeding" ?>">
</form>

<hr>
<a href="update_conference.php?conference_id=<?= $conference_id ?>">⬅ Back to Conference Dashboard</a>
</body>
</html>