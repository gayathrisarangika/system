<?php
session_start();
include "config.php";

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $dept_id  = intval($_POST['dept_id']);  
    $type     = $_POST['type'] ?? 'journal'; 
    $role     = "editor";

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("
        INSERT INTO users (username, password, role, department_id)
        VALUES (?, ?, ?, ?)
    ");

    if(!$stmt){
        die("Prepare Failed: " . $conn->error);
    }

    $stmt->bind_param("sssi", $username, $hashedPassword, $role, $dept_id);

    if($stmt->execute()){

        // ✅ Redirect back with success message
        header("Location: department.php?id=$dept_id&type=$type&msg=success");
        exit();

    } else {

        // ❌ Redirect back with error
        header("Location: department.php?id=$dept_id&type=$type&msg=error");
        exit();

    }

    $stmt->close();
}
?>