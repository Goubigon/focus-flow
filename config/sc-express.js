//All express routes
const express = require('express');
const app = express();

//static files are put in /public
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));


const homeRoute = require('../src/routes/home.js');
const aboutRoute = require('../src/routes/about.js');
const fillerRoute = require('../src/routes/filler.js');
const exerciseRoute = require('../src/routes/exercise.js');
const parametersRoute = require('../src/routes/parameters.js');
const mathDataRoute = require('../src/routes/data/math-data.js');
const dashboardRoute = require('../src/routes/dashboard.js');

const signRoute = require('../src/routes/sign.js');
const userRoute = require('../src/routes/data/user-data.js');

const loginRoute = require('../src/routes/login.js');
const logoutRoute = require('../src/routes/logout.js');


const sessionDataRoute = require('../src/routes/data/session-data.js');

const previewRoute = require('../src/routes/preview.js');

const handRoute = require('../src/routes/handwritten.js');
const modelRoute = require('../src/routes/data/model-data.js');


//default / redirects to /preview
app.get('/', (req, res) => {
    res.redirect('/preview');
});

app.use('/home', homeRoute);
app.use('/about', aboutRoute);
app.use('/filler', fillerRoute);
app.use('/exercise', exerciseRoute);
app.use('/parameters', parametersRoute);
app.use('/math-data', mathDataRoute);
app.use('/dashboard', dashboardRoute);

app.use('/sign', signRoute);
app.use('/user-data', userRoute);
app.use('/login', loginRoute);

app.use('/logout', logoutRoute);

app.use('/session-data', sessionDataRoute);
app.use('/preview', previewRoute);


app.use('/handwritten', handRoute);
app.use('/model-data', modelRoute);


// Handle 404 errors
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>Sorry, we couldn't find the page you were looking for.</p>
        <a href="/">Go back to Home</a>
    `);
});


module.exports = app;