(function() {
  // Create widget container
  const container = document.createElement('div');
  container.id = 'octal-chatbot-widget';
  document.body.appendChild(container);

  // Load required styles
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'https://744a4ff2-e35c-4bed-ba3a-135e5179f1ca.lovableproject.com/src/index.css';
  document.head.appendChild(linkElement);

  // Load the widget
  const script = document.createElement('script');
  script.src = 'https://744a4ff2-e35c-4bed-ba3a-135e5179f1ca.lovableproject.com/src/main.tsx';
  script.type = 'module';
  document.body.appendChild(script);

  // Load GPT Engineer script (required for the widget)
  const gptScript = document.createElement('script');
  gptScript.src = 'https://cdn.gpteng.co/gptengineer.js';
  gptScript.type = 'module';
  document.body.appendChild(gptScript);
})();