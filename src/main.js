import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 1 
            }
        }
    },
    scene: [MainScene],
    parent: 'game-container',
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
