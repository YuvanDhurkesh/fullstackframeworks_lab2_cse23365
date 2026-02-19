/**
 * ResizableNumberSelector Component
 * An interactive number selector where users drag to resize a box
 * Larger box = Larger number
 * Perfect for kids with autism - visual and tactile interaction
 */

import React, { useState, useRef, useEffect } from 'react';

export default function ResizableNumberSelector({ value, onChange, maxValue = 100 }) {
  const boxRef = useRef(null);
  const sliderRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [boxSize, setBoxSize] = useState(50);
  const [displayNumber, setDisplayNumber] = useState(value || 0);
  const [inputMethod, setInputMethod] = useState('box'); // 'box' or 'slider'

  // Convert box size to number (0-200px box = 0-maxValue number)
  const sizeToNumber = (size) => {
    return Math.round((size / 200) * maxValue);
  };

  // Convert number to box size
  const numberToSize = (num) => {
    return (num / maxValue) * 200;
  };

  // Handle mouse down on resize handle
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !boxRef.current) return;

      const rect = boxRef.current.getBoundingClientRect();
      const newSize = Math.max(40, Math.min(200, e.clientX - rect.left));
      
      setBoxSize(newSize);
      const newNumber = sizeToNumber(newSize);
      setDisplayNumber(newNumber);
      onChange(newNumber);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onChange]);

  // Handle slider input
  const handleSliderChange = (e) => {
    const newNum = parseInt(e.target.value);
    setDisplayNumber(newNum);
    setBoxSize(numberToSize(newNum));
    onChange(newNum);
  };

  // Handle keyboard input
  const handleKeyPress = (e) => {
    const num = parseInt(e.key);
    if (!isNaN(num)) {
      const newNum = Math.min(maxValue, num);
      setDisplayNumber(newNum);
      setBoxSize(numberToSize(newNum));
      onChange(newNum);
    }
  };

  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        const newNum = Math.min(maxValue, displayNumber + 1);
        setDisplayNumber(newNum);
        setBoxSize(numberToSize(newNum));
        onChange(newNum);
      } else if (e.key === 'ArrowDown') {
        const newNum = Math.max(0, displayNumber - 1);
        setDisplayNumber(newNum);
        setBoxSize(numberToSize(newNum));
        onChange(newNum);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayNumber, onChange, maxValue]);

  useEffect(() => {
    if (value !== undefined && value !== displayNumber) {
      setDisplayNumber(value);
      setBoxSize(numberToSize(value));
    }
  }, [value]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Instruction */}
      <div className="text-center mb-2">
        <p className="text-gray-700 font-semibold text-lg">👆 Select a number:</p>
        <p className="text-sm text-gray-500">Drag the box OR use the slider below 👇</p>
      </div>

      {/* Resizable Box Container */}
      <div className="relative w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-4 border-blue-300 p-6">
        <div
          ref={boxRef}
          className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 rounded-lg shadow-2xl transition-all"
          style={{
            width: `${boxSize}px`,
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          {/* Number Display */}
          <div className="text-center">
            <div className="text-7xl font-bold text-white drop-shadow-xl">
              {displayNumber}
            </div>
            <div className="text-white text-sm mt-2 font-semibold drop-shadow">
              {isResizing ? '📏 Dragging...' : '👉 Drag right →'}
            </div>
          </div>

          {/* Resize Handle on the right - LARGER AND MORE VISIBLE */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 rounded-r-lg transition-all shadow-lg cursor-grab hover:cursor-grabbing flex items-center justify-center"
            style={{
              cursor: isResizing ? 'grabbing' : 'grab',
            }}
          >
            <div className="text-white text-xl drop-shadow">⋮⋮</div>
          </div>
        </div>

        {/* Visual Scale Guide */}
        <div className="flex justify-between mt-4 text-xs text-gray-600 font-semibold px-2">
          <span>0️⃣</span>
          <span>{Math.round(maxValue / 4)}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>{Math.round((maxValue * 3) / 4)}</span>
          <span>{maxValue}🔝</span>
        </div>
        <div className="w-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 h-2 rounded-full mt-2" />
      </div>

      {/* Smooth Slider - Easy for small numbers */}
      <div className="w-full bg-white rounded-lg border-4 border-purple-300 p-6">
        <p className="text-center font-semibold text-gray-700 mb-4">📊 Or use the Slider:</p>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max={maxValue}
          value={displayNumber}
          onChange={handleSliderChange}
          className="w-full h-4 bg-gradient-to-r from-blue-300 to-purple-500 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            WebkitAppearance: 'none',
            cursor: 'pointer',
          }}
        />
        <div className="flex justify-between mt-3 text-xs text-gray-500 font-semibold">
          <span>🟢 0</span>
          <span>🟡 {Math.round(maxValue / 2)}</span>
          <span>🔴 {maxValue}</span>
        </div>
      </div>

      {/* Button Controls - Simple alternative */}
      <div className="w-full flex gap-2 items-center justify-center">
        <button
          onClick={() => {
            const newNum = Math.max(0, displayNumber - 5);
            setDisplayNumber(newNum);
            setBoxSize(numberToSize(newNum));
            onChange(newNum);
          }}
          className="px-3 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all text-sm shadow-lg"
        >
          ⬅️ -5
        </button>
        <button
          onClick={() => {
            const newNum = Math.max(0, displayNumber - 1);
            setDisplayNumber(newNum);
            setBoxSize(numberToSize(newNum));
            onChange(newNum);
          }}
          className="px-3 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all text-sm shadow-lg"
        >
          ➖ -1
        </button>
        <span className="text-3xl font-bold text-purple-700 min-w-20 text-center bg-purple-50 px-3 py-2 rounded-lg border-2 border-purple-300">
          {displayNumber}
        </span>
        <button
          onClick={() => {
            const newNum = Math.min(maxValue, displayNumber + 1);
            setDisplayNumber(newNum);
            setBoxSize(numberToSize(newNum));
            onChange(newNum);
          }}
          className="px-3 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all text-sm shadow-lg"
        >
          ➕ +1
        </button>
        <button
          onClick={() => {
            const newNum = Math.min(maxValue, displayNumber + 5);
            setDisplayNumber(newNum);
            setBoxSize(numberToSize(newNum));
            onChange(newNum);
          }}
          className="px-3 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all text-sm shadow-lg"
        >
          ➡️ +5
        </button>
      </div>

      {/* Status Display */}
      <div className="w-full text-center text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 border-2 border-blue-400 shadow-lg">
        <p>🎯 Selected Number: <span className="text-3xl font-bold">{displayNumber}</span></p>
        <p className="text-xs mt-2 opacity-90">Choose any method: drag the box, use the slider, or click the buttons!</p>
      </div>
    </div>
  );
}
