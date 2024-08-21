const https = require('https');
const fs = require('fs');
const path = require('path');

const port = 8000;

function startServer(app) {
    //HTTPS certificates
    const options = {
        key: fs.readFileSync(path.join(__dirname, '../certificates/localhost-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../certificates/localhost.pem'))
    };

    const server = https.createServer(options, app);
    server.listen(port, () => {
        console.log(`Server running at https://localhost:${port}/`);
    })
}

module.exports = { startServer };