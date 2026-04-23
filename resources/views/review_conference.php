<?php
session_start();
include "config.php";

/* ✅ Admin Protection */
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'admin') {
    die("<p style='color:red;'>Access denied.</p>");
}

/* ✅ Get Conference ID */
$conference_id = intval($_GET['id'] ?? 0);
if ($conference_id <= 0) die("Invalid conference ID.");

/* ✅ Fetch Conference */
$result = $conn->query("
    SELECT c.*, d.name AS dept_name 
    FROM conferences c 
    JOIN departments d ON c.department_id = d.id 
    WHERE c.id=$conference_id
");
if (!$result) die("Database query failed: " . $conn->error);
$conference = $result->fetch_assoc();
if (!$conference) die("Conference not found.");

/* ✅ Fetch Organizing Committee (using correct column `role`) */
$committee = $conn->query("
    SELECT * FROM conference_committee 
    WHERE conference_id=$conference_id 
    ORDER BY FIELD(role, 'Main Committee','Faculty Coordinator','Sub-Committee Chair','Sub-Committee')
");
if (!$committee) die("Committee query failed: " . $conn->error);

/* ✅ Fetch Proceedings */
$proceedings = $conn->query("
    SELECT * FROM conference_proceedings 
    WHERE conference_id=$conference_id 
    ORDER BY year DESC
");
if (!$proceedings) die("Proceedings query failed: " . $conn->error);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Review Conference</title>
    <link rel="stylesheet" href="system.css">
</head>
<body>

<header class="main-header">
    <h1>Conference Review</h1>
</header>

<div class="container">

    <h2><?= htmlspecialchars($conference['conference_title']) ?></h2>
    <small><?= htmlspecialchars($conference['dept_name']) ?></small>

    <hr>

    <!-- ✅ Conference Details -->
    <h3>Conference Details</h3>
    <p><?= nl2br(htmlspecialchars($conference['conference_details'])) ?></p>

    <h3>Aim & Scope</h3>
    <p><?= nl2br(htmlspecialchars($conference['aim_scope'])) ?></p>

    <h3>Mission</h3>
    <p><?= nl2br(htmlspecialchars($conference['mission'])) ?></p>

    <hr>

    <!-- ✅ Organizing Committee -->
    <h3>Organizing Committee</h3>
    <?php
    if ($committee->num_rows > 0) {
        $roles_order = ['Conference Chair',
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
                    'Logistics and Inauguration'];
        $members = [];
        while($m = $committee->fetch_assoc()){
            $members[] = $m;
        }

        foreach($roles_order as $role){
            $role_members = array_filter($members, fn($m) => $m['role'] === $role);
            if(!empty($role_members)){
                echo "<h4>$role</h4>";
                echo "<div class='board-grid'>";
                foreach($role_members as $m){
                    echo "<div class='member-card'>";
                    echo "<strong>".htmlspecialchars($m['name'])."</strong><br>";
                    if(!empty($m['department'])) echo htmlspecialchars($m['department'])."<br>";
                    if(!empty($m['university'])) echo htmlspecialchars($m['university'])."<br>";
                    
                    echo "</div>";
                }
                echo "</div><hr>";
            }
        }
    } else {
        echo "<p>No committee members added yet.</p>";
    }
    ?>

    <hr>

    <!-- ✅ Proceedings -->
    <h3>Conference Proceedings</h3>
    <?php
    if($proceedings->num_rows > 0){
        while($p = $proceedings->fetch_assoc()){
            echo "<div class='journal-box'>";
            echo "<strong>Year: " . htmlspecialchars($p['year']) . "</strong><br>";

            if(!empty($p['cover_image'])){
                echo "<img src='".htmlspecialchars($p['cover_image'])."' width='120'><br>";
            }
            if(!empty($p['pdf_link'])){
                echo "<a href='".htmlspecialchars($p['pdf_link'])."' target='_blank'>View PDF</a><br>";
            }
            if(!empty($p['is_current']) && $p['is_current']==1){
                echo "<span class='current-issue'>Current Proceeding</span>";
            }

            echo "</div>";
        }
    } else {
        echo "<p>No proceedings added.</p>";
    }
    ?>

    <hr>
    <a href="admin_dashboard.php" class="btn view">⬅ Back to Dashboard</a>

</div>

</body>
</html>