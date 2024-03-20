import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import OpeningScene from './scenes/OpeningScene.js';

// Retrieve game dimensions from the HTML element
const gameContainer = document.getElementById('game-container');
const gameWidth = gameContainer.getAttribute('data-width');
const gameHeight = gameContainer.getAttribute('data-height');

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
            debug: true,
            gravity: { y: 300 }
        }
    },
    scene: [OpeningScene, MainMenuScene, MainScene, GameOverScene]
};

const game = new Phaser.Game(config);
