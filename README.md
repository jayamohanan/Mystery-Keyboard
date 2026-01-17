# Letter Extraction Spelling Game

A Phaser 3 HTML5 web game where players spell target words by clicking images to extract letters.

## 🎮 Game Concept

Players must spell the name of a target image by extracting letters from other images.

**The Twist:** There's no keyboard! Letters are extracted based on position (FIRST, SECOND, or THIRD).

## 🕹️ How to Play

1. **Target Image**: A target image is shown at the top (e.g., 🐱 CAT)
2. **Letter Input Cells**: Empty cells below show where letters go (OTP-style)
3. **Toggle Position**: Select FIRST LETTER, SECOND LETTER, or THIRD LETTER
4. **Click Images**: Click option images to extract their letters
5. **Fill the Word**: Extracted letters fill cells left-to-right
6. **Win**: Complete the word correctly to advance!

### Example

**Target:** CAT  
**Toggle:** FIRST LETTER

- Click CAR → **C**
- Click AXE → **A**
- Click TREE → **T**
- Result: **CAT** ✅

**Toggle:** SECOND LETTER

- Click CAR → **A** (2nd letter)
- Click AXE → **X** (2nd letter)
- Click TREE → **R** (2nd letter)
- Result: **AXR** ❌

## ⚙️ Configuration

All visual settings are in [`config.js`](config.js):

- **HIDE_TARGET_IMAGE** (bool) - Show silhouette until correct answer
  - `true`: Target image appears as black silhouette, reveals when correct
  - `false`: Target image shows in full color from start
- Layout percentages (header, answer, toggles, options)
- Image sizes (target, cells, options)
- Colors (borders, buttons, cells)
- Spacing and animations

## 🎨 Features

- ✅ **Silhouette Mode** - Hide target image as black shadow (configurable)
- ✅ **Image Reveal** - Flash and bounce animation when word is correct
- ✅ OTP-style letter input cells with cursor pulse
- ✅ Visual feedback (filled vs empty cells)
- ✅ Radio-button toggle system
- ✅ 3-column dynamic grid for options
- ✅ Undo button (↶) to remove last letter
- ✅ Win screen with confetti
- ✅ Level looping (back to Level 1 after completion)
- ✅ Portrait-oriented layout
- ✅ Rounded borders on all images

## 📁 Project Structure

```
Hex/
├── index.html          # Main HTML file
├── game.js             # Main game scene logic
├── WinScene.js         # Win screen with confetti
├── config.js           # All configurable values
├── levels.json         # Level data
├── phaser.min.js       # Phaser 3 library
└── graphics/           # Image assets
    ├── cat.png
    ├── car.png
    ├── axe.png
    └── tree.png
```

## 🚀 Running the Game

1. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open your browser to:
   ```
   http://localhost:8080
   ```

## 📝 Adding New Levels

Edit [`levels.json`](levels.json):

```json
{
  "levels": [
    {
      "answer": {
        "word": "CAT",
        "image": "graphics/cat.png"
      },
      "options": [
        { "word": "CAR", "image": "graphics/car.png" },
        { "word": "AXE", "image": "graphics/axe.png" },
        { "word": "TREE", "image": "graphics/tree.png" }
      ]
    }
  ]
}
```

- **word**: The target word (internal use only)
- **image**: Path to the image file
- **options**: Array of clickable images with their words

## 🎯 Game Rules

1. Only one toggle active at a time
2. Letters fill left-to-right automatically
3. Can't add more letters than the answer length
4. Undo removes only the last letter
5. Wrong answers show error message
6. Correct answers show win screen
7. Game loops back to Level 1 after final level

## � Customization Tips

**Enable/Disable Silhouette Mode:**
```javascript
// In config.js
HIDE_TARGET_IMAGE: true,   // Black silhouette (guess mode)
HIDE_TARGET_IMAGE: false,  // Full color (easier mode)
```

**Change colors:**
```javascript
// In config.js
TOGGLE_ACTIVE_COLOR: 0x4a90e2,  // Blue
FILLED_CELL_COLOR: 0xe8e8e8,    // Light grey
```

**Adjust layout:**
```javascript
// In config.js
HEADER_HEIGHT_PERCENT: 10,   // Header size
ANSWER_HEIGHT_PERCENT: 40,   // Target + cells
TOGGLE_HEIGHT_PERCENT: 10,   // Toggle buttons
OPTIONS_HEIGHT_PERCENT: 40,  // Option grid
```

**Change image sizes:**
```javascript
// In config.js
TARGET_IMAGE_SIZE: 128,      // Target image
ANSWER_CELL_SIZE: 48,        // Letter cells
OPTION_IMAGE_SIZE: 80,       // Option images
```

## 🐛 Troubleshooting

**Images not loading?**
- Check that image paths in `levels.json` are correct
- Images should be in the `graphics/` folder

**Game not starting?**
- Open browser console (F12) to check for errors
- Ensure web server is running
- Check that all files are present

## 📜 License

This is a demonstration game created with Phaser 3.

---

**Built with Phaser 3** 🎮
