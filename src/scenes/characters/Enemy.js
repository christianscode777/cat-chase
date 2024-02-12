import Phaser from 'phaser';

    export default class Skelly extends Phaser.Physics.Matter.Sprite {
        static defeatedCount = 0; // Static property to keep track of defeated Skelly instances
    
        constructor(scene, x, y, spriteSheetKey = 'enemy-skull') {
            super(scene.matter.world, x, y, spriteSheetKey);
            this.lives = 1;
            this.isAttacking = false;
    
            const { Bodies } = Phaser.Physics.Matter.Matter;
            this.visionRange = 200; // Example range in pixels

            const width = this.frame.width;
            const height = this.frame.height;
            this.mainBody = Bodies.rectangle(this.x, this.y, width, height, { label: 'skelly' });
            this.setExistingBody(this.mainBody).setFixedRotation();
            
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
                frames: this.scene.anims.generateFrameNumbers('enemy-lol', { start: 0, end: 11 }),
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
                this.anims.play('enemy_dead', true).once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'enemy_dead', () => {
                    this.destroy(); // Destroy Skelly instance
                    Skelly.defeatedCount++; // Increment defeated Skelly count
                    Skelly.spawnStrongerSkelly(this.scene, this.x, this.y); // Spawn a stronger Skelly
                });
            }
            console.log(`Skelly received damage. Lives left: ${this.lives}`);
        }
    
        static spawnStrongerSkelly(scene, x, y) {
            const strengthMultiplier = 1 + Skelly.defeatedCount * 0.1; // Increase strength by 10% for each defeat
            const newSkelly = new Skelly(scene, x, y);
            newSkelly.lives = Math.ceil(newSkelly.lives * strengthMultiplier); // Increase lives based on strengthMultiplier
            scene.add.existing(newSkelly); // Add new Skelly to the scene
            console.log(`Spawned stronger Skelly with ${newSkelly.lives} lives.`);
        }
    
        update() {
            // Skelly behavior and AI logic goes here
            // This can include movement, attacking, etc.
            console.log('Skelly is updating');
        
    // Call the detectPlayer method every frame
    this.detectPlayer();
}
    
// Add a new method in Skelly class
detectPlayer() {
    const playerDistance = Phaser.Math.Distance.Between(
        this.x, this.y, 
        this.scene.player.x, this.scene.player.y
    );

    if (playerDistance <= this.visionRange && !this.isAwareOfPlayer) {
        this.isAwareOfPlayer = true; // Set a flag to ensure the animation plays only once
        this.play('enemy_react');
    }
}
}