import Phaser from 'phaser';
import MainScene from '@/scenes/MainScene.js'; // Adjust the import path as necessary
import GameOverScene from '@/scenes/GameOverScene.js'; // Ensure you have this file in your scenes directory
import MainMenuScene from '@/scenes/MainMenuScene.js'; // Ensure you have this file in your scenes directory

const gameWidth = 800;
const gameHeight = 450;

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // Adjust according to your needs (true for development, false for production)
            gravity: { y: 300 } // Adjust gravity as needed for your game
        }
    },
    scene: [MainMenuScene, MainScene, GameOverScene] // Include all your scenes here
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
