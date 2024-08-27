const express = require('express');
//const path = require('path');

const app = express();


const homeRoute = require('../app/routes/home');
const aboutRoute = require('../app/routes/about');
const dataRoute = require('../app/routes/data');
const fillerRoute = require('../app/routes/filler.js');


app.use('/', homeRoute);
app.use('/about', aboutRoute);
app.use('/data', dataRoute);
app.use('/filler', fillerRoute);



// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Page not found');
});


module.exports = app;