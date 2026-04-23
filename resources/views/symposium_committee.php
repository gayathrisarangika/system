<?php
include "config.php";

$symposium_id = intval($_GET['id'] ?? 0);
if ($symposium_id <= 0) die("Invalid symposium ID.");

/* Fetch Symposium Details */
$symposium = $conn->query("SELECT * FROM symposiums WHERE id=$symposium_id")->fetch_assoc();
if (!$symposium) die("Symposium not found.");

/* Fetch Committee */
$committee = $conn->query("
    SELECT * FROM symposium_committee
    WHERE symposium_id=$symposium_id
    ORDER BY FIELD(role, 'Chair','Secretary')
");

if (!$committee) {
    die("Committee Query Failed: " . $conn->error);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Committee - <?= htmlspecialchars($symposium['symposium_title']) ?></title>
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
        <h1><?= htmlspecialchars($symposium['symposium_title']) ?></h1>
        <h3><?= htmlspecialchars($symposium['university_name']) ?></h3>
    </div>

    <?php if(!empty($journal['university_logo'])): ?>
        <div class="journal-logo">
            <img src="<?= $symposium['university_logo'] ?>?<?= time() ?>">
        </div>
    <?php endif; ?>

</header>

<nav>
    <a href="symposium.php?id=<?= $symposium_id ?>">Home</a>
    <a href="#">Committee</a>
    <a href="symposium_proceedings.php?id=<?= $symposium_id ?>">Proceedings</a>
</nav>

<div class="container">

    <h2>Symposium Committee</h2>

    <?php
    if ($committee->num_rows > 0) {

        $roles = ['Chair', 'Secretary'];
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
                    echo htmlspecialchars($m['department'])."<br>";
                     echo htmlspecialchars($m['university']);
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
        <h1><?= htmlspecialchars($symposium['symposium_title']) ?></h1>
        <h3><?= htmlspecialchars($symposium['university_name']) ?></h3>
    </div>
</footer>

</body>
</html>