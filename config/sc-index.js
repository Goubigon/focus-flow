//indexing everything from configs
//easier to use by app.js

//currently using express.js & https.js
const expressApp = require('./sc-express.js');
const { startServer } = require('./sc-https.js');

module.exports = {
    expressApp,
    startServer,
};
