import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, spriteSheetKey = 'cat-run') {
        super(scene.matter.world, x, y, spriteSheetKey);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Destructure Matter classes
        const { width, height } = this.getBounds();

        // Assuming width and height are defined or calculated based on the sprite
        this.body = Bodies.rectangle(x, y, width, height, { label: 'player' });
        this.setFrictionAir(0.2); // Use this method on the instance, not on the Body class
        this.setExistingBody(this.body);
        this.setFixedRotation(); // Prevents the player from rotating 
        

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('cat-idle', { start: 0, end: 4 }), // Adjust frame numbers
            frameRate: 10,
            repeat: -1
        });

        // Jump animation
        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers('cat-jump', { start:0, end: 6 }), // Assuming a single frame for jump
            frameRate: 10
        });

        // Initially, play the idle animation
        this.anims.play('idle', true);

        // Add animations (assuming you have them loaded in your scene's preload method)
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('cat-runstart', { start: 0, end: 4 }), // Adjust frame numbers
            frameRate: 10,
            repeat: -1
        });

        this.anims.play('run', true);

        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            arrowUp: Phaser.Input.Keyboard.KeyCodes.UP
        });
    }

    jump() {
        if (this.body.touching.down) {
            this.setVelocityY(-5);
            this.anims.play('jump');
        }
    }

    update() {
        if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
            this.setVelocityX(-5);
            this.flipX = true;
            this.anims.play('run', true);
        } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
            this.setVelocityX(5);
            this.flipX = false;
            this.anims.play('run', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('idle', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)) {
            this.jump();
        }
    }
}
    