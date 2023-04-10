import { ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useState } from "react";

// Wrap your App with <ThemeManger>YOURAPP...</ThemeManager>
// Just the Theme Manager (mui themes and storing theme in local storage)
export default function ThemeManager({ children }) {

    const themes = {
        'dark':
            createTheme({
                palette: {
                    mode: 'dark',
                    primary: {
                        main: '#90caf9',
                    },
                    secondary: {
                        main: '#ce93d8',
                    },
                    background: {
                        default: '#22222F',
                        paper: '#171717'
                    },
                },
                c: {
                    test: '#ff0000',
                    p0: '#5f505f',
                    p1: '#513e51',
                    p2: '#775b77',
                    p3: '#af7eaf',

                    signal: '#9664C811',

                    modal0: '#18131ecc',

                    shadow0: '0 0 15px 5px rgba(150, 100, 200, 0.5)',

                    rounding0: 1,
                    rounding1: 2,
                    rounding2: 4,
                    rounding3: 8,
                }
            }),

        'dracula':
            createTheme({
                palette: {
                    mode: 'dark',
                    primary: {
                        main: '#90caf9',
                    },
                    secondary: {
                        main: '#ce93d8',
                    },
                    background: {
                        default: '#22222FEE',
                        paper: '#171717'
                    },
                },
                c: {
                    test: '#ff0000',
                    p0: '#5f505f88',
                    p1: '#8f8f8f88',
                    p2: '#AfAfAf88',

                    shadow0: '0 0 15px 5px rgba(150, 100, 200, 0.5)',

                    rounding0: 4,
                    rounding1: 2,
                }
            }),
    }

    const [themeName, setThemeName] = useState('dark');

    useEffect(() => { // load Theme when Website Loads
        const storedTheme = window.localStorage.getItem("theme");
        if (storedTheme) {
            setThemeName(storedTheme);
        }
    }, []);

    useEffect(() => { // Store Theme in LocalStorage when it gets changed
        window.localStorage.setItem("theme", themeName);
    }, [themeName]);


    return (
        <ThemeContext.Provider value={{ themeName, setThemeName }}>
            <ThemeProvider theme={themes[themeName]}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

import { createContext } from 'react';
export const ThemeContext = createContext({
    themeName: 'dark',
    setThemeName: () => { },
});