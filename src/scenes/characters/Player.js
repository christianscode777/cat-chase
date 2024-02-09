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
        
        this.lives = 3; // Or h owever many lives you want the player to have
        
        


        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 0, end: 8}), // Adjust frame numbers
            frameRate: 10,
            repeat: -1
        });

        // Jump animation
        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start:106, end: 113 }), // Assuming a single frame for jump
            frameRate: 2,
            repeat: 0 
        });

        // Initially, play the idle animation
        this.anims.play('idle', true);

        // Add animations (assuming you have them loaded in your scene's preload method)
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 32, end: 47 }), // Adjust frame numbers
            frameRate: 10,
            repeat: -1
        }); 


        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 312, end: 315 }), // Adjust frame numbers
            frameRate: 10,
            repeat: 0
        }); 

        this.scene.anims.create({
            key: 'dead',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 248, end: 255 }), // Adjust frame numbers
            frameRate: 10,
            repeat: 0
        }); 

        this.scene.anims.create({
            key: 'respawn',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 272, end: 279 }), // Adjust frame numbers
            frameRate: 10,
            repeat: 0
        }); 
        

        this.anims.play('run', true);

        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
            attack: Phaser.Input.Keyboard.KeyCodes.Z,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        
    }

    jump() {
        
            this.setVelocityY(-5);
            this.anims.play('jump');
        
    } 

    die() {
        console.log('Player die method called.');
        // Play the 'dead' animation
        this.anims.play('dead');
        
        // Disable player input and physics while the death animation plays
        this.setStatic(true); // For Matter.js, setStatic makes the body immovable and not react to collisions
    
        // After the death animation is done, we'll respawn the player
        this.scene.time.delayedCall(this.anims.currentAnim.msPerFrame * this.anims.currentAnim.frames.length, () => {
            // Reduce lives count
            this.lives -= 1;
            
            if (this.lives > 0) {
                // Reset the player position and make it dynamic again
                this.setPosition(480, 100); // Original spawn point
                this.setStatic(false);
                this.anims.play('respawn');
            } else {
                // Handle game over logic
                console.log('Game Over!');
                this.scene.scene.restart(); // This restarts the current scene, resetting the game.
            }
        });
    }


    update() {
        // Check if spacebar is pressed
        if (Phaser.Input.Keyboard.JustDown(this.keys.space))   { 
            this.anims.stop();
            this.anims.play('attack', true);
        }
    
        // Then check for movement
        if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
            this.setVelocityX(-2.5);
            this.flipX = true;
            if (!Phaser.Input.Keyboard.JustDown(this.keys.attack) && !Phaser.Input.Keyboard.JustDown(this.keys.space))  { // Only play run animation if not attacking
                this.anims.play('run', true);
            }
        } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
            this.setVelocityX(2.5);
            this.flipX = false;
            if (!Phaser.Input.Keyboard.JustDown(this.keys.attack) && !Phaser.Input.Keyboard.JustDown(this.keys.space)) { // Only play run animation if not attacking
                this.anims.play('run', true);
            }
        } else {
            this.setVelocityX(0);
            if (!Phaser.Input.Keyboard.JustDown(this.keys.attack) && !Phaser.Input.Keyboard.JustDown(this.keys.space)) { // Only play idle animation if not attacking
                if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'attack') { // Only play idle animation if attack animation is not playing
                    this.anims.play('idle', true);
                }
            }
        }
      
        if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)) {
            this.jump();
        }
        
        if (this.anims.currentAnim && this.anims.currentAnim.key === 'dead') {
            return;
        }
    }
    
}

