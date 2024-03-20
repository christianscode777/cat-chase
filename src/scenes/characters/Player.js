import * as Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, spriteSheetKey = 'cat-player') {
        super(scene, x, y, spriteSheetKey);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(this.frame.width * 1, this.frame.height * 1); 
        this.body.setGravityY(300);
    
        this.isAttacking = false;
        this.lives = 3;
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
        this.lives = 3;
        this.isAttacking = false; 
        this.setDepth(25); // Reapply depth in case it's called outside of creation
        this.clearTint();
        this.scene.player = this;
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true); 
        this.body.setSize(this.frame.width, this.frame.height);
        this.body.setGravityY(500);
        this.setupAnimations();

        // Initialize the attack hitbox
        this.attackHitbox = this.scene.add.zone(this.x, this.y, 20, 10); // Define the size as needed
        this.scene.physics.world.enable(this.attackHitbox);
        this.attackHitbox.body.moves = false; 
        this.attackHitbox.setData('player', this);
        this.attackHitbox.setVisible(false); // Hitbox is invisible
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

        this.scene.anims.create({
            key: 'damage',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 148, end: 149 }), // Replace X and Y with appropriate frame numbers
            frameRate: 10,
            repeat: 0 // Play once
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
        if (!this.isAttacking && this.body) {
            this.isAttacking = true;
            this.play('attack', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.isAttacking = false;
                console.log('Attack animation completed'); // Confirming attack animation completion
            }); 

            console.log('Player object during attack:', this); // Log to see the properties of 'this' during attack
        
            // Position the attackHitbox relative to the player
            this.attackHitbox.setPosition(
                this.flipX ? this.x - 20 : this.x + 20,
                this.y
            );
            console.log('Attack hitbox positioned', this.attackHitbox.x, this.attackHitbox.y); // Logging hitbox position
        }
    }
    

    receiveDamage(damage) {
        this.lives -= damage;
        if (this.lives > 0) {
            this.play('damage', true);
        } else {
            this.play('dead', true).on('animationcomplete', () => {
                this.destroy();
            });
        }
        this.scene.updateSkellyCounter(this.lives); // Ensure you have a method to update enemy lives in your scene.
    }

    jump() {
        if (this.body && (this.body.touching.down || this.body.blocked.down)) {
            this.body.setVelocityY(-300);
            this.anims.play('jump');
        }
    }

    update() {
        if (!this.body) throw new Error("Player's physics body is undefined.");
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.attack();
        }
        let velocityX = 0;
        if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
            velocityX = -160;
            this.flipX = true;
        } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
            velocityX = 160;
            this.flipX = false;
        }
        this.body.setVelocityX(velocityX);
        if (!this.isAttacking) {
            this.anims.play(velocityX !== 0 ? 'run' : 'idle', true);
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)) {
            this.jump();
        }
    }
}