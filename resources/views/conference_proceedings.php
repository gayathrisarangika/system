<?php
include "config.php";

$conference_id = intval($_GET['id'] ?? 0);
if ($conference_id <= 0) die("Invalid conference ID.");

/* Fetch Conference Details */
$conference = $conn->query("SELECT * FROM conferences WHERE id=$conference_id")->fetch_assoc();
if (!$conference) die("Conference not found.");

/* Fetch Proceedings */
$proceedings = $conn->query("
    SELECT * FROM conference_proceedings 
    WHERE conference_id=$conference_id
    ORDER BY year DESC
");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Conference Proceedings - <?= htmlspecialchars($conference['conference_title']) ?></title>
    <link rel="stylesheet" href="style.css">

    <style>
        /* Multi-column layout */
        .archive-grid {
            column-count: 4;      /* number of columns */
            column-gap: 20px;     /* space between columns */
        }

        .archive-grid a {
            display: block;        /* each item is a block inside column */
            break-inside: avoid;   /* prevents items from breaking across columns */
            margin-bottom: 20px;
            text-align: center;
            text-decoration: none;
            color: #222;
        }

        .archive-grid img {
            width: 100%;
            height: auto;        /* auto height to keep aspect ratio */
            object-fit: cover;
            margin-bottom: 5px;
        }

        .archive-grid p {
            margin: 0;
            font-size: 14px;
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
    <a href="conference_committee.php?id=<?= $conference_id ?>">Organizing Committee</a>
    <a href="#">Proceedings</a>
</nav>

<div class="container">

    <!--<h2>Conference Proceedings</h2>-->

    <div class="archive-grid">

        <?php if ($proceedings && $proceedings->num_rows > 0): ?>
            <?php while($p = $proceedings->fetch_assoc()): ?>
                <a href="<?= htmlspecialchars($p['pdf_link']) ?>" target="_blank">
                    <img src="<?= htmlspecialchars($p['cover_image']) ?>">
                    <p>
                        Year: <?= $p['year'] ?><br>
                        <?= $p['is_current'] ? "<strong>Current</strong>" : "" ?>
                    </p>
                </a>
            <?php endwhile; ?>
        <?php else: ?>
            <p>No proceedings added yet.</p>
        <?php endif; ?>

    </div>

</div>

<footer class="journal-header">

    <div class="journal-title">
        <h1><?= htmlspecialchars($conference['conference_title']) ?></h1>
    </div>
</footer>

</body>
</html>