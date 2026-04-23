<?php 
include "config.php"; 

$dept_id = intval($_GET['id'] ?? 0);
$type = $_GET['type'] ?? 'journal'; // default type
$msg = $_GET['msg'] ?? '';
?>

<!DOCTYPE html>
<html>
<head>
    <title>Department Access</title>
    <link rel="stylesheet" href="system.css">
</head>

<body>

<header class="main-header">
    <h1>Department Portal</h1>
</header>

<div class="container">

<?php
// ✅ Success / Error message
if($msg == "success"){
    echo "<p style='color:green; text-align:center; font-weight:bold;'>Editor registered successfully!</p>";
}
if($msg == "error"){
    echo "<p style='color:red; text-align:center; font-weight:bold;'>Registration failed!</p>";
}
?>

<div class="two-column">

        <!-- LOGIN -->
        <div class="card">
            <h2>Login</h2>

            <form method="post" action="login.php">
                <input type="hidden" name="dept_id" value="<?= $dept_id ?>">
                <input type="hidden" name="type" value="<?= htmlspecialchars($type) ?>">

                Username:<br>
                <input type="text" name="username" required><br><br>

                Password:<br>
                <input type="password" name="password" required><br><br>

                <button type="submit">Login</button>
            </form>
        </div>


        <!-- REGISTER -->
        <div class="card">
            <h2>Register as Editor</h2>

            <form method="post" action="register.php">
                <input type="hidden" name="dept_id" value="<?= $dept_id ?>">
                <input type="hidden" name="type" value="<?= htmlspecialchars($type) ?>">

                Username:<br>
                <input type="text" name="username" required><br><br>

                Password:<br>
                <input type="password" name="password" required><br><br>

                <button type="submit">Register</button>
            </form>
        </div>

</div>

</div>

</body>
</html>