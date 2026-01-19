// Shared config for Mystery Keyboard game
var CONFIG = {
    // Target word for all levels
    TARGET_WORD: 'POKI',
    
    // Layout percentages (% of screen height)
    HEADER_HEIGHT_PERCENT: 10,
    INPUT_CELLS_HEIGHT_PERCENT: 15,
    KEYBOARD_HEIGHT_PERCENT: 55,
    INSTRUCTION_HEIGHT_PERCENT: 10,
    SPACING_PERCENT: 10,
    
    // Colors
    BACKGROUND_COLOR: '#d3e8ee',
    KEY_COLOR: '#ffffff',
    KEY_HOVER_COLOR: '#e3f2fd',
    KEY_DISABLED_COLOR: '#cccccc',
    KEY_TEXT_COLOR: '#333333',
    CELL_COLOR: '#ffffff',
    CELL_STROKE_COLOR: '#4a90e2',
    CELL_TEXT_COLOR: '#333333',
    PRIMARY_COLOR: '#4a90e2',
    
    // Dimensions
    KEY_WIDTH: 60,
    KEY_HEIGHT: 60,
    KEY_SPACING: 10,
    CELL_SIZE: 80,
    CELL_SPACING: 15,
    
    // Font sizes
    KEY_FONT_SIZE: '24px',
    CELL_FONT_SIZE: '48px',
    HEADER_FONT_SIZE: '32px',
    INSTRUCTION_FONT_SIZE: '18px',
    
    // Keyboard layout
    QWERTY_ROWS: [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ],
    
    // Debug and testing
    SHOW_LEVEL_HINTS: false,
    RESET_PROGRESS: true // Set to true to reset level progress and start from Level 1
};
