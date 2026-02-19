/**
 * PuzzleStats Component
 * Displays game statistics with visualizations
 */

import React from 'react';

export default function PuzzleStats({ stats }) {
  const { totalAttempts, correctAnswers, wrongAnswers = 0, accuracy = 0 } = stats || {
    totalAttempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    accuracy: 0
  };

  // Calculate percentage for progress bar
  const progressPercentage = accuracy;
  
  // Calculate pie chart segments
  const correctPercent = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  const wrongPercent = totalAttempts > 0 ? Math.round((wrongAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Your Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stats Cards */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{totalAttempts}</p>
              <p className="text-sm text-gray-600 mt-2">Total Attempts</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
              <p className="text-sm text-gray-600 mt-2">Correct</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{wrongAnswers}</p>
              <p className="text-sm text-gray-600 mt-2">Wrong</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold text-gray-700">Accuracy</p>
              <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow">
              <div
                className="bg-gradient-to-r from-green-400 to-purple-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${accuracy}%` }}
              >
                {accuracy > 10 && (
                  <span className="text-white text-xs font-bold">{accuracy}%</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart Alternative - Simple Visual */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="transparent" />
              
              {/* Correct segment */}
              {totalAttempts > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="25"
                  strokeDasharray={`${(correctPercent / 100) * 282.74} 282.74`}
                  strokeDashoffset="0"
                />
              )}
              
              {/* Wrong segment */}
              {totalAttempts > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="25"
                  strokeDasharray={`${(wrongPercent / 100) * 282.74} 282.74`}
                  strokeDashoffset={`-${(correctPercent / 100) * 282.74}`}
                />
              )}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              {totalAttempts > 0 ? (
                <>
                  <p className="text-3xl font-bold text-gray-800">{accuracy}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </>
              ) : (
                <p className="text-center text-gray-600">No attempts yet</p>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-700">Wrong</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Message */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
        {totalAttempts === 0 ? (
          <p className="text-gray-700 font-medium">🎮 Start playing to see your stats!</p>
        ) : accuracy >= 80 ? (
          <p className="text-green-700 font-medium">🌟 Excellent performance! Keep it up!</p>
        ) : accuracy >= 60 ? (
          <p className="text-blue-700 font-medium">👍 Good progress! You're on the right track!</p>
        ) : (
          <p className="text-orange-700 font-medium">💪 Keep practicing! You'll improve!</p>
        )}
      </div>
    </div>
  );
}
