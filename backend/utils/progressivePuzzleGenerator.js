/**
 * Progressive Puzzle Generator - Character Based
 * Generates visual puzzles: Doctor + Doctor = 20, Cook + Cook = 10, etc.
 */

const CHARACTER_POOL = [
  { name: 'Doctor', emoji: '👨‍⚕️' },
  { name: 'Police', emoji: '👮' },
  { name: 'Firefighter', emoji: '👨‍🚒' },
  { name: 'Teacher', emoji: '👩‍🏫' },
  { name: 'Engineer', emoji: '👷' },
  { name: 'Nurse', emoji: '👩‍⚕️' },
  { name: 'Chef', emoji: '👨‍🍳' },
  { name: 'Farmer', emoji: '👨‍🌾' },
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate character-based progressive puzzle
 * Level 1-3: Simple same character addition (A + A = ?)
 * Level 4-6: Same character subtraction (A - A, or variants)
 * Level 7-9: Two different characters (A + B = ?)
 * Level 10+: More complex combinations
 */
function generateProgressivePuzzle(level = 1) {
  let char1, char2, value1, value2;
  let minVal = 2, maxVal = 10;

  // Determine difficulty based on level
  if (level <= 3) {
    // Very Easy: Same character doubled (2A = ?)
    minVal = 2;
    maxVal = 10;
    char1 = getRandomElement(CHARACTER_POOL);
    char2 = char1; // Same character
    value1 = getRandomNumber(minVal, maxVal);
    value2 = value1; // Same value
  } else if (level <= 6) {
    // Easy: Two same characters, different operations
    minVal = 3;
    maxVal = 15;
    char1 = getRandomElement(CHARACTER_POOL);
    char2 = char1;
    value1 = getRandomNumber(minVal, maxVal);
    value2 = getRandomNumber(1, value1 - 1); // For subtraction: A - B where B < A
  } else if (level <= 9) {
    // Medium: Two different characters
    minVal = 2;
    maxVal = 15;
    char1 = getRandomElement(CHARACTER_POOL);
    char2 = getRandomElement(CHARACTER_POOL.filter(c => c.name !== char1.name));
    value1 = getRandomNumber(minVal, maxVal);
    value2 = getRandomNumber(minVal, maxVal);
  } else {
    // Hard: Different combinations
    minVal = 3;
    maxVal = 20;
    char1 = getRandomElement(CHARACTER_POOL);
    char2 = getRandomElement(CHARACTER_POOL.filter(c => c.name !== char1.name));
    value1 = getRandomNumber(minVal, maxVal);
    value2 = getRandomNumber(minVal, maxVal);
  }

  // Determine equation type based on level
  let equation1Text, equation1Result;
  let equation2Text, equation2Result;
  let questionText, correctAnswer;

  if (level <= 3) {
    // Same character doubled: Doctor + Doctor = ?
    equation1Text = `2 x ${char1.emoji} = 2 x ${value1}`;
    equation1Result = value1 * 2;
    
    // Question: 3 x Doctor = ?
    const multiplier = getRandomNumber(1, 3);
    questionText = `${multiplier} x ${char1.emoji} = ?`;
    correctAnswer = value1 * multiplier;
  } else if (level <= 6) {
    // Two same characters, subtraction
    equation1Text = `${char1.emoji} + ${char1.emoji} = ${value1 * 2}`;
    equation1Result = value1 * 2;
    
    equation2Text = `${char1.emoji} = ${value1}`;
    equation2Result = value1;
    
    questionText = `${char1.emoji} + ${char1.emoji} - ${char1.emoji} = ?`;
    correctAnswer = value1;
  } else {
    // Two different characters: Doctor + Chef = ?
    equation1Text = `${char1.emoji} + ${char1.emoji} = ${value1 * 2}`;
    equation1Result = value1 * 2;
    
    equation2Text = `${char2.emoji} + ${char2.emoji} = ${value2 * 2}`;
    equation2Result = value2 * 2;
    
    questionText = `${char1.emoji} + ${char2.emoji} = ?`;
    correctAnswer = value1 + value2;
  }

  return {
    characters: [
      { name: char1.name, emoji: char1.emoji },
      { name: char2.name, emoji: char2.emoji }
    ],
    equations: [
      {
        text: equation1Text,
        display: equation1Text
      },
      ...(level > 3 ? [{
        text: equation2Text,
        display: equation2Text
      }] : [])
    ],
    question: questionText,
    questionDisplay: questionText,
    correctAnswer,
    level,
    _metadata: {
      characterValues: {
        [char1.name]: value1,
        [char2.name]: value2
      }
    }
  };
}

/**
 * Get difficulty description based on level
 */
function getLevelDescription(level) {
  if (level <= 3) return '😊 Very Easy: Same Character Addition';
  if (level <= 6) return '😌 Easy: Multiplication & Subtraction';
  if (level <= 9) return '🤔 Medium: Different Characters';
  if (level <= 12) return '💪 Getting Harder: Complex Combinations';
  if (level <= 15) return '🧠 Hard: Mixed Operations';
  return '🔥 Challenge Mode: Advanced Problems';
}

module.exports = {
  generateProgressivePuzzle,
  getLevelDescription,
  CHARACTER_POOL
};
