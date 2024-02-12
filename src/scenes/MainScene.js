import Player from '@characters/Player.js'; // Assuming the alias '@characters' is set in your Vite config
import Phaser from 'phaser';
import Skelly from '@characters/Enemy.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' }); 

        this.playerStartX = 200;
        this.playerStartY = 110; 

        this.skellyStartX = 500;
        this.skellyStartY = 110;

    }

    preload() {
        // Existing assets
        this.load.tilemapTiledJSON('map', 'src/assets/maps/catmap1.json');
        this.load.image('MyTileset', 'src/assets/tilesets/MyTileset-1.png');
        this.load.image('farback', 'src/assets/tilesets/layers/country-platform-back.png');  
        this.load.image('fog.png', 'src/assets/tilesets/fog.png');

        // Preload character sprite sheet
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


    }

    create() {
        // Create the tile map
        const map = this.make.tilemap({ key: 'map' });

        // Add the tileset image
        const tileset = map.addTilesetImage('MyTileset');

        // Add the background layer with its parallax effect and opacity
        const background = this.add.image(0, 0, 'farback').setOrigin(0, 0).setScrollFactor(1.00, 1.00);
        background.alpha = 0.71; // Set the opacity of the background 

        const fartile = map.createLayer('fartile', tileset, 0, 0);
        const tileLayer0 = map.createLayer('tileLayer0', tileset, 0, 0);

        // Create the tile layers
        const tileLayer1 = map.createLayer('tileLayer1', tileset, 0, 0).setCollisionByProperty({ isFloor: true });
        this.matter.world.convertTilemapLayer(tileLayer1); // Enable physics interactions for tileLayer1  

        const floorTiles = map.getTilesWithin(0, 0, map.widthInPixels, map.heightInPixels).filter(
            tile => tile.properties.isFloor
        );

        // Create a Matter.js body for each floor tile
        floorTiles.forEach(tile => {
            this.matter.add.rectangle(tile.getCenterX(), tile.getCenterY(), tile.width, tile.height, {
                isStatic: true,
                label: "floor" // Optional label for better collision filtering
            });
        }); 

        const tileLayer3 = map.createLayer('tileLayer3', tileset, 0, 0);

        this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height);  

        this.player = new Player(this, this.playerStartX, this.playerStartY, 'cat-player');
        this.add.existing(this.player); 

        this.cameras.main.startFollow(this.player); 
        this.cameras.main.zoom = 4.5;

        // Create the skelly after the player
        this.skelly = new Skelly(this, this.skellyStartX, this.skellyStartY, 'enemy-skull');
        this.add.existing(this.skelly);


        
        // Collision detection setup
        this.setupCollisionHandling();
        
    } 

    respawnPlayer() {
        const startX = this.playerStartX;
        const startY = this.playerstartY;

        if (this.player) {
            this.player.destroy(); // Ensure no duplicate players
        }

        this.player = new Player(this, startX, startY, 'cat-player');
        this.add.existing(this.player);
    }

    setupCollisionHandling() {
        // Use MatterJS collision events to handle player-enemy collisions 
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            let playerBody, enemyBody;
            if (bodyA.label === 'player' && bodyB.label === 'skelly') {
                playerBody = bodyA; enemyBody = bodyB;
            } else if (bodyB.label === 'player' && bodyA.label === 'skelly') {
                playerBody = bodyB; enemyBody = bodyA;
            }
    
            if (playerBody && enemyBody) {
                // Handle the collision
                this.handlePlayerEnemyCollision(playerBody.gameObject, enemyBody.gameObject);
            }
        });
    } 

    handlePlayerEnemyCollision(player, enemy) {
        // Assume damage is dealt if the attacker is in the attacking state
        if (player.isAttacking) {
            enemy.receiveDamage();
        }
    
        if (enemy.isAttacking) {
            player.receiveDamage();
        }
    }
    

    update(time, delta) {
        // Update the player if it exists
        if (this.player) {
            this.player.update();
        }
    
        // Update skelly if it exists
        if (this.skelly) {
            this.skelly.update();
        }
    
        // Skelly Respawn Check
        if (this.skelly && !this.skelly.active) { 
            const spawnPoint = Phaser.Utils.Array.GetRandom(this.spawnPoints); // Assuming you have spawnPoints defined
            this.skelly.respawn(spawnPoint.x, spawnPoint.y);
        }
    }
}    



