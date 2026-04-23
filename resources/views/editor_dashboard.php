<?php
session_start();
include "config.php";

// ✅ Check if logged in as editor
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$u = $_SESSION['user'];

// Handle new journal submission
if($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Upload optional university logo
    $uni_logo = null;
    if(!empty($_FILES['uni_logo']['name'])){
        $uni_logo = "uploads/" . basename($_FILES['uni_logo']['name']);
        move_uploaded_file($_FILES['uni_logo']['tmp_name'], $uni_logo);
    }

    // Upload cover image
    $cover_image = null;
    if(!empty($_FILES['cover_image']['name'])){
        $cover_image = "uploads/" . basename($_FILES['cover_image']['name']);
        move_uploaded_file($_FILES['cover_image']['tmp_name'], $cover_image);
    }

    // Insert new journal
    $stmt = $conn->prepare("
        INSERT INTO journals
        (journal_title, university_name, university_logo, journal_details, cover_image, aim_scope, mission, footer_text, editor_id, department_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssssssssii",
        $_POST['title'],
        $_POST['uni_name'],
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
        echo "<p style='color:green;'>Journal submitted successfully!</p>";
    } else {
        echo "<p style='color:red;'>Error: " . $stmt->error . "</p>";
    }

    $stmt->close();
}

// ✅ Fetch latest journal created by this editor
$stmt = $conn->prepare("SELECT * FROM journals WHERE editor_id = ? ORDER BY id DESC LIMIT 1");
$stmt->bind_param("i", $u['id']);
$stmt->execute();
$result = $stmt->get_result();
$journal = $result->fetch_assoc();
$stmt->close();
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Editor Dashboard</title>
</head>
<body>

<h2>Submit New Journal</h2>

<form method="post" enctype="multipart/form-data">

Journal Title:<br>
<input type="text" name="title" required><br><br>

University Name:<br>
<input type="text" name="uni_name" required><br><br>

University Logo (optional):<br>
<input type="file" name="uni_logo"><br><br>

Journal Details:<br>
<textarea name="details" rows="5" required></textarea><br><br>

Cover Page Image:<br>
<input type="file" name="cover_image" required><br><br>

Aim & Scope:<br>
<textarea name="aim_scope" rows="5" required></textarea><br><br>

Mission:<br>
<textarea name="mission" rows="5" required></textarea><br><br>

Footer Text:<br>
<input type="text" name="footer_text"><br><br>

<input type="submit" value="Submit Journal">

</form>

<hr>

<!-- Quick links -->
<p>
<a href="add_article.php?journal_id=<?= $journal['id'] ?? '' ?>">Add Articles / Issues</a> |
<a href="manage_editorial_board.php?journal_id=<?= $journal['id'] ?? '' ?>">Editorial Board</a>
</p>

<hr>

<h3>Approved Journals</h3>

<?php
$res = $conn->prepare("
    SELECT * FROM journals
    WHERE status='approved' AND department_id = ?
");
$res->bind_param("i", $u['department_id']);
$res->execute();
$result = $res->get_result();

if ($result->num_rows > 0) {
    while ($j = $result->fetch_assoc()) {
        echo "<div class='journal-box'>";
        echo "<strong>" . htmlspecialchars($j['journal_title']) . "</strong> ";
        echo "(University: " . htmlspecialchars($j['university_name']) . ")<br>";

        if($j['university_logo']){
            echo "<img src='{$j['university_logo']}' width='80'><br>";
        }

        if($j['cover_image']){
            echo "<img src='{$j['cover_image']}' width='120'><br>";
        }

        echo "<a href='journal.php?id={$j['id']}' target='_blank' class='btn view'>View Website</a> ";
        echo "<a href='update_journal.php?journal_id={$j['id']}' class='btn edit'>Update</a>";
        echo "</div><br>";
    }
} else {
    echo "<p>No approved journals for your department.</p>";
}
$res->close();
?>

<hr>
<a href="index.php">⬅ Back to Dashboard</a>

</body>
</html>