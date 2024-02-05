import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    
    preload() {
        this.load.tilemapTiledJSON('catmap1', 'src/assets/maps/catmap1.json');
    
        this.load.image('back2', 'src/assets/tilesets/back2.png');
        this.load.image('background_layer_2', 'src/assets/tilesets/background_layer_2.png');
        this.load.image('background_layer_3', 'src/assets/tilesets/background_layer_3.png');
        this.load.image('Fog2', 'src/assets/tilesets/Fog2.png');

        //this.load.spritesheet('playerIdle', 'assets/sprites/playerIdle.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        const map = this.make.tilemap({ key: 'catmap1' });   

        const tileset1 = map.addTilesetImage('myTileset');
        const tileset2 = map.addTilesetImage('myProps'); 
    }

    createCollidableObjects(objects) {
        objects.forEach(object => {
            // Check if the object has the 'isCollidable' property set to true
            if (object.properties.find(prop => prop.name === 'isCollidable' && prop.value === true)) {
                // Create a static rectangle body for this object
                // Note: Matter.js uses the center of the rectangle for x, y positions
                this.matter.add.rectangle(
                    object.x + object.width / 2, // X position
                    object.y + object.height / 2, // Y position
                    object.width, // Rectangle width
                    object.height, // Rectangle height
                    {
                        isStatic: true, // Make the body static
                        label: 'platform' // Optional: Label your platform for future reference
                    }
                );
            }
        });
    }

    update(time, delta) {
        // Game loop logic here.
    }
}

