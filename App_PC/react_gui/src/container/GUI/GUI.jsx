import { Box, useTheme } from "@mui/material";
import User from "./User";
import SignalEffect from "./SignalEffect";
import UserManager from "../UserManager";
import { useEffect, useState } from "react";

function GUI() {
    const t = useTheme();
    const [pcUsername, setPcUsername] = useState();

    useEffect(() => {
        async function fetchPCUsername() {
            const usrName = await window.saucer.call("exposed_getPCUsername", []);
            console.log(usrName);
            setPcUsername(usrName);
        }

        fetchPCUsername();
    }, []);

    // TODO: fix z index for this crap
    return (
        <Box sx={{ bgcolor: 'background.default' }} className='-z-10 relative flex flex-col h-full'>
            <SignalEffect />
            <UserManager />
            <User pcUsername={pcUsername} />
        </Box>
    )
}

export default GUI;