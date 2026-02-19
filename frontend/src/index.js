import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelperProvider } from './context/HelperContext';

// Suppress MetaMask and extension-related errors
window.addEventListener('error', (event) => {
  if (
    event.message?.includes('MetaMask') ||
    event.message?.includes('chrome-extension') ||
    event.message?.includes('__REACT') ||
    (event.filename && event.filename.includes('chrome-extension'))
  ) {
    event.preventDefault();
  }
}, true);

// Suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('MetaMask') ||
    event.reason?.message?.includes('chrome-extension') ||
    (event.reason && typeof event.reason === 'string' && event.reason.includes('MetaMask'))
  ) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelperProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelperProvider>
  </React.StrictMode>
);
