import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Tilemaps
        this.load.tilemapTiledJSON('map', 'src/assets/maps/catmap1.json');
        
        // Tilesets
        this.load.image('MyTileset', 'src/assets/tilesets/MyTileset-1.png');
        this.load.image('farback', 'src/assets/tilesets/layers/country-platform-back.png');
        this.load.image('fog', 'src/assets/tilesets/fog.png');
    
        // Spritesheets
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
        this.scene.start('MainScene');
    }
}
