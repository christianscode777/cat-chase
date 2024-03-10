import Phaser from 'phaser';

export default class Skelly extends Phaser.GameObjects.Sprite {
    static defeatedCount = 0; // Static property to keep track of defeated Skelly instances

    constructor(scene, x, y, spriteSheetKey = 'enemy-skull') {
        super(scene, x, y, spriteSheetKey);
        this.lives = 1;
        this.isAttacking = false;

        // Arcade Physics body creation and configuration
        scene.physics.world.enable(this);
        this.body.setSize(this.frame.width, this.frame.height);
        this.body.setOffset(0, 0); // Adjust if necessary to align sprite and physics body
        this.body.immovable = true; // Prevents the enemy from being pushed by other objects

        this.visionRange = 200; // Example range in pixels
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
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 30, end: 43 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'enemy_attack',
            frames: this.scene.anims.generateFrameNumbers('skull', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'enemy_damage',
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 25, end: 39 }),
            frameRate: 10,
            repeat: 0 // Play once
        });

        this.scene.anims.create({
            key: 'enemy_dead',
            frames: this.scene.anims.generateFrameNumbers('enemy-skull', { start: 0, end: 11 }),
            frameRate: 8,
            repeat: 0 // Play once
        });

        this.scene.anims.create({
            key: 'enemy_react',
            frames: this.scene.anims.generateFrameNumbers('skull-lol', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: 0 // Play once
        });
    }

    receiveDamage(damage) {
        this.lives -= damage;
    
        if (this.lives > 0) {
            this.play('enemy_damage', true);
        } else {
            this.play('enemy_dead', true).on('animationcomplete', () => {
                console.log('Skelly instance about to be destroyed', this);
                this.destroy();
            });
        }
    }
    

    // Assume methods for defining behavior (e.g., AI logic, movement, attacking) follow here

    update() {
        // Basic AI for patrolling within a defined range
        if (!this.isAwareOfPlayer) {
            this.patrol();
        }
    
        // Detect player proximity and react accordingly
        this.detectPlayer();
    
        // Additional logic based on game state or Skelly's current status
        if (this.isAttacking) {
            // Code to handle the attack animation and logic
            this.attackPlayer();
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
            this.play('enemy_walk', true);
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
        const playerDistance = Phaser.Math.Distance.Between(
            this.x, this.y, 
            this.scene.player.x, this.scene.player.y
        );
    
        if (!this.isAttacking && playerDistance <= this.attackRange) {
            this.isAttacking = true;
            this.play('enemy_attack', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                if (playerDistance <= this.attackRange) {
                    this.scene.player.receiveDamage(1); // Damage the player
                }
                this.isAttacking = false;
            });
        }
    }    
}    