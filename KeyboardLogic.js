// KeyboardLogic.js - Behavior functions for each level in Mystery Keyboard game

/**
 * Base keyboard logic class
 * All specific keyboard behaviors extend this
 */
class BaseKeyboardLogic {
    constructor(scene) {
        this.scene = scene;
        this.reset();
    }
    
    reset() {
        // Override in subclasses
    }
    
    /**
     * Handle key press
     * @param {string} key - The key that was pressed
     * @param {Array} currentInput - Current input array
     * @returns {Object} { letter: string or null, shouldAdd: boolean, feedback: string }
     */
    handleKeyPress(key, currentInput) {
        // Default behavior - just return the key
        return { letter: key, shouldAdd: true, feedback: '' };
    }
    
    /**
     * Get visual feedback for a key
     * @param {string} key - The key to check
     * @returns {Object} { visible: boolean, enabled: boolean }
     */
    getKeyState(key) {
        return { visible: true, enabled: true };
    }
    
    /**
     * Should keyboard be visible?
     * @returns {boolean}
     */
    isKeyboardVisible() {
        return true;
    }
    
    /**
     * Get the letter to insert in cell (can modify for reverse order, etc.)
     * @param {string} letter - The letter to insert
     * @param {Array} currentInput - Current input array
     * @returns {number} - Index where to insert (-1 for normal append)
     */
    getInsertPosition(letter, currentInput) {
        return -1; // -1 means append normally
    }
}

/**
 * Level 1: Normal QWERTY keyboard
 */
class NormalKeyboard extends BaseKeyboardLogic {
    handleKeyPress(key, currentInput) {
        return { letter: key, shouldAdd: true, feedback: '' };
    }
}

/**
 * Level 2: Alternate key press ignored
 * Every other key press is ignored (but keys stay active)
 */
class AlternateDeactivation extends BaseKeyboardLogic {
    reset() {
        this.pressCount = 0;
    }
    
    handleKeyPress(key, currentInput) {
        this.pressCount++;
        
        // Odd presses add the letter
        if (this.pressCount % 2 === 1) {
            return { letter: key, shouldAdd: true, feedback: '' };
        } else {
            // Even presses are ignored (no letter added, but key stays active)
            return { letter: null, shouldAdd: false, feedback: '' };
        }
    }
    
    getKeyState(key) {
        // All keys always remain visible and enabled
        return { visible: true, enabled: true };
    }
}

/**
 * Level 3: Double press required
 * Must press the same key twice consecutively
 */
class DoublePressRequired extends BaseKeyboardLogic {
    reset() {
        this.lastKey = null;
    }
    
    handleKeyPress(key, currentInput) {
        if (this.lastKey === key) {
            // Second consecutive press - add the letter
            this.lastKey = null;
            return { letter: key, shouldAdd: true, feedback: '' };
        } else {
            // First press - remember it
            this.lastKey = key;
            return { letter: null, shouldAdd: false, feedback: 'Press again' };
        }
    }
}

/**
 * Level 4: Next letter keyboard
 * Pressing a key gives the next letter (P->Q, O->P, etc.)
 */
class NextLetterKeyboard extends BaseKeyboardLogic {
    handleKeyPress(key, currentInput) {
        const nextLetter = this.getNextLetter(key);
        return { letter: nextLetter, shouldAdd: true, feedback: '' };
    }
    
    getNextLetter(key) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const index = alphabet.indexOf(key);
        if (index === -1) return key;
        return alphabet[(index + 1) % 26];
    }
}

/**
 * Level 5: Invisible keyboard
 * Keyboard is invisible but functional (keys are transparent but clickable)
 */
class InvisibleKeyboard extends BaseKeyboardLogic {
    handleKeyPress(key, currentInput) {
        return { letter: key, shouldAdd: true, feedback: '' };
    }
    
    getKeyState(key) {
        // Keys are invisible but still present and clickable
        return { visible: false, enabled: true };
    }
    
    isKeyboardVisible() {
        // Return true so keyboard container stays visible (keys just transparent)
        return true;
    }
}

/**
 * Level 6: Vowels twice, consonants once
 * Vowels need to be typed twice, consonants once
 */
class VowelsTwice extends BaseKeyboardLogic {
    reset() {
        this.lastKey = null;
    }
    
    handleKeyPress(key, currentInput) {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const isVowel = vowels.includes(key);
        
        if (isVowel) {
            if (this.lastKey === key) {
                // Second press of vowel - add it
                this.lastKey = null;
                return { letter: key, shouldAdd: true, feedback: '' };
            } else {
                // First press of vowel
                this.lastKey = key;
                return { letter: null, shouldAdd: false, feedback: 'Press again' };
            }
        } else {
            // Consonant - add immediately
            this.lastKey = null;
            return { letter: key, shouldAdd: true, feedback: '' };
        }
    }
}

/**
 * Level 7: Toggle visibility
 * Keyboard toggles visibility after each successful key press
 */
class ToggleVisibility extends BaseKeyboardLogic {
    reset() {
        this.visible = true;
    }
    
    handleKeyPress(key, currentInput) {
        // Toggle visibility after adding letter
        this.visible = !this.visible;
        return { letter: key, shouldAdd: true, feedback: '' };
    }
    
    isKeyboardVisible() {
        return this.visible;
    }
}

/**
 * Level 8: Icon keyboard - first letter
 * Click icons and first letter is typed
 */
class IconKeyboardFirst extends BaseKeyboardLogic {
    handleKeyPress(key, currentInput) {
        // Key here is the icon name, we extract first letter
        const firstLetter = key.charAt(0).toUpperCase();
        return { letter: firstLetter, shouldAdd: true, feedback: '' };
    }
}

/**
 * Level 9: Reverse order typing
 * Letters fill from right to left (4th cell, then 3rd, then 2nd, then 1st)
 */
class ReverseOrder extends BaseKeyboardLogic {
    handleKeyPress(key, currentInput) {
        return { letter: key, shouldAdd: true, feedback: '' };
    }
    
    getInsertPosition(letter, currentInput) {
        // Insert at the beginning, pushing others forward
        return 0;
    }
}

/**
 * Level 10: Icon keyboard - second letter
 * Click icons and second letter is typed
 */
class IconKeyboardSecond extends BaseKeyboardLogic {
    handleKeyPress(key, currentInput) {
        // Key here is the icon name, we extract second letter
        if (key.length >= 2) {
            const secondLetter = key.charAt(1).toUpperCase();
            return { letter: secondLetter, shouldAdd: true, feedback: '' };
        }
        return { letter: null, shouldAdd: false, feedback: 'Invalid icon' };
    }
}

// Factory to create keyboard logic instances
const KeyboardLogicFactory = {
    create(logicName, scene) {
        switch(logicName) {
            case 'normal':
                return new NormalKeyboard(scene);
            case 'alternateDeactivation':
                return new AlternateDeactivation(scene);
            case 'doublePressRequired':
                return new DoublePressRequired(scene);
            case 'nextLetter':
                return new NextLetterKeyboard(scene);
            case 'invisible':
                return new InvisibleKeyboard(scene);
            case 'vowelsTwice':
                return new VowelsTwice(scene);
            case 'toggleVisibility':
                return new ToggleVisibility(scene);
            case 'iconKeyboardFirst':
                return new IconKeyboardFirst(scene);
            case 'reverseOrder':
                return new ReverseOrder(scene);
            case 'iconKeyboardSecond':
                return new IconKeyboardSecond(scene);
            default:
                console.warn(`Unknown logic: ${logicName}, using normal`);
                return new NormalKeyboard(scene);
        }
    }
};
