import { Box, useTheme } from "@mui/material";
import User from "./User";
import SignalEffect from "./SignalEffect";
import UserManager from "../UserManager";
import { useEffect, useState } from "react";

function GUI() {
    const t = useTheme();
    // TODO: fix z index for this crap
    return (
        <Box sx={{ bgcolor: 'background.default' }} className='relative flex flex-col h-full'>
            <SignalEffect />
            <UserManager />
            <User pcUsername/>
        </Box>
    )
}

export default GUI;