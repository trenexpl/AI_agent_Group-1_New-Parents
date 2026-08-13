import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Catch and suppress cross-origin third-party script errors from breaking app execution
if (typeof window !== 'undefined') {
  window.onerror = function (msg) {
    if (msg === 'Script error.' || String(msg).includes('Script error')) {
      return true; // Suppress Script error. from surfacing
    }
    return false;
  };
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || event.message?.includes('Script error')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

