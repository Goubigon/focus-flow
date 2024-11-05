const express = require('express');
const router = express.Router();

const axios = require('axios');

router.use(express.json())


router.get('/', (req, res) => {
    res.send('This is the Model page')
})


router.post("/predict", async (req, res) => {
    //pythonRoute = 'http://localhost:5001/predict'
    pythonRoute = 'http://mnist-server:5001/predict'
    axios.post(pythonRoute, req.body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log("Prediction results : " + JSON.stringify(response.data))
            res.status(201).json({
                'first_index': parseInt(response.data.first_index),
                'first_prob': parseFloat(response.data.first_prob).toFixed(2),
                'second_index': parseInt(response.data.second_index),
                'second_prob': parseFloat(response.data.second_prob).toFixed(2)
            })
        })
        .catch(error => {
            console.error('Error predicting:', error);
        });
})



module.exports = router;