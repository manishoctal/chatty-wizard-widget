import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatBot } from './components/ChatBot';
import './index.css';

// Check if running in widget mode
const widgetContainer = document.getElementById('octal-chatbot-widget');
const root = ReactDOM.createRoot(
  widgetContainer || document.getElementById('root')!
);

// If in widget mode, only render the ChatBot component
if (widgetContainer) {
  root.render(
    <React.StrictMode>
      <ChatBot />
    </React.StrictMode>
  );
} else {
  // Regular app mode - render the full application
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}