const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve the home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/logout.html'));
});

module.exports = router;