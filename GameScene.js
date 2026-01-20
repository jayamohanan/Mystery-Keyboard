// GameScene.js - Main scene for Mystery Keyboard game

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        // Load saved level progress or use provided level
        if (data.levelIndex !== undefined) {
            this.currentLevelIndex = data.levelIndex;
        } else {
            this.currentLevelIndex = this.loadLevelProgress();
        }
    }

    preload() {
        // Load levels data
        this.load.json('levels', 'levels.json');
        
        // Load backspace image
        this.load.svg('backspace', 'graphics/backspace.svg', { scale: 1 });
        
        // Load restart button image
        this.load.image('undo', 'graphics/undo.png');
        
        // Load sound effects
        this.load.audio('click', 'sounds/click.wav');
        this.load.audio('success', 'sounds/success.wav');
        this.load.audio('invalid', 'sounds/invalid.ogg');
        
        // Load all icon images as PNG from graphics/ folder
        const iconNames = ['ladder', 'penguin', 'clock', 'octopus', 'kite', 'carrot', 
                          'icecream', 'cactus', 'violin', 'socks', 'umbrella', 
                          'skull', 'spider', 'mirror', 'battery', 'giraffe'];
        
        iconNames.forEach(icon => {
            this.load.image(icon, `graphics/icons/${icon}.png`);
        });
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        
        // Load levels data
        const levelsData = this.cache.json.get('levels');
        if (!levelsData || !levelsData.levels) {
            console.error('Failed to load levels data');
            return;
        }
        
        this.allLevels = levelsData.levels;
        
        // Ensure level index is valid
        if (this.currentLevelIndex >= this.allLevels.length) {
            this.currentLevelIndex = 0;
        }
        
        this.currentLevel = this.allLevels[this.currentLevelIndex];
        this.targetWord = CONFIG.TARGET_WORD;
        this.currentInput = [];
        
        // Initialize keyboard logic for this level
        this.keyboardLogic = KeyboardLogicFactory.create(this.currentLevel.logic, this);
        
        // Congratulatory messages array
        this.congratsMessages = ['Perfect!', 'Great!', 'Nice!', 'Master!', 'Excellent!', 'Nailed it!'];
        
        // Calculate layout - keyboard positioned at bottom for mobile
        const headerHeight = height * 0.08;
        const typePokiHeight = height * 0.05;
        const inputHeight = height * 0.12;
        const keyboardHeight = height * 0.45; // Keyboard height
        const spacingHeight = height - headerHeight - typePokiHeight - inputHeight - keyboardHeight - (height * 0.02); // Remaining space with small bottom margin
        
        let currentY = 0;
        
        // Create UI sections
        this.createHeader(width, headerHeight, currentY);
        currentY += headerHeight;
        
        // Add "Type POKI" text
        this.createTypePokiText(width, typePokiHeight, currentY);
        currentY += typePokiHeight;
        
        this.createInputCells(width, inputHeight, currentY);
        currentY += inputHeight + spacingHeight;
        
        // Position keyboard lower on screen
        this.createKeyboard(width, keyboardHeight, currentY);
        
        // Add restart button above keyboard on right
        this.createRestartButton(width, currentY);
    }

    createHeader(width, height, yPos) {
        // Simplified level name - just "Level X"
        const levelNumber = this.currentLevelIndex + 1;
        const headerText = this.add.text(width / 2, yPos + height / 2, 
            `Level ${levelNumber}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: CONFIG.HEADER_FONT_SIZE,
            color: CONFIG.PRIMARY_COLOR,
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createTypePokiText(width, height, yPos) {
        this.add.text(width / 2, yPos + height / 2, 
            'Type POKI', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: CONFIG.KEY_TEXT_COLOR,
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createInputCells(width, height, yPos) {
        this.inputCells = [];
        const totalWidth = (CONFIG.CELL_SIZE * this.targetWord.length) + 
                          (CONFIG.CELL_SPACING * (this.targetWord.length - 1));
        const startX = (width - totalWidth) / 2;
        const centerY = yPos + height / 2;
        
        for (let i = 0; i < this.targetWord.length; i++) {
            const x = startX + (CONFIG.CELL_SIZE + CONFIG.CELL_SPACING) * i;
            
            // Cell background
            const cell = this.add.rectangle(x, centerY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE, 
                Phaser.Display.Color.HexStringToColor(CONFIG.CELL_COLOR).color);
            cell.setStrokeStyle(3, Phaser.Display.Color.HexStringToColor(CONFIG.CELL_STROKE_COLOR).color);
            cell.setOrigin(0, 0.5);
            
            // Cell text
            const text = this.add.text(x + CONFIG.CELL_SIZE / 2, centerY, '', {
                fontFamily: 'Arial, sans-serif',
                fontSize: CONFIG.CELL_FONT_SIZE,
                color: CONFIG.CELL_TEXT_COLOR,
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.inputCells.push({ cell, text, defaultColor: CONFIG.CELL_COLOR });
        }
        
        // Highlight first cell
        this.highlightNextCell();
    }

    createKeyboard(width, height, yPos) {
        this.keyboardContainer = this.add.container(0, yPos);
        this.keys = {};
        
        if (this.currentLevel.keyboardType === 'qwerty') {
            this.createQwertyKeyboard(width, height);
        } else if (this.currentLevel.keyboardType === 'icons') {
            this.createIconKeyboard(width, height);
        }
        
        // Update keyboard visibility based on logic
        this.updateKeyboardVisibility();
    }

    createQwertyKeyboard(width, height) {
        const rows = CONFIG.QWERTY_ROWS;
        const rowSpacing = 10;
        const totalRows = rows.length;
        const availableHeight = height - (rowSpacing * (totalRows + 1));
        const keyHeight = Math.min(CONFIG.KEY_HEIGHT, availableHeight / totalRows);
        
        // Add horizontal padding to prevent clipping
        const horizontalPadding = 30;
        const availableWidth = width - (horizontalPadding * 2);
        
        let currentY = rowSpacing;
        
        rows.forEach((row, rowIndex) => {
            const rowWidth = (CONFIG.KEY_WIDTH * row.length) + (CONFIG.KEY_SPACING * (row.length - 1));
            let startX = (availableWidth - rowWidth) / 2 + horizontalPadding;
            
            row.forEach((letter, colIndex) => {
                const x = startX + (CONFIG.KEY_WIDTH + CONFIG.KEY_SPACING) * colIndex;
                const key = this.createKey(letter, x, currentY, CONFIG.KEY_WIDTH, keyHeight);
                this.keys[letter] = key;
                this.keyboardContainer.add([key.bg, key.text]);
            });
            
            currentY += keyHeight + rowSpacing;
            
            // Add backspace after the last row (row 2: Z-M)
            if (rowIndex === rows.length - 1) {
                // Position backspace to the right of M, below L
                const lastRowWidth = (CONFIG.KEY_WIDTH * row.length) + (CONFIG.KEY_SPACING * (row.length - 1));
                const backspaceX = (availableWidth - lastRowWidth) / 2 + horizontalPadding + (CONFIG.KEY_WIDTH + CONFIG.KEY_SPACING) * row.length;
                const backspaceY = currentY - keyHeight - rowSpacing;
                
                const backspaceKey = this.createBackspaceKey(backspaceX, backspaceY, CONFIG.KEY_WIDTH, keyHeight);
                this.keys['BACKSPACE'] = backspaceKey;
                this.keyboardContainer.add([backspaceKey.bg, backspaceKey.icon]);
            }
        });
    }

    createIconKeyboard(width, height) {
        const icons = this.currentLevel.icons || [];
        const cols = 3; // 3x3 grid for 9 icons
        const rows = Math.ceil(icons.length / cols);
        const iconSize = 80;
        const spacing = 20;
        
        const totalWidth = (iconSize * cols) + (spacing * (cols - 1));
        const totalHeight = (iconSize * rows) + (spacing * (rows - 1));
        const startX = (width - totalWidth) / 2;
        const startY = (height - totalHeight) / 2;
        
        icons.forEach((iconName, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = startX + (iconSize + spacing) * col;
            const y = startY + (iconSize + spacing) * row;
            
            const key = this.createIconKey(iconName, x, y, iconSize);
            this.keys[iconName] = key;
            this.keyboardContainer.add([key.border, key.bg, key.icon]);
        });
    }

    createKey(letter, x, y, width, height) {
        // Background
        const bg = this.add.rectangle(x, y, width, height, 
            Phaser.Display.Color.HexStringToColor(CONFIG.KEY_COLOR).color);
        bg.setStrokeStyle(2, 0x999999);
        bg.setOrigin(0, 0);
        bg.setInteractive({ useHandCursor: true });
        
        // Text
        const text = this.add.text(x + width / 2, y + height / 2, letter, {
            fontFamily: 'Arial, sans-serif',
            fontSize: CONFIG.KEY_FONT_SIZE,
            color: CONFIG.KEY_TEXT_COLOR,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Click handler
        bg.on('pointerdown', () => this.handleKeyPress(letter));
        
        // Hover effect
        bg.on('pointerover', () => {
            const state = this.keyboardLogic.getKeyState(letter);
            if (state.enabled) {
                bg.setFillStyle(Phaser.Display.Color.HexStringToColor(CONFIG.KEY_HOVER_COLOR).color);
            }
        });
        bg.on('pointerout', () => {
            this.updateKeyAppearance(letter);
        });
        
        return { bg, text, letter };
    }

    createIconKey(iconName, x, y, size) {
        // Create graphics for rounded rectangle border
        const borderGraphics = this.add.graphics();
        borderGraphics.lineStyle(2, 0x999999, 1);
        borderGraphics.strokeRoundedRect(x, y, size, size, 4);
        
        // Create invisible interactive rectangle for click detection
        const bg = this.add.rectangle(x, y, size, size, 0xffffff, 0);
        bg.setOrigin(0, 0);
        bg.setInteractive({ useHandCursor: true });
        
        // Icon image
        const icon = this.add.image(x + size / 2, y + size / 2, iconName);
        icon.setDisplaySize(size * 0.7, size * 0.7);
        
        // Click handler
        bg.on('pointerdown', () => this.handleKeyPress(iconName));
        
        // Hover effect - change border color
        bg.on('pointerover', () => {
            borderGraphics.clear();
            borderGraphics.lineStyle(2, Phaser.Display.Color.HexStringToColor(CONFIG.PRIMARY_COLOR).color, 1);
            borderGraphics.strokeRoundedRect(x, y, size, size, 4);
        });
        bg.on('pointerout', () => {
            borderGraphics.clear();
            borderGraphics.lineStyle(2, 0x999999, 1);
            borderGraphics.strokeRoundedRect(x, y, size, size, 4);
        });
        
        return { bg, icon, letter: iconName, border: borderGraphics };
    }

    createBackspaceKey(x, y, width, height) {
        // Background
        const bg = this.add.rectangle(x, y, width, height, 
            Phaser.Display.Color.HexStringToColor(CONFIG.KEY_COLOR).color);
        bg.setStrokeStyle(2, 0x999999);
        bg.setOrigin(0, 0);
        bg.setInteractive({ useHandCursor: true });
        
        // Backspace icon - maintain aspect ratio
        const icon = this.add.image(x + width / 2, y + height / 2, 'backspace');
        const scale = Math.min((width * 0.6) / icon.width, (height * 0.6) / icon.height);
        icon.setScale(scale);
        
        // Click handler
        bg.on('pointerdown', () => this.handleBackspace());
        
        // Hover effect
        bg.on('pointerover', () => {
            bg.setFillStyle(Phaser.Display.Color.HexStringToColor(CONFIG.KEY_HOVER_COLOR).color);
        });
        bg.on('pointerout', () => {
            bg.setFillStyle(Phaser.Display.Color.HexStringToColor(CONFIG.KEY_COLOR).color);
        });
        
        return { bg, icon, letter: 'BACKSPACE' };
    }

    createRestartButton(width, keyboardYPos) {
        const btnSize = 75; // Increased by 50% from 50 to 75
        const x = width - btnSize - 20;
        const y = keyboardYPos - btnSize - 15; // Above keyboard
        
        // Create rounded rectangle border
        const border = this.add.graphics();
        border.lineStyle(3, 0x333333, 1);
        border.strokeRoundedRect(x, y, btnSize, btnSize, 4);
        
        // Create undo icon without background
        const icon = this.add.image(x + btnSize / 2, y + btnSize / 2, 'undo');
        icon.setDisplaySize(btnSize * 0.7, btnSize * 0.7);
        icon.setInteractive({ useHandCursor: true });
        
        // Click handler
        icon.on('pointerdown', () => this.restartLevel());
        
        // Hover effect - scale up slightly and redraw border
        icon.on('pointerover', () => {
            icon.setScale(1.1);
            border.clear();
            border.lineStyle(3, Phaser.Display.Color.HexStringToColor(CONFIG.PRIMARY_COLOR).color, 1);
            border.strokeRoundedRect(x, y, btnSize, btnSize, 4);
        });
        icon.on('pointerout', () => {
            icon.setScale(1.0);
            border.clear();
            border.lineStyle(3, 0x333333, 1);
            border.strokeRoundedRect(x, y, btnSize, btnSize, 4);
        });
    }

    handleKeyPress(key) {
        // Check if we can still add letters
        if (this.currentInput.length >= this.targetWord.length) {
            return;
        }
        
        // Play click sound
        this.sound.play('click', { volume: 0.5 });
        
        // Get keyboard logic response
        const result = this.keyboardLogic.handleKeyPress(key, this.currentInput);
        
        // Visual feedback (brief flash)
        this.showKeyFeedback(key);
        
        // Add letter if should add
        if (result.shouldAdd && result.letter) {
            const insertPos = this.keyboardLogic.getInsertPosition(result.letter, this.currentInput);
            
            if (insertPos === 0) {
                // Insert at beginning (reverse order)
                this.currentInput.unshift(result.letter);
            } else {
                // Normal append
                this.currentInput.push(result.letter);
            }
            
            this.updateInputDisplay();
            this.updateKeyboardVisibility();
            
            // Check if word is complete
            if (this.currentInput.length === this.targetWord.length) {
                this.checkAnswer();
            }
        }
        
        // Update key appearances (for disabled keys, etc.)
        this.updateAllKeys();
    }

    handleBackspace() {
        if (this.currentInput.length > 0) {
            this.currentInput.pop();
            this.updateInputDisplay();
        }
    }

    updateInputDisplay() {
        this.currentInput.forEach((letter, index) => {
            if (index < this.inputCells.length) {
                this.inputCells[index].text.setText(letter);
            }
        });
        
        // Clear remaining cells
        for (let i = this.currentInput.length; i < this.inputCells.length; i++) {
            this.inputCells[i].text.setText('');
        }
        
        // Highlight next cell
        this.highlightNextCell();
    }

    highlightNextCell() {
        // Reset all cells to default color
        this.inputCells.forEach(cellObj => {
            cellObj.cell.setFillStyle(Phaser.Display.Color.HexStringToColor(cellObj.defaultColor).color);
        });
        
        // Highlight next empty cell in yellow
        const nextIndex = this.currentInput.length;
        if (nextIndex < this.inputCells.length) {
            this.inputCells[nextIndex].cell.setFillStyle(0xFFEB3B); // Yellow
        }
    }

    updateKeyboardVisibility() {
        const visible = this.keyboardLogic.isKeyboardVisible();
        // Always keep keyboard container visible (individual keys control their visibility)
        this.keyboardContainer.setVisible(true);
    }

    updateAllKeys() {
        Object.keys(this.keys).forEach(letter => {
            this.updateKeyAppearance(letter);
        });
    }

    updateKeyAppearance(letter) {
        const key = this.keys[letter];
        if (!key) return;
        
        // Backspace is always visible and enabled
        if (letter === 'BACKSPACE') {
            key.bg.setVisible(true);
            if (key.icon) key.icon.setVisible(true);
            key.bg.setAlpha(1);
            if (key.icon) key.icon.setAlpha(1);
            return;
        }
        
        const state = this.keyboardLogic.getKeyState(letter);
        
        // For invisible state, make transparent but keep interactive
        if (!state.visible) {
            // Make invisible by setting alpha to 0, but keep elements present
            key.bg.setAlpha(0);
            if (key.text) key.text.setAlpha(0);
            if (key.icon) key.icon.setAlpha(0);
            // Keep interactive so it can still be clicked
            if (state.enabled) {
                key.bg.setInteractive({ useHandCursor: true });
            }
        } else {
            // Normal visibility
            key.bg.setAlpha(1);
            if (key.text) key.text.setAlpha(1);
            if (key.icon) key.icon.setAlpha(1);
        }
        
        // Update enabled state (color)
        if (state.enabled) {
            key.bg.setFillStyle(Phaser.Display.Color.HexStringToColor(CONFIG.KEY_COLOR).color);
            key.bg.setInteractive({ useHandCursor: true });
        } else {
            key.bg.setFillStyle(Phaser.Display.Color.HexStringToColor(CONFIG.KEY_DISABLED_COLOR).color);
            key.bg.disableInteractive();
        }
    }

    showKeyFeedback(key) {
        const keyObj = this.keys[key];
        if (!keyObj) return;
        
        // Brief color change
        keyObj.bg.setFillStyle(0xcccccc);
        
        this.time.delayedCall(100, () => {
            this.updateKeyAppearance(key);
        });
    }

    checkAnswer() {
        const playerWord = this.currentInput.join('');
        
        if (playerWord === this.targetWord) {
            // Correct! Play success sound
            this.sound.play('success', { volume: 0.7 });
            
            // Sequential rotation animation for letters
            this.playLetterRotationAnimation(() => {
                // After rotation, show confetti and congratulations
                this.showCongratsAndConfetti(() => {
                    // Save progress and go to win scene
                    const nextLevel = this.currentLevelIndex + 1;
                    if (nextLevel < this.allLevels.length) {
                        this.saveLevelProgress(nextLevel);
                    }
                    
                    this.scene.start('WinScene', {
                        currentLevelIndex: this.currentLevelIndex,
                        totalLevels: this.allLevels.length
                    });
                });
            });
        } else {
            // Wrong - play invalid sound and shake cells
            this.sound.play('invalid', { volume: 0.5 });
            this.shakeCells();
            
            // Clear after delay
            this.time.delayedCall(500, () => {
                this.currentInput = [];
                this.updateInputDisplay();
                this.keyboardLogic.reset();
                this.updateKeyboardVisibility();
                this.updateAllKeys();
            });
        }
    }

    playLetterRotationAnimation(onComplete) {
        let delay = 0;
        const rotationDelay = 150;
        
        this.inputCells.forEach((cellObj, index) => {
            this.time.delayedCall(delay, () => {
                this.tweens.add({
                    targets: [cellObj.cell, cellObj.text],
                    scaleX: 0,
                    duration: 150,
                    ease: 'Power2',
                    yoyo: true,
                    onYoyo: () => {
                        // Flip happens at middle of animation
                    }
                });
            });
            delay += rotationDelay;
        });
        
        // Call onComplete after all animations
        this.time.delayedCall(delay + 300, onComplete);
    }

    showCongratsAndConfetti(onComplete) {
        const { width, height } = this.sys.game.canvas;
        
        // Create confetti particles
        this.createConfetti(width, height);
        
        // Special handling for level 1 - show tutorial popup
        if (this.currentLevelIndex === 0) {
            this.showLevel1TutorialPopup();
            return; // Skip normal completion flow
        }
        
        // Random congratulatory message for other levels
        const message = Phaser.Utils.Array.GetRandom(this.congratsMessages);
        
        // Get position below cells
        const cellsY = this.inputCells[0].cell.y;
        const messageY = cellsY + 100;
        
        const congratsText = this.add.text(width / 2, messageY, message, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '42px',
            color: '#4CAF50',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Fade in animation
        this.tweens.add({
            targets: congratsText,
            alpha: 1,
            duration: 400,
            ease: 'Power2'
        });
        
        // Wait before showing win screen
        this.time.delayedCall(1500, onComplete);
    }

    createConfetti(width, height) {
        const colors = [0xFF5252, 0xFFEB3B, 0x4CAF50, 0x2196F3, 0x9C27B0, 0xFF9800];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-50, height / 2);
            const color = Phaser.Utils.Array.GetRandom(colors);
            
            const confetti = this.add.rectangle(x, y, 10, 10, color);
            
            this.tweens.add({
                targets: confetti,
                y: height + 50,
                x: x + Phaser.Math.Between(-100, 100),
                rotation: Phaser.Math.Between(0, 360),
                alpha: 0,
                duration: Phaser.Math.Between(1000, 2000),
                ease: 'Cubic.easeIn',
                onComplete: () => confetti.destroy()
            });
        }
    }

    shakeCells() {
        this.inputCells.forEach(cellObj => {
            const originalX = cellObj.cell.x;
            
            this.tweens.add({
                targets: [cellObj.cell, cellObj.text],
                x: originalX + 10,
                duration: 50,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    cellObj.cell.x = originalX;
                    cellObj.text.x = originalX + CONFIG.CELL_SIZE / 2;
                }
            });
        });
    }

    loadLevelProgress() {
        // Check if progress should be reset
        if (CONFIG.RESET_PROGRESS) {
            localStorage.removeItem('mysteryKeyboardProgress');
            console.log('Progress reset - starting from Level 1');
            return 0;
        }
        
        try {
            const saved = localStorage.getItem('mysteryKeyboardProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                return progress.currentLevel || 0;
            }
        } catch (e) {
            console.warn('Could not load saved progress:', e);
        }
        return 0;
    }

    saveLevelProgress(levelIndex) {
        try {
            localStorage.setItem('mysteryKeyboardProgress', JSON.stringify({
                currentLevel: levelIndex,
                lastPlayed: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    restartLevel() {
        // Restart current level
        this.scene.restart({ levelIndex: this.currentLevelIndex });
    }

    showLevel1TutorialPopup() {
        const { width, height } = this.sys.game.canvas;
        
        // Semi-transparent overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        
        // Popup panel
        const panelWidth = width * 0.85;
        const panelHeight = 320;
        const panel = this.add.rectangle(width / 2, height / 2, panelWidth, panelHeight, 0xffffff);
        panel.setStrokeStyle(4, 0x4a90e2);
        
        // Tutorial message
        const message = 'That was easy.\n\nThe keyboard now follows\na hidden pattern.\n\nFind it to win.';
        const messageText = this.add.text(width / 2, height / 2 - 40, message, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#333333',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        // "Got it" button
        const buttonWidth = 150;
        const buttonHeight = 55;
        const buttonY = height / 2 + 90;
        
        const button = this.add.rectangle(width / 2, buttonY, buttonWidth, buttonHeight, 0x4CAF50);
        button.setStrokeStyle(3, 0x388E3C);
        button.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(width / 2, buttonY, 'Got it!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button hover effect
        button.on('pointerover', () => {
            button.setFillStyle(0x66BB6A);
        });
        button.on('pointerout', () => {
            button.setFillStyle(0x4CAF50);
        });
        
        // Button click - save progress and go to level 2
        button.on('pointerdown', () => {
            this.saveLevelProgress(1); // Save progress to level 2
            this.scene.start('GameScene', { levelIndex: 1 });
        });
    }
}
