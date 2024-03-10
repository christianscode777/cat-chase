import * as Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, spriteSheetKey = 'cat-player') {
        super(scene, x, y, spriteSheetKey);

        // Arcade Physics body creation and configuration
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true); // Prevent player from going out of bounds
        this.body.setSize(this.frame.width, this.frame.height);
        this.body.setGravityY(300); // Set gravity specifically for the player 

        this.isAttacking = false;
        this.lives = 1;
        this.initPlayer();

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

    initPlayer() {
        this.lives = 1;
        this.isAttacking = false;
        this.clearTint();
    
        // Check if there is already a player instance and if it's not the current one
        if (this.scene.player && this.scene.player !== this) {
            console.log("Destroying previous player instance.");
            this.scene.player.destroy(); // Destroy the previous player instance
            this.scene.player.body = null; // Ensure to nullify the body reference to prevent shared body issue
        } else if (!this.scene.player) {
            console.log("No previous player instance found.");
        }
        
        this.scene.player = this; // Set the current player as the scene's player
    
        // Re-enable physics body in case it was destroyed earlier
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(this.frame.width, this.frame.height);
        this.body.setGravityY(300); 

        
    
        // Set up animations and other initial properties
        this.setupAnimations(); 

        console.log("Player Physics Body: ", this.body); 

        console.log('Player initialized with physics body:', this.body); 

        

    }

    setupAnimations() { 
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 0, end: 16 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 107, end: 110 }),
            frameRate: 5,
            repeat: 0 
        });

        // Add animations
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 48, end: 56 }),
            frameRate: 10,
            repeat: -1
        }); 

        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 172, end: 175 }),
            frameRate: 10,
            repeat: 0
        }); 

        this.scene.anims.create({
            key: 'dead',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 149, end: 157 }),
            frameRate: 10,
            repeat: 0
        }); 

        this.scene.anims.create({
            key: 'respawn',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 157, end: 166 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'uhoh',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 200, end: 203 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.play('run', true);

        // Listen for animation complete for 'attack' animation
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame) => {
            this.isAttacking = false; // Reset attacking state after animation completes
            if (anim.key === 'attack') {
                this.anims.play('idle', true);
            }
        }, this);
    }

    
    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.body.setVelocityX(0); // Stop player's movement
            this.play('attack', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                // Check if the enemy is within attack range
                let distanceToSkelly = Phaser.Math.Distance.Between(
                    this.x, this.y, 
                    this.scene.skelly.x, this.scene.skelly.y
                );
                if (distanceToSkelly < this.attackRange) {
                    this.scene.skelly.receiveDamage(1); // Deal damage to the enemy
                }
                this.isAttacking = false;
            });
        }
    }
    
    
    

    
    jump() {
        // Safety check before accessing this.body
        if (this.body && (this.body.touching.down || this.body.blocked.down)) {
            this.body.setVelocityY(-500); // Adjust velocity for jump height
            this.anims.play('jump');
        }
    }
    
    
    update() { 

        if (!this.body) console.error('Player physics body is undefined.');

        // Check for attack input
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.attack();
        }
    
        // Combined conditional check for this.body for both movement and jump input
        if (this.body) {
            let velocityX = 0;
    
            // Handle left/right movement
            if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
                velocityX = -160; // Adjust speed as needed
                this.flipX = true;
            } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
                velocityX = 160; // Adjust speed as needed
                this.flipX = false;
            }
    
            // Set velocity based on input
            this.body.setVelocityX(velocityX);
    
            // Play animations based on movement
            if (!this.isAttacking) {
                if (velocityX !== 0) {
                    this.anims.play('run', true);
                } else {
                    this.anims.play('idle', true);
                }
            }
    
            // Check for jump input
            if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)) {
                this.jump();
            } 

        }

        if (!this.body) {
            console.error("Player's physics body is undefined during update cycle.");
        }
    }
}    