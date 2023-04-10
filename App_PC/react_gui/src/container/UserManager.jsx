import React, { useState, useEffect } from 'react';

const UserManager = () => {
    let ws;
    const [users, setUsers] = useState();

    const eventManager = (event, data) => {
        switch (event) {
            case "SetID":
                setId(data.peerID);
            case "UserList":
                console.log(data)
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

    useEffect(_ => {
        ws = new WebSocket("ws://127.0.0.1:8080")
        ws.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            let { event, peerID } = data
            eventManager(event, data);
        }
    }, [])

    return (
        <div>
            <li>
                {users}
            </li>
        </div>
    )
}

export default UserManager;