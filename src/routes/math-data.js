const express = require('express');
const router = express.Router();

router.use(express.json())

const { getAnswers, getAnswer, createAnswer } = require('../../config/sc-math-db.js');

router.get('/', (req, res) => {
    res.send('This is the Math Data page')
})


router.get("/getAnswers", async (req, res) =>{
    const data = await getAnswers();
    res.send(data)
})

router.get("/getAnswer/:id", async (req, res) =>{
    const id = req.params.id
    const data = await getAnswer(id);
    res.send(data)
})

router.post("/createAnswer", async (req, res) =>{
    const {
        leftOperation, mathOperation, rightOperation,
        qResult, qAnswer, isCorrect,
        qTime, qDate,
        minNumber, maxNumber, floatNumber, nNumber,
        additionCheck, subtractionCheck, multiplicationCheck
    } = req.body

    const data = await createAnswer(
        leftOperation, mathOperation, rightOperation,
        qResult, qAnswer, isCorrect,
        qTime, qDate,
        minNumber, maxNumber, floatNumber, nNumber,
        additionCheck, subtractionCheck, multiplicationCheck)

    res.status(201).send(data)
})

module.exports = router;