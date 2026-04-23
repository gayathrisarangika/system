<?php
include "config.php";

$issue_id = intval($_GET['issue_id'] ?? 0);

if(!$issue_id) die("Invalid issue.");

if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $pdf = "uploads/articles/" . $_FILES['pdf']['name'];
    move_uploaded_file($_FILES['pdf']['tmp_name'], $pdf);

    $stmt = $conn->prepare("
        INSERT INTO articles (issue_id, title, author, abstract, keywords, pdf, year)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "isssssi",
        $issue_id,
        $_POST['title'],
        $_POST['author'],
        $_POST['abstract'],
        $_POST['keywords'],
        $pdf,
        $_POST['year']
    );

    $stmt->execute();
    echo "Article added successfully!";
}
?>

<form method="post" enctype="multipart/form-data">

Title:<br>
<input type="text" name="title" required><br><br>

Author:<br>
<input type="text" name="author" required><br><br>

Abstract:<br>
<textarea name="abstract" required></textarea><br><br>

Keywords:<br>
<input type="text" name="keywords"><br><br>

Year:<br>
<input type="number" name="year" required><br><br>

PDF:<br>
<input type="file" name="pdf" required><br><br>

<input type="submit" value="Add Article">

</form>

<hr>

<a href="add_article.php?journal_id=<?= $journal_id ?>">⬅ Back to Dashboard</a>