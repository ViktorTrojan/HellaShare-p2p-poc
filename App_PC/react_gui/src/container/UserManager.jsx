import React, { useState, useEffect } from 'react';
import AllPeers from './GUI/AllPeers';

import Peer from 'peerjs';

import io from "socket.io-client";
const socket = io("http://localhost:8080");

// TODO: This is like the peer.js Manager
const PeerJSManager = ({ peers, peerID }) => {
    const [peerData, setPeerData] = useState({ peer: null, id: null });
    const [connections, setConnections] = useState([]);
    const [initialized, setInitialized] = useState(false);
    window.connections = connections;
    useEffect(() => {
        const peer = new Peer(peerID);
        peer.on('open', (id) => { // Event for when Peer obj finished initializing
            setPeerData({peer: peer, id: id });
            setInitialized(true);
        });
        peer.on('connection', (newConn) => { // new Peer connected to us
            setConnections((prevConnections) => [...prevConnections, newConn]);
            newConn.on('data', (data) => {
                alert(`Received: ${data}`);
            });
            window.connections = connections;


            newConn.on('close', () => {
                setConnections((prevConnections) =>
                    prevConnections.filter((conn) => conn !== newConn)
                );
            });
        });

        return () => {
            peer.destroy();
        };
    }, []);

    useEffect(() => {
        // filter out the peers we are already connected to
        const newPeers = peers.filter((p) => {
            return !connections.some((c) => c.peer === p.id);
        });

        // only call handleConnect if peer has initialized
        if (initialized) {
            console.log(peerData)
            newPeers.forEach((p) => {
                handleConnect(p.id);
            });
        }
    }, [peers, initialized]);
    const handleConnect = (peerID) => { // call this to connect to a peer with the peerID
        const newConn = peerData.peer.connect(peerID);
        newConn.on('open', () => { // after opening connection to peer?
            setConnections((prevConnections) => [...prevConnections, newConn]);
            newConn.send("a")
        });

        newConn.on('data', (data) => {
            console.log('Received:', data);
        });

        newConn.on('close', () => {
            setConnections((prevConnections) =>
                prevConnections.filter((conn) => conn !== newConn)
            );
        });
    };
}

// TODO: This is for like socket.io server management
const UserManager = () => {
    // stors all the peers information
    const [peers, setPeers] = useState([])

    // our peer information
    const [peer, setPeer] = useState([]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("[+] Connected to server");

            // "init" To Init ourselves and get the other peers in our network
            socket.emit("init", { name: 'MrSus' });
        });
        socket.on("disconnect", () => console.log("[-] Disconnected from server"));

        // When our init was successful, we get a PeerID
        socket.on('init successful', (data) => {
            setPeer(data);
        })

        socket.on('peers in network', (peersInNetwork) => {
            console.log("[+] Received other Peers in Network:", peersInNetwork);
            // add them to the peers Arr
            setPeers((prevPeers) => [...prevPeers, ...peersInNetwork]);
        })

        socket.on('new peer', (newPeer) => {
            console.log("[+] Received recently joined Peer:", newPeer);
            // add the newly joined peer to the array
            setPeers((prevPeers) => [...prevPeers, newPeer]);
        })

        socket.on('peer dced', (dcedPeer) => {
            console.log("[-] Peer Dissconnected:", dcedPeer);
            // remove him from the peers array
            setPeers(prevPeers => prevPeers.filter(peer => peer.id !== dcedPeer.id));
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("init successful");
            socket.off("peers in network");
            socket.off("new peer");
            socket.off("peer dced");
            socket.close()
        };
    }, []);
    return (
        <div className='flex w-full h-full'>
            {peer.id && <PeerJSManager peers={peers} peerID={peer.id} />}
            <AllPeers peers={peers} />
        </div>
    );
}



export default UserManager;