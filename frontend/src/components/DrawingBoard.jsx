/**
 * DrawingBoard Component
 * Allows students to draw their answer on a digital canvas
 */

import React, { useRef, useEffect, useState } from 'react';

export default function DrawingBoard({ onSubmit, correctAnswer = null, showResult = false, maxValue = 100 }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [lineWidth, setLineWidth] = useState(5);
  const [color, setColor] = useState('#1f2937'); // dark gray
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 300;

    // Get context
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setContext(ctx);

    // Add grid lines for reference
    drawGrid(ctx);
  }, []);

  // Update line width in context when it changes
  useEffect(() => {
    if (context) {
      context.lineWidth = lineWidth;
    }
  }, [lineWidth, context]);

  // Update color in context when it changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
    }
  }, [color, context]);

  /**
   * Draw grid lines on canvas for reference
   */
  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= ctx.canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, ctx.canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= ctx.canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(ctx.canvas.width, i);
      ctx.stroke();
    }
  };

  /**
   * Get mouse position relative to canvas
   */
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  /**
   * Handle mouse down - start drawing
   */
  const handleMouseDown = (e) => {
    if (showResult) return; // Don't allow drawing after result shown
    
    setIsDrawing(true);
    const pos = getMousePos(e);
    
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  };

  /**
   * Handle mouse move - draw on canvas
   */
  const handleMouseMove = (e) => {
    if (!isDrawing || !context || showResult) return;

    const pos = getMousePos(e);
    context.lineTo(pos.x, pos.y);
    context.stroke();
  };

  /**
   * Handle mouse up - stop drawing
   */
  const handleMouseUp = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  /**
   * Clear the canvas
   */
  const handleClear = () => {
    const canvas = canvasRef.current;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(context);
  };

  /**
   * Handle drawing submission
   */
  const handleSubmit = () => {
    if (selectedNumber !== null) {
      onSubmit(selectedNumber);
      setSelectedNumber(null);
    }
  };

  /**
   * Quick number selector buttons
   */
  const QuickNumberButtons = () => {
    const numbers = [0, 5, 10, 15, 20, 25, 50, 75, 100];
    
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => setSelectedNumber(num)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              selectedNumber === num
                ? 'bg-purple-600 text-white shadow-lg scale-110'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            disabled={showResult}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">✍️ Draw Your Answer</h3>
        <p className="text-sm text-gray-600">Draw the number you think is the answer below:</p>
      </div>

      {/* Canvas Drawing Area */}
      <div className="border-4 border-purple-400 rounded-lg shadow-lg bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair block touch-none"
          style={{
            width: '500px',
            height: '300px',
            display: 'block'
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {/* Quick Number Selector */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-400">
          <label className="block font-semibold text-gray-700 mb-3 text-center">
            👆 Select Your Answer:
          </label>
          <QuickNumberButtons />
          {selectedNumber !== null && (
            <div className="mt-3 text-center p-2 bg-purple-100 rounded-lg">
              <p className="text-lg font-bold text-purple-700">
                Selected: <span className="text-3xl">{selectedNumber}</span>
              </p>
            </div>
          )}
        </div>

        {/* Line Width Control */}
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <label htmlFor="lineWidth" className="font-semibold text-gray-700">
            ✏️ Pen Size:
          </label>
          <input
            id="lineWidth"
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="flex-1"
            disabled={showResult}
          />
          <span className="text-sm font-bold text-gray-700 min-w-fit">{lineWidth}px</span>
        </div>

        {/* Color Control */}
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <label htmlFor="color" className="font-semibold text-gray-700">
            🎨 Color:
          </label>
          <input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 cursor-pointer rounded border-2 border-gray-300"
            disabled={showResult}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClear}
            disabled={showResult}
            className="flex-1 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            🗑️ Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={showResult || selectedNumber === null}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            ✅ Submit Answer
          </button>
        </div>
      </div>

      {/* Result Message */}
      {showResult && correctAnswer !== null && (
        <div className="w-full max-w-md mx-auto p-4 bg-blue-50 border-2 border-blue-400 rounded-lg text-center">
          <p className="text-sm font-semibold text-blue-700">Correct Answer: <span className="text-2xl font-bold">{correctAnswer}</span></p>
        </div>
      )}
    </div>
  );
}
