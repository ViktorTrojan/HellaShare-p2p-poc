import { Box, useTheme } from "@mui/material";
import User from "./User";
import SignalEffect from "./SignalEffect";
import AllPeers from "./AllPeers";
import UserManager from "../UserManager";

function GUI() {
    const t = useTheme();

    // TODO: fix z index for this crap
    return (
        <Box sx={{ bgcolor: 'background.default' }} className='-z-10 relative flex flex-col h-full'>
            <SignalEffect />
            <UserManager/>
            <AllPeers/>

            <User />
        </Box>
    )
}

export default GUI;