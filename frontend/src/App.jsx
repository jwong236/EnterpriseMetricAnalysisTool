import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import MainPage from './components/MainPage';
import './App.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<MainPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
