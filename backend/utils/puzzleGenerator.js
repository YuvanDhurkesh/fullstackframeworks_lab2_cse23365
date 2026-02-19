/**
 * Puzzle Generator Utility
 * Generates random math puzzle equations using character avatars
 */

// Character pool with names and avatar URLs
const CHARACTER_POOL = [
  { name: 'Doctor', emoji: '👨‍⚕️', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor' },
  { name: 'Police', emoji: '👮', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=police' },
  { name: 'Firefighter', emoji: '👨‍🚒', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=firefighter' },
  { name: 'Teacher', emoji: '👩‍🏫', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher' },
  { name: 'Engineer', emoji: '👷', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=engineer' },
  { name: 'Nurse', emoji: '👩‍⚕️', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse' },
  { name: 'Chef', emoji: '👨‍🍳', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef' },
  { name: 'Farmer', emoji: '👨‍🌾', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer' },
];

/**
 * Get random element from array
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random number within range
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Select unique characters from pool
 */
function selectUniqueCharacters(count = 2) {
  const selected = [];
  const indices = new Set();
  
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * CHARACTER_POOL.length));
  }
  
  for (const idx of indices) {
    selected.push({ ...CHARACTER_POOL[idx] });
  }
  
  return selected;
}

/**
 * Generate a random puzzle based on difficulty
 * @param {string} difficulty - 'easy' (1-5), 'medium' (1-10), 'hard' (1-15)
 * @returns {Object} Puzzle object with characters, equations, question, and answer
 */
function generatePuzzle(difficulty = 'easy') {
  // Determine value range based on difficulty - MUCH SIMPLER for autism kids
  const ranges = {
    easy: { min: 1, max: 5 },
    medium: { min: 1, max: 10 },
    hard: { min: 1, max: 15 }
  };
  
  const { min, max } = ranges[difficulty] || ranges.easy;
  
  // Select ONLY 2 unique characters (not 3) for easier solving
  const characters = selectUniqueCharacters(2);
  
  // Assign random integer values to each character
  const characterValues = {
    [characters[0].name]: getRandomNumber(min, max),
    [characters[1].name]: getRandomNumber(min, max),
  };
  
  // Generate simpler coefficients (1-2 only)
  const eq1Coef1 = getRandomNumber(1, 2);
  const eq1Coef2 = getRandomNumber(1, 2);
  
  // Calculate results for first equation
  const eq1Result = eq1Coef1 * characterValues[characters[0].name] + 
                   eq1Coef2 * characterValues[characters[1].name];
  
  // Generate a simple equation with just the two characters
  const char1 = characters[0];
  const char2 = characters[1];
  
  // Answer is the sum of both characters
  const correctAnswer = characterValues[char1.name] + characterValues[char2.name];
  
  // Format equations for display - ONLY ONE EQUATION
  const equations = [
    {
      text: `${eq1Coef1} ${char1.emoji} + ${eq1Coef2} ${char2.emoji} = ${eq1Result}`,
      display: `${eq1Coef1} ${char1.name} + ${eq1Coef2} ${char2.name} = ${eq1Result}`
    }
  ];
  
  return {
    characters: characters.map(c => ({ name: c.name, emoji: c.emoji, image: c.image })),
    equations,
    question: `${char1.emoji} + ${char2.emoji} = ?`,
    questionDisplay: `${char1.name} + ${char2.name} = ?`,
    correctAnswer,
    difficulty,
    // Store for validation
    _metadata: {
      characterValues,
      eq1: { coef1: eq1Coef1, coef2: eq1Coef2, result: eq1Result },
      questionChars: [char1.name, char2.name]
    }
  };
}

module.exports = {
  generatePuzzle,
  selectUniqueCharacters,
  getRandomNumber,
  CHARACTER_POOL
};
