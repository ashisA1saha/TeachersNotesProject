const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8697336118',
    database: 'teachers_notes_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|ppt|pptx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only documents are allowed (PDF, DOC, DOCX, PPT, PPTX, TXT)'));
        }
    }
});

// ============ API ROUTES ============

// 1. Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const query = 'SELECT id, username, role, full_name FROM users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// 2. Get All Teachers
app.get('/api/teachers', (req, res) => {
    const query = 'SELECT * FROM teachers ORDER BY name';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json(results);
    });
});

// 3. Get All Notes
app.get('/api/notes', (req, res) => {
    const query = `
        SELECT n.*, t.name as teacher_name, t.subject as teacher_subject
        FROM notes n
        JOIN teachers t ON n.teacher_id = t.id
        ORDER BY n.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json(results);
    });
});

// 4. Upload Note
app.post('/api/notes', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const { title, subject, teacherId, description, uploadedBy } = req.body;
    
    const query = `
        INSERT INTO notes (title, subject, teacher_id, uploaded_by, upload_date, description, file_name, file_path, file_size)
        VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)
    `;
    
    const values = [
        title,
        subject,
        teacherId,
        uploadedBy,
        description,
        req.file.originalname,
        req.file.path,
        req.file.size
    ];
    
    db.query(query, values, (err, result) => {
        if (err) {
            // Delete uploaded file if database insert fails
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ success: false, message: 'Failed to save note' });
        }
        
        res.json({ success: true, noteId: result.insertId });
    });
});

// 5. Download Note
app.get('/api/download/:id', (req, res) => {
    const noteId = req.params.id;
    
    const query = 'SELECT file_path, file_name FROM notes WHERE id = ?';
    
    db.query(query, [noteId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        
        const filePath = results[0].file_path;
        const fileName = results[0].file_name;
        
        if (fs.existsSync(filePath)) {
            res.download(filePath, fileName);
        } else {
            res.status(404).json({ success: false, message: 'File not found' });
        }
    });
});

// 6. Delete Note (Admin Only)
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    
    // First get file path
    const selectQuery = 'SELECT file_path FROM notes WHERE id = ?';
    
    db.query(selectQuery, [noteId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        
        const filePath = results[0].file_path;
        
        // Delete from database
        const deleteQuery = 'DELETE FROM notes WHERE id = ?';
        
        db.query(deleteQuery, [noteId], (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to delete note' });
            }
            
            // Delete physical file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            res.json({ success: true, message: 'Note deleted successfully' });
        });
    });
});

// 7. Get Statistics (Optional)
app.get('/api/stats', (req, res) => {
    const queries = {
        totalNotes: 'SELECT COUNT(*) as count FROM notes',
        totalTeachers: 'SELECT COUNT(*) as count FROM teachers',
        totalStudents: 'SELECT COUNT(*) as count FROM users WHERE role = "student"'
    };
    
    const stats = {};
    
    db.query(queries.totalNotes, (err, result) => {
        stats.totalNotes = result[0].count;
        
        db.query(queries.totalTeachers, (err, result) => {
            stats.totalTeachers = result[0].count;
            
            db.query(queries.totalStudents, (err, result) => {
                stats.totalStudents = result[0].count;
                res.json(stats);
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📁 Upload folder: ${path.join(__dirname, 'uploads')}`);
    console.log(`📊 Database: teachers_notes_db`);
});