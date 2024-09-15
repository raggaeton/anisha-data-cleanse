(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Inject styles with unique class names
    const style = document.createElement('style');
    style.innerHTML = `
      #youly-306511-container {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 300px !important;
        height: 400px !important;

        background-color: white !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
        z-index: 1000 !important;
        border-radius: 10px !important; 
      }

      #youly-306511-chat-box {
        display: flex !important;
        flex-direction: column !important;
        padding: 10px !important;
        overflow-y: auto !important;
        background-color: #f7f7f7 !important;
        flex-grow: 1 !important;
      }

      #youly-306511-input-area {
        display: flex !important;
        border-top: 1px solid #ccc !important;
      }

      #youly-306511-user-input {
        flex-grow: 1 !important;
        padding: 10px !important;
        border: none !important;
        outline: none !important;
        border-radius: 0 10px; !important
      }

      #youly-306511-send-btn {
        padding: 10px 15px !important;
        background-color: #4CAF50 !important;
        color: white !important;
        border: none !important;
        cursor: pointer !important;
        border-radius: 0 0 10px 0 !important; 
      }

      #youly-306511-send-btn:hover {
        background-color: #45a049 !important;
      }

      .youly-306511-message {
        align-items: flex-end !important;
        border-radius: 5px !important;
        display: flex !important;
        flex-direction: column !important;
        margin-bottom: 10px !important;
        max-width: 80% !important;
        padding: 8px 12px !important;
        word-wrap: break-word !important;
      }

      .youly-306511-user-message {
        background-color: #dcf8c6 !important;
        align-self: flex-end !important;
        text-align: right !important;
      }

      .youly-306511-bot-message {
        background-color: #ffffff !important;
        align-self: flex-start !important;
        text-align: left !important;
      }

      #youly-306511-toggle-btn {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        background: none !important; /* Removed background */
        color: #4CAF50 !important; /* Updated text color */
        padding: 10px !important;
        border: none !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        z-index: 1001 !important;
      }

      .youly-306511-typing-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 2px;
        background-color: #ccc;
        border-radius: 50%;
        animation: youly-306511-bounce 1.4s infinite ease-in-out both;
      }

      .youly-306511-typing-dot:nth-child(1) {
        animation-delay: -0.32s;
      }

      .youly-306511-typing-dot:nth-child(2) {
        animation-delay: -0.16s;
      }

      .youly-306511-timestamp {
        font-size: 0.75em !important; /* Make the font smaller */
        color: #999 !important;
        margin-top: 5px !important;
      }

      @keyframes youly-306511-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        } 40% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    // Inject chatbot HTML
    const chatContainer = document.createElement('div');
    chatContainer.id = 'youly-306511-container';
    chatContainer.innerHTML = `
        <div id="youly-306511-chat-box"></div>
        <div id="youly-306511-input-area">
          <input type="text" id="youly-306511-user-input" placeholder="Type your message here" />
          <button id="youly-306511-send-btn">Send</button>
        </div>
      `;
    document.body.appendChild(chatContainer);

    // Initially hide the chat container
    chatContainer.style.display = 'none';

    // Create the toggle button for the chat
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'youly-306511-toggle-btn';
    document.body.appendChild(toggleBtn);

    // Toggle the visibility of the chat
    toggleBtn.addEventListener('click', () => {
      if (chatContainer.style.display === 'none') {
        chatContainer.style.display = 'flex';
        toggleBtn.style.display = 'none';
      }
    });

    // Chatbot logic
    const chatBox = document.getElementById('youly-306511-chat-box');
    const userInput = document.getElementById('youly-306511-user-input');
    const sendBtn = document.getElementById('youly-306511-send-btn');

    // Load chat history from localStorage
    let chatHistory = JSON.parse(localStorage.getItem('youly-306511-chat-history')) || [];
    chatHistory.forEach((message) => {
      addMessageToChat(message.sender, message.text, message.timestamp, false);
    });

    sendBtn.addEventListener('click', async () => {
      const message = userInput.value;
      if (message.trim() !== '') {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        addMessageToChat('User', message, timestamp);
        userInput.value = ''; // Clear input field

        // Show typing indicator
        const typingIndicator = createTypingIndicator();
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
          const response = await getBotResponse(message);
          chatBox.removeChild(typingIndicator);
          const botTimestamp = new Date().toLocaleTimeString();
          addMessageToChat('Bot', response, botTimestamp);
        } catch (error) {
          chatBox.removeChild(typingIndicator);
          const errorTimestamp = new Date().toLocaleTimeString();
          addMessageToChat('Bot', 'Sorry, something went wrong. Please try again.', errorTimestamp);
        }
      }
    });

    // Allow sending message with Enter key
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });

    function addMessageToChat(sender, message, timestamp, saveToHistory = true) {
      const messageElem = document.createElement('div');
      messageElem.classList.add('youly-306511-message', `youly-306511-${sender.toLowerCase()}-message`);

      messageElem.innerHTML = `
        <div class="youly-306511-message-text">${message}</div>
        <div class="youly-306511-timestamp">${timestamp}</div>
      `;
      chatBox.appendChild(messageElem);
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom

      // Save message to chat history
      if (saveToHistory) {
        chatHistory.push({ sender, text: message, timestamp });
        localStorage.setItem('youly-306511-chat-history', JSON.stringify(chatHistory));
      }
    }

    function createTypingIndicator() {
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('youly-306511-message', 'youly-306511-bot-message', 'youly-306511-typing-indicator');

      typingIndicator.innerHTML = `
          <div class="youly-306511-message-header">
            <strong>Bot</strong> <span class="youly-306511-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="youly-306511-message-text">
            <span class="youly-306511-typing-dot"></span>
            <span class="youly-306511-typing-dot"></span>
            <span class="youly-306511-typing-dot"></span>
          </div>
        `;
      return typingIndicator;
    }

    async function getBotResponse(message) {
      // Simulate network delay for typing indicator
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await fetch(`https://dummyjson.com/quotes/${Math.floor(Math.random() * 20)}?delay=500`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          //   body: JSON.stringify({ message }),
        });
        const data = await response.json();
        return data.quote; // Assuming the API returns a 'reply' field
      } catch (error) {
        throw error;
      }
    }
  });
})();
