const express = require('express');
const router = express.Router();

router.use(express.json())

const { getAnswers, getAnswer, createAnswer,
    countOperation, averageSuccessWithOperation,
    medianTimeWithOperation
} = require('../../../config/database/sc-math-db.js');

const { updateSessionDuration } = require('../../../config/database/sc-session-db.js');
const { incrementSessionCountInStat } = require('../../../config/database/sc-user-db.js');


const { middleAuthentication } = require('../../utils/auth.js')
const cookieParser = require('cookie-parser');
router.use(cookieParser());


router.get('/', (req, res) => {
    res.send('This is the Math Data page')
})


router.get("/getAnswers", async (req, res) => {
    const data = await getAnswers();
    res.send(data)
})

router.get("/getAnswer/:id", async (req, res) => {
    const id = req.params.id
    const data = await getAnswer(id);
    res.send(data)
})

router.post("/createAnswer", async (req, res) => {
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

router.get("/countOperation/:operation", async (req, res) => {
    const operation = req.params.operation
    const data = await countOperation(operation);
    res.send(data.toString())
})

//average Success by Operation
router.get("/averageSbO/:operation", async (req, res) => {
    const operation = req.params.operation
    const data = await averageSuccessWithOperation(operation);
    res.send(data.toString())
})

//median Time by Operation
router.get("/medianTbO/:operation", async (req, res) => {
    const operation = req.params.operation
    const data = await medianTimeWithOperation(operation);
    res.send(data.toString())
})


function randomNumber(minVal, maxVal) {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
}

function getCorrectResult(lOpe, mOpe, rOpe){
    if (mOpe === "+") {
        return lOpe + rOpe;
    } else if (mOpe === "-") {
        return lOpe - rOpe;
    } else if (mOpe === "x") {
        return lOpe * rOpe;
    }
}

router.post("/generateQuestions", async (req, res) => {
    const { minNumber, maxNumber,
        additionCheck, subtractionCheck, multiplicationCheck,
        mMaxAnswerCount
    } = req.body

    console.log("mMaxAnswerCount : " + mMaxAnswerCount )
    //Push selected math operations
    const opList = []
    if (additionCheck) { opList.push("+"); }
    if (subtractionCheck) { opList.push("-"); }
    if (multiplicationCheck) { opList.push("x"); }
    //List containing all the questions
    let questionJsonList = [];

    //Fill the list with random questions
    for (let i = 0; i < mMaxAnswerCount; i++) {
        const lOpe = randomNumber(minNumber, maxNumber);
        const mOpe = opList[Math.floor(Math.random() * opList.length)];
        const rOpe = randomNumber(minNumber, maxNumber);
        const qRes =  getCorrectResult(lOpe, mOpe, rOpe)

        const question = {
            leftOperation: lOpe,
            mathOperation: mOpe,
            rightOperation: rOpe,
            qResult: qRes,
        };
        questionJsonList.push(question);
    }

    console.log("BACKEND questionJsonList : " + JSON.stringify(questionJsonList))
    res.status(201).send(questionJsonList)
})

router.post("/insertAllAnswers", middleAuthentication, async (req, res) => {
    const mSessionIdentifier = req.body[0].mSessionIdentifier;

    for(let i = 0 ; i < req.body.length; i++){
        console.log(i + " : " + JSON.stringify(req.body[i]))
        const { leftOperation, mathOperation,
            rightOperation,qResult, qAnswer, isCorrect, 
            qTime, qDate
        } = req.body[i]

        await createAnswer(mSessionIdentifier,
            leftOperation, mathOperation, rightOperation,
            qResult, qAnswer, isCorrect,
            qTime, qDate)
    }

    await updateSessionDuration(mSessionIdentifier)

    //get user id from auth token
    await incrementSessionCountInStat(req.user.mUserIdentifier)

    res.status(201)
})


module.exports = router;