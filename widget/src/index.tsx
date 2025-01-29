import { ChatBot } from './components/ChatBot';

export { ChatBot };

// Initialize function to setup the widget
export const initChatWidget = (containerId: string = 'chat-widget-container') => {
  const container = document.createElement('div');
  container.id = containerId;
  document.body.appendChild(container);

  // Load styles
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'YOUR_DEPLOYED_CSS_URL/index.css';
  document.head.appendChild(linkElement);
};