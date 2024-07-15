// src/StartPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css'; // Import the CSS file for styling

const StartPage = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/game');
    };

    return (
        <div className="start-page">
            <h1 className="title">Bird Quest</h1>
            <button className="start-button" onClick={handleStartClick}>
                Start
            </button>
        </div>
    );
};

export default StartPage;
