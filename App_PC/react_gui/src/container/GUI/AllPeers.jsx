import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const Peer = ({ user }) => {
    return (
        <Box className='w-20 h-20 bg-slate-100 rounded-full'>
            {user.name}

        </Box>
    );
}

function AllPeers({ peers }) {

    useEffect(() => {
    }, []);

    return (
        <div className="flex h-full flex-wrap gap-2">
            {
                peers.map((user, idx) => {
                    return <Peer key={idx} user={user} />
                })
            }
        </div>
    );
}

export default AllPeers;