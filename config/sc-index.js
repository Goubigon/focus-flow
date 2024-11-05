//indexing everything from configs
//easier to use by app.js

//currently using express.js & http.js
const expressApp = require('./sc-express.js');
const { startServerHTTP } = require('./sc-http.js');

const {initializeDatabase} = require('./database/sc-init-db.js');

module.exports = {
    expressApp,
    startServerHTTP,
    initializeDatabase
};
