import Phaser from 'phaser';

export default class Skelly extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, spriteSheetKey = 'enemy-skull') {
        super(scene.matter.world, x, y, spriteSheetKey);
        this.lives = 1;
        this.isAttacking = false;

        // Setup physics body
        const { Bodies } = Phaser.Physics.Matter.Matter;
        const width = this.frame.width;
        const height = this.frame.height;
        this.mainBody = Bodies.rectangle(this.x, this.y, width, height, { label: 'skelly' });
        this.setExistingBody(this.mainBody).setFixedRotation();

        // Animation setup
        this.defineAnimations();
        this.play('enemy_idle');

        console.log('Skelly created at x:', x, 'y:', y); 

        this.player = null;
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
    }  

   
    
    receiveDamage() {
        this.lives -= 1;
        if (this.lives > 0) {
            this.anims.stop(); // Stop any currently playing animation
            this.anims.play('enemy_damage', true);
        } else {
            this.anims.stop(); // Stop any currently playing animation
            if (this.isAttacking) {
                // Reset isAttacking flag and any delayed calls if enemy dies while attacking
                this.isAttacking = false;
                this.scene.time.removeAllEvents();
            }
            this.anims.play('enemy_dead', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'enemy_dead', () => {
                this.destroy(); // Destroy Skelly instance
            });
        }
    }
    
    update() {
        if (!this.player) return; // Make sure the player exists
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        const chaseThreshold = 100;
        const attackThreshold = 50; // The distance at which Skelly attacks
        const velocityScale = 1; // Adjust this to change the Skelly's speed
    
        if (distance < chaseThreshold) {
            // Calculate the direction vector from the enemy to the player
            const direction = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y).normalize();
            const velocity = direction.scale(velocityScale);
            this.setVelocity(velocity.x, velocity.y);
    
            // Flip Skelly to face the player based on the direction
            this.setFlipX(this.x > this.player.x);
    
            if (distance > attackThreshold) {
                this.anims.play('enemy_walk', true);
            } else {
                if (!this.isAttacking) {
                    this.anims.play('enemy_attack', true);
                    this.isAttacking = true;
                    this.scene.time.delayedCall(500, () => { this.isAttacking = false; }); // Reset attack state after delay
                }
            }
        } else {
            this.anims.play('enemy_idle', true);
            this.setVelocity(0, 0); // Stop moving
        }
    }
}    
