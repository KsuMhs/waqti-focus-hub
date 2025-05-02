
<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db.php';

// Parse the request body
$requestBody = json_decode(file_get_contents("php://input"), true);

// Basic routing
$route = isset($_GET['route']) ? $_GET['route'] : '';

// API endpoints
switch ($route) {
    case 'tasks':
        // Get all tasks
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $tasks = getTasks();
            echo json_encode([
                'status' => 'success',
                'data' => $tasks
            ]);
        }
        // Create a new task
        else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $task = saveTask($requestBody);
            echo json_encode([
                'status' => 'success',
                'data' => $task
            ]);
        }
        break;
        
    case 'achievements':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $achievements = getAchievements();
            echo json_encode([
                'status' => 'success',
                'data' => $achievements
            ]);
        }
        break;
        
    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Route not found'
        ]);
}
?>
