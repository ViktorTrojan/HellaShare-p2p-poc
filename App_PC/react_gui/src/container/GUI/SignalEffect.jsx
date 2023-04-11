import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// TODO: optimize this whole class, the further the ring goes the bigger the width gets, fix that, probably dont use scale
const SignalRing = ({ onRemove }) => {
    
    const t = useTheme();
    return (
        <motion.div
            initial={{ scale: 0, opacity: 1}}
            animate={{ scale: window.innerWidth>=600?15:6, opacity: 0}}
            transition={{ duration: 10,ease: 'linear' }}
            style={{borderColor: t.c.signal}}
            className="absolute rounded-full border w-40 h-40"
            onAnimationComplete={onRemove}
        />
    );
};

function SignalEffect() {
    const [signalRings, setSignalRings] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSignalRings((prevRings) => [
                ...prevRings,
                { id: Date.now(), remove: false },
            ]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleRemoveSignalRing = (id) => {
        setSignalRings((prevRings) =>
            prevRings.map((ring) => (ring.id === id ? { ...ring, remove: true } : ring))
        );
        setTimeout(() => {
            setSignalRings((prevRings) => prevRings.filter((ring) => ring.id !== id));
        }, 10000); // wait for 10 seconds for the animation to complete
    };

    return (
        <Box className="-z-20 absolute inset-0">
            <Box className="relative flex justify-center items-end h-full">
                {signalRings.map((ring) =>
                    !ring.remove ? (
                        <SignalRing key={ring.id} onRemove={() => handleRemoveSignalRing(ring.id)} />
                    ) : null
                )}
            </Box>
        </Box>
    );
}

export default SignalEffect;
