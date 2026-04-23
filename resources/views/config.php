<?php
$conn = mysqli_connect("localhost", "root", "", "journal_system");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
