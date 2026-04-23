<?php
include "config.php";

/* GET ARTICLE ID */
$id = intval($_GET['id'] ?? 0);

if(!$id){
    die("Invalid article.");
}

/* FETCH ARTICLE */
$stmt = $conn->prepare("SELECT * FROM articles WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$article = $result->fetch_assoc();

if(!$article){
    die("Article not found.");
}
?>

<!DOCTYPE html>
<html>
<head>

<!-- ✅ SEO TITLE -->
<title><?= $article['title'] ?> | Journal</title>

<!-- ✅ SEO META -->
<meta name="description" content="<?= substr($article['abstract'],0,150) ?>">
<meta name="keywords" content="<?= $article['keywords'] ?>">

<!-- ✅ Google Scholar META -->
<meta name="citation_title" content="<?= $article['title'] ?>">
<meta name="citation_author" content="<?= $article['author'] ?>">
<meta name="citation_journal_title" content="Your Journal Name">
<meta name="citation_publication_date" content="<?= $article['year'] ?>">
<meta name="citation_pdf_url" content="http://localhost/Journal_system/<?= $article['pdf'] ?>">

</head>

<body>

<h1><?= $article['title'] ?></h1>

<p><b>Author:</b> <?= $article['author'] ?></p>

<p><b>Abstract:</b><br>
<?= $article['abstract'] ?>
</p>

<p><b>Keywords:</b> <?= $article['keywords'] ?></p>

<!-- ✅ PDF LINK -->
<p>
<a href="<?= $article['pdf'] ?>" target="_blank">📄 Download Full Paper</a>
</p>

</body>
</html>