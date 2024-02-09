import Player from '@characters/Player.js'; // Assuming the alias '@characters' is set in your Vite config
import Phaser from 'phaser';
import Skelly from '@characters/Enemy.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Existing assets
        this.load.tilemapTiledJSON('map', 'src/assets/maps/catmap1.json');
        this.load.image('MyTileset', 'src/assets/tilesets/MyTileset-1.png');
        this.load.image('background', 'src/assets/tilesets/mySky.png');
        this.load.image('tree1.png', 'src/assets/tilesets/tree1.png');
        this.load.image('tree2.png', 'src/assets/tilesets/tree2.png');
        this.load.image('fog.png', 'src/assets/tilesets/fog.png');

        // Preload character sprite sheet
        this.load.spritesheet('cat-player', 'src/assets/sprites/myCatSheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('enemy-skull', 'src/assets/sprites/mySkullSheet.png', {   
            frameWidth: 40,
            frameHeight: 40
        });
    }

    create() {
        // Create the tile map
        const map = this.make.tilemap({ key: 'map' });

        // Add the tileset image
        const tileset = map.addTilesetImage('MyTileset');

        // Add the background layer with its parallax effect and opacity
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(1.00, 2.20);
        background.alpha = 0.71; // Set the opacity of the background 

        const tree1 = this.add.image(0, 0, 'tree1.png').setOrigin(0, 0);
        const tree2 = this.add.image(0, 0, 'tree2.png').setOrigin(0, 0);

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

        // Enemy creation and frame arrays
        this.enemy = new Skelly(this, 495, 110, 'enemy-skull'); 
        this.add.existing(this.enemy);



        this.player = new Player(this, 480, 100, 'cat-run');

        this.add.existing(this.player);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(4); // Adjust this value to get the desired zoom level

        const tileLayer2 = map.createLayer('tileLayer2', tileset, 0, 0);
        const tileLayer3 = map.createLayer('tileLayer3', tileset, 0, 0).setCollisionByProperty({ isObstacle: true });

        // Add the fog layer with a parallax effect
        const fog = this.add.image(0, 0, 'fog.png').setOrigin(0, 0).setScrollFactor(0.90, 0.40);
    }

    update(time, delta) {
        this.player.update(); 
        this.enemy.update(this.player); 

        console.log(`Player Position: x=${this.player.x}, y=${this.player.y}`);
        console.log(`Enemy Position: x=${this.enemy.x}, y=${this.enemy.y}`);
    }
}
