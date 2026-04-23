<?php
session_start();
include "config.php";

/* ✅ Admin Protection */
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    die("<p style='color:red;'>Access denied. Please login as admin.</p>");
}

$symposium_id = intval($_GET['id'] ?? 0);
if (!$symposium_id) die("Invalid Symposium ID.");

/* ✅ Fetch Symposium */
$symposium = $conn->query("
    SELECT s.*, d.name AS dept_name
    FROM symposiums s
    JOIN departments d ON s.department_id = d.id
    WHERE s.id = $symposium_id
")->fetch_assoc();

if (!$symposium) die("Symposium not found.");

/* ✅ Fetch Committee (Chair & Co-Chair) */
$committee = $conn->query("
    SELECT * FROM symposium_committee 
    WHERE symposium_id = $symposium_id
    ORDER BY FIELD(role, 'Chair', 'Co-Chair')
");

/* ✅ Fetch Proceedings */
$proceedings = $conn->query("
    SELECT * FROM symposium_proceedings
    WHERE symposium_id = $symposium_id
    ORDER BY year DESC
");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Review Symposium</title>
    <link rel="stylesheet" href="system.css">
    <style>
        .section { margin-bottom: 40px; }
        .box { border:1px solid #ccc; padding:15px; margin-bottom:15px; }
        img { max-width:200px; margin-top:10px; }
    </style>
</head>
<body>

<h1>Review Symposium</h1>

<div class="section">
    <h2><?= htmlspecialchars($symposium['symposium_title']) ?></h2>
    <p><strong>Department:</strong> <?= htmlspecialchars($symposium['dept_name']) ?></p>
    <p><strong>University:</strong> <?= htmlspecialchars($symposium['university_name']) ?></p>
</div>

<div class="section">
    <h3>Header Image</h3>
    <?php if(!empty($symposium['header_image'])): ?>
        <img src="<?= $symposium['header_image'] ?>">
    <?php endif; ?>
</div>

<div class="section">
    <h3>Cover Image</h3>
    <?php if(!empty($symposium['cover_image'])): ?>
        <img src="<?= $symposium['cover_image'] ?>">
    <?php endif; ?>
</div>

<div class="section">
    <h3>Symposium Details</h3>
    <div class="box"><?= nl2br(htmlspecialchars($symposium['symposium_details'])) ?></div>
</div>

<div class="section">
    <h3>Aim & Scope</h3>
    <div class="box"><?= nl2br(htmlspecialchars($symposium['aim_scope'])) ?></div>
</div>

<div class="section">
    <h3>Mission</h3>
    <div class="box"><?= nl2br(htmlspecialchars($symposium['mission'])) ?></div>
</div>

<!-- ================= Committee ================= -->
<div class="section">
    <h3>Committee</h3>

    <?php if($committee && $committee->num_rows > 0): ?>
        <?php while($m = $committee->fetch_assoc()): ?>
            <div class="box">
                <strong><?= htmlspecialchars($m['role']) ?></strong><br>
                <?= htmlspecialchars($m['name']) ?><br>
                <?= htmlspecialchars($m['department']) ?><br>
                <?= htmlspecialchars($m['university']) ?><br>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p>No committee members added.</p>
    <?php endif; ?>
</div>

<!-- ================= Proceedings ================= -->
<div class="section">
    <h3>Proceedings</h3>

    <?php if($proceedings && $proceedings->num_rows > 0): ?>
        <?php while($p = $proceedings->fetch_assoc()): ?>
            <div class="box">
                <strong><?= htmlspecialchars($p['version']) ?></strong>
                (<?= $p['year'] ?>)
                <?= $p['is_current'] ? "<b> - Current</b>" : "" ?><br>

                <?php if(!empty($p['pdf_link'])): ?>
                    <a href="<?= $p['pdf_link'] ?>" target="_blank">View PDF</a><br>
                <?php endif; ?>

                <?php if(!empty($p['cover_image'])): ?>
                    <img src="<?= $p['cover_image'] ?>">
                <?php endif; ?>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p>No proceedings added.</p>
    <?php endif; ?>
</div>

<hr>

<!-- Approve / Reject Buttons -->
<a href="admin_dashboard.php?approve=<?= $symposium_id ?>&type=symposium" class="btn approve">Approve</a>
<a href="admin_dashboard.php?reject=<?= $symposium_id ?>&type=symposium" class="btn reject">Reject</a>
<a href="admin_dashboard.php">⬅ Back</a>

</body>
</html>