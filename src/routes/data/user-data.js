const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.use(express.json())
router.use(cookieParser());


const { getUsers, getUser, createUser, checkDuplicateEmail, getHashedPassword, getUsername, 
    getUserWithEmail, deleteUser, createUserStat, incrementLogNumber,
    getUserSessionData,
    getUserSessionCountByDay,
    getLatestResults, getResultsByDay, getResultByLevel,
    getSessionDetailsByLevel, averageAnswerDurationByLevel,
    getUserStats
} = require('../../../config/database/sc-user-db.js');


const { createSecureCookie, middleAuthentication } = require('../../utils/auth.js')


router.get('/', (req, res) => {
    res.send('This is the User Data page')
})


router.get("/getUsers", async (req, res) => {
    const data = await getUsers();
    res.send(data)
})

router.get("/getUsername", middleAuthentication, async (req, res) => {
    const data = await getUsername("Americano");
    res.send(data)
})

const myList = [
    {
        email: "user1@truc.fr",
        title: "title1"
    },
    {
        email: "user2@machin.test",
        title: "title2"
    },
    {
        email: "Badoit@cojean.fr",
        title: "title3"
    }
]

router.get("/myList", middleAuthentication, async (req, res) => {
    res.json(myList.filter(l => l.email === req.user.mEmail))
})

//PARAMS VERSION
router.get("/getUser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getUser(id);
        res.send(data);
    } catch {
        res.status(500)
    }
})

//AUTHENTICATE TOKEN
router.get("/getUser", middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;
        const data = await getUser(id);
        res.status(201).send(data);
    } catch (error) {
        console.error('get User Error retrieving user data:', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})




router.post("/logUser", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("[Request to log in with email : '" +email + " ']")

        //get hashedPassword from user using email
        const hashedPassword = await getHashedPassword(email);

        if (!hashedPassword) {
            return res.status(404).json({ message: "User not found" });
        }
        //compare hashedPassword with password
        if (await bcrypt.compare(password, hashedPassword)) {
            //get other information from user using email
            const response = await getUserWithEmail(email)

            const currentUser = {
                mUserIdentifier: response.mUserIdentifier,
                mUsername: response.mUsername,
                mEmail: response.mEmail,
                mRole: response.mRole,
            }

            console.log("[User retrieved by email] : ");
            console.log(JSON.stringify(currentUser, null, 2));

            //generate (access token + refresh token) using user information
            const authToken = jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign(currentUser, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '12h' });

            console.log("[AuthToken created during login] : " + authToken);
            console.log("[RefreshToken created during login] : " + refreshToken);

            //insert refresh token into cookies
            createSecureCookie(req, res, "authTokenCookie", authToken, 60 * 60 * 1000); //1 hour
            createSecureCookie(req, res, 'refreshTokenCookie', refreshToken, 12 * 60 * 60 * 1000) // 12 hours

            console.log("-[Auth & Refresh cookies created in login]-")


            try{
                await incrementLogNumber(currentUser.mUserIdentifier)

            }catch(err){
                res.status(500).json({ message: "update log error" });
                
            }

            //returns (access token + refresh token)
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }

    } catch {
        res.status(500).json({ message: "/LogUser error" });
    }
})

router.post("/createUser", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const isDuplicate = await checkDuplicateEmail(email);
        if (!isDuplicate) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const data = await createUser(name, email, hashedPassword, role);
            await createUserStat(data.mUserIdentifier)

            console.log("CREATING USER DATA : ")
            console.log(data)
            res.status(201).send(data)
        }
        else {
            res.status(400).send({ message: 'Email already exists' });
        }
    } catch {
        res.status(500).send()
    }
})

router.delete("/deleteUser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await deleteUser(id);
        res.status(200).json(data);
    } catch {
        res.status(500)
    }
})

// ---- Only used in login-script.js for debug -----
// ---- cf. /keepAuthenticate ----
//Try to get refreshToken from cookies
//refreshes authToken if possible
router.get('/RefreshingToken', (req, res) => {
    const refreshTokenCookie = req.cookies.refreshTokenCookie;
    console.log("RefreshingToken with Cookie : " + refreshTokenCookie)
    if (refreshTokenCookie == null || refreshTokenCookie === undefined) {
        return res.status(401).send({ message: "Refresh Token is null or undefined" })
    }
    jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: "Refresh Token is invalid" })

        const newUser = {
            mUserIdentifier: user.mUserIdentifier,
            mUsername: user.mUsername,
            mEmail: user.mEmail,
            mRole: user.mRole,
        }
        const authToken = generateAuthToken(newUser)
        createSecureCookie(req, res, "authTokenCookie", authToken, 60 * 60 * 1000); //1 hour

        res.status(200).send({ message: "Auth Token successfully refreshed" })
    })
})

router.get('/keepAuthenticate', middleAuthentication, (req, res) => {
    res.status(201).json({ message: 'Authentication successfully kept' , isAuth: req.isAuth})
})



router.delete("/logout", middleAuthentication, (req, res) => {
    res.clearCookie('refreshTokenCookie', { path: '/' });
    res.clearCookie('authTokenCookie', { path: '/' });
    res.status(204).send({ message: 'Logout successful, cookie cleared.' });
})


router.get('/getUserSessionData', middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;
        const data = await getUserSessionData(id);
        res.status(201).send(data);
    } catch (error) {
        console.error('get User Session Data retrieving user data:', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})

router.get('/getUserSessionCount', middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;
        const data = await getUserSessionCountByDay(id);
        res.status(201).send(data);
    } catch (error) {
        console.error('get User Session Count retrieving user data:', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})


router.get('/getLatestResults', middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;
        const data = await getLatestResults(id);
        res.status(201).send(data);
    } catch (error) {
        console.error('get User Latest Results retrieving user data:', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})


router.get('/getResultsByDay', middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;
        const data = await getResultsByDay(id);
        res.status(201).send(data);
    } catch (error) {
        console.error('get User Results by Day retrieving user data:', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})


router.get('/getResultByLevel/:level', middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;
        const level = req.params.level;

        console.log("[GET /getResultByLevel/:"+ level+"]")

        const resByLevel = await getResultByLevel(id, level)
        const sessionDetailsByLevel = await getSessionDetailsByLevel(id, level)
        const avgAnswerDurationByLevel = await averageAnswerDurationByLevel(id, level)

        res.status(201).send({
            resByLevel,
            sessionDetailsByLevel,
            avgAnswerDurationByLevel
        });
    } catch (error) {
        console.error('get User Results by Day retrieving user data:', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})

router.get('/getUserStats', middleAuthentication, async (req, res) => {
    try {
        const id = req.user.mUserIdentifier;

        console.log("[GET /getUserStats")

        const userStats = await getUserStats(id)

        res.status(201).send(userStats);
    } catch (error) {
        console.error('getUserStats : ', error); // Log the error
        res.status(500).send({ message: 'get User Internal Server Error' });
    }
})


module.exports = router;
