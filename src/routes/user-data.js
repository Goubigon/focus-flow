const express = require('express');
const router = express.Router();

router.use(express.json())

const { getUsers
} = require('../../config/sc-user-db.js');

router.get('/', (req, res) => {
    res.send('This is the User Data page')
})


router.get("/getUsers", async (req, res) =>{
    const data = await getUsers();
    res.send(data)
})

module.exports = router;