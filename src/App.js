// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './StartPage';
import BirdQuest from './BirdQuest';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/game" element={<BirdQuest />} />
            </Routes>
        </Router>
    );
}

export default App;

