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
        display: flex;
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
        border-radius: 0 10px !important;
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
        background: none !important;
        color: #4CAF50 !important;
        background-color: #45a049 !important;
        border-radius: 20px !important;
        padding: 10px !important;
        border: none !important;
        cursor: pointer !important;
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
        font-size: 0.75em !important;
        color: #999 !important;
        margin-top: 5px !important;
      }

      .hidden {
        display: none !important;
      }

      @keyframes youly-306511-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      #youly-306511-header {
        display: flex !important;
        justify-content: flex-end !important;
        align-items: center !important;
        padding: 5px !important;
        background-color: #4CAF50 !important;
        border-top-left-radius: 10px !important;
        border-top-right-radius: 10px !important;
      }

      #youly-306511-close-btn {
        background: none !important;
        border: none !important;
        font-weight: bold !important;
        font-size: 20px !important;
        cursor: pointer !important;
        color: white !important;
        margin-right: 10px !important;
      }
    `;
    document.head.appendChild(style);

    // Inject chatbot HTML
    const chatContainer = document.createElement('div');
    chatContainer.id = 'youly-306511-container';
    chatContainer.innerHTML = `
      <div id="youly-306511-header">
        <button id="youly-306511-close-btn">X</button>
      </div>
      <div id="youly-306511-chat-box"></div>
      <div id="youly-306511-input-area">
        <input type="text" id="youly-306511-user-input" placeholder="Type your message here" />
        <button id="youly-306511-send-btn">Send</button>
      </div>
    `;
    document.body.appendChild(chatContainer);

    // Check if a user ID exists in localStorage
    let userId = localStorage.getItem('youly-306511-user-id');
    // Check the stored status in localStorage
    let chatStatus = localStorage.getItem('youly-306511-chat-status');


    function generateUserId() {
      // Use crypto.randomUUID() if available
      if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
      } else {
        // Fallback to a custom UUID generator
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
    }

    // If status is 'open', show the chat container; else, hide it
    if (chatStatus === 'open') {
      showChatContainer();
    } else {
      hideChatContainer();
    }
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem('youly-306511-user-id', userId);
    }

    // Create the toggle button for the chat
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'youly-306511-toggle-btn';
    toggleBtn.innerHTML = '💬';
    document.body.appendChild(toggleBtn);

    // Toggle the visibility of the chat
    toggleBtn.addEventListener('click', () => {
      if (chatContainer.classList.contains('hidden')) {
        showChatContainer();
      } else {
        hideChatContainer();
      }
    });

    // Functions to show and hide the chat container
    function showChatContainer() {
      chatContainer.classList.remove('hidden');
      toggleBtn.classList.add('hidden'); // Hide the toggle button
      localStorage.setItem('youly-306511-chat-status', 'open'); // Store status as 'open'
    }

    function hideChatContainer() {
      chatContainer.classList.add('hidden');
      toggleBtn.classList.remove('hidden'); // Show the toggle button
      localStorage.setItem('youly-306511-chat-status', 'closed'); // Store status as 'closed'
    }

    // Initially hide the chat container
    hideChatContainer();

    // Chatbot logic
    const chatBox = document.getElementById('youly-306511-chat-box');
    const userInput = document.getElementById('youly-306511-user-input');
    const sendBtn = document.getElementById('youly-306511-send-btn');

    // Load chat history from localStorage
    let chatHistory = JSON.parse(localStorage.getItem('youly-306511-chat-history')) || [];
    chatHistory.forEach((message) => {
      addMessageToChat(message.sender, message.text, message.timestamp, false);
    });

    // Event listener for the send button
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
          const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          addMessageToChat('Bot', response, botTimestamp);
        } catch (error) {
          chatBox.removeChild(typingIndicator);
          const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          addMessageToChat('Bot', 'Sorry, something went wrong. Please try again.', errorTimestamp);
        }
      }
    });

    // Close button functionality
    const closeBtn = document.getElementById('youly-306511-close-btn');
    closeBtn.addEventListener('click', () => {
      hideChatContainer();
    });

    // Allow sending message with Enter key
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });

    // Function to add messages to the chat
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

    // Function to create the typing indicator
    function createTypingIndicator() {
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('youly-306511-message', 'youly-306511-bot-message', 'youly-306511-typing-indicator');

      typingIndicator.innerHTML = `
        <div class="youly-306511-message-text">
          <span class="youly-306511-typing-dot"></span>
          <span class="youly-306511-typing-dot"></span>
          <span class="youly-306511-typing-dot"></span>
        </div>
        <div class="youly-306511-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      `;
      return typingIndicator;
    }

    // Function to get bot response
    async function getBotResponse(message) {
      // Simulate network delay for typing indicator
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await fetch(`https://dummyjson.com/quotes/${Math.floor(Math.random() * 20) + 1}?delay=500`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          //  body: JSON.stringify({ message, userId }), // Include userId here
        });
        const data = await response.json();
        return data.quote;

      } catch (error) {
        throw error;
      }
    }
  });
})();
