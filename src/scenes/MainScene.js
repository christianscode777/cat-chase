import Player from '@characters/Player.js'; // Assuming the alias '@characters' is set in your Vite config
import Phaser from 'phaser';
import Skelly from '@characters/Enemy.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.tileLayer1 = null; // Define tileLayer1 in the constructor to make it available in other methods.
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'src/assets/maps/catmap1.json');
        this.load.image('MyTileset', 'src/assets/tilesets/MyTileset-1.png');
        this.load.image('farback', 'src/assets/tilesets/layers/country-platform-back.png');
        this.load.image('fog', 'src/assets/tilesets/fog.png'); // Preloading the corrected fog image

        // Preload 
        this.load.spritesheet('cat-player', 'src/assets/sprites/myCatSheet.png', {
            frameWidth: 28,
            frameHeight: 18
        });
        this.load.spritesheet('enemy-skull', 'src/assets/sprites/mySkullSheet.png', {
            frameWidth: 26,
            frameHeight: 32
        });
        this.load.spritesheet('skull', 'src/assets/sprites/skull-atk.png', {
            frameWidth: 43,
            frameHeight: 37
        });
        this.load.spritesheet('skellcount', 'src/assets/sprites/mySkellyCounter.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('skull-lol', 'src/assets/sprites/skull-react.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('skull-attack', 'src/assets/sprites/skull-atk.png', {
            frameWidth: 43,
            frameHeight: 37
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('MyTileset');
        const background = this.add.image(0, 0, 'farback').setOrigin(0, 0).setScrollFactor(1.00, 1.00);
        background.alpha = 0.71;

        const fartile = map.createLayer('fartile', tileset, 0, 0);
        fartile.setDepth(10);
        const tileLayer0 = map.createLayer('tileLayer0', tileset, 0, 0);
        tileLayer0.setDepth(10);

        const tileLayer1 = map.createLayer('tileLayer1', tileset, 0, 0);
        this.tileLayer1 = tileLayer1; // Assigning the local 'tileLayer1' to 'this.tileLayer1'
        this.tileLayer1.setCollisionByProperty({ isFloor: true });
        this.tileLayer1.setDepth(20); // This should only apply to 'this.tileLayer1'

        const tileLayer3 = map.createLayer('tileLayer3', tileset, 0, 0);
        tileLayer3.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        this.createEntities();

        this.physics.add.overlap(this.player, this.skelly, (player, skelly) => {
            if (!player.isAttacking && skelly.isAttacking) {
                player.receiveDamage(1); // Adjust the damage as needed.
            }
        }, null, this);

        this.setupCollisionHandling();

        this.setupCollisionAndOverlap();

        this.anims.create({
            key: 'skelly_life',
            frames: this.anims.generateFrameNumbers('skellcount', { start: 0, end: 2 }), // Assuming 3 frames for 3 lives
            frameRate: 1,
            repeat: 0
        });

        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
        this.cameras.main.setZoom(4);

        this.skellyCounter = this.add.sprite(50, 50, 'skellcount'); // Create the sprite
        this.skellyCounter.setScale(0.1); // Scale it down, adjust as necessary
        this.skellyCounter.setScrollFactor(0).setDepth(30); // Make sure it doesn't scroll with the camera

        this.spawnPoints = [
            { x: 100, y: 400 },
        ];

        // After creating all layers and entities, we set up collision handling


        this.physics.add.overlap(this.player, this.skelly, (player, enemy) => {
            if (player.isAttacking) {
                enemy.receiveDamage(1); // Assuming receiveDamage takes damage amount as an argument
            }
        }, null, this);

        this.playerHealthIcon = this.add.sprite(50, 50, 'skellcount').setScrollFactor(0).setDepth(30);
    }

    setupCollisionHandling() {
        // Now tileLayer1 is available here
        if (this.player && this.skelly) {
            this.physics.add.collider(this.player, this.skelly, this.handlePlayerEnemyCollision, null, this);
            this.physics.add.collider(this.player, this.tileLayer1); // Fixed scope issue here
            this.physics.add.collider(this.skelly, this.tileLayer1); // And here
            console.log('Collision handling set up correctly');
        }
    }

    setupCollisionAndOverlap() {
        // Player and Skelly overlap
        this.physics.add.overlap(this.player, this.skelly, (player, skelly) => {
            console.log('Overlap detected between player and Skelly');
            if (player.isAttacking) {
                console.log('Player attack should damage Skelly now');
                skelly.receiveDamage(1);
            }
        }, null, this);

        // Example collision with the world bounds or platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.skelly, this.platforms);

        console.log('Collision and overlap setup complete.');
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.isAttacking) {
            enemy.receiveDamage();
        }

        if (enemy.isAttacking) {
            player.receiveDamage();
        }
    }

    createEntities() {
        // Set higher starting Y positions for player and enemy
        this.playerStartX = 1000;
        this.playerStartY = 10; // Adjust to be higher on the map
        this.player = new Player(this, this.playerStartX, this.playerStartY, 'cat-player');
        this.add.existing(this.player);
        this.physics.world.enable(this.player);
        this.player.setDepth(15);

        this.skellyStartX = 1000;
        this.skellyStartY = 40; // Adjust to be higher on the map
        this.skelly = new Skelly(this, this.skellyStartX, this.skellyStartY, 'enemy-skull');
        this.add.existing(this.skelly);
        this.physics.world.enable(this.skelly);
        this.skelly.setDepth(15);

        console.log('Player Physics Body:', this.player.body);
        console.log('Skelly Physics Body:', this.skelly.body);
    }

    updateSkellyCounter(lives) {
        // Assuming the frame index is directly related to the number of lives (0 indexed)
        if (lives >= 0 && lives <= this.player.lives) {
            this.skellyCounter.setFrame(lives);
        } else {
            console.error('Invalid number of lives for skellyCounter update');
        }
    }

    update(time, delta) {
        super.update(time, delta); // Call parent update if needed

        // Update entities
        if (this.player && this.player.active) {
            this.player.update();
        }

        if (this.skelly && this.skelly.active) {
            this.skelly.update();
        }

        // Check for overlaps and ensure correct damage application
        this.physics.overlap(this.player, this.skelly, (player, skelly) => {
            if (player.isAttacking && !skelly.isAttacking) {
                skelly.receiveDamage(1);
                player.isAttacking = false;
            }
        });
    }
}
