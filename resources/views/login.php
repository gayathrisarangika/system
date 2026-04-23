<?php
session_start();
include "config.php";

$message = "";

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $dept_id  = intval($_POST['dept_id'] ?? 0);   
    $type     = $_POST['type'] ?? 'journal'; // capture type: journal/conference/symposium

    /* LOGIN QUERY (Supports Admin + Editors) */
    $stmt = $conn->prepare("
        SELECT * FROM users 
        WHERE username=? 
        AND (department_id=? OR role='admin')
        LIMIT 1
    ");

    if(!$stmt){
        die("Query Error: " . $conn->error);
    }

    $stmt->bind_param("si", $username, $dept_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows == 1){

        $user = $result->fetch_assoc();

        if(password_verify($password, $user['password'])){

            $_SESSION['user'] = $user;

            /* REDIRECT BASED ON ROLE AND TYPE */
            if($user['role'] == 'admin'){
                header("Location: admin_dashboard.php");
            } else {
                switch($type){
                    case 'journal':
                        header("Location: editor_dashboard.php");
                        break;
                    case 'conference':
                        header("Location: editor_dashboard_conference.php");
                        break;
                    case 'symposium':
                        header("Location: editor_dashboard_symposium.php");
                        break;
                    default:
                        header("Location: editor_dashboard.php");
                }
            }
            exit();

        } else {
            $message = "❌ Invalid Password";
        }

    } else {
        $message = "❌ Invalid Username";
    }

    $stmt->close();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>System Login</title>
    <link rel="stylesheet" href="system.css">
</head>
<body>

<header class="main-header">
    <h1>Login</h1>
    <p>Publication Management System</p>
</header>

<div class="container">
    <div class="card">
        <h2>Login</h2>

        <?php if(!empty($message)): ?>
            <p style="color:red;"><?= $message ?></p>
        <?php endif; ?>

        <form method="post">
            <input type="hidden" name="dept_id" value="<?= $_GET['id'] ?? 0 ?>">
            <input type="hidden" name="type" value="<?= $_GET['type'] ?? 'journal' ?>">

            Username<br>
            <input type="text" name="username" required><br><br>

            Password<br>
            <input type="password" name="password" required><br><br>

            <button type="submit">Login</button>
        </form>
    </div>
</div>

<footer class="main-footer">
    <p>© <?= date("Y") ?> Faculty of Social Sciences and Languages</p>
</footer>

</body>
</html>