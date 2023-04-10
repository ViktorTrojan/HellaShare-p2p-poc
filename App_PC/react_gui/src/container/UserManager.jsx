import React, { useState, useEffect } from 'react';
import AllPeers from './GUI/AllPeers';

import io from "socket.io-client";
const socket = io("http://localhost:8080");

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
        socket.on("connect", () => {
            console.log("[+] Connected to server");

            // "init" To Init ourselves and get the other peers in our network
            socket.emit("init", {name: 'MrSus'});
        });
        socket.on("disconnect", () => console.log("[-] Disconnected from server"));

        socket.on("user joined", (user) => {
            setUsers((prevUsers) => [...prevUsers, user]);
        });

        socket.on("user left", (user) => {
            setUsers((prevUsers) => prevUsers.filter((u) => u !== user));
        });

        socket.on("chat message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("user joined");
            socket.off("user left");
            socket.off("chat message");
        };
    }, []);

    // useEffect(() => {
    //     // TODO: save ip somewhere
    //     ws = new WebSocket("ws://127.0.0.1:8080")
    //     ws.onmessage = (msg) => {
    //         let data = JSON.parse(msg.data)
    //         let { event, peerID } = data
    //         eventManager(event, data);

    //     }
    // }, []);

    return (
        <AllPeers peers={peers} />
    );
}



export default UserManager;