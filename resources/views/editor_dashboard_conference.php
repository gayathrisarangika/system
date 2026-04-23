<?php
session_start();
include "config.php";

// Check if user is logged in and is editor
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor') {
    die("Access denied. Please login as editor.");
}

$u = $_SESSION['user'];

// Handle form submission
if($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Handle image uploads
    $header_image = isset($_FILES['header_image']) ? "uploads/" . $_FILES['header_image']['name'] : null;
    if($header_image) move_uploaded_file($_FILES['header_image']['tmp_name'], $header_image);

    $cover_image = isset($_FILES['cover_image']) ? "uploads/" . $_FILES['cover_image']['name'] : null;
    if($cover_image) move_uploaded_file($_FILES['cover_image']['tmp_name'], $cover_image);

    // Optional: University logo
    $uni_logo = isset($_FILES['uni_logo']) ? "uploads/" . $_FILES['uni_logo']['name'] : null;
    if($uni_logo) move_uploaded_file($_FILES['uni_logo']['tmp_name'], $uni_logo);

    // Prepare and insert conference details
    $stmt = $conn->prepare("
        INSERT INTO conferences
        (conference_title, university_name, header_image, university_logo, conference_details, cover_image, aim_scope, mission, footer_text, editor_id, department_id)
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
        echo "<p style='color:green;'>Conference submitted successfully!</p>";
    } else {
        echo "<p style='color:red;'>Error: " . $stmt->error . "</p>";
    }

    $stmt->close();
}

// Fetch the latest conference for this editor (if any)
$stmt = $conn->prepare("SELECT * FROM conferences WHERE editor_id = ? ORDER BY id DESC LIMIT 1");
$stmt->bind_param("i", $u['id']);
$stmt->execute();
$result = $stmt->get_result();
$conference = $result->fetch_assoc();
$stmt->close();
?>
<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Editor Dashboard - Conferences</title>
</head>
<body>
    <h2>Submit New Conference</h2>
    <form method="post" enctype="multipart/form-data">
        Conference Title:<br>
        <input type="text" name="title" required><br><br>

        University Name:<br>
        <input type="text" name="uni_name" required><br><br>

         University Logo :<br>
        <input type="file" name="uni_logo" required><br><br>

        Conference Details (paragraph-wise, 5 rows each):<br>
        <textarea name="details" rows="5" required></textarea><br><br>

        Cover Page Image:<br>
        <input type="file" name="cover_image" required><br><br>

        Aim & Scope:<br>
        <textarea name="aim_scope" rows="5" required></textarea><br><br>

        Mission:<br>
        <textarea name="mission" rows="5" required></textarea><br><br>


        <input type="submit" value="Submit Conference">
    </form>

    <hr>

    <!-- Quick links for existing conference management -->
    <p>
        <a href="add_conference_proceedings.php?conference_id=<?= $conference['id'] ?? '' ?>" >Add Papers / Sessions</a> | 
        <a href="manage_editorial_board_conference.php">Editorial Board</a>
    </p>

    <?php
        $res = $conn->query("
            SELECT * FROM conferences 
            WHERE status='approved'
            AND department_id = {$u['department_id']}
        ");

        if (!$res) {
            die("Query failed: " . $conn->error);
        }

        if ($res->num_rows > 0) {
            while ($c = $res->fetch_assoc()) {
                echo "<div class='conference-box'>";
                echo "<strong>{$c['conference_title']}</strong> ";
                echo "<a href='conference.php?id={$c['id']}' target='_blank' class='btn view'>View Website</a>";
                // Update Button
                echo "<a href='update_conference.php?conference_id={$c['id']}' class='btn edit'>Update</a>";
                echo "</div>";
            }
        } else {
            echo "<p>No approved conferences for your department.</p>";
        }
    ?>
</body>
</html>