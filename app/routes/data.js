const express = require('express');
const router = express.Router();

router.use(express.json())

const { getData, getLine, createLine } = require('../../config/sc-db.js');

router.get('/', (req, res) => {
    res.send('This is the Data page')
})


router.get("/getData", async (req, res) =>{
    const data = await getData();
    res.send(data)
})

router.get("/getLine/:id", async (req, res) =>{
    const id = req.params.id
    const data = await getLine(id);
    res.send(data)
})

router.post("/createLine", async (req, res) =>{
    const {name, value} = req.body
    const data = await createLine(name, value)
    res.status(201).send(data)
})


module.exports = router;