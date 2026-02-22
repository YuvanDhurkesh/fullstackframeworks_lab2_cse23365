/**
 * DrawingBoard Component
 * Allows students to draw their answer on a digital canvas and uses OCR to detect the number
 */

import React, { useRef, useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

export default function DrawingBoard({ onSubmit, correctAnswer = null, showResult = false, maxValue = 100 }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [lineWidth, setLineWidth] = useState(8); // Thicker line for better OCR
  const [color, setColor] = useState('#000000'); // Pure black for better OCR
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedValue, setDetectedValue] = useState(null);
  const [status, setStatus] = useState('');

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

    // Fill with white background (crucial for OCR)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setContext(ctx);
  }, []);

  // Update line width in context
  useEffect(() => {
    if (context) context.lineWidth = lineWidth;
  }, [lineWidth, context]);

  // Update color in context
  useEffect(() => {
    if (context) context.strokeStyle = color;
  }, [color, context]);

  /**
   * Get mouse position relative to canvas
   */
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  /**
   * Handle mouse down / touch start - start drawing
   */
  const handleStartDrawing = (e) => {
    if (showResult || isProcessing) return;
    setIsDrawing(true);
    const pos = getMousePos(e);
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  };

  /**
   * Handle mouse move / touch move - draw on canvas
   */
  const handleDrawing = (e) => {
    if (!isDrawing || !context || showResult || isProcessing) return;
    const pos = getMousePos(e);
    context.lineTo(pos.x, pos.y);
    context.stroke();
  };

  /**
   * Handle mouse up / touch end - stop drawing
   */
  const handleEndDrawing = () => {
    setIsDrawing(false);
    if (context) context.closePath();
  };

  /**
   * Keyboard Shortcuts for Drawing Board
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [context, showResult, isProcessing]); // Added isProcessing to dependencies

  /**
   * Clear the canvas
   */
  const handleClear = () => {
    if (showResult || isProcessing || !context) return;
    const canvas = canvasRef.current;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setDetectedValue(null);
    setStatus('');
  };

  /**
   * OCR Detection Logic using Tesseract.js
   */
  const detectAndSubmit = async () => {
    if (showResult || isProcessing || !context) return;

    try {
      setIsProcessing(true);
      setStatus('🔍 Analyzing drawing...');

      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');

      // Run OCR focused on digits
      const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setStatus(`🔍 Detecting... ${Math.round(m.progress * 100)}%`);
          }
        },
        // Tell tesseract to focus on digits
        tessedit_char_whitelist: '0123456789'
      });

      // Clean up the detected text
      const trimmedText = text.trim();
      const match = trimmedText.match(/\d+/); // Get first sequence of digits

      if (match) {
        const value = parseInt(match[0]);
        setDetectedValue(value);
        setStatus(`✨ Detected: ${value}`);

        // Wait a small moment so the user can see what was detected
        setTimeout(() => {
          onSubmit(value);
          setIsProcessing(false);
        }, 800);
      } else {
        setStatus('❌ Could not read digits. Try drawing more clearly!');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setStatus('❌ Analytics error. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">✍️ Draw Your Answer</h3>
        <p className="text-sm text-gray-600">The AI will detect the number you draw!</p>
      </div>

      {/* Canvas Drawing Area */}
      <div
        className="relative border-4 border-purple-400 rounded-lg shadow-lg bg-white overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawing}
          onMouseUp={handleEndDrawing}
          onMouseLeave={handleEndDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDrawing}
          onTouchEnd={handleEndDrawing}
          className={`cursor-crosshair block touch-none ${isProcessing ? 'opacity-50' : ''}`}
          style={{ width: '500px', height: '300px' }}
        />

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className={`text-md font-bold h-6 ${status.includes('❌') ? 'text-red-500' : 'text-purple-600'}`}>
        {status}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {/* Pen Controls */}
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
            <span className="text-xs font-bold text-gray-500 uppercase">Size</span>
            <input
              type="range"
              min="4"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="flex-1"
              disabled={showResult || isProcessing}
            />
          </div>
          <button
            onClick={handleClear}
            disabled={showResult || isProcessing}
            className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all border"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Detect & Submit Button */}
        <button
          onClick={detectAndSubmit}
          disabled={showResult || isProcessing}
          className="w-full px-8 py-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-2xl shadow-lg flex items-center justify-center gap-3"
        >
          {isProcessing ? '🤖 Detecting...' : '🚀 Detect & Submit'}
        </button>
      </div>

      {/* Result Display after detection */}
      {showResult && correctAnswer !== null && (
        <div className="w-full max-w-md mx-auto p-4 bg-blue-50 border-2 border-blue-400 rounded-lg text-center">
          <p className="text-sm font-semibold text-blue-700">Correct Answer: <span className="text-2xl font-bold">{correctAnswer}</span></p>
        </div>
      )}
    </div>
  );
}
