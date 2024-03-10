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

        // Preload character and enemy sprite sheets
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
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
        this.cameras.main.setZoom(4);

        // After creating all layers and entities, we set up collision handling
        this.setupCollisionHandling();

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
        this.playerStartX = 100;
        this.playerStartY = 400; // Adjust to be higher on the map
        this.player = new Player(this, this.playerStartX, this.playerStartY, 'cat-player');
        this.add.existing(this.player);
        this.physics.world.enable(this.player);
        this.player.setDepth(15);

        
        this.skellyStartX = 100;
        this.skellyStartY = 400; // Adjust to be higher on the map
        this.skelly = new Skelly(this, this.skellyStartX, this.skellyStartY, 'enemy-skull');
        this.add.existing(this.skelly);
        this.physics.world.enable(this.skelly);
        this.skelly.setDepth(15);

        console.log('Player Physics Body:', this.player.body);
        console.log('Skelly Physics Body:', this.skelly.body);
    }

    update(time, delta) {
        console.log('Player active:', this.player?.active, 'Skelly active:', this.skelly?.active);

        if (this.player && this.player.active) {
            this.player.update();
        }

        if (this.skelly && this.skelly.active) {
            this.skelly.update();
        } 

        if (this.skelly && !this.skelly.active && this.spawnPoints) {
            const spawnPoint = Phaser.Utils.Array.GetRandom(this.spawnPoints);
            this.skelly.respawn(spawnPoint.x, spawnPoint.y);
        } else if (!this.skelly.active) {
            console.warn('Skelly cannot respawn because spawnPoints are undefined');
        }
    }
}
