import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createTheme, ThemeProvider} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
    palette: {
        primary: {
            main: "#575757"
        },
        secondary: {
            main: "#ed1c24"
        }
    },
    typography: {
        fontFamily: 'Montserrat, Helvetica, sans-serif',
        fontSize: 16,
        fontWeight: '500'

},
});

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}><App /></ThemeProvider>
    </React.StrictMode>
);
