<?php
session_start();
include "config.php";

/* ✅ Editor Protection */
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("<p style='color:red;'>Access denied. Please login as editor.</p>");
}

$u = $_SESSION['user'];

/* Handle form submission for new symposium */
if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $header_image = isset($_FILES['header_image']) ? "uploads/" . $_FILES['header_image']['name'] : null;
    if($header_image) move_uploaded_file($_FILES['header_image']['tmp_name'], $header_image);

    $cover_image = isset($_FILES['cover_image']) ? "uploads/" . $_FILES['cover_image']['name'] : null;
    if($cover_image) move_uploaded_file($_FILES['cover_image']['tmp_name'], $cover_image);

    $uni_logo = isset($_FILES['uni_logo']) ? "uploads/" . $_FILES['uni_logo']['name'] : null;
    if($uni_logo) move_uploaded_file($_FILES['uni_logo']['tmp_name'], $uni_logo);

    $stmt = $conn->prepare("
        INSERT INTO symposiums
        (symposium_title, university_name, header_image, university_logo, symposium_details, cover_image, aim_scope, mission, footer_text, editor_id, department_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "ssssssssiii",
        $_POST['title'], 
        $_POST['uni_name'], 
        $header_image, 
        $uni_logo, 
        $_POST['details'], 
        $cover_image, 
        $_POST['aim_scope'], 
        $_POST['mission'], 
        $_POST['footer_text'], 
        $u['id'], 
        $u['department_id']
    );

    if($stmt->execute()){
        echo "<p style='color:green;'>Symposium submitted successfully!</p>";
    } else {
        echo "<p style='color:red;'>Error: " . $stmt->error . "</p>";
    }
    $stmt->close();
}

/* Fetch latest symposium for this editor */
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE editor_id=? ORDER BY id DESC LIMIT 1");
$stmt->bind_param("i", $u['id']);
$stmt->execute();
$result = $stmt->get_result();
$symposium = $result->fetch_assoc();
$stmt->close();

/* Fetch all approved symposiums in editor's department */
$res = $conn->query("SELECT * FROM symposiums WHERE status='approved' AND department_id={$u['department_id']}");
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Editor Dashboard - Symposium</title>
</head>
<body>
    <h2>Submit New Symposium</h2>
    <form method="post" enctype="multipart/form-data">
        Symposium Title:<br>
        <input type="text" name="title" required><br><br>

        University Name:<br>
        <input type="text" name="uni_name" required><br><br>

        University Logo:<br>
        <input type="file" name="uni_logo"  required><br><br>

        Symposium Details (paragraph-wise, 5 rows each):<br>
        <textarea name="details" rows="5" required></textarea><br><br>

        Cover Page Image:<br>
        <input type="file" name="cover_image" required><br><br>

        Aim & Scope:<br>
        <textarea name="aim_scope" rows="5" required></textarea><br><br>

        Mission:<br>
        <textarea name="mission" rows="5" required></textarea><br><br>

        <input type="submit" value="Submit Symposium">
    </form>

    <hr>

    <!-- Quick links for existing symposium management -->
    <p>
        <a href="manage_symposium_committee.php?symposium_id=<?= $symposium['id'] ?? '' ?>">Manage Committee</a> | 
        <a href="add_symposium_proceedings.php?symposium_id=<?= $symposium['id'] ?? '' ?>">Add Proceedings</a>
    </p>

    <hr>

    <h2>Approved Symposiums in Your Department</h2>

    <?php
    if ($res && $res->num_rows > 0) {
        while($s = $res->fetch_assoc()){
            echo "<div class='journal-box'>";
            echo "<strong>{$s['symposium_title']}</strong><br>";
            echo "<a href='symposium.php?id={$s['id']}' target='_blank' class='btn view'>View Website</a>";
            echo "<a href='update_symposium.php?symposium_id={$s['id']}' class='btn edit'>Update</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No approved symposiums for your department.</p>";
    }
    ?>

</body>
</html>