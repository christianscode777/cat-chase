import Phaser from 'phaser'; 
// Correct import statement if Coin.js is in the same directory as Enemy.js
import Coin from './Coin.js';





export default class Skelly extends Phaser.GameObjects.Sprite {
    static defeatedCount = 0; // Keep track of defeated Skelly instances

    constructor(scene, x, y, spriteSheetKey = 'enemy-skull') {
        super(scene, x, y, spriteSheetKey);
        this.scene = scene;
        this.lives = 5;
        this.isAttacking = false;
        this.isAwareOfPlayer = false;

        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setOffset(0, 0);
        this.body.immovable = true;

        this.visionRange = 100;
        this.defineAnimations();
        this.play('enemy_idle');
        this.state = 'idle'; // Initial state
        this.previousState = null;
    }

    defineAnimations() {
        this.scene.anims.create({
            key: 'enemy_idle',
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 12, end: 24 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'enemy_walk',
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 30, end: 41 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'enemy_attack',
            frames: this.scene.anims.generateFrameNumbers('skull-attack', { start: 0, end: 9 }),
            frameRate: 5,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'enemy_damage',
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 25, end: 29  }),
            frameRate: 5,
            repeat: 0 // Play once
        });

        this.scene.anims.create({
            key: 'enemy_dead',
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: 0 // Play once
        });

        this.scene.anims.create({
            key: 'enemy_react',
            frames: this.scene.anims.generateFrameNumbers('skull-lol', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0 // Play once
        });
    }


    

    respawn(x, y) {
        this.setActive(true).setVisible(true);
        this.lives = 5; // Reset lives
        this.setDepth(25);
        this.setPosition(x, y); 
        this.play('enemy_idle');
    }

    update() {
        switch (this.state) {
            case 'idle':
                if (!this.isAwareOfPlayer) {
                    this.patrol();
                } else {
                    this.detectPlayer();
                }
                break;
            case 'attacking':
                this.attackPlayer();
                break;
            case 'takingDamage':
                // Special handling for taking damage if needed
                break;
            case 'dead':
                // Perhaps a separate method to handle post-death logic
                break;
        }
    }

    setState(newState) {
        if (this.state !== newState) {
            this.previousState = this.state;
            this.state = newState;
            this.onStateChange();
        }
    } 

    onStateChange() {
        switch (this.state) {
            case 'idle':
                this.play('enemy_idle', true);
                break;
            case 'attacking':
                // Attacking logic should be here.
                break;
            case 'takingDamage':
                this.play('enemy_damage', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    // Return to previous state or decide next state based on context.
                    this.setState(this.previousState);
                });
                break;
            case 'dead':
                this.play('enemy_dead', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    // Drop a coin at Skelly's position.
                    let coin = new Coin(this.scene, this.x, this.y + 16);
                    this.scene.coins.add(coin);
                    
                    // Set inactive and invisible before destroying to prevent further updates.
                    this.setActive(false).setVisible(false);
                    
                    this.destroy();
                    Skelly.defeatedCount++;
                });
                break;
        }
    }
    
    

    receiveDamage(damageAmount) {
        if (!this.active || this.state === 'dead') return;
        
        this.lives -= damageAmount;
    
        if (this.lives <= 0) {
            this.setState('dead');
            // You no longer need to call play('enemy_dead') here as it's being handled in onStateChange() when the state is set to 'dead'.
        } else {
            this.setState('takingDamage');
            // 'takingDamage' state will play the 'enemy_damage' animation via onStateChange() method.
        }
    }
    

    patrol() {
        // Example patrol behavior: move back and forth within a range
        if (!this.patrolBounds) {
            this.patrolBounds = { left: this.x - 100, right: this.x + 100 };
            this.patrolDirection = 1;
        }

        if (this.x <= this.patrolBounds.left) {
            this.patrolDirection = 1;
            this.flipX = false; // Assuming flipX = false faces the enemy to the right
        } else if (this.x >= this.patrolBounds.right) {
            this.patrolDirection = -1;
            this.flipX = true; // Flip sprite to face left
        }

        this.body.setVelocityX(this.patrolDirection * 60); // Adjust speed as needed
        if (!this.isAttacking) {
            this.play('enemy_attack', true);
        }
    }

    detectPlayer() {
        const playerDistance = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.scene.player.x, this.scene.player.y
        );

        // Adjust vision range and reaction based on game design
        if (playerDistance <= this.visionRange && !this.isAttacking) {
            // Example reaction: chase the player
            this.isAwareOfPlayer = true;
            this.chasePlayer();
        } else {
            this.isAwareOfPlayer = false;
        }
    }

    chasePlayer() {
        const direction = this.scene.player.x < this.x ? -1 : 1;
        this.body.setVelocityX(direction * 10); // Adjust chasing speed as needed
        this.flipX = direction < 0; // Flip sprite based on player's position
        this.play('enemy_walk', true);
    }

    attackPlayer() {
        if (!this.isAttacking && !this.attackCooldown) {
            this.isAttacking = true;
            this.attackCooldown = true; // Put Skelly on cooldown
            this.play('enemy_attack', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.scene.player.receiveDamage(1); // Apply damage to the player
                this.isAttacking = false;
                this.play('enemy_idle'); // Return to idle state
            });

            // Set a delay for the attack cooldown (30 seconds = 30000 milliseconds)
            this.scene.time.addEvent({
                delay: 30000,
                callback: () => {
                    this.attackCooldown = false; // Allow Skelly to attack again
                },
                callbackScope: this
            });
        }
    }
}
