class OpeningScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OpeningScene' });
    }

    preload() {
        this.load.video('openingVideo', 'src/assets/gameintro.mp4', 'loadeddata', false, true);
    }

    create() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Placeholder text to indicate loading, replace as needed
        let loadingText = this.add.text(gameWidth / 2, gameHeight / 2, 'Loading...', {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Video element added off-screen initially
        let video = this.add.video(gameWidth / 2, gameHeight / 2, 'openingVideo');
        video.setOrigin(0.5, 0.5);

        // Make video interactive and mute it initially
        video.setInteractive();
        video.setMute(true);

        // Listener to start the video on user interaction
        this.input.once('pointerdown', () => {
            loadingText.setVisible(false); // Hide loading text
            video.play();
            video.setMute(false); // Unmute video after starting to play
        });

        // Optionally, directly transition after the video ends
        video.on('complete', () => {
            this.scene.start('MainMenuScene');
        });
    }
}



export default OpeningScene;
