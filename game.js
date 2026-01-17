// Letter Mystery Keyboard Game
// Players spell target words by clicking option images (always first letter)

class MysteryKeyboardGame extends Phaser.Scene {
    constructor() {
        super('MysteryKeyboardGame');
    }

    init(data) {
       
    }

    preload() {
        // Load levels data
        this.load.json('levels', 'levels.json');
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        
        // Load levels data
        this.levelsData = this.cache.json.get('levels');
        if (!this.levelsData || !this.levelsData.targets || !this.levelsData.options) {
            console.error('Failed to load levels data');
            return;
        }
        
        // Get current level
        if (this.currentLevelIndex >= this.levelsData.targets.length) {
            this.currentLevelIndex = 0; // Loop back to start
        }
        
        // Build current level from targets and options arrays
        this.currentLevel = this.buildLevel(this.currentLevelIndex);
        
        // Calculate layout areas based on CONFIG percentages
        const headerHeight = height * (CONFIG.HEADER_HEIGHT_PERCENT / 100);
        const answerHeight = height * (CONFIG.ANSWER_HEIGHT_PERCENT / 100);
        const optionsHeight = height * (CONFIG.OPTIONS_HEIGHT_PERCENT / 100);
        
        let currentY = 0;
        
        // Header area (Level X)
        this.createHeader(width, headerHeight, currentY);
        currentY += headerHeight;
        
        // Answer area (Target image + image cells)
        this.createAnswerArea(width, answerHeight, currentY);
        currentY += answerHeight;
        
        // Options area (Image grid)
        this.createOptionsArea(width, optionsHeight, currentY);
    }

}

// Export for use in other scenes
export default MysteryKeyboardGame;

const config = {
    type: Phaser.WEBGL,
    parent: 'game-container',
    transparent: true,
    scene: [MysteryKeyboardGame, WinScene],

    roundPixels: true,
    antialias: true,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
        resolution: window.devicePixelRatio || 1,
    },

    render: {
        antialiasGL: true,
        pixelArt: false,
    },
};

// Only create game instance if this is the main script
if (typeof window !== 'undefined' && !window.__LEVEL_VIEWER__) {
    const game = new Phaser.Game(config);
}
