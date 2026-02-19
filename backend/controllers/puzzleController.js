/**
 * Puzzle Controller
 * Handles puzzle generation, submission, and score tracking
 */

const { generateHelperVisualPuzzle, getLevelDescription } = require('../utils/helperVisualPuzzle');

// In-memory storage for current puzzle and game state
let currentPuzzle = null;
let gameState = {
  level: 1,
  totalAttempts: 0,
  correctAnswers: 0,
  consecutiveCorrect: 0, // Track streak for leveling up
  attempts: [] // Track individual attempts [{ answer, correct, timestamp }]
};

/**
 * Generate a new puzzle based on current level
 */
const generateNewPuzzle = (req, res) => {
  try {
    // Generate helper-based visual puzzle based on current level
    currentPuzzle = generateHelperVisualPuzzle(gameState.level);
    
    // Return puzzle WITHOUT the correct answer
    const safeResponse = {
      equation: currentPuzzle.equation, // Array of helper objects
      knowledgeCards: currentPuzzle.knowledgeCards, // Helper => value cards
      question: currentPuzzle.question, // Visual emoji equation like "👨‍⚕️ + 👨‍⚕️ = ?"
      level: gameState.level,
      levelDescription: getLevelDescription(gameState.level),
      consecutiveCorrect: gameState.consecutiveCorrect,
      puzzleId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(safeResponse);
  } catch (error) {
    console.error('Error generating puzzle:', error);
    res.status(500).json({ error: 'Failed to generate puzzle' });
  }
};

/**
 * Submit answer for current puzzle
 */
const submitAnswer = (req, res) => {
  try {
    const { answer } = req.body;
    
    if (typeof answer !== 'number') {
      return res.status(400).json({ 
        error: 'Invalid answer. Must provide a number.' 
      });
    }
    
    if (!currentPuzzle) {
      return res.status(400).json({ 
        error: 'No puzzle available. Please generate a puzzle first.' 
      });
    }
    
    // Check if answer is correct
    const isCorrect = answer === currentPuzzle.correctAnswer;
    
    // Update game stats
    gameState.totalAttempts++;
    
    if (isCorrect) {
      gameState.correctAnswers++;
      gameState.consecutiveCorrect++;
      
      // Level up every 3 consecutive correct answers, but max 5 per attempt limit
      if (gameState.consecutiveCorrect >= 3 && gameState.level < 20) {
        gameState.level++;
        gameState.consecutiveCorrect = 0; // Reset streak for new level
      }
    } else {
      gameState.consecutiveCorrect = 0; // Reset streak on wrong answer
    }
    
    // Track attempt
    gameState.attempts.push({
      answer,
      correct: isCorrect,
      expected: currentPuzzle.correctAnswer,
      level: currentPuzzle.level,
      timestamp: new Date()
    });
    
    // Calculate accuracy
    const accuracy = gameState.totalAttempts > 0 
      ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100)
      : 0;
    
    return res.json({
      correct: isCorrect,
      correctAnswer: currentPuzzle.correctAnswer,
      totalAttempts: gameState.totalAttempts,
      correctAnswers: gameState.correctAnswers,
      accuracy,
      level: gameState.level,
      levelDescription: getLevelDescription(gameState.level),
      consecutiveCorrect: gameState.consecutiveCorrect,
      leveledUp: gameState.consecutiveCorrect === 0 && isCorrect && gameState.level > currentPuzzle.level
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

/**
 * Get current game statistics
 */
const getStats = (req, res) => {
  try {
    const accuracy = gameState.totalAttempts > 0 
      ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100)
      : 0;
    
    return res.json({
      totalAttempts: gameState.totalAttempts,
      correctAnswers: gameState.correctAnswers,
      wrongAnswers: gameState.totalAttempts - gameState.correctAnswers,
      accuracy,
      level: gameState.level,
      levelDescription: getLevelDescription(gameState.level),
      consecutiveCorrect: gameState.consecutiveCorrect
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

/**
 * Reset game statistics
 */
const resetStats = (req, res) => {
  try {
    gameState = {
      level: 1,
      totalAttempts: 0,
      correctAnswers: 0,
      consecutiveCorrect: 0,
      attempts: []
    };
    currentPuzzle = null;
    
    return res.json({ 
      message: 'Stats reset successfully',
      ...gameState 
    });
  } catch (error) {
    console.error('Error resetting stats:', error);
    res.status(500).json({ error: 'Failed to reset stats' });
  }
};

/**
 * Get attempt history
 */
const getAttemptHistory = (req, res) => {
  try {
    return res.json({
      totalAttempts: gameState.totalAttempts,
      correctAnswers: gameState.correctAnswers,
      level: gameState.level,
      attempts: gameState.attempts.map(att => ({
        answer: att.answer,
        correct: att.correct,
        expected: att.expected,
        level: att.level,
        timestamp: att.timestamp
      }))
    });
  } catch (error) {
    console.error('Error getting attempt history:', error);
    res.status(500).json({ error: 'Failed to get attempt history' });
  }
};

module.exports = {
  generateNewPuzzle,
  submitAnswer,
  getStats,
  resetStats,
  getAttemptHistory
};
