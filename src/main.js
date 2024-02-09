import Phaser from 'phaser';
import MainScene from '@/scenes/MainScene.js';

const gameWidth = 800; // Wider aspect ratio
const gameHeight = 450; // Proportionate height for the game

const config = {
  width: gameWidth,
  height: gameHeight,
  backgroundColor: '#000000',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // Ensures the game fits and centers on the screen
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: {
        y: 1
      }
    }
  },
  scene: [MainScene],
};

const game = new Phaser.Game(config);

// Optional: Adjust resize logic if needed
window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
