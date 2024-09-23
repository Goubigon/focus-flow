//All express routes
const express = require('express');

const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));


const homeRoute = require('../src/routes/home.js');
const aboutRoute = require('../src/routes/about.js');
const dataRoute = require('../src/routes/data.js');
const fillerRoute = require('../src/routes/filler.js');
const exerciseRoute = require('../src/routes/exercise.js');
const parametersRoute = require('../src/routes/parameters.js');
const mathDataRoute = require('../src/routes/math-data.js');
const dashboardRoute = require('../src/routes/dashboard.js');

const signRoute = require('../src/routes/sign.js');


app.use('/', homeRoute);
app.use('/about', aboutRoute);
app.use('/data', dataRoute);
app.use('/filler', fillerRoute);
app.use('/exercise', exerciseRoute);
app.use('/parameters', parametersRoute);
app.use('/math-data', mathDataRoute);
app.use('/dashboard', dashboardRoute);

app.use('/sign', signRoute);


// Handle 404 errors
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>Sorry, we couldn't find the page you were looking for.</p>
        <a href="/">Go back to Home</a>
    `);
});


module.exports = app;