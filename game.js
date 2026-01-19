// Main game configuration for Mystery Keyboard

const config = {
    type: Phaser.WEBGL,
    parent: 'game-container',
    transparent: true,
    scene: [GameScene, WinScene],

    roundPixels: true,
    antialias: true,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // Portrait orientation for Poki mobile
        width: 720,
        height: 1280,
        resolution: window.devicePixelRatio || 1,
    },

    render: {
        antialiasGL: true,
        pixelArt: false,
    },
};

// Create game instance
const game = new Phaser.Game(config);
