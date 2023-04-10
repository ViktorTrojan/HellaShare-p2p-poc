import React, { useState, useEffect } from 'react';
import AllPeers from './GUI/AllPeers';

// TODO: rename to PeerManager
const UserManager = () => {
    // stors all the peers information
    const [peers, setPeers] = useState()
    let ws;

    const eventManager = (event, data) => {
        switch (event) {

            // Set the ID
            case "SetID":
                setId(data.peerID);

            // Get all Peers
            case "GetUsers": {
                setPeers({ ...peers, data })
                console.log(peers, data);
            }

        }
    }


    const setId = (peerID) => {
        localStorage.setItem("peerID", peerID)
        ws.send(JSON.stringify({
            "event": "InitUser",
            "username": localStorage.getItem("username"),
            "peerID": localStorage.getItem("peerID"),
        }))
    }

    useEffect(() => {
        // TODO: save ip somewhere
        ws = new WebSocket("ws://127.0.0.1:8080")
        ws.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            let { event, peerID } = data
            eventManager(event, data);

        }
    }, []);

    return (
        <AllPeers peers={peers} />
    );
}



export default UserManager;