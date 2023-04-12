import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

function Example_Download() {
  const [peerData, setPeerData] = useState({ peer: null, id: null }); // My Peer Data
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [receivedFile, setReceivedFile] = useState(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => { // PeerID gets Generated
      setPeerData({ ...peerData, peer: peer, id: id });
    });

    peer.on('connection', (newConn) => {
      console.log("[+] Connection established!", newConn);
      setConn(newConn);

      newConn.on('data', handleData);
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
    newConn.on('data', handleData);
  };

  const handleSendFile = (event) => {
    const file = event.target.files[0];

    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onloadend = () => {
    //   const fileData = reader.result;
    conn.send({ type: 'file', name: file.name, data: file });
    // };
  };

  const handleData = (data) => {
    if (data.type === 'file') {
      // console.log(data);
      // const url = URL.createObjectURL(data.data);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = data.name;
      // a.click();
      // URL.revokeObjectURL(url);

      const blob = new Blob([data.data], { type: data.mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center gap-2'>
      <h1>PeerJS Example</h1>
      <p>My ID: {peerData.id}</p>

      {conn ? (
        <>
          <p>Connected to peer!</p>
          <input type="file" onChange={handleSendFile} />
        </>
      ) : (
        <>
          <input className='bg-blue-100 rounded p-2' type="text" value={peerId} onChange={(e) => setPeerId(e.target.value)} />
          <button onClick={handleConnect}>Connect</button>
        </>
      )}

      {receivedFile && (
        <a href={receivedFile} download="receivedFile">
          Download Received File
        </a>
      )}
    </div>
  );
}

export default Example_Download;