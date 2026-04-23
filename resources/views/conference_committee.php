<?php
include "config.php";

$conference_id = intval($_GET['id'] ?? 0);
if ($conference_id <= 0) die("Invalid conference ID.");

/* Fetch Conference Details */
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id")->fetch_assoc();
if (!$conference) die("Conference not found.");

/* Fetch Organizing Committee */
$committee = $conn->query("
    SELECT * FROM conference_committee
    WHERE conference_id=$conference_id
    ORDER BY FIELD(role, 'Conference Chair','Conference Co-Chair','Conference Secretary','Conference Co-Secretary','International Relations','Technical Program','Editorial and Publication','Design and Publicity','Workshop Management','Finance','Online Resource Management','Web and Information Management','Registration','Logistics and Inauguration')");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Organizing Committee - <?= htmlspecialchars($conference['conference_title']) ?></title>
    <link rel="stylesheet" href="style.css">

    <style>
        .board-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .member-card {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
        }

        .role-section {
            margin-bottom: 30px;
        }

        .role-section h3 {
            margin-bottom: 15px;
            color: #0b2c6b;
        }

         .journal-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            background:#e9e9e9;
            padding:20px 30px;
        }

        .journal-title{
            text-align:center;
            flex:1;
        }

        .journal-title h1{
            margin:0;
            font-size:34px;
        }

        .journal-title h3{
            margin-top:6px;
            color:#0b2a5b;
        }

        /* Logo right side */
        .journal-logo img{
            max-height:150px;
            max-width:200px;
            width:auto;
            height:auto;
            object-fit:contain;
            margin-right:100px;
        }
    </style>
</head>

<body>

<header class="journal-header">

    <div class="journal-title">
        <h1><?= htmlspecialchars($conference['conference_title']) ?></h1>
        <h3><?= htmlspecialchars($conference['university_name']) ?></h3>
    </div>

    <?php if(!empty($journal['university_logo'])): ?>
        <div class="journal-logo">
            <img src="<?= $journal['university_logo'] ?>?<?= time() ?>">
        </div>
    <?php endif; ?>

</header>

<nav>
    <a href="conference.php?id=<?= $conference_id ?>">Home</a>
    <a href="#">Organizing Committee</a>
    <a href="conference_proceedings.php?id=<?= $conference_id ?>">Proceedings</a>
</nav>

<div class="container">

    <h2>Organizing Committee</h2>

    <?php
    if ($committee && $committee->num_rows > 0) {

        /* Group members by role */
        $roles = ['Conference Chair',
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
        while($c = $committee->fetch_assoc()){
            $members[$c['role']][] = $c;
        }

        foreach($roles as $role){
            if(!empty($members[$role])){
                echo "<div class='role-section'>";
                echo "<h3>" . htmlspecialchars($role) . "</h3>";
                echo "<div class='board-grid'>";
                foreach($members[$role] as $m){
                    echo "<div class='member-card'>";
                    echo "<b>" . htmlspecialchars($m['name']) . "</b><br>";
                    echo htmlspecialchars($m['department']) . "<br>";
                    echo htmlspecialchars($m['university']) . "<br>";
                    echo "</div>";
                }
                echo "</div>";
                echo "</div>";
            }
        }

    } else {
        echo "<p>No committee members added yet.</p>";
    }
    ?>

</div>

<footer class="journal-header">

    <div class="journal-title">
        <h1><?= htmlspecialchars($conference['conference_title']) ?></h1>
    </div>
</footer>

</body>
</html>