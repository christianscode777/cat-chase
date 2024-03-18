import Phaser from 'phaser';

export default class Skelly extends Phaser.GameObjects.Sprite {
    static defeatedCount = 0; // Static property to keep track of defeated Skelly instances

    constructor(scene, x, y, spriteSheetKey = 'enemy-skull') {
        super(scene, x, y, spriteSheetKey);
        this.scene = scene;
        this.lives = 5; // Example starting lives
        this.isAttacking = false;
        this.isAwareOfPlayer = false; // Track player awareness

        // Arcade Physics body creation and configuration
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.8, this.height * 0.9);
        this.body.setOffset(0, 0);
        this.body.immovable = true;

        // Additional reference for documentation - not a real rename
        this.body1 = this.body;
        this.visionRange = 100; // Example range in pixels
        this.defineAnimations();
        this.play('enemy_idle');

        console.log('Skelly created at x:', x, 'y:', y);
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

    receiveDamage(damageAmount) {
        if (!this.active) {
            console.warn('Skelly instance is not active.');
            return;
        }
    
        // Subtract the specified damage amount from Skelly's lives
        this.lives -= damageAmount;
    
        if (this.lives > 0) {
            // Play the damage animation if Skelly is still alive
            this.play('enemy_damage', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                // Optional: Add any logic that should occur after the damage animation completes
            });
        } else {
            // Play the death animation if Skelly has no lives left
            this.play('enemy_dead', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                Skelly.defeatedCount++; // Increment the count of defeated Skellies
                this.setActive(false).setVisible(false); // Optionally deactivate and hide Skelly instead of destroying
                // Consider adding a respawn mechanism here if applicable
            });
        }
    }
    

    respawn(x, y) {
        // Reset properties for respawn
        this.setActive(true);
        this.setVisible(true);
        this.lives = 10; // Reset lives or any other properties as needed
        this.setPosition(x, y);
        this.play('enemy_idle');
    }

    // Assume methods for defining behavior (e.g., AI logic, movement, attacking) follow here

    update() {
        // Basic AI for patrolling within a defined range
        if (!this.isAwareOfPlayer) {
            this.patrol();
        }

        // Detect player proximity and react accordingly
        this.detectPlayer();
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
                this.scene.player.receiveDamage(.1); // Apply damage to the player
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
