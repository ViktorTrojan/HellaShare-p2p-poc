import { Box, Typography, useTheme } from "@mui/material";
import { HiDesktopComputer } from "react-icons/hi";
import { RiComputerLine } from "react-icons/ri";


// User Section Part
function User({ pcUsername }) {
    const t = useTheme();

    return (
        <Box sx={{ bgcolor: t.c.p0, borderRadius: t.c.rounding1 }} className='flex m-2 items-center justify-between p-2'>

            <Box className='flex items-center gap-1'>
                <RiComputerLine color={t.palette.text.primary} size={50} />

                <Box className='flex flex-col'>
                    <Typography color='text.primary'>{localStorage.getItem("username") ? localStorage.getItem("username") : pcUsername}</Typography>
                    <Typography color='text.secondary' sx={{ fontSize: 12 }}>PC - Win 10 Pro</Typography>
                </Box>
            </Box>

            <Box sx={{ bgcolor: t.c.p1, borderRadius: t.c.rounding1 }} className='flex w-10 h-10'>

            </Box>
        </Box>
    )
}

export default User;