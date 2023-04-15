import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

function Example_Download() {
  const [peerData, setPeerData] = useState({ peer: null, id: null }); // My Peer Data
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [receivedFile, setReceivedFile] = useState(null);
  const [fileToSend, setFileToSend] = useState(null);
  const [transferInProgress, setTransferInProgress] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => { // PeerID gets Generated
      setPeerData({ ...peerData, peer: peer, id: id });
    });

    peer.on('connection', (newConn) => { // someone connected to us
      console.log("[+] Connection established!", newConn);
      setConn(newConn);

      newConn.on('data', handleData);
      newConn.on('close', () => {
        console.log('[-] Connection closed by peer');
        setConn(null);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const handleConnect = () => { // we connect to someone
    const newConn = peerData.peer.connect(peerId);
    newConn.on('open', () => { // set the connection object on Connection
      setConn(newConn);
    });
    newConn.on('data', handleData);
    newConn.on('close', () => {
      console.log('[-] Connection closed by peer');
      setConn(null);
    });
  };

  const handleSendFile = (event) => {
    const file = event.target.files[0];
    setFileToSend(file);
    setTransferInProgress(true);
  };

  const handleCancelTransfer = () => {
    setFileToSend(null);
    setTransferInProgress(false);
    setTransferProgress(0);
  };

  const handleData = (data) => {
    if (data.type === 'file') {
      const blob = new Blob([data.data], { type: data.mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } else if (data.type === 'chunk') {
      // const chunk = data.data;
      // const offset = data.offset;
      // receivedChunks[offset] = chunk;

      // let allChunksReceived = true;
      // let receivedSize = 0;
      // for (let i = 0; i < receivedChunks.length; i++) {
      //   if (receivedChunks[i]) {
      //     receivedSize += receivedChunks[i].byteLength;
      //   } else {
      //     allChunksReceived = false;
      //     break;
      //   }
      // }

      // setTransferProgress((receivedSize / fileToReceive.size) * 100);

      // if (allChunksReceived) {
      //   const completeBlob = new Blob(receivedChunks, { type: fileToReceive.type });
      //   const url = URL.createObjectURL(completeBlob);
      //   setReceivedFile(url);
      //   setFileToReceive(null);
      //   setReceivedChunks([]);
      //   setTransferInProgress(false);
      //   setTransferProgress(0);
      // }
    }
  };

  // const handleData = (data) => {
  //   if (data.type === 'file') {
  //     const blob = new Blob([data.data], { type: data.mime });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = data.name;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   }
  // };

  useEffect(() => {
    if (fileToSend && conn && transferInProgress) {
      const chunkSize = 128000; // 128KB
      let offset = 0;
      const fileReader = new FileReader();

      fileReader.onload = () => {
        conn.send({
          type: 'chunk',
          data: fileReader.result,
          offset: offset,
        });
        offset += fileReader.result.byteLength;
        setTransferProgress((offset / fileToSend.size) * 100);

        if (offset < fileToSend.size) {
          readSlice(offset);
        } else {
          conn.send({ type: 'done' });
          setTransferInProgress(false);
          setTransferProgress(0);
          setFileToSend(null);
        }
      };

      fileReader.onerror = () => {
        console.error('[-] Error occurred while reading file.');
        setTransferInProgress(false);
        setTransferProgress(0);
        setFileToSend(null);
      };

      const readSlice = (o) => {
        const slice = fileToSend.slice(offset, o + chunkSize);
        fileReader.readAsArrayBuffer(slice);
      };

      readSlice(0);
    }
  }, [fileToSend, conn, transferInProgress]);

  return (
    <div className='flex flex-col min-h-screen justify-center items-center gap-2'>
      <h1>PeerJS Example</h1>
      <p>My ID: {peerData.id}</p>

      {conn ? (
        <>
          <p>Connected to peer!</p>
          {transferInProgress ? (
            <>
              <p>Uploading {fileToSend.name}</p>
              <progress value={transferProgress} max="100" />
              <button onClick={handleCancelTransfer}>Cancel</button>
            </>
          ) : (
            <input type="file" onChange={handleSendFile} />
          )}
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

// TODO: Make a class for the File Chunker