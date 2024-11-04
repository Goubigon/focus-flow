//app.js
//main executer

//express.js & http.js
const { expressApp, startServerHTTP, initializeDatabase } = require('./config/sc-index');

// Initialize the database
initializeDatabase();

startServerHTTP(expressApp);