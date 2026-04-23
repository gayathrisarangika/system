<?php
session_start();
include "config.php";

/* ✅ Editor Protection */
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("<p style='color:red;'>Access denied. Please login as editor.</p>");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_GET['symposium_id'] ?? 0);
if(!$symposium_id) die("Invalid Symposium ID.");

/* ✅ Load symposium */
$symposium = $conn->query("SELECT * FROM symposiums WHERE id=$symposium_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$symposium) die("Symposium not found.");

/* ✅ Add Committee Member */
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $name = trim($_POST['name']);
    $role = trim($_POST['role']);
    $qualification = trim($_POST['department']);
    $faculty = trim($_POST['university']);
   // $address = trim($_POST['address']);

    $stmt = $conn->prepare("
        INSERT INTO symposium_committee
        (symposium_id, name, role, department, university)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("issss", $symposium_id, $name, $role, $qualification, $faculty);

    if($stmt->execute()){
        echo "<p style='color:green;'>Member added successfully!</p>";
    } else {
        echo "<p style='color:red;'>Error: " . $stmt->error . "</p>";
    }
    $stmt->close();
}

/* ✅ Fetch Members */
$members = $conn->query("SELECT * FROM symposium_committee WHERE symposium_id=$symposium_id ORDER BY role ASC");
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Manage Symposium Committee</title>
    <style>
        .board-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .member-card {
            border: 1px solid #ccc;
            padding: 15px;
        }
    </style>
</head>
<body>

<h2>Manage Committee for: <?= htmlspecialchars($symposium['symposium_title']) ?></h2>

<form method="post">
    Name:<br>
    <input type="text" name="name" required><br><br>

    Role:<br>
    <select name="role">
        <option>Chair</option>
        <option>Secretary</option>
    </select><br><br>

    Department:<br>
    <input type="text" name="department" required><br><br>

    University:<br>
    <input type="text" name="university" required><br><br>

    <input type="submit" value="Add Member">
</form>

<hr>

<h3>Existing Members</h3>
<?php if($members->num_rows > 0): ?>
    <div class="board-grid">
    <?php while($m = $members->fetch_assoc()): ?>
        <div class="member-card">
            <b><?= htmlspecialchars($m['name']) ?></b><br>
            <?= htmlspecialchars($m['role']) ?><br>
            <?= htmlspecialchars($m['department']) ?><br>
            <?= htmlspecialchars($m['university']) ?><br>
            
        </div>
    <?php endwhile; ?>
    </div>
<?php else: ?>
    <p>No members added yet.</p>
<?php endif; ?>

<hr>
<a href="editor_dashboard_symposium.php">⬅ Back to Dashboard</a>

</body>
</html>