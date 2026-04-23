<?php
include "config.php";

$symposium_id = intval($_GET['id'] ?? 0);
if ($symposium_id <= 0) die("Invalid symposium ID.");

/* Fetch Symposium Details */
$symposium_query = $conn->query("SELECT * FROM symposiums WHERE id=$symposium_id");
if (!$symposium_query || $symposium_query->num_rows == 0) {
    die("Symposium not found.");
}
$symposium = $symposium_query->fetch_assoc();

/* Fetch Symposium Proceedings */
$proceedings = $conn->query("
    SELECT * FROM symposium_proceedings
    WHERE symposium_id=$symposium_id
    ORDER BY year DESC
");

if (!$proceedings) {
    die("Proceedings query failed: " . $conn->error);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Proceedings - <?= htmlspecialchars($symposium['symposium_title']) ?></title>
    <link rel="stylesheet" href="style.css">

    <style>
        .archive-grid {
            column-count: 4;
            column-gap: 20px;
        }

        .archive-grid a {
            display: block;
            break-inside: avoid;
            margin-bottom: 20px;
            text-align: center;
            text-decoration: none;
            color: #222;
        }

        .archive-grid img {
            width: 100%;
            height: auto;
            object-fit: cover;
            margin-bottom: 5px;
        }

        .archive-grid p {
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>

<body>

<header>
    <?php if(!empty($symposium['header_image'])): ?>
        <img src="<?= htmlspecialchars($symposium['header_image']) ?>">
    <?php endif; ?>
</header>

<nav>
    <a href="symposium.php?id=<?= $symposium_id ?>">Home</a>
    <a href="symposium_committee.php?id=<?= $symposium_id ?>">Committee</a>
    <a href="#">Proceedings</a>
</nav>

<div class="container">

    <h2>Symposium Proceedings</h2>

    <div class="archive-grid">
        <?php if($proceedings->num_rows > 0): ?>
            <?php while($p = $proceedings->fetch_assoc()): ?>
                <a href="<?= htmlspecialchars($p['pdf_link']) ?>" target="_blank">
                    <img src="<?= htmlspecialchars($p['cover_image']) ?>">
                    <p>
                        <?= htmlspecialchars($p['version']) ?><br>
                        <?= htmlspecialchars($p['year']) ?>
                    </p>
                </a>
            <?php endwhile; ?>
        <?php else: ?>
            <p>No proceedings available.</p>
        <?php endif; ?>
    </div>

</div>

<footer>
    <?php if(!empty($symposium['header_image'])): ?>
        <img src="<?= htmlspecialchars($symposium['header_image']) ?>">
    <?php endif; ?>
</footer>

</body>
</html>