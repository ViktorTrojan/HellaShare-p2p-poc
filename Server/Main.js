const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 9000;

// Log every request with IP address
app.use((req, res, next) => {
    const clientIp = req.ip;
    console.log(`Request from ${clientIp}: ${req.method} ${req.path}`);
    next();
});

// Listen for incoming WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Listen for incoming messages from clients
    socket.on('message', (message) => {
        console.log('Received message:', message);

        // Broadcast the message to all connected clients
        io.emit('message', message);
    });

    // Listen for when a client disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`);
});