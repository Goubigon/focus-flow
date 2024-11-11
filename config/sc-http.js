// Import the http module
const http = require('http');

// Define the server's port
const PORT = 8000;

function startServerHTTP(res) {
    // Create a server that responds with "Hello, World!" to all requests
    const server = http.createServer(res);

    // Start the server and listen on the specified port
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}


module.exports = { startServerHTTP };