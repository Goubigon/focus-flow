//indexing everything from configs
//easier to use by app.js

//currently using express.js & https.js
const expressApp = require('./sc-express.js');
const { startServerHTTP } = require('./sc-http.js');

module.exports = {
    expressApp,
    startServerHTTP,
};
