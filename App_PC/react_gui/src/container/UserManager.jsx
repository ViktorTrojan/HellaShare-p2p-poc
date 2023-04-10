import React, { useState, useEffect } from 'react';
import AllPeers from './GUI/AllPeers';

// TODO: rename to PeerManager
const UserManager = () => {
    // stors all the peers information
    const [peers, setPeers] = useState()
    let ws;

    const eventManager = (event, data) => {
        switch (event) {
            case "SetID":
                setId(data.peerID);
            case "UserList":
                setPeers({ ...peers, data })
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
        ws = new WebSocket("ws://127.0.0.1:8080")
        ws.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            let { event, peerID } = data
            eventManager(event, data);

        }
    }, []);

    return(
        <div>
            <AllPeers peers={peers}/>
        </div>
    );
}



export default UserManager;