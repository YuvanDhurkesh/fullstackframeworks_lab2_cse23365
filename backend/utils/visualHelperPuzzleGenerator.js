// Visual helper-based puzzle generator
// Similar to fruit equation puzzles but with helpers

const HELPERS = [
  { name: 'Doctor', emoji: '👨‍⚕️' },
  { name: 'Police', emoji: '👮' },
  { name: 'Firefighter', emoji: '👨‍🚒' },
  { name: 'Teacher', emoji: '👨‍🏫' },
  { name: 'Engineer', emoji: '👨‍💼' },
  { name: 'Nurse', emoji: '👩‍⚕️' },
  { name: 'Chef', emoji: '👨‍🍳' },
  { name: 'Farmer', emoji: '👨‍🌾' }
];

function generateVisualHelperPuzzle(level) {
  // Determine difficulty based on level
  let minVal, maxVal;
  
  if (level <= 3) {
    minVal = 2;
    maxVal = 5;
  } else if (level <= 6) {
    minVal = 5;
    maxVal = 10;
  } else if (level <= 9) {
    minVal = 5;
    maxVal = 15;
  } else if (level <= 12) {
    minVal = 10;
    maxVal = 20;
  } else if (level <= 15) {
    minVal = 10;
    maxVal = 25;
  } else {
    minVal = 15;
    maxVal = 30;
  }

  // Randomly pick 3 different helpers
  const shuffled = HELPERS.sort(() => Math.random() - 0.5);
  const helper1 = shuffled[0];
  const helper2 = shuffled[1];
  const helper3 = shuffled[2];

  // Assign random values to each helper
  const value1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  const value2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  const value3 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  // Create the visible equations (3 + 3 + 3 = total)
  const eq1Total = value1 * 3;
  const eq2Total = value2 * 3;
  const eq3Total = value3 * 3;

  // Create the question: mix the three helpers
  const questionIndices = [0, 1, 2]; // Use all three helpers
  questionIndices.sort(() => Math.random() - 0.5); // Random order
  
  const answer = value1 + value2 + value3;

  return {
    level,
    helpers: {
      helper1: { ...helper1, value: value1 },
      helper2: { ...helper2, value: value2 },
      helper3: { ...helper3, value: value3 }
    },
    equations: [
      {
        helper: helper1,
        count: 3,
        total: eq1Total,
        description: `${helper1.emoji} + ${helper1.emoji} + ${helper1.emoji} = ${eq1Total}`
      },
      {
        helper: helper2,
        count: 3,
        total: eq2Total,
        description: `${helper2.emoji} + ${helper2.emoji} + ${helper2.emoji} = ${eq2Total}`
      },
      {
        helper: helper3,
        count: 3,
        total: eq3Total,
        description: `${helper3.emoji} + ${helper3.emoji} + ${helper3.emoji} = ${eq3Total}`
      }
    ],
    question: {
      parts: [helper1, helper2, helper3],
      description: `${helper1.emoji} + ${helper2.emoji} + ${helper3.emoji} = ?`,
      answer: answer
    },
    correctAnswer: answer,
    levelDescription: `Level ${level}`
  };
}

module.exports = { generateVisualHelperPuzzle };
