<?php
if (isset($_POST['action'])) {
    $action = $_POST['action'];
}
else {
    $action = 'console';
}

switch($action) {
    case 'console':
        include 'console.php';
        break;
}
?>
