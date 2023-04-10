import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const Peer = ({ user }) => {
    return (
        <Box className='w-20 h-20 bg-slate-100 rounded-full'>
            {/* {user.name} */}

        </Box>
    );
}

function AllPeers({ peers }) {

    useEffect(() => {

        // ws shit and add the peers to that list


    }, []);

    return (
        <div className="flex h-full flex-wrap gap-2">
            {
                // peers.map((user) => {
                //     <Peer user={user}/>
                // })
            }
        </div>
    );
}

export default AllPeers;