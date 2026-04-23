<?php
include "config.php";

$username = "admin";          // change if needed
$password = "admin123";       // change password

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO users (username, password, role)
    VALUES (?, ?, 'admin')
");

$stmt->bind_param("ss", $username, $hashedPassword);

if($stmt->execute()){
    echo "✅ Admin Created Successfully";
} else {
    echo "❌ Error: " . $stmt->error;
}

$stmt->close();
?>