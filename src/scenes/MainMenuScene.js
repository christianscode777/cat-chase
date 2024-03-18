class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Display title
        this.add.text(100, 100, 'Cat vs. God', { fontSize: '32px', fill: '#fff' });

        // Start game button
        this.add.text(100, 200, 'Start Game', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene'));
        
        // Any other buttons (like settings, credits, etc.) can be added similarly
    }
}


export default MainMenuScene; // Add this line to export the class