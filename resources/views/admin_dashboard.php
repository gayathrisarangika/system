<?php
session_start();
include "config.php";

/* ✅ Admin Protection */
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    die("<p style='color:red;'>Access denied. Please login as admin.</p>");
}

/* ✅ Approve / Reject */
if (isset($_GET['approve'])) {
    $id = intval($_GET['approve']);
    $type = $_GET['type'] ?? 'journal';
    if ($type === 'journal') {
        $conn->query("UPDATE journals SET status='approved' WHERE id=$id");
    } elseif ($type === 'conference') {
        $conn->query("UPDATE conferences SET status='approved' WHERE id=$id");
    } elseif ($type === 'symposium') {
        $conn->query("UPDATE symposiums SET status='approved' WHERE id=$id");
    }
    header("Location: admin_dashboard.php");
    exit();
}

if (isset($_GET['reject'])) {
    $id = intval($_GET['reject']);
    $type = $_GET['type'] ?? 'journal';
    if ($type === 'journal') {
        $conn->query("UPDATE journals SET status='rejected' WHERE id=$id");
    } elseif ($type === 'conference') {
        $conn->query("UPDATE conferences SET status='rejected' WHERE id=$id");
    } elseif ($type === 'symposium') {
        $conn->query("UPDATE symposiums SET status='rejected' WHERE id=$id");
    }
    header("Location: admin_dashboard.php");
    exit();
}

/* ✅ Fetch Pending Items */
$pending_journals = $conn->query("
    SELECT j.*, d.name AS dept_name 
    FROM journals j
    JOIN departments d ON j.department_id = d.id
    WHERE j.status='pending'
");

$pending_conferences = $conn->query("
    SELECT c.*, d.name AS dept_name
    FROM conferences c
    JOIN departments d ON c.department_id = d.id
    WHERE c.status='pending'
");

$pending_symposiums = $conn->query("
    SELECT s.*, d.name AS dept_name
    FROM symposiums s
    JOIN departments d ON s.department_id = d.id
    WHERE s.status='pending'
");

/* ✅ Fetch Approved Items */
$approved_journals = $conn->query("
    SELECT j.*, d.name AS dept_name 
    FROM journals j
    JOIN departments d ON j.department_id = d.id
    WHERE j.status='approved'
");

$approved_conferences = $conn->query("
    SELECT c.*, d.name AS dept_name
    FROM conferences c
    JOIN departments d ON c.department_id = d.id
    WHERE c.status='approved'
");

$approved_symposiums = $conn->query("
    SELECT s.*, d.name AS dept_name
    FROM symposiums s
    JOIN departments d ON s.department_id = d.id
    WHERE s.status='approved'
");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="system.css">
</head>
<body>

<header class="main-header">
    <h1>Admin Dashboard</h1>
</header>

<div class="container">

    <!-- ==================== Pending Section ==================== -->
    <h2>Pending Items</h2>

    <!-- Journals -->
    <h3>Journals</h3>
    <?php
    if ($pending_journals->num_rows > 0) {
        while ($j = $pending_journals->fetch_assoc()) {
            echo "<div class='item-box'>";
            echo "<strong>{$j['journal_title']}</strong> ({$j['dept_name']})<br>";
            echo "<a href='review_journal.php?id={$j['id']}' class='btn view'>Review</a> ";
            echo "<a href='?approve={$j['id']}&type=journal' class='btn approve'>Approve</a> ";
            echo "<a href='?reject={$j['id']}&type=journal' class='btn reject'>Reject</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No pending journals.</p>";
    }
    ?>

    <!-- Conferences -->
    <h3>Conferences</h3>
    <?php
    if ($pending_conferences->num_rows > 0) {
        while ($c = $pending_conferences->fetch_assoc()) {
            echo "<div class='item-box'>";
            echo "<strong>{$c['conference_title']}</strong> ({$c['dept_name']})<br>";
            echo "<a href='review_conference.php?id={$c['id']}' class='btn view'>Review</a> ";
            echo "<a href='?approve={$c['id']}&type=conference' class='btn approve'>Approve</a> ";
            echo "<a href='?reject={$c['id']}&type=conference' class='btn reject'>Reject</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No pending conferences.</p>";
    }
    ?>

    <!-- Symposiums -->
    <h3>Symposiums</h3>
    <?php
    if ($pending_symposiums->num_rows > 0) {
        while ($s = $pending_symposiums->fetch_assoc()) {
            echo "<div class='item-box'>";
            echo "<strong>{$s['symposium_title']}</strong> ({$s['dept_name']})<br>";
            echo "<a href='review_symposium.php?id={$s['id']}' class='btn view'>Review</a> ";
            echo "<a href='?approve={$s['id']}&type=symposium' class='btn approve'>Approve</a> ";
            echo "<a href='?reject={$s['id']}&type=symposium' class='btn reject'>Reject</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No pending symposiums.</p>";
    }
    ?>

    <hr>

    <!-- ==================== Approved Section ==================== -->
    <h2>Approved Items</h2>

    <!-- Journals -->
    <h3>Journals</h3>
    <?php
    if ($approved_journals->num_rows > 0) {
        while ($j = $approved_journals->fetch_assoc()) {
            echo "<div class='item-box'>";
            echo "<strong>{$j['journal_title']}</strong> ({$j['dept_name']}) ";
            echo "<a href='journal.php?id={$j['id']}' class='btn view' target='_blank'>View Website</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No approved journals yet.</p>";
    }
    ?>

    <!-- Conferences -->
    <h3>Conferences</h3>
    <?php
    if ($approved_conferences->num_rows > 0) {
        while ($c = $approved_conferences->fetch_assoc()) {
            echo "<div class='item-box'>";
            echo "<strong>{$c['conference_title']}</strong> ({$c['dept_name']}) ";
            echo "<a href='conference.php?id={$c['id']}' class='btn view' target='_blank'>View Website</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No approved conferences yet.</p>";
    }
    ?>

    <!-- Symposiums -->
    <h3>Symposiums</h3>
    <?php
    if ($approved_symposiums->num_rows > 0) {
        while ($s = $approved_symposiums->fetch_assoc()) {
            echo "<div class='item-box'>";
            echo "<strong>{$s['symposium_title']}</strong> ({$s['dept_name']}) ";
            echo "<a href='symposium.php?id={$s['id']}' class='btn view' target='_blank'>View Website</a>";
            echo "</div>";
        }
    } else {
        echo "<p>No approved symposiums yet.</p>";
    }
    ?>

</div> <!-- container ends -->

</body>
</html>