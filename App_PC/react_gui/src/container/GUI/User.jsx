import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { HiDesktopComputer } from "react-icons/hi";
import { RiComputerLine } from "react-icons/ri";


// User Section Part
function User({ pcUsername, setPcUsername }) {
    const t = useTheme();

    useEffect(() => {
        async function fetchPCUsername() {
            const usrName = await window.saucer?.call("exposed_getPCUsername", []);
            if (usrName !== undefined) {
                setPcUsername(usrName);
                localStorage.setItem("username",usrName)
            }
            setPcUsername(localStorage.getItem("username"))
        }
        fetchPCUsername();
    }, [localStorage.getItem("username")]);


    return (
        <Box sx={{ bgcolor: t.c.p0, borderRadius: t.c.rounding1 }} className='z-20 flex m-2 items-center justify-between p-2'>

            <Box className='flex items-center gap-1'>
                <RiComputerLine color={t.palette.text.primary} size={50} />

                <Box className='flex flex-col'>
                    <Typography color='text.primary'>{pcUsername}</Typography>
                    <Typography color='text.secondary' sx={{ fontSize: 12 }}>PC - Win 10 Pro</Typography>
                </Box>
            </Box>

            <Box sx={{ bgcolor: t.c.p1, borderRadius: t.c.rounding1 }} className='flex w-10 h-10'>

            </Box>
        </Box>
    )
}

export default User;