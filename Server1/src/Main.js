const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: '*', } });
const cors = require("cors");
app.use(cors());

const Logger = require("./util/Logger");
const uuid = require('uuid');

const PORT = 8080;

const peers = {};

io.on("connection", (socket) => {

    // TODO: manage those ip groups

    function addPeer(peerIP, peerObj) {
        // if Peer object doesnt exists, create it
        if (!peers[peerIP]) {
            peers[peerIP] = [];
        }

        // Add the new peer
        peers[peerIP].push(peerObj);
    }

    // sends a broadcast in the network
    function broadcastInNetwork(ip) {
        peersByIp[peerIpAddress].forEach((peer) => {
            peer.emit("new peer", { id, name: data.name });
        });
    }

    // will emit to the peer all the other Peers which are in the network [~self is excluded~]
    function emitAllInNetwork() {
        // Emit the new peer ID to all peers with the same IP address
        const peersInGroup = peersByIp[peerIpAddress].map((peer) => peer.id);

        // Emit the list of peers in the group to the new peer
        socket.emit("peers in group", peersInGroup);
    }

    socket.on('init', (data) => {
        // TODO: check if there is not already someone with that id in the network (even though very unlikely)
        // TODO: check if there is someone in the network with the same name
        // create unique id for that user
        const id = uuid.v4();
        const ip = socket.handshake.address;
        addPeer(ip, { id: id, name: data.name });

        Logger.info("[+] Peer joined: [" + data.name + "] " + id);

        // Emit the list of peers to all peers with the same IP address
        socket.broadcast.emit("new peer", { id: id, name: data.name });
    });

    // Add new users to the array
    socket.on("new user", (user) => {
        users.push(user);
        console.log(`${user} joined the chat`);
        io.emit("user joined", `${user} joined the chat`);
    });

    // Remove users from the array when they leave
    socket.on("disconnect", () => {
        console.log("D")
        const index = users.indexOf(socket.username);
        if (index > -1) {
            users.splice(index, 1);
            console.log(`${socket.username} left the chat`);
            io.emit("user left", `${socket.username} left the chat`);
        }
    });

    // Broadcast messages to all users
    socket.on("chat message", (msg) => {
        console.log(`${socket.username}: ${msg}`);
        io.emit("chat message", `${socket.username}: ${msg}`);
    });

    // Set the username for the socket
    socket.on("set username", (username) => {
        socket.username = username;
    });
});

// Set up the Express server
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => { Logger.info("[+] Started the Server on Port: " + PORT) });
