<?php
session_start();
include "config.php";

/* ✅ Admin Protection */
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    die("<p style='color:red;'>Access denied.</p>");
}

/* ✅ Get Journal ID */
if (!isset($_GET['id'])) {
    die("Invalid Journal");
}

$journal_id = intval($_GET['id']);

/* ✅ Fetch Journal */
$journal = $conn->query("
    SELECT j.*, d.name AS dept_name
    FROM journals j
    JOIN departments d ON j.department_id = d.id
    WHERE j.id = $journal_id
")->fetch_assoc();

/* ✅ Safety Check */
if (!$journal) {
    die("Journal not found");
}

/* ✅ Fetch Editorial Board */
$board = $conn->query("
    SELECT * FROM editorial_board
    WHERE journal_id = $journal_id
");

/* ✅ Fetch Issues */
$issues = $conn->query("
    SELECT * FROM issues
    WHERE journal_id = $journal_id
    ORDER BY year DESC
");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Review Journal</title>
    <link rel="stylesheet" href="system.css">
</head>
<body>

<header class="main-header">
    <h1>Journal Review</h1>
</header>

<div class="container">

    <h2><?= $journal['journal_title'] ?></h2>
    <small><?= $journal['dept_name'] ?></small>

    <hr>

    <!-- ✅ Journal Details -->
    <h3>Journal Details</h3>
    <p><?= nl2br($journal['journal_details']) ?></p>

    <h3>Aim & Scope</h3>
    <p><?= nl2br($journal['aim_scope']) ?></p>

    <h3>Mission</h3>
    <p><?= nl2br($journal['mission']) ?></p>

    <hr>

        <!-- ✅ Editorial Board -->
    <h3>Editorial Board</h3>

    <?php
    if ($board && $board->num_rows > 0) {

        // Fetch all members into an array first
        $members = [];
        while ($m = $board->fetch_assoc()) {
            $members[] = $m;
        }

        // Define role order for display
        $role_order = ['Editor-in-Chief', 'Associate Editor', 'Member'];

        foreach ($role_order as $role) {
            $role_members = array_filter($members, fn($m) => ($m['role'] ?? '') === $role);

            if (!empty($role_members)) {
                echo "<h4>" . htmlspecialchars($role) . "</h4>";
                echo "<div class='board-grid'>"; // optional grid for cards

                foreach ($role_members as $m) {
                    echo "<div class='member-card'>";
                    echo "<strong>" . htmlspecialchars($m['name']) . "</strong><br>";

                    if (!empty($m['qualification'])) {
                        echo htmlspecialchars($m['qualification']) . "<br>";
                    }
                    if (!empty($m['faculty'])) {
                        echo htmlspecialchars($m['faculty']) . "<br>";
                    }
                    if (!empty($m['address'])) {
                        echo htmlspecialchars($m['address']);
                    }

                    echo "</div>";
                }

                echo "</div><hr>";
            }
        }

    } else {
        echo "<p>No editorial board members added.</p>";
    }
    ?>
    <hr>

    <!-- ✅ Issues -->
    <h3>Issues</h3>

    <div class="issues-container">
    <?php
    if ($issues && $issues->num_rows > 0) {
        while ($i = $issues->fetch_assoc()) {
            echo "<div class='journal-box'>";
            
            // Issue details
            echo "<strong>Vol {$i['volume']} - Issue {$i['issue']} ({$i['year']})</strong><br>";
            
            // Cover image
            if (!empty($i['cover_image'])) {
                echo "<img src='{$i['cover_image']}' width='120'><br>";
            }
            
            // PDF link
            if (!empty($i['pdf_link'])) {
                echo "<a href='{$i['pdf_link']}' target='_blank'>View PDF</a><br>";
            }

            // Current issue badge
            if (!empty($i['current_issue']) && $i['current_issue'] == 1) {
                echo "<span class='current-issue'>Current Issue</span>";
            }

            echo "</div>";
        }
    } else {
        echo "<p>No issues added.</p>";
    }
    ?>
</div>
    <hr>

    <a href="admin_dashboard.php" class="btn view">⬅ Back</a>

</div>

</body>
</html>