<?php
include "config.php";

/* GET ISSUE ID SAFELY */
$issue_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if(!$issue_id){
    die("Invalid Issue ID.");
}

/* FETCH ISSUE */
$stmt = $conn->prepare("SELECT * FROM issues WHERE id=?");
$stmt->bind_param("i", $issue_id);
$stmt->execute();
$issue = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$issue){
    die("Issue not found.");
}

/* FETCH ARTICLES */
$articles = $conn->query("SELECT * FROM articles WHERE issue_id=$issue_id");
?>

<h1>
Volume <?= $issue['volume'] ?> Issue <?= $issue['issue'] ?>
</h1>

<hr>

<?php if($articles->num_rows > 0): ?>

    <?php while($row = $articles->fetch_assoc()): ?>

        <h3>
            <a href="article.php?id=<?= $row['id'] ?>">
                <?= htmlspecialchars($row['title']) ?>
            </a>
        </h3>

        <p><?= htmlspecialchars($row['author']) ?></p>

        <hr>

    <?php endwhile; ?>

<?php else: ?>

    <p>No articles found for this issue.</p>

<?php endif; ?>