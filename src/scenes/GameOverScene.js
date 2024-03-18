class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        // Display game over text
        this.add.text(100, 100, 'Game Over', { fontSize: '32px', fill: '#fff' });

        // Retry button
        this.add.text(100, 200, 'Retry', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene'));

        // Back to main menu button
        this.add.text(100, 300, 'Main Menu', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenuScene'));
    }
} 


export default GameOverScene; // Add this line to export the class
