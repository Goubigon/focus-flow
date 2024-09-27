const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.use(express.json())
router.use(cookieParser());


const { getUsers, getUser, createUser, checkDuplicateEmail, getHashedPassword, getUsername, getUserWithEmail
} = require('../../../config/sc-user-db.js');





let refreshTokenList = [];



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
        res.send(data);
    } catch {
        res.status(500)
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
            const authToken = generateAuthToken(currentUser)
            const refreshToken = jwt.sign(currentUser, process.env.REFRESH_TOKEN_SECRET)

            console.log("Created authToken : " + authToken);
            console.log("Created refreshToken : " + refreshToken);

            //insert refresh token into cookies
            createSecureCookie(req, res, "authTokenCookie", authToken, 15 * 1000); //15 sec
            createSecureCookie(req, res, 'refreshTokenCookie', refreshToken, 7 * 24 * 60 * 60 * 1000) // 7 days

            console.log("Auth & Refresh cookies created")
            //returns (access token + refresh token)
            res.status(200).json({ message: "Login successful", authToken: authToken });
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
            res.status(201).send(data)
        }
        else {
            res.status(400).send({ message: 'Email already exists' });
        }
    } catch {
        res.status(500).send()
    }
})

router.get('/token', (req, res) => {

    const refreshTokenCookie = req.cookies.refreshTokenCookie;
    console.log("Cookie got : " + refreshTokenCookie)
    if (refreshTokenCookie == null) {
        return res.status(401)
    }
    if (!refreshTokenCookie.includes(refreshTokenCookie)) {
        return res.status(403)
    }
    jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        const newUser = {
            ID: user.ID,
            mUsername: user.mUsername,
            mEmail: user.mEmail,
            mRole: user.mRole,
        }
        const authToken = generateAuthToken(newUser)
        res.status(200).send({ message: "Token successfully refreshed", authToken: authToken })
    })
})



router.delete("/logout", authenticateToken, (req, res) => {
    res.clearCookie('refreshTokenCookie', { path: '/' }); // Specify the path if needed
    res.status(204).send({ message: 'Logout successful, cookie cleared.' });
})

//middleware function
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Authentication cookie : " + token);
    if (token == null) {
        console.log("Token is null")
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Token exists but is invalid")
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })

}
function generateAuthToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

/**
 * Creates a secure, HTTP-only cookie if it does not already exist.
 *
 * @param {Object} req - The request object, which contains cookies.
 * @param {Object} res - The response object, used to set the cookie.
 * @param {string} name - The name of the cookie to create.
 * @param {string} value - The value of the cookie to set.
 * @param {number} expiresIn - The expiration time for the cookie in milliseconds.
 */
function createSecureCookie(req, res, name, value, expiresIn) {
    if(req.cookies[name] === undefined){
        console.log("["+ name + "] Cookie doesn't exist yet")
        res.cookie(name, value, {
            httpOnly: true,
            secure: true, //https
            maxAge: expiresIn
        })
        console.log("["+ name + "] Cookie created")
    }else{
        console.log("Cookie [" + name + "] already exists, nothing to do")
    }
}


module.exports = router;