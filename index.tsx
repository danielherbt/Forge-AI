import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill for uuid package
import { v4 as uuidv4 } from 'uuid';

// Fix: Augment the Window interface to include uuidv4 to solve the TypeScript error.
declare global {
  interface Window {
    uuidv4: typeof uuidv4;
  }
}
window.uuidv4 = uuidv4;


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);