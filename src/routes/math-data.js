const express = require('express');
const router = express.Router();

router.use(express.json())

const { getAnswers } = require('../../config/sc-math-db.js');

router.get('/', (req, res) => {
    res.send('This is the Math Data page')
})


router.get("/getAnswers", async (req, res) =>{
    const data = await getAnswers();
    res.send(data)
})

module.exports = router;