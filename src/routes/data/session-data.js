const express = require('express');
const router = express.Router();

const cookieParser = require('cookie-parser');
router.use(cookieParser());

require('dotenv').config()

router.use(express.json())

const { getExactParams, getParamWithID, createParam, createSession, getSessionWithID
} = require('../../../config/database/sc-session-db.js');

const { getUserWithEmail } = require('../../../config/database/sc-user-db.js');
const { middleAuthentication } = require('../../utils/auth.js')

router.get('/', (req, res) => {
    res.send('This is the session page')
})

router.get("/getParamWithID/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getParamWithID(id);
        res.send(data);
    } catch {
        res.status(500)
    }
})

router.get("/getSessionWithID/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getSessionWithID(id);
        res.send(data);
    } catch {
        res.status(500)
    }
})

router.post("/createParams", async (req, res) => {
    try {
        const { mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount } = req.body;
        const paramsIdentifier = await getExactParams(mMinNumber, mMaxNumber, mFloatNumber, mNumber,
            mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount)

        if (paramsIdentifier == 0) { //parameters don't exist, create new one
            const newParamsJson = await createParam(mMinNumber, mMaxNumber, mFloatNumber, mNumber,
                mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount)
            console.log("[POST /createParams] New Param created : ", newParamsJson)
            res.status(200).json(newParamsJson)
        }
        else { //parameters already exists, return them
            const existingParamsJson = await getParamWithID(paramsIdentifier);
            console.log("[POST /createParams] Param existing : ", existingParamsJson)
            res.status(200).json(existingParamsJson);
        }
        //console.log(response);
        //res.status(200).json(response)
    } catch {
        res.status(500).json({ message: "/createParams error" });
    }
})


router.post("/createSession", middleAuthentication, async (req, res) => {
    try {

        const { paramID, sessionDate } = req.body;

        const user = await getUserWithEmail(req.user.mEmail)
        const userID = user.mUserIdentifier;

        const result = await createSession(userID, paramID, sessionDate);

        res.status(201).send(result)

    } catch {
        res.status(500).json({ message: "/createParams error" });
    }
})






module.exports = router;