//app.js
//main executer

//express.js & http.js
const { expressApp, startServerHTTP } = require('./config/sc-index');

startServerHTTP(expressApp);