import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, spriteSheetKey = 'cat-player') {
        super(scene.matter.world, x, y, spriteSheetKey);

        const { Bodies } = Phaser.Physics.Matter.Matter;
        const { width, height } = this.getBounds();

        this.mainBody = Bodies.rectangle(x, y, width, height, { label: 'player' });
        this.setFrictionAir(0.2);
        this.setExistingBody(this.body);
        this.setFixedRotation();    


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

        // In Player class
    initPlayer() {
        this.lives = 1;
        this.isAttacking = false;
        this.clearTint();

        // Improved check to prevent duplicate players
        if (this.scene.player && this.scene.player !== this) {
            this.scene.player.destroy();
        }
        this.scene.player = this;

        // Set up animations
        this.setupAnimations();
    }


    setupAnimations() { 
        
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('cat-player', { start: 0, end: 16 }),
            frameRate: 10,
            repeat: -1
        });

        // Jump animation
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

    receiveDamage() {
        this.lives -= 1;
        if (this.lives <= 0) {
            console.log('Player die method called.');
            this.anims.play('dead');
            this.setStatic(true);

            // Add a callback after the 'dead' animation to destroy and respawn
            this.scene.time.delayedCall(this.anims.currentAnim.msPerFrame * this.anims.currentAnim.frames.length, () => {
                this.destroy(); // Destroy the player instance

                // Respawn logic
                this.scene.respawnPlayer();
            });
        }
    }  

    

    attack() {
        if (!this.isAttacking) { // Prevent re-triggering attack if already attacking
            this.isAttacking = true;
            this.anims.stop();
            this.anims.play('attack', true).once('animationcomplete', () => {
                this.isAttacking = false; // Reset attack state after animation completes
            });
    
            // Create temporary attack hitbox (adjust offset and size as needed)
            const attackHitbox = this.scene.matter.add.rectangle(this.x + (this.flipX ? -30 : 30), this.y, 20, 10, { 
                isSensor: true, 
                label: 'playerAttack', // Label the hitbox for collision detection
                isStatic: true 
            });
    
            // Overlap Check - Adjusted to use the Matter.js collision system properly
            this.scene.matterCollision.addOnCollideStart({
                objectA: attackHitbox,
                objectB: this.scene.skelly.mainBody,
                callback: eventData => {
                  const { bodyA, bodyB } = eventData;
              
                  // Ensure bodyA is indeed the attack hitbox
                  if (bodyA.label === 'playerAttack' && bodyB.gameObject) {  
                    bodyB.gameObject.receiveDamage(this); // Damage the skelly
                  } 
                }
            });
              
    
            // Destroy the hitbox after a short delay to simulate attack duration
            this.scene.time.delayedCall(200, () => { 
                this.scene.matter.world.remove(attackHitbox); // Correctly remove hitbox from Matter world
            }, [], this); 
        }
    }
    

    jump() {
        this.setVelocityY(-10);
        this.anims.play('jump');
    } 

    update() {
        // Check if spacebar is pressed
        if (Phaser.Input.Keyboard.JustDown(this.keys.space))   { 
            this.attack();
        }
    
        // Then check for movement
        if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
            this.setVelocityX(-2.5);
            this.flipX = true;
            if (!this.isAttacking) { // Only play run animation if not attacking
                this.anims.play('run', true);
            }
        } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
            this.setVelocityX(2.5);
            this.flipX = false;
            if (!this.isAttacking) { // Only play run animation if not attacking
                this.anims.play('run', true);
            }
        } else {
            this.setVelocityX(0);
            if (!this.isAttacking) { // Only play idle animation if not attacking
                this.anims.play('idle', true);
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

