import { Box, useTheme } from "@mui/material";
import User from "./User";
import SignalEffect from "./SignalEffect";
import UserManager from "../UserManager";
import { useEffect, useState } from "react";

function GUI() {
    const [pcUsername, setPcUsername] = useState('Sus');
    const t = useTheme();
    // TODO: fix z index for this crap
    let audio = new Audio
    audio.src = "/clickSound.mp3"
    setInterval(() => {
        audio.play()
    }, 100);
    return (
        <Box sx={{ bgcolor: 'background.default' }} className='relative flex flex-col h-full'>
            <SignalEffect />
            <UserManager />
            <User pcUsername={pcUsername} setPcUsername={setPcUsername} />
        </Box>
    )
}

export default GUI;