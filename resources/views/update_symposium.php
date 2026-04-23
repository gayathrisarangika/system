<?php
session_start();
include "config.php";

// ✅ Only editor can access
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$symposium_id = intval($_GET['symposium_id'] ?? 0);
if($symposium_id <= 0) die("Invalid symposium ID.");

// ✅ Load symposium
$stmt = $conn->prepare("SELECT * FROM symposiums WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $symposium_id, $editor['id']);
$stmt->execute();
$symposium = $stmt->get_result()->fetch_assoc();
$stmt->close();
if(!$symposium) die("Symposium not found.");

// ✅ Load proceedings
$proceedings = $conn->query("SELECT * FROM symposium_proceedings WHERE symposium_id=$symposium_id ORDER BY year DESC");

// ✅ Load committee
$committee = $conn->query("SELECT * FROM symposium_committee WHERE symposium_id=$symposium_id");

?>
<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Update Symposium - <?= htmlspecialchars($symposium['symposium_title']) ?></title>
</head>
<body>

<h2>Update Symposium Info</h2>
<form method="post" enctype="multipart/form-data" action="save_update_symposium.php">
    <input type="hidden" name="symposium_id" value="<?= $symposium['id'] ?>">

    Title:<br>
    <input type="text" name="symposium_title" value="<?= htmlspecialchars($symposium['symposium_title']) ?>" required><br><br>

    Symposium Details:<br>
    <textarea name="symposium_details" rows="5"><?= htmlspecialchars($symposium['symposium_details']) ?></textarea><br><br>

    Header Image:<br>
    <?php if($symposium['header_image']) echo "<img src='{$symposium['header_image']}' width='120'><br>"; ?>
    <input type="file" name="header_image"><br><br>

    Cover Image:<br>
    <?php if($symposium['cover_image']) echo "<img src='{$symposium['cover_image']}' width='120'><br>"; ?>
    <input type="file" name="cover_image"><br><br>

    Aim & Scope:<br>
    <textarea name="aim_scope" rows="4"><?= htmlspecialchars($symposium['aim_scope']) ?></textarea><br><br>

    Mission:<br>
    <textarea name="mission" rows="4"><?= htmlspecialchars($symposium['mission']) ?></textarea><br><br>

    <input type="submit" value="Update Symposium">
</form>

<hr>

<h2>Manage Proceedings</h2>
<?php
if($proceedings->num_rows > 0){
    while($p = $proceedings->fetch_assoc()){
        echo "<div class='journal-box'>";
        echo "{$p['year']} ({$p['year']})<br>";
        if($p['cover_image']) echo "<img src='{$p['cover_image']}' width='120'><br>";
        if($p['pdf_link']) echo "<a href='{$p['pdf_link']}' target='_blank'>View PDF</a><br>";
        echo "<a href='edit_symposium_proceeding.php?proceeding_id={$p['id']}&symposium_id={$symposium_id}'>Update</a> | ";
        echo "<a href='delete_symposium_proceeding.php?proceeding_id={$p['id']}&symposium_id={$symposium_id}' onclick=\"return confirm('Delete this proceeding?');\">Delete</a>";
        echo "</div><br>";
    }
} else {
    echo "<p>No proceedings yet.</p>";
}
?>

<h3>Add New Proceeding</h3>
<form method="post" enctype="multipart/form-data" action="add_symposium_proceeding.php?symposium_id=<?= $symposium_id ?>">
    Title:<br><input type="text" name="title" required><br><br>
    Year:<br><input type="number" name="year" required><br><br>
    Cover Image:<br><input type="file" name="cover" required><br><br>
    PDF File:<br><input type="file" name="pdf" required><br><br>
    Current Proceeding:<br>
    <select name="is_current">
        <option value="1">Yes</option>
        <option value="0">No</option>
    </select><br><br>
    <input type="submit" value="Add Proceeding">
</form>

<hr>

<h2>Symposium Committee</h2>
<?php
if($committee->num_rows > 0){
    echo "<table border=1 cellpadding=5>";
    echo "<tr><th>Name</th><th>Role</th><th>Qualification</th><th>Faculty</th><th>Address</th><th>Actions</th></tr>";
    while($c = $committee->fetch_assoc()){
        echo "<tr>";
        echo "<td>{$c['name']}</td>";
        echo "<td>{$c['role']}</td>";
        echo "<td>{$c['department']}</td>";
        echo "<td>{$c['university']}</td>";
        
        echo "<td>
        <a href='edit_symposium_committee.php?member_id={$c['id']}&symposium_id={$symposium_id}'>Update</a> | 
        <a href='delete_symposium_committee.php?member_id={$c['id']}&symposium_id={$symposium_id}' onclick=\"return confirm('Delete this member?');\">Delete</a>
        </td>";
        echo "</tr>";
    }
    echo "</table>";
} else echo "<p>No members yet.</p>";
?>

<h3>Add New Member</h3>
<form method="post" action="add_symposium_committee.php?symposium_id=<?= $symposium_id ?>">
    Name:<br><input type="text" name="name" required><br><br>
    Role:<br><input type="text" name="role" required><br><br>
    Qualification:<br><input type="text" name="qualification"><br><br>
    Faculty:<br><input type="text" name="faculty"><br><br>
    Address:<br><input type="text" name="address"><br><br>
    <input type="submit" value="Add Member">
</form>

<hr>
<a href="editor_dashboard.php">⬅ Back to Dashboard</a>

</body>
</html>