import { Peer, server, Logger } from "./src/index.js"
let peers = []


server.on("InitUser", data => {
    let { username, ip, ws, peerID} = data;
    let peer = new Peer(ip, peerID, username);

    peers.push(peer)
    // filters the peers and returns the ones that have the same public ip (e.g. 192.168.100.2);
    const filteredPeers = peers.filter(peer_ => peer_.ip === ip);
    ws.send(JSON.stringify({ peers: filteredPeers, event: "UserList" }));


})

server.on("GetUsers", data => {
    ws.send(JSON.stringify({ peers: peers, event: "UserList" }));
})

// gets fired by the server --------------------------------------------------------------------------------------------------

server.on("SetId", data => {
    let { ws, peerID } = data
    ws.send(JSON.stringify({ "peerID": peerID, event: "SetID" }))
})

server.on("disconnect",data=>{
    Logger.info(`[-] Peer: [${data.id}] dissconnected!`)
    peers = peers.filter(peer => peer.id !== data.id);
})

// ---------------------------------------------------------------------------------------------------------------------------