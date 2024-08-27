//indexing everything from configs
//easier to use by app.js


const expressApp = require('./sc-express.js');
const { startServer } = require('./sc-https.js');

module.exports = {
    expressApp,
    startServer,
};
