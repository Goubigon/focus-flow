const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

router.use(express.json())

const { getUsers, getUser, createUser, checkDuplicateEmail
} = require('../../../config/sc-user-db.js');

router.get('/', (req, res) => {
    res.send('This is the User Data page')
})


router.get("/getUsers", async (req, res) => {
    const data = await getUsers();
    res.send(data)
})

router.get("/getUser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getUser(id);
        res.send(data);
    } catch {
        res.status(500)
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



module.exports = router;