/**
 * Helper-Based Visual Puzzle Generator
 * Creates visual equations like the fruit puzzle game
 * Shows 3 equations to establish values, then asks for a 4th mixed equation
 * 
 * Example:
 * Doctor + Doctor + Doctor = 15
 * Police + Police + Police = 18
 * Cook + Cook + Cook = 12
 * Doctor + Police + Cook = ?
 */

const HELPERS = [
  { name: 'Doctor', emoji: '👨‍⚕️' },
  { name: 'Cook', emoji: '👨‍🍳' },
  { name: 'Police', emoji: '👮' },
  { name: 'Firefighter', emoji: '👨‍🚒' },
  { name: 'Teacher', emoji: '👩‍🏫' },
  { name: 'Engineer', emoji: '👷' },
  { name: 'Nurse', emoji: '👩‍⚕️' },
  { name: 'Farmer', emoji: '👨‍🌾' },
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomHelpers(count) {
  const shuffled = HELPERS.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate visual puzzle: Show 3 x 3 equations, solve 4th mixed equation
 * Progressive difficulty based on level
 * Levels 1-7: Mostly addition
 * Levels 8-14: Mix of addition and subtraction
 * Levels 15-20: More subtraction
 */
function generateHelperVisualPuzzle(level = 1) {
  // Determine value range based on level
  let minVal, maxVal;
  
  if (level <= 3) {
    minVal = 2;
    maxVal = 5;
  } else if (level <= 6) {
    minVal = 3;
    maxVal = 8;
  } else if (level <= 9) {
    minVal = 5;
    maxVal = 12;
  } else if (level <= 12) {
    minVal = 8;
    maxVal = 15;
  } else if (level <= 15) {
    minVal = 10;
    maxVal = 20;
  } else {
    minVal = 12;
    maxVal = 25;
  }

  // Pick 3 random helpers
  const selectedHelpers = getRandomHelpers(3);
  const helperA = selectedHelpers[0];
  const helperB = selectedHelpers[1];
  const helperC = selectedHelpers[2];

  // Assign each helper a random value
  const valueA = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  const valueB = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  const valueC = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  // Determine operation type based on level
  let operationType = 'addition';
  if (level >= 8) {
    const rand = Math.random();
    if (level >= 15) {
      operationType = rand < 0.6 ? 'subtraction' : 'addition';
    } else {
      operationType = rand < 0.4 ? 'subtraction' : 'addition';
    }
  }

  // Create the 3 visual equations
  let equation = [];
  let correctAnswer = 0;

  if (operationType === 'addition') {
    // Addition: A + A + A = Total
    equation = [
      {
        helpers: [helperA, helperA, helperA],
        operation: '+',
        visual: `${helperA.emoji} + ${helperA.emoji} + ${helperA.emoji} = ${valueA * 3}`,
        total: valueA * 3
      },
      {
        helpers: [helperB, helperB, helperB],
        operation: '+',
        visual: `${helperB.emoji} + ${helperB.emoji} + ${helperB.emoji} = ${valueB * 3}`,
        total: valueB * 3
      },
      {
        helpers: [helperC, helperC, helperC],
        operation: '+',
        visual: `${helperC.emoji} + ${helperC.emoji} + ${helperC.emoji} = ${valueC * 3}`,
        total: valueC * 3
      }
    ];
    // Question: A + B + C = ?
    correctAnswer = valueA + valueB + valueC;
  } else {
    // Subtraction: A + A + A - B - B = Total (mix of operations)
    const eqTotal1 = valueA * 3;
    const eqTotal2 = valueB * 2;
    const eqTotal3 = valueC * 3;

    equation = [
      {
        helpers: [helperA, helperA, helperA],
        operation: '+',
        visual: `${helperA.emoji} + ${helperA.emoji} + ${helperA.emoji} = ${eqTotal1}`,
        total: eqTotal1
      },
      {
        helpers: [helperB, helperB],
        operation: '-',
        visual: `${helperB.emoji} + ${helperB.emoji} = ${eqTotal2}`,
        total: eqTotal2
      },
      {
        helpers: [helperC, helperC, helperC],
        operation: '+',
        visual: `${helperC.emoji} + ${helperC.emoji} + ${helperC.emoji} = ${eqTotal3}`,
        total: eqTotal3
      }
    ];
    // Question: A + B - C = ? (mixed operations)
    correctAnswer = valueA + valueB - valueC;
    if (correctAnswer < 0) correctAnswer = Math.abs(correctAnswer); // Ensure positive
  }

  // The question: depends on operation type
  let question = '';
  if (operationType === 'addition') {
    question = `${helperA.emoji} + ${helperB.emoji} + ${helperC.emoji} = ?`;
  } else {
    question = `${helperA.emoji} + ${helperB.emoji} - ${helperC.emoji} = ?`;
  }

  // Knowledge cards showing the actual helper values (deduced from equations)
  const knowledgeCards = [
    { helper: helperA, value: valueA },
    { helper: helperB, value: valueB },
    { helper: helperC, value: valueC }
  ];

  return {
    level,
    operation: operationType,
    equation, // Array of 3 equations showing: Helper operations = Total
    knowledgeCards, // Cards showing helper => value mappings
    question, // Visual question: "👨‍⚕️ + 👨‍🍳 + 👮 = ?" or "👨‍⚕️ + 👨‍🍳 - 👮 = ?"
    correctAnswer,
    levelDescription: getLevelDescription(level),
  };
}

function getLevelDescription(level) {
  if (level <= 3) return '⭐ Level ' + level + ' - Very Easy Addition (2-5)';
  if (level <= 7) return '⭐ Level ' + level + ' - Easy Addition (3-12)';
  if (level <= 10) return '⭐ Level ' + level + ' - Addition & Subtraction (5-15)';
  if (level <= 14) return '⭐ Level ' + level + ' - Mixed Operations (8-20)';
  if (level <= 18) return '⭐ Level ' + level + ' - More Subtraction (10-25)';
  return '⭐ Level ' + level + ' - Expert Challenge (12-25)';
}

module.exports = {
  generateHelperVisualPuzzle,
  getLevelDescription,
  HELPERS,
};
