import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

function PeerManager() {
  const [peerData, setPeerData] = useState({ peer: null, id: null }); // My Peer Data
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // const peer = new Peer(undefined, {
    //   host: 'localhost',
    //   port: 9000,
    //   path: '/hellashare_server'
    // });

    const peer = new Peer();

    peer.on('open', (id) => { // PeerID gets Generated
      setPeerData({ ...peerData, peer: peer, id: id });
    });

    peer.on

    peer.on('connection', (newConn) => {
      console.log("[+] Connection established!", newConn);
      setConn(newConn);

      newConn.on('data', (data) => {
        console.log('Received:', data);
      });
    });


    return () => {
      peer.destroy();
    };
  }, []);

  const handleConnect = () => {
    const newConn = peerData.peer.connect(peerId);


    newConn.on('open', () => { // set the connection object on Connection
      setConn(newConn);
    });

    newConn.on('data', (data) => {
      console.log('Received:', data);
    });
  };

  const handleSend = () => {
    conn.send(message);
    setMessage('');
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center gap-2'>
      <h1>PeerJS Example</h1>
      <p>My ID: {peerData.id}</p>

      {conn ? (
        <>
          <p>Connected to peer!</p>

          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSend}>Send</button>
        </>
      ) : (
        <>
          <input className='bg-blue-100 rounded p-2' type="text" value={peerId} onChange={(e) => setPeerId(e.target.value)} />
          <button onClick={handleConnect}>Connect</button>
        </>
      )}
    </div>
  );
}

export default PeerManager;
