<?php
session_start();
include "config.php";

/* CHECK LOGIN */
if(!isset($_SESSION['user']) || $_SESSION['user']['role'] != 'editor'){
    die("Access denied. Please login as editor.");
}

$editor = $_SESSION['user'];
$journal_id = intval($_GET['journal_id'] ?? 0);

/* LOAD JOURNAL */
$stmt = $conn->prepare("SELECT * FROM journals WHERE id=? AND editor_id=?");
$stmt->bind_param("ii", $journal_id, $editor['id']);
$stmt->execute();
$journal = $stmt->get_result()->fetch_assoc();
$stmt->close();

if(!$journal) die("Journal not found.");

/* CHECK IF EDIT MODE */
$issue_id = intval($_GET['issue_id'] ?? 0);
$issue = null;

if($issue_id){
    $stmt = $conn->prepare("SELECT * FROM issues WHERE id=? AND journal_id=?");
    $stmt->bind_param("ii", $issue_id, $journal_id);
    $stmt->execute();
    $issue = $stmt->get_result()->fetch_assoc();
    $stmt->close();
}

/* HANDLE FORM */
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    /* FILE UPLOADS */
    $cover = !empty($_FILES['cover']['name']) 
        ? "uploads/covers/" . $_FILES['cover']['name'] 
        : ($issue['cover_image'] ?? null);

    if(!empty($_FILES['cover']['tmp_name'])){
        move_uploaded_file($_FILES['cover']['tmp_name'], $cover);
    }

    $pdf = !empty($_FILES['pdf']['name']) 
        ? "uploads/pdfs/" . $_FILES['pdf']['name'] 
        : ($issue['pdf_link'] ?? null);

    if(!empty($_FILES['pdf']['tmp_name'])){
        move_uploaded_file($_FILES['pdf']['tmp_name'], $pdf);
    }

    $current = intval($_POST['current']);
    $vol = intval($_POST['vol']);
    $iss = intval($_POST['iss']);
    $year = intval($_POST['year']);

    if($issue_id){
        /* UPDATE ISSUE */
        $stmt = $conn->prepare("
            UPDATE issues 
            SET volume=?, issue=?, year=?, cover_image=?, pdf_link=?, is_current_issue=? 
            WHERE id=? AND journal_id=?
        ");
        $stmt->bind_param("iiiisiii", $vol, $iss, $year, $cover, $pdf, $current, $issue_id, $journal_id);
        $stmt->execute();
        $stmt->close();

        $message = "Issue updated successfully!";

    } else {
        /* INSERT ISSUE */
        $stmt = $conn->prepare("
            INSERT INTO issues (journal_id, volume, issue, year, cover_image, pdf_link, is_current_issue) 
            VALUES (?,?,?,?,?,?,?)
        ");
        $stmt->bind_param("iiiissi", $journal_id, $vol, $iss, $year, $cover, $pdf, $current);
        $stmt->execute();

        $new_issue_id = $stmt->insert_id;
        $stmt->close();

        /* REDIRECT TO EDIT MODE */
        header("Location: add_article.php?journal_id=$journal_id&issue_id=$new_issue_id");
        exit();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title><?= $issue_id ? "Update Issue" : "Add New Issue" ?> - <?= htmlspecialchars($journal['journal_title']) ?></title>
    <link rel="stylesheet" href="system.css">
</head>

<body>

<h2><?= $issue_id ? "Update Issue" : "Add New Issue" ?> for <?= htmlspecialchars($journal['journal_title']) ?></h2>

<?php if(!empty($message)): ?>
    <p style="color:green;"><?= $message ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data">

    Volume:<br>
    <input type="number" name="vol" value="<?= $issue['volume'] ?? '' ?>" required><br><br>

    Issue:<br>
    <input type="number" name="iss" value="<?= $issue['issue'] ?? '' ?>" required><br><br>

    Year:<br>
    <input type="number" name="year" value="<?= $issue['year'] ?? '' ?>" required><br><br>

    Cover Image:<br>
    <?php if(!empty($issue['cover_image'])): ?>
        <img src="<?= $issue['cover_image'] ?>" width="120"><br>
    <?php endif; ?>
    <input type="file" name="cover"><br><br>

    PDF File:<br>
    <?php if(!empty($issue['pdf_link'])): ?>
        <a href="<?= $issue['pdf_link'] ?>" target="_blank">View Current PDF</a><br>
    <?php endif; ?>
    <input type="file" name="pdf"><br><br>

    Current Issue:<br>
    <select name="current">
        <option value="1" <?= (!empty($issue['is_current_issue']) && $issue['is_current_issue']==1) ? "selected" : "" ?>>Yes</option>
        <option value="0" <?= (isset($issue['is_current_issue']) && $issue['is_current_issue']==0) ? "selected" : "" ?>>No</option>
    </select><br><br>

    <input type="submit" value="<?= $issue_id ? "Update Issue" : "Add Issue" ?>">

</form>

<?php if($issue_id): ?>
    <hr>
    <h3>📄 Manage Articles</h3>

    <a href="add_journal_article.php?issue_id=<?= $issue_id ?>">
        ➕ Add Article
    </a>

    <br><br>

    <a href="issue_view.php?id=<?= $issue_id ?>">
        📚 View Articles in this Issue
    </a>
<?php endif; ?>

<hr>

<a href="editor_dashboard.php?journal_id=<?= $journal_id ?>">⬅ Back to Dashboard</a>

</body>
</html>