/**
 * PuzzleGame Component
 * Main game component for the Visual Algebra Puzzle Game
 */

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { generatePuzzle, submitAnswer, getStats, resetStats } from '../api/puzzleApi';
import PuzzleStats from './PuzzleStats';
import ResizableNumberSelector from './ResizableNumberSelector';
import DrawingBoard from './DrawingBoard';

export default function PuzzleGame() {
  // Game State
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    accuracy: 0,
    level: 1,
    levelDescription: '😊 Very Easy: Single Digit Addition',
    consecutiveCorrect: 0
  });
  const [puzzleCount, setPuzzleCount] = useState(0);
  const [autoLoadTimer, setAutoLoadTimer] = useState(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [inputMethod, setInputMethod] = useState('drag'); // 'drag', 'type', 'draw'
  const [textAnswer, setTextAnswer] = useState('');
  const [gallery, setGallery] = useState([]); // Array of { id, image, level, time }
  const gameRef = useRef(null);

  /**
   * Handle Screen Capture
   */
  const handleCaptureSuccess = async () => {
    if (!gameRef.current) return;

    try {
      // Temporarily hide the capture button and result message for the shot
      const canvas = await html2canvas(gameRef.current, {
        backgroundColor: '#f3f4f6',
        logging: false,
        useCORS: true,
        scale: 1.5 // Better quality
      });

      const image = canvas.toDataURL("image/png");

      // Save to local gallery
      const newCapture = {
        id: Date.now(),
        image: image,
        level: stats.level,
        time: new Date().toLocaleTimeString()
      };

      setGallery(prev => [newCapture, ...prev].slice(0, 5)); // Keep last 5 successes
      setResultMessage(resultMessage + ' 📸 Saved to Your Gallery!');

      // Also trigger download for the user
      const link = document.createElement('a');
      link.href = image;
      link.download = `puzzle-success-level-${stats.level}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Screen capture failed:', error);
    }
  };

  // Load initial puzzle and stats on mount
  useEffect(() => {
    loadPuzzle(true); // Skip increment for initial load
    loadStats();
  }, []);

  /**
   * Load a new puzzle from the backend
   */
  const loadPuzzle = async (skipIncrement = false) => {
    try {
      setLoading(true);
      setAnswer('');
      setTextAnswer('');
      setInputMethod('drag');
      setShowResult(false);
      setLeveledUp(false);

      const newPuzzle = await generatePuzzle();
      setPuzzle(newPuzzle);
      setResultMessage('');

      if (!skipIncrement) {
        setPuzzleCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setResultMessage('❌ Failed to load puzzle. Please ensure the backend server is running on port 5001.');
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load current stats from backend
   */
  const loadStats = async () => {
    try {
      const newStats = await getStats();
      setStats(newStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Initialize with default stats if fetch fails
      setStats({
        totalAttempts: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0
      });
    }
  };

  /**
   * Handle timer expiration
   */
  const handleTimerExpired = () => {
    setResultMessage('⏰ Time\'s up! Moving to next puzzle...');
    setShowResult(true);
    setTimeout(() => {
      loadPuzzle();
    }, 2000);
  };

  /**
   * Keyboard Shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in the input field
      if (document.activeElement.tagName === 'INPUT' && e.key !== 'Enter') return;

      switch (e.key.toLowerCase()) {
        case '1':
          if (!showResult && !loading) setInputMethod('drag');
          break;
        case '2':
          if (!showResult && !loading) setInputMethod('type');
          break;
        case '3':
          if (!showResult && !loading) setInputMethod('draw');
          break;
        case 'enter':
          if (!loading) {
            if (showResult) {
              loadPuzzle();
            } else {
              submitCurrentAnswer();
            }
          }
          break;
        case 's':
          if (showResult && isCorrect) handleCaptureSuccess();
          break;
        case 'n':
          if (showResult) loadPuzzle();
          break;
        case 'r':
          handleResetStats();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, showResult, isCorrect, inputMethod, answer, textAnswer]);

  /**
   * Generic submit handler for all input methods
   */
  const submitCurrentAnswer = async (answerValue) => {
    const answerToSubmit = answerValue !== undefined && answerValue !== null ? answerValue : (inputMethod === 'type' ? textAnswer : answer);

    if (!answerToSubmit && answerToSubmit !== 0 && answerToSubmit !== '0') {
      setResultMessage('⚠️ Please enter an answer!');
      setShowResult(true);
      return;
    }

    try {
      setLoading(true);

      const result = await submitAnswer(parseInt(answerToSubmit));

      setIsCorrect(result.correct);
      setCorrectAnswer(result.correctAnswer);

      const newStats = {
        totalAttempts: result.totalAttempts,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.totalAttempts - result.correctAnswers,
        accuracy: result.accuracy,
        level: result.level,
        levelDescription: result.levelDescription,
        consecutiveCorrect: result.consecutiveCorrect
      };

      setStats(newStats);

      if (result.correct) {
        if (result.leveledUp) {
          setLeveledUp(true);
          setResultMessage(`✅ Correct! 🎉 LEVEL UP! Now Level ${result.level}`);
        } else if (result.consecutiveCorrect > 0) {
          setResultMessage(`✅ Correct! (${result.consecutiveCorrect}/3 to level up)`);
        } else {
          setResultMessage('✅ Correct! Great job!');
        }
      } else {
        setResultMessage(`❌ Wrong! The correct answer is ${result.correctAnswer}`);
      }

      setShowResult(true);

      // Clear existing timer if any
      if (autoLoadTimer) {
        clearTimeout(autoLoadTimer);
      }

      // Auto-load next puzzle after 3 seconds (increased for better reading)
      const timer = setTimeout(() => {
        loadPuzzle();
      }, 3000);

      setAutoLoadTimer(timer);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setResultMessage('❌ Failed to submit answer. Please try again.');
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle answer submission from drag/type input
   */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    submitCurrentAnswer();
  };

  /**
   * Handle reset stats
   */
  const handleResetStats = async () => {
    if (window.confirm('Are you sure you want to reset all progress? You will start from Level 1.')) {
      try {
        await resetStats();
        setStats({
          totalAttempts: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          accuracy: 0,
          level: 1,
          levelDescription: '😊 Very Easy: Single Digit Addition',
          consecutiveCorrect: 0
        });
        setPuzzleCount(0);
        setLeveledUp(false);
        setResultMessage('🔄 Progress reset! Starting from Level 1...');
        setShowResult(true);
        setTimeout(() => {
          setShowResult(false);
          loadPuzzle(true);
        }, 2000);
      } catch (error) {
        console.error('Error resetting stats:', error);
        setResultMessage('❌ Failed to reset progress.');
        setShowResult(true);
      }
    }
  };

  return (
    <div ref={gameRef} className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-purple-700 mb-2">🧮 Play with Math</h1>
          <p className="text-lg text-gray-700">Start with simple addition and progressively increase difficulty!</p>
        </div>

        {/* Level Display */}
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold">⭐ Level {stats.level}</h2>
              <p className="text-lg mt-2">{stats.levelDescription}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white text-blue-600 rounded-lg p-4 text-center shadow">
                <p className="text-sm font-semibold">Progress</p>
                <p className="text-2xl font-bold">{stats.consecutiveCorrect}/3</p>
              </div>
              <button
                onClick={handleResetStats}
                className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
              >
                🔄 Restart
              </button>
            </div>
          </div>
        </div>

        {/* Main Game Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          {/* Loading State */}
          {loading && !puzzle ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin mb-4">
                <div className="border-4 border-purple-200 border-t-purple-600 rounded-full w-16 h-16"></div>
              </div>
              <p className="text-gray-700 font-semibold">Loading puzzle...</p>
            </div>
          ) : puzzle ? (
            <>
              {/* Visual Equation Cards - Show the 3 base equations */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Figure Out the Values:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {puzzle.equation && puzzle.equation.map((eq, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-pink-100 to-pink-50 border-4 border-pink-400 rounded-xl p-6 shadow-lg text-center"
                    >
                      <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                        {eq.helpers.map((helper, hIdx) => (
                          <React.Fragment key={hIdx}>
                            <span className="text-4xl">{helper.emoji}</span>
                            {hIdx < eq.helpers.length - 1 && (
                              <span className="text-3xl font-bold text-pink-600">{eq.operation || '+'}</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="text-2xl font-bold text-gray-800">= {eq.total}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Question with Visual Equation */}
              <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 border-4 border-yellow-400 text-center">
                <h2 className="text-sm text-gray-600 font-semibold mb-6">❓ Now Solve This:</h2>
                <div className="text-5xl font-bold text-gray-800 mb-4">
                  {puzzle.question}
                </div>
              </div>

              {/* Puzzle Counter */}
              {puzzleCount > 0 && (
                <div className="text-center mb-6 text-gray-700 font-semibold text-lg">
                  Puzzle #{puzzleCount}
                </div>
              )}

              {/* Answer Selection Methods - Multi-Tab Interface */}
              {!showResult && (
                <div className="mb-6">
                  {/* Method Selector Tabs */}
                  <div className="flex gap-3 mb-6 justify-center flex-wrap">
                    <button
                      onClick={() => setInputMethod('drag')}
                      className={`px-6 py-3 font-bold rounded-lg transition-all shadow-md group ${inputMethod === 'drag'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105 shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      disabled={loading}
                    >
                      🎯 Drag Helper <span className="ml-2 px-1.5 py-0.5 bg-black bg-opacity-10 rounded text-xs">1</span>
                    </button>
                    <button
                      onClick={() => setInputMethod('type')}
                      className={`px-6 py-3 font-bold rounded-lg transition-all shadow-md group ${inputMethod === 'type'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      disabled={loading}
                    >
                      ⌨️ Type Answer <span className="ml-2 px-1.5 py-0.5 bg-black bg-opacity-10 rounded text-xs">2</span>
                    </button>
                    <button
                      onClick={() => setInputMethod('draw')}
                      className={`px-6 py-3 font-bold rounded-lg transition-all shadow-md group ${inputMethod === 'draw'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white scale-105 shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      disabled={loading}
                    >
                      ✍️ Draw Answer <span className="ml-2 px-1.5 py-0.5 bg-black bg-opacity-10 rounded text-xs">3</span>
                    </button>
                  </div>

                  {/* Drag Input Method */}
                  {inputMethod === 'drag' && (
                    <div className="mb-6">
                      <ResizableNumberSelector
                        value={answer}
                        onChange={setAnswer}
                        maxValue={100}
                      />
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-lg flex items-center gap-2"
                        >
                          ✅ Submit Answer <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-sm">Enter</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Type Input Method */}
                  {inputMethod === 'type' && (
                    <div className="mb-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">⌨️ Type Your Answer</h3>
                          <p className="text-sm text-gray-600">Enter the number you think is correct:</p>
                        </div>
                        <input
                          type="number"
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          placeholder="Enter your answer..."
                          className="w-full max-w-md px-6 py-4 text-3xl text-center font-bold border-4 border-green-400 rounded-lg focus:outline-none focus:border-green-600 transition-all shadow-inner"
                          autoFocus
                          disabled={loading}
                        />
                      </div>
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => submitCurrentAnswer(textAnswer)}
                          disabled={loading}
                          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-lg flex items-center gap-2"
                        >
                          ✅ Submit Answer <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-sm">Enter</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Draw Input Method */}
                  {inputMethod === 'draw' && (
                    <div className="mb-6">
                      <DrawingBoard
                        onSubmit={submitCurrentAnswer}
                        correctAnswer={correctAnswer}
                        showResult={showResult}
                        maxValue={100}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Result Message with Level Up Animation */}
              {showResult && (
                <div>
                  <div className={`p-6 rounded-lg text-center text-lg font-bold mb-6 transition-all transform scale-100 ${leveledUp
                    ? 'bg-yellow-100 text-yellow-700 border-4 border-yellow-500 animate-bounce'
                    : isCorrect
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-red-100 text-red-700 border-2 border-red-500'
                    }`}>
                    {resultMessage}
                    <p className="text-sm mt-3 font-normal">Next puzzle loading in 3s... (or press <strong>Enter</strong>)</p>
                  </div>

                  {/* Show the deduced values AFTER answer submission */}
                  <div className="mb-6 p-6 bg-green-50 rounded-lg border-4 border-green-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                      <span className="text-2xl">✅</span> So These Equal:
                    </h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {puzzle.knowledgeCards && puzzle.knowledgeCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-green-100 to-green-50 border-4 border-green-500 rounded-xl p-6 shadow-lg text-center transform hover:scale-110 transition-transform cursor-help"
                        >
                          <p className="text-5xl mb-2">{card.helper.emoji}</p>
                          <p className="text-3xl font-bold text-green-700">{card.value}</p>
                          <p className="text-sm text-gray-700 mt-2 font-semibold">{card.helper.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              {showResult && (
                <button
                  onClick={loadPuzzle}
                  className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2"
                >
                  ➡️ Next Puzzle <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-sm font-normal">Enter</span>
                </button>
              )}

              {/* Screen Capture Button */}
              {showResult && isCorrect && (
                <button
                  onClick={handleCaptureSuccess}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2"
                >
                  📸 Capture Success! <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-sm font-normal">S</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 font-semibold mb-6 text-2xl">Ready to learn math?</p>
              <p className="text-gray-600 mb-8 text-lg">Start at Level 1 and progress through 20 increasingly difficult levels!</p>
              <button
                onClick={() => loadPuzzle(true)}
                className="px-12 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-2xl font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                🚀 Start Level 1 - Simple Addition!
              </button>
            </div>
          )}
        </div>

        {/* Global Keyboard Shortcut Hints */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 hidden md:flex">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded shadow-sm">1</kbd>-<kbd className="px-1.5 py-0.5 bg-gray-100 border rounded shadow-sm">3</kbd> Modes
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded shadow-sm">Enter</kbd> Submit/Next
          </div>
          {showResult && isCorrect && (
            <>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded shadow-sm">S</kbd> Capture
              </div>
            </>
          )}
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded shadow-sm">R</kbd> Reset
          </div>
        </div>

        {/* Statistics Display */}
        <PuzzleStats stats={stats} />

        {/* Success Gallery */}
        {gallery.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🏆 Success Gallery <span className="text-sm font-normal text-gray-500">(Your Last {gallery.length} Wins)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gallery.map(cap => (
                <div key={cap.id} className="relative group">
                  <img
                    src={cap.image}
                    alt={`Success Level ${cap.level}`}
                    className="rounded-lg shadow-md border-2 border-purple-100 group-hover:border-purple-400 transition-all"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center text-white p-2 text-center text-sm">
                    <p className="font-bold">Level {cap.level}</p>
                    <p>{cap.time}</p>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = cap.image;
                        link.download = `success-level-${cap.level}.png`;
                        link.click();
                      }}
                      className="mt-2 bg-white text-purple-600 px-3 py-1 rounded-full font-bold hover:bg-purple-50"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📖 How to Play</h3>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li>👥 <strong>Learn the Helpers:</strong> Each helper has a number value. Doctor might be worth 10, Chef might be worth 5, etc.</li>
            <li>📚 <strong>See Examples:</strong> We show you example equations to help you figure out the values.</li>
            <li>🤔 <strong>Solve the Problem:</strong> Use what you learned to answer the question. What is Chef + Doctor?</li>
            <li>🪄 <strong>Choose Your Method:</strong> You can drag numbers, type them, or even draw them!</li>
            <li>📈 <strong>Level Up:</strong> Get 3 correct in a row to advance to the next level!</li>
            <li>⌨️ <strong>Power User:</strong> Use number keys <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-sm">1</kbd>-<kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-sm">3</kbd> to switch modes and <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-sm">Enter</kbd> to submit!</li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-800 font-semibold">💡 Example:</p>
            <p className="text-blue-700 font-semibold text-lg">👨‍⚕️ + 👨‍⚕️ = 20</p>
            <p className="text-blue-700 text-sm font-semibold">(So Doctor = 10)</p>
            <p className="text-blue-700 font-semibold text-lg mt-2">👨‍🍳 + 👨‍🍳 = 10</p>
            <p className="text-blue-700 text-sm font-semibold">(So Chef = 5)</p>
            <p className="text-blue-700 font-semibold text-lg mt-2">❓ 👨‍🍳 + 👨‍⚕️ = ?</p>
            <p className="text-blue-700 text-sm mt-2">Answer: 5 + 10 = <span className="font-bold">15</span> ✅</p>
          </div>
        </div>
      </div>
    </div>
  );
}
