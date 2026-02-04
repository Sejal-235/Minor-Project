-- Terminal/MySQL Workbench मध्ये run कर
CREATE DATABASE psychology_tests;
USE psychology_tests;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    college VARCHAR(200) NOT NULL,
    std VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    level INT NOT NULL,
    result_title TEXT,
    suggestions TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
