import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelperProvider } from './context/HelperContext';

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
