import Phaser from 'phaser';
import Player from '@characters/Player.js'; 
import Skelly from '@characters/Enemy.js';
import Coin from '@/scenes/characters/Coin.js'; // If Coin.js is

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.tileLayer1 = null; 
        this.coinCounter = 0;
    }

    preload() { 
        this.load.audio('gameMusic', 'src/assets/gameMusic.wav');
        this.load.tilemapTiledJSON('map', 'src/assets/maps/catmap1.json');
        this.load.image('MyTileset', 'src/assets/tilesets/MyTileset-1.png');
        this.load.image('farback', 'src/assets/tilesets/layers/country-platform-back.png');
        this.load.image('fog', 'src/assets/tilesets/fog.png');

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
        this.load.spritesheet('coin', 'src/assets/sprites/coin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // Initialize background music and map as before
        this.backgroundMusic = this.sound.add('gameMusic', { loop: true });
        this.backgroundMusic.play();
        
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('MyTileset');
        const background = this.add.image(0, 0, 'farback').setOrigin(0, 0).setScrollFactor(1.00, 1.00);
        background.alpha = 0.71;

        const fartile = map.createLayer('fartile', tileset, 0, 0);
        fartile.setDepth(10);
        const tileLayer0 = map.createLayer('tileLayer0', tileset, 0, 0);
        tileLayer0.setDepth(10);

        const tileLayer1 = map.createLayer('tileLayer1', tileset, 0, 0);
        this.tileLayer1 = tileLayer1;
        this.tileLayer1.setCollisionByProperty({ isFloor: true });
        this.tileLayer1.setDepth(25);

        const tileLayer3 = map.createLayer('tileLayer3', tileset, 0, 0);
        tileLayer3.setDepth(10); 

        this.anims.create({
            key: 'skellcountT',
            frames: this.anims.generateFrameNumbers('skellcount', { 
                start: 0, 
                end: 9 
            }),
            frameRate: 10,
            repeat: -1 // '-1' for indefinite looping
        });

        // Adjusting skellyCounter properties to not interfere with gameplay
        this.skellyCounter = this.add.sprite(this.sys.game.config.width / 2, 0, 'skellcount');
        this.skellyCounter.setScale(0.1); // Adjust scale to be unobtrusive
        this.skellyCounter.setScrollFactor(0); // Ensure it doesn't scroll with the camera
        this.skellyCounter.setDepth(26); // Ensure it's above gameplay elements
        this.skellyCounter.play('skellcountT'); 

        this.coins = this.physics.add.group({
            classType: Coin,
            runChildUpdate: true // Automatically calls update on each child in the group
        });                                                    

        this.physics.add.collider(this.coins, this.tileLayer1);

        // Create the player and skelly before adding colliders...
        this.player = new Player(this, 100, 100, 'cat-player');
        this.add.existing(this.player);
        this.physics.world.enable(this.player);
        this.player.setDepth(25);  

        // Add or adjust this in the create method of MainScene.js
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(3.5); // Adjust the zoom level according to your game's needs


        this.skelly = new Skelly(this, 400, 100, 'enemy-skull');
        this.add.existing(this.skelly);
        this.physics.world.enable(this.skelly);
        this.skelly.setDepth(25);

        // Setup collision and overlap checks...
        this.physics.add.collider(this.player, this.tileLayer1);
        this.physics.add.collider(this.skelly, this.tileLayer1);
        this.physics.add.overlap(this.player.attackHitbox, this.skelly, this.playerAttackHandler, null, this); 
        
        
    } 

    collectCoin(player, coin) {
        // Increment coin counter and handle the logic for when a coin is collected
        this.coinCounter++;
        // Update UI or coin counter display here if necessary
        coin.collect(); // This should handle destroying the coin and any other cleanup
    }
    

    // In MainScene.js:
    playerAttackHandler(hitbox, enemy) {
        // Access the player reference from the hitbox data
        const player = hitbox.getData('player');
        console.log('Player object in handler:', player); // This should now log the Player instance

        // Now use the isAttacking property from the actual player object
        if (player && player.isAttacking) {
            console.log('Player is attacking, applying damage to enemy');
            enemy.receiveDamage(1);
        } else {
            console.log('Player is not in attacking state when overlap detected');
        }
    }


    handlePlayerEnemyCollision(player, enemy) {
        if (this.player && this.skelly) {
            this.physics.add.collider(this.player, this.tileLayer1);
            this.physics.add.collider(this.skelly, this.tileLayer1);
            console.log('Collision handling set up correctly');
        }
    } 

    // MainScene.js - Method for spawning new Skelly instances

    
    


    update() {
        // Incorporate your original update logic with the new attacking condition
        // Handle player inputs and updates
        if (this.player) {
            this.player.update();
        }

        // Handle enemy updates
        if (this.skelly) {
            this.skelly.update();
        } 
        
        this.coins.getChildren().forEach((coin) => {
            coin.update();
        });
    }
}