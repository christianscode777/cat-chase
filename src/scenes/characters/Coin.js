// Coin.js
import Phaser from 'phaser';

export default class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'coin');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this); 
        
        this.setDepth(25);
        this.body.setGravityY(-200); // Negative gravity to simulate the coin popping out of the Skelly
        this.body.setBounce(0.5); // A bit of a bounce effect
        this.body.setCollideWorldBounds(true);

        this.collected = false;

        this.defineAnimations();
        this.play('spin');
    }

    defineAnimations() {
        this.scene.anims.create({
            key: 'spin',
            frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 12 }),
            frameRate: 10,
            repeat: -1
        });
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            this.scene.coinCounter++; // Assuming you have a coinCounter variable in your scene
            console.log(`Coins collected: ${this.scene.coinCounter}`);
            this.destroy();
        }
    }

    update() {
        if (!this.collected) {
            this.scene.physics.overlap(this.scene.player, this, () => {
                this.collect();
            });
        }
    }
}




