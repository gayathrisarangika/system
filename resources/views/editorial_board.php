<?php
include "config.php";

$journal_id = $_GET['id'];

$journal = $conn->query("SELECT * FROM journals WHERE id=$journal_id")->fetch_assoc();
$members = $conn->query("SELECT * FROM editorial_board WHERE journal_id=$journal_id");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Editorial Board</title>
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
    <a href="#">Editorial Board</a>
    <a href="issue_archive.php?id=<?= $journal_id ?>">Issue Archive</a>
</nav>

<div class="container">

    <!--<h2>Editorial Board</h2>-->

    <div class="board-grid">

        <?php while($m=$members->fetch_assoc()){ ?>

            <div class="member-card">
                <b><?= $m['name'] ?></b><br><br>
                <?= $m['role'] ?><br>
                <?= $m['department'] ?><br>
                <?= $m['university'] ?><br>
                
            </div>

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
