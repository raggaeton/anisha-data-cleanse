(function () {
  // Inject styles with unique class names
  const style = document.createElement('style');
  style.innerHTML = `
    #youly-306511-container {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 300px !important;
      height: 400px !important;
      border: 1px solid #ccc !important;
      background-color: white !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
      z-index: 1000 !important;
    }

    #youly-306511-chat-box {
      height: 80% !important;
      overflow-y: auto !important;
      padding: 10px !important;
      background-color: #f7f7f7 !important;
    }

    #youly-306511-user-input {
      width: 100% !important;
      padding: 10px !important;
      border: none !important;
      border-top: 1px solid #ccc !important;
    }

    #youly-306511-send-btn {
      padding: 10px !important;
      background-color: #4CAF50 !important;
      color: white !important;
      border: none !important;
      cursor: pointer !important;
    }

    #youly-306511-send-btn:hover {
      background-color: #45a049 !important;
    }

    .youly-306511-message {
      margin-bottom: 10px !important;
    }

    #youly-306511-toggle-btn {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      background-color: #4CAF50 !important;
      color: white !important;
      padding: 10px !important;
      border: none !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      z-index: 1001 !important;
    }
  `;
  document.head.appendChild(style);

  // Inject chatbot HTML
  const chatContainer = document.createElement('div');
  chatContainer.id = 'youly-306511-container';
  chatContainer.innerHTML = `
    <div id="youly-306511-chat-box"></div>
    <input type="text" id="youly-306511-user-input" placeholder="Type your message here" />
    <button id="youly-306511-send-btn">Send</button>
  `;
  document.body.appendChild(chatContainer);

  // Initially hide the chat container
  chatContainer.style.display = 'none';

  // Create the toggle button for the chat
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'youly-306511-toggle-btn';
  toggleBtn.innerHTML = '💬';
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

  sendBtn.addEventListener('click', async () => {
    const message = userInput.value;
    if (message.trim() !== '') {
      addMessageToChat('User', message);
      userInput.value = '';  // Clear input field
      const response = await getBotResponse(message);
      addMessageToChat('Bot', response);
    }
  });

  function addMessageToChat(sender, message) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('youly-306511-message');
    messageElem.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to bottom
  }

  async function getBotResponse(message) {
    try {
      const response = await fetch('https://api.example.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),  // Send user message
      });
      const data = await response.json();
      return data.reply;  // Assuming the API returns a `reply` field
    } catch (error) {
      return 'Sorry, something went wrong. Please try again.';
    }
  }
})();
