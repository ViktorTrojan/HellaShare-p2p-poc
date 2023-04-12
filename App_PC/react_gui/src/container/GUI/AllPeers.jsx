import { Box } from "@mui/material";
import { useEffect, useState } from "react";



const Peer = ({ user }) => {

    const handleClick=(id)=>{
        let peer = window.connections.filter(con=>con.peer==id)[0]
        console.log("clicked")
        peer.send("penis")
    }

    return (
        <Box className='w-20 h-20 bg-slate-100 rounded-full text-center' id={user.id} onClick={() => handleClick(user.id)}>
            {user.name}
        </Box>
    );
}

function AllPeers({ peers }) {

    useEffect(() => {
    }, []);

    return (
        <div className="z-10 flex h-full flex-wrap gap-2">
            {
                peers.map((user, idx) => {
                    return <Peer key={idx} user={user}/>
                })
            }
        </div>
    );
}

export default AllPeers;