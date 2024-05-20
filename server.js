const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage
}).single('video');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Upload endpoint
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: err.message });
        } else {
            const videoData = {
                url: `/uploads/${req.file.filename}`,
                description: req.body.description || 'No description'
            };
            fs.readFile('videos.json', (err, data) => {
                const videos = err ? [] : JSON.parse(data);
                videos.push(videoData);
                fs.writeFile('videos.json', JSON.stringify(videos), (err) => {
                    if (err) {
                        res.status(500).json({ success: false, message: err.message });
                    } else {
                        res.json({ success: true, message: 'Video uploaded successfully!' });
                    }
                });
            });
        }
    });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get videos endpoint
app.get('/videos', (req, res) => {
    fs.readFile('videos.json', (err, data) => {
        if (err) {
            res.status(500).json({ success: false, message: err.message });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
