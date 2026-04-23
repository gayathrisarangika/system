<?php
session_start();
include "config.php";

// Check if logged in as editor
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$journal_id = intval($_GET['journal_id'] ?? 0);

if(!$journal_id) die("Invalid journal ID.");

// Load journal
$stmt = $conn->prepare("SELECT * FROM journals WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $journal_id, $editor['id']);
$stmt->execute();
$journal = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$journal) die("Journal not found.");

// Load issues
$issues = $conn->query("SELECT * FROM issues WHERE journal_id=$journal_id ORDER BY year DESC");

// Load editorial board
$board = $conn->query("SELECT * FROM editorial_board WHERE journal_id=$journal_id");
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Update Journal - <?= htmlspecialchars($journal['journal_title']) ?></title>
</head>
<body>

<h2>Update Journal Info</h2>
<form method="post" enctype="multipart/form-data" action="save_update_journal.php">
    <input type="hidden" name="journal_id" value="<?= $journal['id'] ?>">

    Journal Title:<br>
    <input type="text" name="title" value="<?= htmlspecialchars($journal['journal_title']) ?>" required><br><br>

    University Name:<br>
    <input type="text" name="uni_name" value="<?= htmlspecialchars($journal['university_name']) ?>" required><br><br>

    University Logo (optional):<br>
    <?php if($journal['university_logo']) echo "<img src='{$journal['university_logo']}' width='100'><br>"; ?>
    <input type="file" name="uni_logo"><br><br>

    Cover Image:<br>
    <?php if($journal['cover_image']) echo "<img src='{$journal['cover_image']}' width='120'><br>"; ?>
    <input type="file" name="cover_image"><br><br>

    Journal Details:<br>
    <textarea name="details" rows="5"><?= htmlspecialchars($journal['journal_details']) ?></textarea><br><br>

    Aim & Scope:<br>
    <textarea name="aim_scope" rows="5"><?= htmlspecialchars($journal['aim_scope']) ?></textarea><br><br>

    Mission:<br>
    <textarea name="mission" rows="5"><?= htmlspecialchars($journal['mission']) ?></textarea><br><br>

    Footer Text:<br>
    <input type="text" name="footer_text" value="<?= htmlspecialchars($journal['footer_text']) ?>"><br><br>

    <input type="submit" value="Update Journal">
</form>

<hr>

<h2>Manage Issues</h2>
<?php
if($issues->num_rows > 0){
    while($i = $issues->fetch_assoc()){
        echo "<div class='journal-box'>";
        echo "Vol {$i['volume']} - Issue {$i['issue']} ({$i['year']})<br>";
        if($i['cover_image']) echo "<img src='{$i['cover_image']}' width='120'><br>";
        if($i['pdf_link']) echo "<a href='{$i['pdf_link']}' target='_blank'>View PDF</a><br>";
        echo "<a href='add_article.php?issue_id={$i['id']}&journal_id={$journal_id}'>Update Issue</a> | ";
        echo "<a href='delete_issue.php?issue_id={$i['id']}&journal_id={$journal_id}' onclick=\"return confirm('Delete this issue?');\">Delete</a>";
        echo "</div><br>";
    }
} else {
    echo "<p>No issues yet.</p>";
}
?>
<h3>Add New Issue</h3> 
<form method="post" enctype="multipart/form-data" action="add_article.php?journal_id=<?= $journal_id ?>"> 
    Volume:<br><input type="number" name="vol" required><br><br> 
    Issue:<br><input type="number" name="iss" required><br><br> 
    Year:<br><input type="number" name="year" required><br><br> 
    Cover Image:<br><input type="file" name="cover" required><br><br> 
    PDF File:<br><input type="file" name="pdf" required><br><br> 
    Current Issue:<br> 
    <select name="current"> 
        <option value="1">Yes</option> 
        <option value="0">No</option> 
    </select><br><br> 
    <input type="submit" value="Add Issue"> </form> <hr>

<h2>Editorial Board</h2>
<?php
if($board->num_rows > 0){
    echo "<table border=1 cellpadding=5>";
    echo "<tr><th>Name</th><th>Role</th><th>Qualification</th><th>Faculty</th><th>Address</th><th>Actions</th></tr>";
    while($m = $board->fetch_assoc()){
        echo "<tr>";
        echo "<td>{$m['name']}</td>";
        echo "<td>{$m['role']}</td>";
        echo "<td>{$m['department']}</td>";
        echo "<td>{$m['university']}</td>";
        
        echo "<td>
        <a href='edit_member.php?member_id={$m['id']}&journal_id={$journal_id}'>Update</a> | 
        <a href='delete_member.php?member_id={$m['id']}&journal_id={$journal_id}' onclick=\"return confirm('Delete this member?');\">Delete</a>
        </td>";
        echo "</tr>";
    }
    echo "</table>";
} else echo "<p>No members yet.</p>";
?>

<h3>Add New Member</h3>
<form method="post" action="add_member.php?journal_id=<?= $journal_id ?>">
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