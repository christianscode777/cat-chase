import Phaser from 'phaser';

export default class Skelly extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, spriteSheetKey = 'enemy-skull') {
        super(scene.matter.world, x, y, spriteSheetKey);

        // Use the spriteSheetKey for generating frame numbers
        const idleFrames = scene.anims.generateFrameNumbers(spriteSheetKey, { start: 28, end: 36 });
        const walkFrames = scene.anims.generateFrameNumbers(spriteSheetKey, { start: 43, end: 54 });
        const attackFrames = scene.anims.generateFrameNumbers(spriteSheetKey, { start: 12, end: 27 });
        const damageFrames = scene.anims.generateFrameNumbers(spriteSheetKey, { start: 37, end: 42 });
        const deadFrames = scene.anims.generateFrameNumbers(spriteSheetKey, { start:0, end: 11 });

        // Create animations
        this.createAnimation(scene, 'enemy_idle', idleFrames);
        this.createAnimation(scene, 'enemy_walk', walkFrames);
        this.createAnimation(scene, 'enemy_attack', attackFrames);
        this.createAnimation(scene, 'enemy_damage', damageFrames);
        this.createAnimation(scene, 'enemy_dead', deadFrames);

        // Start with the idle animation
        this.play('enemy_idle');

        // Set up the Matter body
            // Set up the Matter body
        const { Bodies } = Phaser.Physics.Matter.Matter;
        const width = this.frame.width;
        const height = this.frame.height;

        this.mainBody = Bodies.rectangle(this.x, this.y, width, height, { label: 'skelly' });
        this.setExistingBody(this.mainBody);
        this.setFixedRotation(); // Prevents the Skelly from rotating

    }

    createAnimation(scene, key, frames) {
        scene.anims.create({
            key,
            frames,
            frameRate: 10,
            repeat: -1
        });
    }

    update(player) {
        // Calculate the distance to the player
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const chaseThreshold = 150;
        const attackThreshold = 50; // The distance at which Skelly attacks 
        const velocityScale = 1;

        if (distance < chaseThreshold) {
            // Calculate the direction vector from the enemy to the player
            const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    
            // Move the enemy towards the player
            const velocity = direction.scale(velocityScale); // Use the velocityScale to slow down Skelly
            this.setVelocity(velocity.x, velocity.y);
    
            // Flip Skelly to face the player based on the direction
            this.setFlipX(this.x > player.x);
    
            // Check if we should be walking or attacking based on distance
            if (distance > attackThreshold) {
                this.anims.play('enemy_walk', true);
            } else {
                // Attack the player
                this.anims.play('enemy_attack', true);
                // Check for the specific attack frames and overlap with player
                if ([21, 22, 23].includes(this.anims.currentFrame.index)) {
                    const isCollidingWithPlayer = Phaser.Physics.Matter.Matter.SAT.collides(this.body, player.body).collided;
                    if (isCollidingWithPlayer) { 
                        console.log('Enemy should hit the player now!');
                        
                        player.die();
                    }
                }
                    
            }
        } else {
            // If the player is too far away, idle
            this.anims.play('enemy_idle', true);
            this.setVelocity(0, 0); // Stop moving
        }
    }
}
