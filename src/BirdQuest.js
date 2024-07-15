import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import toast from 'react-hot-toast';
import GameOverModal from './GameOverModal'; // Import the modal component

const BirdQuest = () => {
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(15); // Timer starts at 30 seconds
    const [gameOver, setGameOver] = useState(false);
    const [gameEnded, setGameEnded] = useState(false); // Flag to check if game has ended
    const scoreRef = useRef(score); // Ref to hold the latest score
    const gameRef = useRef(null); // Ref to hold the Phaser game instance
    const [showModal, setShowModal] = useState(false); // Manage modal visibility

    // Function to reset the game
    const resetGame = () => {
        setScore(0); // Reset score
        setGameOver(false); // Set game over to false
        setGameEnded(false); // Reset the game ended flag
        setShowModal(false); // Hide the modal

        // Reset Phaser game
        if (gameRef.current) {
            gameRef.current.destroy(true);
            gameRef.current = null;
        }

        // Reinitialize the game
        const newConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            pixelArt: true // Optional: to keep the image quality
        };

        gameRef.current = new Phaser.Game(newConfig);
    };

    useEffect(() => {
        scoreRef.current = score; // Sync the ref with the latest score whenever score changes
    }, [score]);

    useEffect(() => {
        if (gameRef.current) return; // Skip if game is already initialized

        resetGame(); // Initialize the game

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    // Phaser scene methods
    function preload() {
        this.load.image('background', 'assets/BirdQuestForest.png');
        this.load.image('PigeonUp', 'assets/BirdUp.png');
        this.load.image('PigeonDown', 'assets/BirdDown.png');
        this.load.image('GreyUp', 'assets/GreyUp.png');
        this.load.image('GreyDown', 'assets/GreyDown.png');
        this.load.image('SwallowUp', 'assets/SwallowUp.png');
        this.load.image('SwallowDown', 'assets/SwallowDown.png');
        this.load.image('BlackBirdUp', 'assets/BlackBirdUp.png');
        this.load.image('BlackBirdDown', 'assets/BlackBirdDown.png');
        this.load.image('DoveUp', 'assets/DoveUp.png');
        this.load.image('DoveDown', 'assets/DoveDown.png');
    }

    function create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Define birds with point values
        const birds = [
            { key: 'Pigeon', up: 'PigeonUp', down: 'PigeonDown', speed: 7, points: 7 },
            { key: 'Jay', up: 'GreyUp', down: 'GreyDown', speed: 8, points: 6 },
            { key: 'Swallow', up: 'SwallowUp', down: 'SwallowDown', speed: 12, points: 10 },
            { key: 'BlackBird', up: 'BlackBirdUp', down: 'BlackBirdDown', speed: 5, points: 4 },
            { key: 'Dove', up: 'DoveUp', down: 'DoveDown', speed: 3, points: 2 }
        ];

        birds.forEach(bird => {
            const birdSprite = this.add.sprite(this.sys.game.config.width, Phaser.Math.Between(0, this.sys.game.config.height), bird.down)
                .setInteractive()
                .setScale(0.5);

            this.anims.create({
                key: `${bird.key}Flap`,
                frames: [
                    { key: bird.up },
                    { key: bird.down }
                ],
                frameRate: 10,
                repeat: -1 // Loop indefinitely
            });

            birdSprite.play(`${bird.key}Flap`);

            // Track whether the bird has been clicked
            birdSprite.clicked = false;

            birdSprite.on('pointerdown', () => {
                if (!gameOver && !birdSprite.clicked) {
                    birdSprite.clicked = true; // Mark the bird as clicked
                    takePhoto.call(this, bird.key, bird.points);
                }
            });

            bird.sprite = birdSprite;
            bird.speed = bird.speed;
            bird.points = bird.points; // Add point value to the bird object
        });

        this.birds = birds;

        // Set the custom cursor
        this.input.setDefaultCursor('url(/assets/Camera.png), pointer');
    }

    function update() {
        if (gameOver) return;

        this.birds.forEach(bird => {
            bird.sprite.x -= bird.speed; // Move left by decreasing x position based on speed
            if (bird.sprite.x < -bird.sprite.width) {
                // Reset bird position and mark it as not clicked
                bird.sprite.x = this.sys.game.config.width;
                bird.sprite.y = Phaser.Math.Between(0, this.sys.game.config.height);
                bird.sprite.clicked = false;
            }
        });
    }

    function takePhoto(birdKey, points) {
        const birdName = birdKey.charAt(0).toUpperCase() + birdKey.slice(1).replace('bird', ' Bird');
        const currentScore = scoreRef.current;
        setScore(currentScore + points);

        let message = `Photo taken of a ${birdName}!`;
        if (points >= 8) {
            message += " Wow! That's a fast one!";
        } else if (points >= 5) {
            message += " Great job!";
        } else if (points >= 1) {
            message += " Nice catch!";
        } else {
            message += " Good try!";
        }

        // Show toast notification for 3 seconds (3000ms)
        toast(message, {
            duration: 3000, // Duration in milliseconds
            position: 'top-left', // Position of the toast
            style: {
                background: '#333',
                color: '#fff',
                padding: '10px',
                borderRadius: '5px'
            }
        });
    }

    // Timer logic
    useEffect(() => {
        if (gameOver) return;

        const timerInterval = setInterval(() => {
            if (gameOver) {
                clearInterval(timerInterval);
                return;
            }

            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    // Timer has finished
                    if (!gameEnded) {
                        // Show modal when time is up
                        setShowModal(true);
                        setGameEnded(true); // Set flag to true
                        setGameOver(true); // End the game
                    }
                    return 0; // Stop the timer
                }
                return prevTimer - 1;
            });
        }, 1000); // Update every second

        return () => clearInterval(timerInterval); // Clean up timer on component unmount
    }, [gameOver, gameEnded]); // Depend on gameOver and gameEnded to reset the game properly

    return (
        <div>
            <div id="phaser-game" />
            <h2 style={{ textAlign: 'center' }}>Score: {score}</h2>
            <h3 style={{ textAlign: 'center' }}>Time Remaining: {timer} seconds</h3>
            {showModal && <GameOverModal score={score} />}
        </div>
    );
};

export default BirdQuest;
