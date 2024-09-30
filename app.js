//app.js
//main executer

//express.js & https.js
const { expressApp, startServer } = require('./config/sc-index');

startServer(expressApp);

//export to be used in tests
module.exports = expressApp;