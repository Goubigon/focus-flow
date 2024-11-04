//app.js
//main executer

//express.js & http.js
const { expressApp, startServerHTTP, connectWithRetry, initializeDatabase } = require('./config/sc-index');


async function startApp() {
    await connectWithRetry();
    await initializeDatabase();
    startServerHTTP(expressApp);
}

startApp();