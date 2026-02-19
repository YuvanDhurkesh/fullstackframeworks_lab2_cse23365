/**
 * Math Puzzle Routes
 * Handles all endpoints for the Visual Algebra Puzzle Game
 */

const express = require('express');
const router = express.Router();
const {
  generateNewPuzzle,
  submitAnswer,
  getStats,
  resetStats,
  getAttemptHistory
} = require('../controllers/puzzleController');

/**
 * GET /api/puzzle/generate
 * Generates a new puzzle
 * Query params: difficulty (easy, medium, hard)
 */
router.get('/generate', generateNewPuzzle);

/**
 * POST /api/puzzle/submit
 * Submits an answer for the current puzzle
 * Body: { answer: number }
 */
router.post('/submit', submitAnswer);

/**
 * GET /api/puzzle/stats
 * Gets current game statistics
 */
router.get('/stats', getStats);

/**
 * POST /api/puzzle/reset
 * Resets all game statistics
 */
router.post('/reset', resetStats);

/**
 * GET /api/puzzle/history
 * Gets attempt history (optional feature)
 */
router.get('/history', getAttemptHistory);

module.exports = router;
