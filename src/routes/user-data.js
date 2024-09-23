const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

router.use(express.json())

const { getUsers, createUser
} = require('../../config/sc-user-db.js');

router.get('/', (req, res) => {
    res.send('This is the User Data page')
})


router.get("/getUsers", async (req, res) =>{
    const data = await getUsers();
    res.send(data)
})

router.post("/createUser", async (req, res) =>{
    try{
        const {name, email, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const data = await createUser(name, email, hashedPassword, role);
        res.status(201).send(data)
    }catch{
        res.status(500).send()
    }
})

module.exports = router;