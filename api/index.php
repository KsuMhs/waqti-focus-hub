
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

// Parse the request body
$requestBody = json_decode(file_get_contents("php://input"), true);

// Basic routing
$route = isset($_GET['route']) ? $_GET['route'] : '';

// API endpoints
switch ($route) {
    case 'tasks':
        // Get all tasks
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo json_encode([
                'status' => 'success',
                'data' => [
                    [
                        'id' => '1',
                        'title' => 'Complete project',
                        'description' => 'Finish the PHP integration',
                        'category' => 'work',
                        'completed' => false,
                        'date' => date('Y-m-d'),
                        'time' => '14:00'
                    ],
                    [
                        'id' => '2',
                        'title' => 'Exercise',
                        'description' => 'Go to the gym',
                        'category' => 'health',
                        'completed' => false,
                        'date' => date('Y-m-d'),
                        'time' => '18:00'
                    ]
                ]
            ]);
        }
        // Create a new task
        else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // In a real app, you would save to a database
            echo json_encode([
                'status' => 'success',
                'data' => array_merge(['id' => uniqid()], $requestBody)
            ]);
        }
        break;
        
    case 'achievements':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo json_encode([
                'status' => 'success',
                'data' => [
                    [
                        'id' => '1',
                        'title' => 'Journey Starter',
                        'description' => 'Complete 5 tasks',
                        'icon' => 'Trophy',
                        'progress' => 3,
                        'maxProgress' => 5,
                        'unlocked' => false,
                        'category' => 'tasks',
                        'points' => 10
                    ],
                    [
                        'id' => '2',
                        'title' => 'Habit Builder',
                        'description' => 'Track 3 habits for a full week',
                        'icon' => 'Star',
                        'progress' => 2,
                        'maxProgress' => 3,
                        'unlocked' => false,
                        'category' => 'habits',
                        'points' => 20
                    ],
                    [
                        'id' => '3',
                        'title' => 'Focus Master',
                        'description' => 'Complete 10 pomodoro sessions',
                        'icon' => 'Crown',
                        'progress' => 10,
                        'maxProgress' => 10,
                        'unlocked' => true,
                        'category' => 'focus',
                        'points' => 30
                    ]
                ]
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
