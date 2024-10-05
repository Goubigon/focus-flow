const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.use(express.json())
router.use(cookieParser());


const { getUsers, getUser, createUser, checkDuplicateEmail, getHashedPassword, getUsername, getUserWithEmail, deleteUser
} = require('../../../config/database/sc-user-db.js');


const {createSecureCookie, authenticateToken } = require ('../../utils/auth.js')


router.get('/', (req, res) => {
    res.send('This is the User Data page')
})


router.get("/getUsers", async (req, res) => {
    const data = await getUsers();
    res.send(data)
})

router.get("/getUsername", authenticateToken, async (req, res) => {
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

router.get("/myList", authenticateToken, async (req, res) => {
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
router.get("/getUser", authenticateToken, async (req, res) => {
    try {
        const id = req.user.ID;
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
                ID: response.ID,
                mUsername: response.mUsername,
                mEmail: response.mEmail,
                mRole: response.mRole,
            }

            console.log("User retrieved by email : " + JSON.stringify(currentUser, null, 2));

            //generate (access token + refresh token) using user information
            const authToken = jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
            const refreshToken = jwt.sign(currentUser, process.env.REFRESH_TOKEN_SECRET)

            console.log("Created authToken : " + authToken);
            console.log("Created refreshToken : " + refreshToken);

            //insert refresh token into cookies
            createSecureCookie(req, res, "authTokenCookie", authToken, 15 * 1000); //15 sec
            createSecureCookie(req, res, 'refreshTokenCookie', refreshToken, 7 * 24 * 60 * 60 * 1000) // 7 days

            console.log("Auth & Refresh cookies created")
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
            ID: user.ID,
            mUsername: user.mUsername,
            mEmail: user.mEmail,
            mRole: user.mRole,
        }
        const authToken = generateAuthToken(newUser)
        createSecureCookie(req, res, "authTokenCookie", authToken, 15 * 1000); //15 sec

        res.status(200).send({ message: "Auth Token successfully refreshed" })
    })
})

router.get('/keepAuthenticate', authenticateToken, (req, res) => {
    res.status(201).json({ message: 'Authentication successfully kept' })
})



router.delete("/logout", authenticateToken, (req, res) => {
    res.clearCookie('refreshTokenCookie', { path: '/' });
    res.clearCookie('authTokenCookie', { path: '/' });
    res.status(204).send({ message: 'Logout successful, cookie cleared.' });
})


module.exports = router;
