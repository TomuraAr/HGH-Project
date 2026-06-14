import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { reportError } from './watchupClient'; // Import the reporter

// Add this global error listener
window.onerror = (message, source, lineno, colno, error) => {
  if (error) {
    reportError(error);
  } else {
    // If there's no error object, create a simple one
    reportError(new Error(typeof message === 'string' ? message : 'Unknown error'));
  }
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);