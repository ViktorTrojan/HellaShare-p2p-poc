import { useEffect, useState } from "react";

const Peer = ({ peer, conn }) => {

    const handleClick = (event) => {
        const file = event.target.files[0];
        conn.send({ type: 'file', name: file.name, data: file });
    }

    return (
        <div>
            <input type="file" onChange={handleClick} className='w-20 h-20 bg-slate-100 rounded-full text-center' id={peer.id} />
            {peer.name}
        </div>
    );
}

function AllPeers({ peers, peerConnections }) {

    return (
        <div className="z-10 flex justify-center h-full flex-wrap gap-2">
            {
                peers.map((peer, idx) => {
                    // find the corresponding peerConnection object
                    const peerConnection = peerConnections.find(pc => pc.peer === peer.id);
                    return <Peer key={idx} peer={peer} conn={peerConnection} />
                })
            }
        </div>
    );
}

export default AllPeers;