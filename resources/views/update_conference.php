<?php
session_start();
include "config.php";

// ✅ Check if logged in as editor
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied.");
}

$editor = $_SESSION['user'];
$conference_id = intval($_GET['conference_id'] ?? 0);

// ✅ Load conference assigned to this editor
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id AND editor_id={$editor['id']}")->fetch_assoc();
if(!$conference) die("Conference not found.");

// ✅ Load committee members
$committee = $conn->query("SELECT * FROM conference_committee WHERE conference_id=$conference_id ORDER BY FIELD(role,'Conference Chair',
'Conference Co-Chair',
'Conference Secretary',
'Conference Co-Secretary',
'International Relations',
'Technical Program',
'Editorial and Publication',
'Design and Publicity',
'Workshop Management',
'Finance',
'Online Resource Management',
'Web and Information Management',
'Registration',
'Logistics and Inauguration')");

// ✅ Load proceedings
$proceedings = $conn->query("SELECT * FROM conference_proceedings WHERE conference_id=$conference_id ORDER BY year DESC");
?>

<html>
<head>
    <link rel="stylesheet" href="system.css">
    <title>Update Conference - <?= htmlspecialchars($conference['conference_title']) ?></title>
</head>
<body>

<h2>Update Conference Info</h2>
<form method="post" enctype="multipart/form-data" action="save_update_conference.php">
    <input type="hidden" name="conference_id" value="<?= $conference['id'] ?>">

    Title:<br>
    <input type="text" name="title" value="<?= htmlspecialchars($conference['conference_title']) ?>" required><br><br>

    

    Cover Image:<br>
    <?php if($conference['cover_image']) echo "<img src='{$conference['cover_image']}' width='120'><br>"; ?>
    <input type="file" name="cover_image"><br><br>

    Conference Details:<br>
    <textarea name="details" rows="5"><?= htmlspecialchars($conference['conference_details']) ?></textarea><br><br>

    Aim & Scope:<br>
    <textarea name="aim_scope" rows="5"><?= htmlspecialchars($conference['aim_scope']) ?></textarea><br><br>

    Mission:<br>
    <textarea name="mission" rows="5"><?= htmlspecialchars($conference['mission']) ?></textarea><br><br>

    <input type="submit" value="Update Conference">
</form>

<hr>

<h2>Manage Committee Members</h2>
<?php
if($committee->num_rows > 0){
    echo "<table border=1 cellpadding=5>";
    echo "<tr><th>Name</th><th>Role</th><th>Qualification</th><th>Faculty</th><th>Address</th></tr>";
    while($m = $committee->fetch_assoc()){
        echo "<tr>";
        echo "<td>{$m['name']}</td>";
        echo "<td>{$m['role']}</td>";
        echo "<td>{$m['department']}</td>";
        echo "<td>{$m['university']}</td>";
        
        echo "<td>
        <a href='edit_committee.php?member_id={$m['id']}&conference_id={$conference_id}'>Update</a> | 
        <a href='delete_committee.php?member_id={$m['id']}&conference_id={$conference_id}' onclick=\"return confirm('Delete this member?');\">Delete</a>
        </td>";
        echo "</tr>";
    }
    echo "</table>";
} else echo "<p>No committee members yet.</p>";
?>

<h3>Add New Member</h3>
<form method="post" action="add_committee.php?conference_id=<?= $conference_id ?>">
    Name:<br><input type="text" name="name" required><br><br>
    Role:<br>
    <select name="role" required>
        <option value="Conference Chair">Conference Chair</option>
        <option value="Conference Co-Chair">Conference Co-Chair</option>
        <option value="Conference Secretary">Conference Secretary</option>
        <option value="Conference Co-Secretary">Conference Co-Secretary</option>
        <option value="International Relations">International Relations</option>
        <option value="Technical Program">Technical Program</option>
        <option value="Editorial and Publication">Editorial and Publication</option>
        <option value="Design and Publicity">Design and Publicity</option>
        <option value="Workshop Management">Workshop Management</option>
        <option value="Finance">Finance</option>
        <option value="Online Resource Management">Online Resource Management</option>
        <option value="Web and Information Management">Web and Information Management</option>
        <option value="Registration">Registration</option>
        <option value="Logistics and Inauguration">Logistics and Inauguration</option>
    </select><br><br>
    Qualification:<br><input type="text" name="qualification"><br><br>
    Faculty:<br><input type="text" name="faculty"><br><br>
    Address:<br><input type="text" name="address"><br><br>
    <input type="submit" value="Add Member">
</form>

<hr>

<h2>Manage Proceedings</h2>
<?php
if($proceedings->num_rows > 0){
    while($p = $proceedings->fetch_assoc()){
        echo "<div class='journal-box'>";
        echo "Year: {$p['year']} ({$p['year']})<br>";
        if($p['cover_image']) echo "<img src='{$p['cover_image']}' width='120'><br>";
        if($p['pdf_link']) echo "<a href='{$p['pdf_link']}' target='_blank'>View PDF</a><br>";
        echo "<a href='edit_proceeding.php?proceeding_id={$p['id']}&conference_id={$conference_id}'>Update</a> | ";
        echo "<a href='delete_proceeding.php?proceeding_id={$p['id']}&conference_id={$conference_id}' onclick=\"return confirm('Delete this proceeding?');\">Delete</a>";
        echo "</div><br>";
    }
} else {
    echo "<p>No proceedings yet.</p>";
}
?>

<h3>Add New Proceeding</h3>
<form method="post" enctype="multipart/form-data" action="add_proceeding.php?conference_id=<?= $conference_id ?>">
    Year:<br><input type="number" name="year" required><br><br>
    Cover Image:<br><input type="file" name="cover" required><br><br>
    PDF File:<br><input type="file" name="pdf" required><br><br>
    <input type="submit" value="Add Proceeding">
</form>

<hr>
<a href="editor_dashboard_conference.php">⬅ Back to Dashboard</a>

</body>
</html>