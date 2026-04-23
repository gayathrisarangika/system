<?php
include "config.php";

$journal_id = $_GET['id'];

$journal = $conn->query("SELECT * FROM journals WHERE id=$journal_id")->fetch_assoc();
$issues = $conn->query("SELECT * FROM issues WHERE journal_id=$journal_id ORDER BY year DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Issue Archive</title>
    <link rel="stylesheet" href="style.css">

    <style>/* Multi-column layout */
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
        <h1><?= htmlspecialchars($journal['journal_title']) ?></h1>
        <h3><?= htmlspecialchars($journal['university_name']) ?></h3>
    </div>

    <?php if(!empty($journal['university_logo'])): ?>
        <div class="journal-logo">
            <img src="<?= $journal['university_logo'] ?>?<?= time() ?>">
        </div>
    <?php endif; ?>

</header>

<nav>
    <a href="journal.php?id=<?= $journal_id ?>">Home</a>
    <a href="editorial_board.php?id=<?= $journal_id ?>">Editorial Board</a>
    <a href="#">Issue Archive</a>
</nav>

<div class="container">

    <!--<h2>Issue Archive</h2>-->

    <div class="archive-grid">

        <?php while($issue=$issues->fetch_assoc()){ ?>

            <a href="<?= $issue['pdf_link'] ?>" target="_blank">
                <img src="<?= $issue['cover_image'] ?>">
                <p>
                    Vol <?= $issue['volume'] ?>  
                    Issue <?= $issue['issue'] ?><br>
                    <?= $issue['year'] ?>
                </p>
            </a>

        <?php } ?>

        

    </div>

</div>

<footer class="journal-header">

    <div class="journal-title">
        <h1><?= htmlspecialchars($journal['journal_title']) ?></h1>
    </div>
</footer>

</body>
</html>
