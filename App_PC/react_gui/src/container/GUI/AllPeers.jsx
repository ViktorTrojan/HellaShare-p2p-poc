import { Box } from "@mui/material";

const Peer = () => {

    return (
        <Box className='w-20 h-20 bg-slate-100 rounded-full'>

        </Box>
    );
}

function AllPeers() {
    return (
        <div className="flex h-full flex-wrap gap-2">
            <Peer/>
            <Peer/>
            <Peer/>
            <Peer/>
            <Peer/>
        </div>
    );
}

export default AllPeers;