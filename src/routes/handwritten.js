const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve the home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/handwritten.html'));
});

module.exports = router;