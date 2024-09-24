const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.use(express.json())

const { getUsers, getUser, createUser, checkDuplicateEmail, getHashedPassword, getUsername, getUserWithEmail
} = require('../../../config/sc-user-db.js');



let refreshToken = [];



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
        email : "user1@truc.fr",
        title : "title1"
    },
    {
        email : "user2@machin.test",
        title : "title2"
    },
    {
        email : "Badoit@cojean.fr",
        title : "title3"
    }
]
router.get("/myList", authenticateToken, async (req, res) => {
    res.json(myList.filter(l => l.email === req.user.mEmail))
})

//PARAMS VERSION
router.get("/getUser/:id",async (req, res) => {
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
        const id = req.user.id;
        const data = await getUser(id);
        res.send(data);
    } catch {
        res.status(500)
    }
})

router.post("/logUser", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await getHashedPassword(email);

        if (!hashedPassword) {
            return res.status(404).json({ message: "User not found" });
        }

        if (await bcrypt.compare(password, hashedPassword)) {
            console.log("user : ")
            
            const response = await getUserWithEmail(email)

            const user = { 
                id : response.ID,
                mUsername : response.mUsername,
                mEmail : response.mEmail,
                mRole : response.mRole,
            }

            const accessToken = generateAccessToken(user)

            //const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            //refreshTokens.push(refreshToken)

            res.status(200).json({ message: "Login successful", accessToken: accessToken , refreshToken:refreshToken});
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }

    } catch {
        res.status(500).json({ message: "Server error" });
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

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null){
        return res.status(401)
    }
    if(!refreshToken.includes(refreshToken)){
        return res.status(403)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken( {email: user.email})
        res.json({accessToken : accessToken})
    })
})


function authenticateToken(req, res, next){
    
    console.log("generating access token")

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        console.log("Token is null")
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err){
            console.log("error 403")
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'15s'});
}


module.exports = router;