//app.js
//main executer

//express.js & http.js
const { expressApp, startServerHTTP, initializeDatabase } = require('./config/sc-index');


async function startApp() {
    await initializeDatabase();
    startServerHTTP(expressApp);
}

startApp();