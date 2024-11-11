//app.js
//main executer

//express.js & https.js
const { expressApp, startServerHTTP } = require('./config/sc-index');

startServerHTTP(expressApp);