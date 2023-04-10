import { Box, useTheme } from "@mui/material";

// Form for the GUI
export default function FormManager({ children }) {
    // mui theme
    const t = useTheme();
    return (
        <Box className="flex w-full h-screen p-10">
            <Box sx={{ overflow: 'hidden', borderRadius: t.c.rounding2, width: '100%', height: '100%', boxShadow: t.c.shadow0 }}>
                {children}
            </Box>
        </Box>
    );

}