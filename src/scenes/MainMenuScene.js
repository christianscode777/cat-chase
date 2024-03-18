// /src/scenes/MainMenuScene.js
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        
        // Centering and setting the font size for "Cat vs. God"
        this.add.text(gameWidth / 2, 100, 'Cat vs. God', { 
            fontSize: '42px',
            fill: '#fff', 
            fontFamily: 'Foldit'
        }).setOrigin(0.5);

        // Positioning the "Start Game" button closer to the bottom of the scene
        const startGameButtonY = gameHeight - 100;
        const startGameButtonText = this.add.text(gameWidth / 2, startGameButtonY, 'Start Game', { 
            fontSize: '24px', 
            fill: '#fff',
            fontFamily: 'Foldit'
        }).setOrigin(0.5).setInteractive();

        // Recalculating the button's rectangle bounds for the new position
        const padding = 10;
        const rect = new Phaser.Geom.Rectangle(
            startGameButtonText.x - startGameButtonText.width / 2 - padding,
            startGameButtonText.y - startGameButtonText.height / 2 - padding / 2,
            startGameButtonText.width + padding * 2,
            startGameButtonText.height + padding
        );

        // Creating the rectangle with a thinner line and deep purple color
        const graphics = this.add.graphics().lineStyle(1, 0x8e44ad).strokeRectShape(rect); // Deep purple color and thinner line

        // Updating interaction events for the new button appearance
        startGameButtonText
            .on('pointerover', () => graphics.lineStyle(2, 0x8e44ad).strokeRectShape(rect)) // Making border slightly thicker on hover
            .on('pointerout', () => graphics.lineStyle(1, 0x8e44ad).strokeRectShape(rect)) // Reverting to thinner border
            .on('pointerdown', () => {
                graphics.lineStyle(2, 0x8e44ad).strokeRectShape(rect); // Keeping it slightly thicker when clicked
                this.scene.start('MainScene');
            });
    }
}

export default MainMenuScene;
