import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatBot } from './components/ChatBot';
import App from './App';
import './index.css';

// Check if running in widget mode
const widgetContainer = document.getElementById('lovable-chatbot-widget');
const rootElement = widgetContainer || document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render only ChatBot in widget mode, full App otherwise
root.render(
  <React.StrictMode>
    {widgetContainer ? <ChatBot /> : <App />}
  </React.StrictMode>
);