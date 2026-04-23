<?php
session_start();
include "config.php";

/* CHECK LOGIN */
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor') {
    die("Access denied. Please login as editor.");
}

$u = $_SESSION['user'];

/* GET EDITOR'S JOURNAL */
$journal_res = $conn->query("SELECT * FROM journals WHERE editor_id={$u['id']} LIMIT 1");

if(!$journal_res){
    die("Journal Error: " . $conn->error);
}

if($journal_res->num_rows == 0){
    die("Please create a journal first.");
}

$journal = $journal_res->fetch_assoc();
$journal_id = $journal['id'];

/* ADD MEMBER */
if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name = trim($_POST['name']);
    $role = trim($_POST['role']);
    $qualification = trim($_POST['department']);
    $faculty = trim($_POST['university']);
    //$address = trim($_POST['address']);

    $stmt = $conn->prepare("
        INSERT INTO editorial_board
        (journal_id, name, role, department, university)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param("issss",
        $journal_id,
        $name,
        $role,
        $qualification,
        $faculty
        //$address
    );

    if($stmt->execute()){
        echo "<p style='color:green;'>Member Added Successfully!</p>";
    } else {
        echo "<p style='color:red;'>Error: ".$stmt->error."</p>";
    }

    $stmt->close();
}

/* FETCH MEMBERS */
$members = $conn->query("SELECT * FROM editorial_board WHERE journal_id=$journal_id");

if(!$members){
    die("Members Error: " . $conn->error);
}
?>
<html>
    <head> <link rel="stylesheet" href="system.css"> </head>
    <body>
        <h2>Manage Editorial Board</h2>

        <form method="post">

            Name:<br>
            <input type="text" name="name" required><br><br>

            Role:<br>
            <select name="role">
                <option>Editor-in-Chief</option>
                <option>Coordinating Editor</option>
                <option>Editors</option>
                <option>Text Editor</option>
                <option>Editorial Assistant</option>
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
            <?php while($m = $members->fetch_assoc()): ?>

                <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
                    <b><?= htmlspecialchars($m['name']) ?></b> (<?= htmlspecialchars($m['role']) ?>)<br>
                    <?= htmlspecialchars($m['department']) ?><br>
                    <?= htmlspecialchars($m['university']) ?><br>
                    
                </div>

            <?php endwhile; ?>
        <?php else: ?>
            No members added yet.
        <?php endif; ?>

        <hr>
        <a href="editor_dashboard.php">⬅ Back to Dashboard</a>
    </body>
</html>
    
