(function() {
  // 1. Find the script tag to extract the client ID
  const scripts = document.getElementsByTagName('script');
  let clientId = null;
  let apiBase = 'http://localhost:3000'; // Default to localhost for dev

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('widget.js')) {
      clientId = scripts[i].getAttribute('data-clovrr-id');
      const url = new URL(scripts[i].src);
      apiBase = url.origin;
      break;
    }
  }

  if (!clientId) {
    console.error('Clovrr Widget: data-clovrr-id attribute is missing on the script tag.');
    return;
  }

  // 2. Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    #clovrr-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #clovrr-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: #10b981;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: none;
      transition: transform 0.2s;
    }
    #clovrr-chat-button:hover {
      transform: scale(1.05);
    }
    #clovrr-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    #clovrr-chat-header {
      background-color: #10b981;
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #clovrr-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    #clovrr-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #f9fafb;
    }
    .clovrr-message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
    }
    .clovrr-message.bot {
      background-color: #e5e7eb;
      color: #1f2937;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .clovrr-message.user {
      background-color: #10b981;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    #clovrr-chat-input-area {
      padding: 12px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    #clovrr-chat-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      outline: none;
      font-size: 14px;
    }
    #clovrr-chat-input:focus {
      border-color: #10b981;
    }
    #clovrr-send-btn {
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 0 16px;
      font-weight: 600;
      cursor: pointer;
    }
    #clovrr-send-btn:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
    .clovrr-typing {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
      background-color: #e5e7eb;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      width: fit-content;
    }
    .clovrr-dot {
      width: 6px;
      height: 6px;
      background-color: #6b7280;
      border-radius: 50%;
      animation: clovrr-bounce 1.4s infinite ease-in-out both;
    }
    .clovrr-dot:nth-child(1) { animation-delay: -0.32s; }
    .clovrr-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes clovrr-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // 3. Build HTML Structure
  const container = document.createElement('div');
  container.id = 'clovrr-widget-container';

  container.innerHTML = `
    <div id="clovrr-chat-window">
      <div id="clovrr-chat-header">
        <span>Chat with us</span>
        <button id="clovrr-close-btn">&times;</button>
      </div>
      <div id="clovrr-chat-messages">
        <div class="clovrr-message bot">Hi there! How can we help you today?</div>
      </div>
      <form id="clovrr-chat-input-area">
        <input type="text" id="clovrr-chat-input" placeholder="Type a message..." autocomplete="off" />
        <button type="submit" id="clovrr-send-btn">Send</button>
      </form>
    </div>
    <button id="clovrr-chat-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
  `;
  document.body.appendChild(container);

  // 4. Logic
  const chatButton = document.getElementById('clovrr-chat-button');
  const chatWindow = document.getElementById('clovrr-chat-window');
  const closeBtn = document.getElementById('clovrr-close-btn');
  const form = document.getElementById('clovrr-chat-input-area');
  const input = document.getElementById('clovrr-chat-input');
  const messagesDiv = document.getElementById('clovrr-chat-messages');
  const sendBtn = document.getElementById('clovrr-send-btn');

  // Generate a random session ID for this user
  let sessionId = localStorage.getItem('clovrr_session_id');
  if (!sessionId) {
    sessionId = 'web_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('clovrr_session_id', sessionId);
  }

  let isOpen = false;

  const toggleChat = () => {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) input.focus();
  };

  chatButton.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  const addMessage = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = \`clovrr-message \${sender}\`;
    msgDiv.innerText = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  const showTyping = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'clovrr-typing';
    typingDiv.id = 'clovrr-typing-indicator';
    typingDiv.innerHTML = '<div class="clovrr-dot"></div><div class="clovrr-dot"></div><div class="clovrr-dot"></div>';
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  const removeTyping = () => {
    const indicator = document.getElementById('clovrr-typing-indicator');
    if (indicator) indicator.remove();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
      const response = await fetch(\`\${apiBase}/api/webhook/webchat\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          session_id: sessionId,
          message: text
        })
      });

      const data = await response.json();
      removeTyping();
      sendBtn.disabled = false;
      
      if (response.ok && data.text) {
        addMessage(data.text, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (err) {
      removeTyping();
      sendBtn.disabled = false;
      addMessage('Network error. Please try again.', 'bot');
    }
  });

})();
