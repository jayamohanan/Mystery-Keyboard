# Mystery Keyboard - POKI Game

A fun puzzle game for Poki where players must type "POKI" using keyboards with different mysterious behaviors!

## 🎮 Game Concept

Type the word **POKI** using a custom keyboard, but each level has a unique twist! Players must figure out the mystery behavior of the keyboard to complete each level.

## 🎯 Levels

### Level 1: Normal Keyboard
- **Mystery**: None! Just a straightforward QWERTY keyboard
- **Solution**: Type P-O-K-I normally

### Level 2: Alternate Deactivation
- **Mystery**: Every other key press deactivates that key permanently
- **Solution**: Type P-Q-O-E-K-F-I (alternate keys get disabled)

### Level 3: Double Press Required
- **Mystery**: Each key must be pressed twice consecutively to register
- **Solution**: Type P-P-O-O-K-K-I-I

### Level 4: Next Letter Keyboard
- **Mystery**: Each key types the NEXT letter in the alphabet
- **Solution**: Press O-N-J-H to get POKI

### Level 5: Invisible Keyboard
- **Mystery**: The keyboard is completely invisible!
- **Solution**: Remember QWERTY layout and tap where keys should be

### Level 6: Vowels Twice
- **Mystery**: Vowels need two presses, consonants only one
- **Solution**: Type P-O-O-K-I-I

### Level 7: Toggle Visibility
- **Mystery**: Keyboard appears and disappears after each key press
- **Solution**: Remember key positions when keyboard is hidden

### Level 8: Icon First Letter
- **Mystery**: Click icons - their first letter is typed
- **Solution**: Click Parrot-Octopus-Kite-Icecream

### Level 9: Reverse Order
- **Mystery**: Letters fill cells from right to left!
- **Solution**: Type I-K-O-P (reverse of POKI)

### Level 10: Icon Second Letter
- **Mystery**: Click icons - their second letter is typed
- **Solution**: Click Spoon-Socks-Skull-Mirror

## 🛠️ Development

### Running Locally

```bash
# Start a local server
python3 -m http.server 8000

# Open browser to
http://localhost:8000
```

### File Structure

```
Mystery Keyboard/
├── index.html          # Main HTML entry point
├── game.js            # Phaser game configuration
├── config.js          # Game settings and constants
├── GameScene.js       # Main game scene
├── KeyboardLogic.js   # All keyboard behavior logic
├── WinScene.js        # Victory screen
├── levels.json        # Level definitions
├── phaser.min.js      # Phaser game engine
└── graphics/
    └── icons/         # SVG icons for icon-based levels
```

### Configuration

Edit config.js to adjust:
- Target word (default: "POKI")
- Colors and styling
- Layout percentages
- Key sizes and spacing
- Enable/disable level hints
- Font sizes

## 🎨 Customization

### Adding New Levels

1. Create a new logic class in KeyboardLogic.js
2. Add to the KeyboardLogicFactory
3. Add level definition to levels.json

### Keyboard Types

- qwerty - Standard QWERTY keyboard layout
- icons - Icon-based keyboard (specify icons in level config)

## 🎯 For Poki Publishing

This game is designed for Poki.com:
- Mobile-friendly responsive design
- Touch and mouse input support
- Portrait orientation (720x1280)
- No external dependencies (all assets included)
- Fast loading and optimized performance

Created for Poki.com publishing.
