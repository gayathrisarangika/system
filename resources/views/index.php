<?php 
include "config.php"; 
?>

<!DOCTYPE html>
<html>
<head>
    <title>Publication Management System</title>
    <link rel="stylesheet" href="system.css">
</head>

<body>

<header class="main-header">
    <h1>Publication Management System</h1>
    <p>Faculty of Social Sciences and Languages</p>
</header>

<div class="landing-container">

    <div class="card">
        <h2>Select Publication Type</h2>

        <div class="button-group">
            <button onclick="showDepartments('journal')">Journal</button>
            <button onclick="showDepartments('conference')">Conference</button>
            <button onclick="showDepartments('symposium')">Symposium</button>
        </div>

        <!-- ✅ ADMIN LOGIN BUTTON -->
        <div style="margin-top:25px;">
            <a href="login.php">
                <button class="admin-btn">Admin Login</button>
            </a>
        </div>

        <!-- ✅ Department Section -->
        <div id="dept" class="department-box" style="display:none;">
            <h3>Select Department</h3>

            <?php
            $res = $conn->query("SELECT * FROM departments");

            while($d = $res->fetch_assoc()){
                echo "<a class='dept-link' data-id='{$d['id']}'>{$d['name']}</a>";
            }
            ?>
        </div>
    </div>

</div>

<footer class="main-footer">
    <p>© <?php echo date("Y"); ?> Faculty of Social Sciences and Languages</p>
</footer>

<script>
function showDepartments(type) {

    // Show department box
    document.getElementById('dept').style.display = "block";

    // Update department links dynamically
    const links = document.querySelectorAll('.dept-link');

    links.forEach(link => {

        const deptId = link.getAttribute('data-id');

        link.href = "department.php?id=" + deptId + "&type=" + type;
    });
}
</script>

</body>
</html>