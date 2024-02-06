import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'src/assets/maps/catmap1.json');
        this.load.image('MyTileset', 'src/assets/tilesets/MyTileset-1.png');
        
        // Preload layer images
        this.load.image('background', 'src/assets/tilesets/mySky.png');
        this.load.image('tree1.png', 'src/assets/tilesets/tree1.png');
        this.load.image('tree2.png', 'src/assets/tilesets/tree2.png');
        

      
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
         const tileLayer0 = map.createLayer('tileLayer0', tileset, 0, 0);
         const tileLayer1 = map.createLayer('tileLayer1', tileset, 0, 0);
         const tileLayer2 = map.createLayer('tileLayer2', tileset, 0, 0);
         const tileLayer3 = map.createLayer('tileLayer3', tileset, 0, 0);
    
        // Add the fog layer with a parallax effect
        const fog = this.add.image(0, 0, 'fog').setOrigin(0, 0).setScrollFactor(0.90, 0.40);
    
        // Set the camera bounds to be the size of the map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {
        // Game loop logic here.
    }
}


