import Phaser from 'phaser';
import MainScene from '@/scenes/MainScene.js'; // Adjust the import path as necessary

const gameWidth = 800;
const gameHeight = 450;

const config = {
    width: gameWidth,
    height: gameHeight,
    backgroundColor: '#000000',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, // Turn off debug mode for production
            gravity: { y: 300 } // Adjust gravity as needed for your game
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
