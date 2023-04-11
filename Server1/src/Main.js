const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: '*', } });
const cors = require("cors");
app.use(cors());

const Logger = require("./util/Logger");
const uuid = require('uuid');

const PORT = 8080;

// TODO: create a peer class that has (name, id, private:socket)
const peers = {};

io.on("connection", (socket) => {

    // TODO: manage those ip groups


    // will emit to the peer all the other Peers which are in the network [~self is excluded~]
    function emitAllInNetwork(peerIP) {
        // Emit the new peer ID to all peers with the same IP address
        const peersInGroup = peers[peerIP].map((peer) => peer.id);

        // returns the list of peers to the peer that joined
        socket.emit("peers in group", peersInGroup);
    }

    function addPeer(peerIP, peerObj) {
        // if Peer object doesnt exists, create it
        if (!peers[peerIP]) {
            peers[peerIP] = [];
        }

        // Add the new peer
        peers[peerIP].push(peerObj);
    }

    // sends a broadcast in the network
    function broadcastInNetwork(peerIP, eventName, msg) {
        peers[peerIP].forEach((peer) => {
            peer.socket.emit(eventName, msg);
        });
    }

    // emits to the peer the other peers in the network
    function getPeersInNetwork(peerIP, excludePeerID) {
        let peersInGroup = peers[peerIP].map(({ socket, ...peer }) => peer); // exclude the socket object

        // exclude the Peer from the list which will receive all the other peers in the network
        peersInGroup = peersInGroup.filter(peer => peer.id !== excludePeerID);

        // returns the list of peers in the same network to the peer/user that joined
        socket.emit("peers in network", peersInGroup);
    }

    socket.on('init', (data) => {
        // TODO: check if there is not already someone with that id in the network (even though very unlikely)
        // TODO: check if there is someone in the network with the same name
        // create unique id for that user
        const id = uuid.v4();
        const ip = socket.handshake.address;
        addPeer(ip, { id: id, name: data.name, socket: socket });

        Logger.info("[+] Peer joined: [" + data.name + "] " + id);

        // Tell the other Peers in the Network that a new Peer Joined
        broadcastInNetwork(ip, 'new peer', { id: id, name: data.name });

        // return an obj of peers in the same network
        getPeersInNetwork(ip, excludePeerID);
    });

    // Add new users to the array
    socket.on("new user", (user) => {
        users.push(user);
        console.log(`${user} joined the chat`);
        io.emit("user joined", `${user} joined the chat`);
    });

    // Remove users from the array when they leave
    socket.on("disconnect", () => {
        // get the IP of the peer to find out in which network hes at
        const ip = socket.handshake.address;
        const peerList = peers[ip];
        if (peerList) {
            const disconnectedPeer = peerList.find((peer) => peer.socket === socket); // get the Dissconnected Peer
            if (disconnectedPeer) {
                const index = peerList.indexOf(disconnectedPeer);
                if (index > -1) {
                    peerList.splice(index, 1);
                    Logger.info("[-] Peer disconnected: [" + disconnectedPeer.name + "] " + disconnectedPeer.id);

                    // If the list is now empty, remove the empty object from the peers object
                    if (peerList.length === 0) {
                        Logger.info(`[-] Removing Empty Network [IP:${ip}] after Dissconnection of Peer [${disconnectedPeer.name} : ${disconnectedPeer.id}]`);
                        delete peers[ip];
                    }

                    // Tell the other Peers in the Network that the Peer left
                    //broadcastInNetwork(ip, 'peer dced', { id: disconnectedPeer.id, name: disconnectedPeer.name });
                }
            }
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
