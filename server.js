const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // ← public folder साठी

// ✅ REAL DATABASE (permanent!)
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));
console.log("Database Connected");

// Students Table
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT UNIQUE, college TEXT, std TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Test Results Table
db.run(`CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER, test_name TEXT, score INTEGER,
    percentage REAL, level INTEGER, result_title TEXT,
    suggestions TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// LOGIN API (तुमच्यासारखाच, फक्त DB save)
app.post('/api/login', (req, res) => {
    const { name, email, college, std } = req.body;
    
    db.get('SELECT * FROM students WHERE email = ?', [email], (err, student) => {
        if (student) {
            console.log(`✅ Existing: ${student.name}`);
            return res.json({ success: true, student });
        }
        
        // New Student
        db.run('INSERT INTO students (name, email, college, std) VALUES(?, ?, ?, ?)',
            [name, email, college, std],
            function(err) {
                if (err) {
                    return res.json({ success: false, message: 'Email आधीच आहे!' });
                }
                console.log(`✅ NEW Student: ${name} (${college}) ID: ${this.lastID}`);
                res.json({ success: true, student: { 
                    id: this.lastID, name, email, college, std 
                }});
            }
        );
    });
});

// SAVE TEST RESULT (permanent!)
app.post('/api/save-result', (req, res) => {
    const { student_id, test_name, score, percentage, level, result_title, suggestions } = req.body;
    
    db.run(`INSERT INTO test_results(student_id, test_name, score, percentage, level, result_title, suggestions)
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [student_id, test_name, score, percentage, level, result_title, JSON.stringify(suggestions)],
        function(err) {
            if (err) {
                console.log('❌ Error:', err);
                return res.json({ success: false });
            }
            console.log(`✅ SAVED PERMANENT: ${test_name} = ${percentage}% (ID: ${this.lastID})`);
            res.json({ success: true });
        }
    );
});

// सर्व Results पहा
app.get('/api/all-results', (req, res) => {
    db.all(`
        SELECT s.name, s.college, r.test_name, r.percentage, r.result_title, r.created_at 
        FROM test_results r JOIN students s ON r.student_id = s.id 
        ORDER BY r.created_at DESC
    `, (err, results) => {
        res.json(results || []);
    });
});

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('🚀 http://localhost:3000');
    console.log('✅ PERMANENT DATABASE SAVE होईल!');
    console.log('✅ Restart केलं तरी data राहील!');
});
