(function() {
  // Create widget container
  const container = document.createElement('div');
  container.id = 'lovable-chatbot-widget';
  document.body.appendChild(container);

  // Load required styles
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = 'YOUR_DEPLOYED_URL/index.css';
  document.head.appendChild(linkElement);

  // Load React and ReactDOM
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  // Load dependencies and initialize widget
  Promise.all([
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js')
  ]).then(() => {
    // Load the widget
    const script = document.createElement('script');
    script.src = 'YOUR_DEPLOYED_URL/main.js';
    script.type = 'module';
    document.body.appendChild(script);
  });
})();