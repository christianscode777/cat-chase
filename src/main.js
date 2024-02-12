import Phaser from 'phaser';
import MatterCollisionPlugin from 'phaser-matter-collision-plugin'; 

import MainScene from '@/scenes/MainScene.js'; 

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
        default: 'matter',
        matter: {
            debug: true, // Turn off debug mode for production
            gravity: {
                y: 2
            }
        }
    },
    scene: [MainScene], 
    plugins: {
        scene: [
            {
                plugin: MatterCollisionPlugin, 
                key: 'matterCollision', 
                mapping: 'matterCollision' 
            }
        ]
    }
};

const game = new Phaser.Game(config); 

window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
}); 
