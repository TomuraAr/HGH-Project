import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// The reporting logic is now inside this file so it can't "get lost"
const reportError = async (error: Error) => {
  const API_KEY = import.meta.env.VITE_WATCHUP_API_KEY;
  const URL = 'https://api.watchup.site/v1/events';

  try {
    await fetch(URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ message: error.message, stack: error.stack })
    });
  } catch (e) { console.error("Reporting failed", e); }
};

window.onerror = (message, source, lineno, colno, error) => {
  reportError(error || new Error(typeof message === 'string' ? message : 'Unknown'));
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode><App /></React.StrictMode>
);