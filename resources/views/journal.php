<?php
include "config.php";

$journal_id = $_GET['id'];

$journal = $conn->query("SELECT * FROM journals WHERE id=$journal_id")->fetch_assoc();
$issues = $conn->query("SELECT * FROM issues WHERE journal_id=$journal_id ORDER BY year DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <title><?= $journal['journal_title'] ?></title>
    <link rel="stylesheet" href="style.css">

    <style>
        /* ===== SLIDER FIX ===== */
        .slider-container {
            width: 100%;       /* full width */
            clear: both;       /* ensure below flex layout */
            margin-top: 50px;
            position: relative;
            overflow: hidden;
        }

        .slider-container h3 {
            margin-bottom: 20px;
            color: #0b2c6b;
        }

        .slider {
            display: flex;
            gap: 20px;
            transition: transform 0.6s ease-in-out;
        }

        .slider img {
            width: 200px;
            height: 270px;
            object-fit: cover;
            box-shadow: 0 3px 10px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
        }

        .slider img:hover {
            transform: scale(1.05);
        }

        .arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25);
            cursor: pointer;
            padding: 10px 14px;
            font-size: 16px;
            z-index: 10;
        }

        .left-arrow { left: 0; }
        .right-arrow { right: 0; }

        
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
    <a href="issue_archive.php?id=<?= $journal_id ?>">Issue Archive</a>
</nav>

<div class="container">

    <!-- ===== FLEX LAYOUT: LEFT + RIGHT ===== -->
    <div class="layout">

        <!-- LEFT COLUMN -->
        <div class="left">
            <h2>About the Journal</h2>
            <p><?= nl2br($journal['journal_details']) ?></p>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="right">
            <img src="<?= $journal['cover_image'] ?>" class="cover">

            <div class="box">
                <h3>Aim & Scope</h3>
                <p><?= nl2br($journal['aim_scope']) ?></p>
            </div>

            <div class="box">
                <h3>Mission</h3>
                <p><?= nl2br($journal['mission']) ?></p>
            </div>
        </div>

    </div> <!-- layout ends -->

    <!-- ===== RECENT ISSUES SLIDER UNDER MISSION ===== -->
    <div class="slider-container">

        <h3>Recent Issues</h3>

        <button class="arrow left-arrow" onclick="slideLeft()">◀</button>

        <div class="slider" id="slider">
            <?php while($issue=$issues->fetch_assoc()){ ?>
                <a href="issue_archive.php?id=<?= $journal_id ?>">
                    <img src="<?= $issue['cover_image'] ?>">
                </a>
            <?php } ?>
        </div>

        <button class="arrow right-arrow" onclick="slideRight()">▶</button>

    </div> <!-- slider ends -->

</div> <!-- container ends -->

<footer class="journal-header">

    <div class="journal-title">
        <h1><?= htmlspecialchars($journal['journal_title']) ?></h1>
    </div>
</footer>

<script>
let position = 0;
const slider = document.getElementById('slider');
const itemWidth = 220;
const visibleItems = 4;
const totalItems = slider.children.length;

function slideRight() {
    if (position > -(itemWidth * (totalItems - visibleItems))) {
        position -= itemWidth;
    } else {
        position = 0;
    }
    slider.style.transform = `translateX(${position}px)`;
}

function slideLeft() {
    if (position < 0) {
        position += itemWidth;
    } else {
        position = -(itemWidth * (totalItems - visibleItems));
    }
    slider.style.transform = `translateX(${position}px)`;
}

setInterval(() => {
    slideRight();
}, 3000);
</script>

</body>
</html>