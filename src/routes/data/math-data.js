const express = require('express');
const router = express.Router();

router.use(express.json())

const { getAnswers, getAnswer, createAnswer ,
    countOperation, averageSuccessWithOperation,
    medianTimeWithOperation
} = require('../../../config/sc-math-db.js');

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
        mSessionIdentifier,
        leftOperation, mathOperation, rightOperation,
        qResult, qAnswer, isCorrect,
        qTime, qDate
    } = req.body

    const data = await createAnswer(
        mSessionIdentifier,
        leftOperation, mathOperation, rightOperation,
        qResult, qAnswer, isCorrect,
        qTime, qDate)

    res.status(201).send(data)
})

router.get("/countOperation/:operation", async (req, res) =>{
    const operation = req.params.operation
    const data = await countOperation(operation);
    res.send(data.toString())
})

//average Success by Operation
router.get("/averageSbO/:operation", async (req, res) =>{
    const operation = req.params.operation
    const data = await averageSuccessWithOperation(operation);
    res.send(data.toString())
})

//median Time by Operation
router.get("/medianTbO/:operation", async (req, res) =>{
    const operation = req.params.operation
    const data = await medianTimeWithOperation(operation);
    res.send(data.toString())
})


module.exports = router;