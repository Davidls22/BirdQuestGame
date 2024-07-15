import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './StartPage.css'; // Import the CSS for styling

const GameOverModal = ({ score }) => {
    const navigate = useNavigate(); // Initialize navigate

    const handleRestart = () => {
        // Navigate to the StartPage
        navigate('/');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h1 className="modal-title">Game Over</h1>
                <p className="modal-score">Final Score: {score}</p>
                <button className="modal-button" onClick={handleRestart}>Restart</button>
            </div>
        </div>
    );
};

export default GameOverModal;
