(function () {
  const currentRolloutPercentage = 1; // Update this value as needed

  // Retrieve stored values from localStorage
  const storedRolloutPercentage = parseInt(localStorage.getItem('rolloutPercentage'), 10);
  const currentAssignment = localStorage.getItem('rag-client');

  // If the user is already included, keep them included
  if (currentAssignment === 'true') {
    loadScripts();
    showChatBubble();
  } else if (storedRolloutPercentage !== currentRolloutPercentage || currentAssignment === null) {
    // For new users or if rollout percentage has changed
    const randomValue = Math.random() * 100;

    // Assign based on the current rollout percentage
    const userIncluded = randomValue < currentRolloutPercentage;
    localStorage.setItem('rag-client', userIncluded ? 'true' : 'false');

    // Update the stored rollout percentage
    localStorage.setItem('rolloutPercentage', currentRolloutPercentage);

    // Load scripts and show the chat bubble for new users who are included
    if (userIncluded) {
      loadScripts();
      showChatBubble();
    }
  }

  // Function to load Botpress scripts
  function loadScripts() {
    var script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script1.defer = true;
    document.head.appendChild(script1);

    script1.onload = function () {
      var script2 = document.createElement('script');
      script2.src = 'https://mediafiles.botpress.cloud/17a32590-61ca-44a6-89b7-ab13d83f5a61/webchat/config.js';
      script2.defer = true;
      document.head.appendChild(script2);

      var style = document.createElement('style');
      style.innerHTML = `
        .bpw-floating-button {
          background-color: #8d1537 !important;
        }
        #bp-web-widget {
          min-width: 90px !important;
        }
        .bp-widget-widget {
          bottom: -10px !important;
          right: 5rem !important;
        }
        .bpw-header-container {
          background-color: #8d1537 !important;
        }
        .bpw-button {
          border-color: #8d1537 !important;
          color: #8d1537 !important;
        }
        .bpw-powered {
          display: none !important;
        }
        .bpw-header-subtitle {
          display: none !important;
        }
        .bpw-chat-container {
          bottom: 3rem !important;
          max-height: 80vh !important;
        }

        .bp-widget-side { 
        z-index: 999999999 !important;
}
.chat-bubble {
    z-index:50;
    position: fixed;
    font-weight: 500;
    color: black;
    right: 145px;
    bottom: 43px;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 1px 20px;
    box-shadow: 1px 11px 28px 0px rgb(0 0 0 / 9%);
    -webkit-box-shadow: 1px 11px 28px 0px rgb(0 0 0 / 9%);
    -moz-box-shadow: 1px 11px 28px 0px rgba(0, 0, 0, 0.07);

}

.chat-bubble span {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
}

@media only screen and (max-width: 600px) {
.chat-bubble {
    font-size:12px;
    bottom: 46px;
    padding: 0px 10px 0px 10px;
}
}




      `;
      document.head.appendChild(style);
    };
  }

  // Function to show the chat bubble
  function showChatBubble() {
    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble';
    chatBubble.innerHTML = 'We are live now!<span class="dot">•</span>';
    document.body.appendChild(chatBubble);
  }
})();
