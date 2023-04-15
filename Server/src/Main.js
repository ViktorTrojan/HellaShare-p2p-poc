const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: '*', } });
const cors = require("cors");
app.use(cors());

const Logger = require("./util/Logger");
const uuid = require('uuid');

const PORT = 32891;

// TODO: create a peer class that has (name, id, private:socket)
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

    // sends a broadcast in the network, except to the excludePeerID
    function broadcastInNetwork(peerIP, eventName, msg, excludePeerID) {
        peers[peerIP].forEach((peer) => {
            if (peer.id !== excludePeerID) {
                peer.socket.emit(eventName, msg);
            }
        });
    }

    // emits to the peer the other peers in the network
    function getPeersInNetwork(peerIP, excludePeerID) {
        let peersInGroup = peers[peerIP].map(({ socket, ...peer }) => peer); // exclude the socket object

        // exclude the Peer from the list which will receive all the other peers in the network
        peersInGroup = peersInGroup.filter(peer => peer.id !== excludePeerID);
        if (peersInGroup.length === 0) return; // if no other people are in the network, dont emit the event

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

        Logger.info(`[+] [IP:${ip}] Peer joined: [${data.name}] ${id}`);

        // Tell the other Peers in the Network that a new Peer Joined
        broadcastInNetwork(ip, 'new peer', { id: id, name: data.name }, id);

        // return an obj of peers in the same network
        getPeersInNetwork(ip, id);

        // return that the init was successfully
        socket.emit('init successful', { id: id, name: data.name });
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
                    Logger.info(`[+] [IP:${ip}] Peer disconnected: [${disconnectedPeer.name}] ${disconnectedPeer.id}`);

                    // If the list is now empty, remove the empty object from the peers object
                    if (peerList.length === 0) {
                        Logger.info(`[-] Removing Empty Network [IP:${ip}] after Dissconnection of Peer [${disconnectedPeer.name} : ${disconnectedPeer.id}]`);
                        delete peers[ip];
                    } else { // network has peers in it
                        // Tell the other Peers in the Network that the Peer left
                        broadcastInNetwork(ip, 'peer dced', { id: disconnectedPeer.id, name: disconnectedPeer.name });
                    }
                }
            }
        }
    });
});
// // Set up the Express server
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

http.listen(PORT, () => { Logger.info("[+] Started the Server on Port: " + PORT) });