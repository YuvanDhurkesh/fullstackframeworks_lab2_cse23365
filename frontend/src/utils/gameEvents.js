/**
 * Interactive Event Handler for Math Game
 * Adds keyboard shortcuts, mouse events, and screen capture functionality
 */

export const setupGameKeyboardShortcuts = (callbacks) => {
  const handleKeyDown = (e) => {
    // Number keys (1-9) directly set answer
    if (e.key >= '0' && e.key <= '9') {
      callbacks.onNumberKeyPress?.(parseInt(e.key));
    }

    // Enter/Space to submit
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callbacks.onSubmit?.();
    }

    // R to restart
    if (e.key.toLowerCase() === 'r') {
      callbacks.onRestart?.();
    }

    // S to skip (load next puzzle)
    if (e.key.toLowerCase() === 's') {
      callbacks.onSkip?.();
    }

    // H for help
    if (e.key.toLowerCase() === 'h') {
      callbacks.onHelp?.();
    }

    // Arrow up/down for number adjustment
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      callbacks.onNumberIncrease?.();
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      callbacks.onNumberDecrease?.();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Mouse wheel support for number selection
 */
export const setupMouseWheelEvents = (elementRef, callbacks) => {
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      callbacks.onNumberIncrease?.();
    } else {
      callbacks.onNumberDecrease?.();
    }
  };

  if (elementRef?.current) {
    elementRef.current.addEventListener('wheel', handleWheel, { passive: false });
  }

  return () => {
    if (elementRef?.current) {
      elementRef.current.removeEventListener('wheel', handleWheel);
    }
  };
};

/**
 * Double-click handler
 */
export const setupDoubleClickEvents = (elementRef, callback) => {
  if (elementRef?.current) {
    elementRef.current.addEventListener('dblclick', callback);
  }

  return () => {
    if (elementRef?.current) {
      elementRef.current.removeEventListener('dblclick', callback);
    }
  };
};

/**
 * Screen capture functionality using html2canvas
 */
export const captureScreen = async (elementId, filename = 'math-game-screenshot') => {
  try {
    // Dynamic import to avoid build errors if library not installed
    const html2canvas = (await import('html2canvas')).default;
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      allowTaint: true,
      useCORS: true,
    });

    // Create download link
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${filename}-${new Date().getTime()}.png`;
    link.click();

    return {
      success: true,
      message: '✅ Screenshot saved successfully!',
    };
  } catch (error) {
    console.error('Screenshot error:', error);
    return {
      success: false,
      message: '❌ Failed to capture screenshot. Please try again.',
    };
  }
};

/**
 * Touch support for mobile interactions
 */
export const setupTouchEvents = (callbacks) => {
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    // Horizontal swipe
    if (Math.abs(touchEndX - touchStartX) > 50) {
      if (touchEndX < touchStartX) {
        // Swipe left - decrease
        callbacks.onNumberDecrease?.();
      } else {
        // Swipe right - increase
        callbacks.onNumberIncrease?.();
      }
    }

    // Vertical swipe
    if (Math.abs(touchEndY - touchStartY) > 50) {
      if (touchEndY < touchStartY) {
        // Swipe up - submit
        callbacks.onSubmit?.();
      } else {
        // Swipe down - skip
        callbacks.onSkip?.();
      }
    }
  };

  window.addEventListener('touchstart', handleTouchStart, false);
  window.addEventListener('touchend', handleTouchEnd, false);

  return () => {
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
  };
};

/**
 * Keyboard hint display
 */
export const getKeyboardHints = () => {
  return [
    { key: '0-9', action: 'Set number directly' },
    { key: 'Enter/Space', action: 'Submit answer' },
    { key: 'Arrow Up/Down', action: 'Increase/Decrease number' },
    { key: 'R', action: 'Restart game' },
    { key: 'S', action: 'Skip to next puzzle' },
    { key: 'H', action: 'Show this help' },
    { key: 'P', action: 'Screenshot puzzle' },
  ];
};
