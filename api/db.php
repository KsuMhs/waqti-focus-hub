
<?php
/**
 * Database connection and helper functions
 * 
 * This is a placeholder for actual database connection.
 * In a real application, you would connect to MySQL or another database.
 */

function connectToDatabase() {
    // In a real application, you would do something like:
    // $conn = new mysqli($servername, $username, $password, $dbname);
    // return $conn;
    
    // For now, just return true to simulate a connection
    return true;
}

function getTasks() {
    // This would normally query a database
    // For now, we'll just return static data
    return [
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
    ];
}

function saveTask($task) {
    // This would normally save to a database
    // For now, we'll just return the task with an ID
    return array_merge(['id' => uniqid()], $task);
}

function getAchievements() {
    // This would normally query a database
    // For now, we'll just return static data
    return [
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
    ];
}
?>
