/**
 * API Service for Math Puzzle Game
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = 'http://localhost:5001/api/puzzle';

/**
 * Check if backend is available
 */
const checkBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/helpers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Generate a new puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 */
export const generatePuzzle = async (difficulty = 'medium') => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate?difficulty=${difficulty}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating puzzle:', error);
    throw new Error(`Failed to generate puzzle: ${error.message}`);
  }
};

/**
 * Submit an answer to the current puzzle
 * @param {number} answer - The user's answer
 */
export const submitAnswer = async (answer) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: Number(answer) }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw new Error(`Failed to submit answer: ${error.message}`);
  }
};

/**
 * Get current game statistics
 */
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }
};

/**
 * Reset all game statistics
 */
export const resetStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error resetting stats:', error);
    throw new Error(`Failed to reset stats: ${error.message}`);
  }
};

/**
 * Get attempt history
 */
export const getAttemptHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw new Error(`Failed to fetch history: ${error.message}`);
  }
};

export { checkBackendHealth };
