(function () {
    const currentRolloutPercentage = 10; // Update this value as needed
  
    // Retrieve stored values from localStorage and sessionStorage
    const storedRolloutPercentage = parseInt(localStorage.getItem('rolloutPercentage'), 10);
    const currentAssignment = localStorage.getItem('rag-client');
    const notificationShown = sessionStorage.getItem('notificationShown'); // Check if notification was shown this session
  
    // If the user is already included, keep them included
    if (currentAssignment === 'true') {
      loadScripts();
      if (!notificationShown) {
        showChatBubble();
      }
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
        if (!notificationShown) {
          showChatBubble();
        }
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
      };
    }
  
    // Function to show the chat bubble
    //TODO: move text to dashboard
    function showChatBubble() {
      const chatBubble = document.createElement('div');
      chatBubble.className = 'chat-bubble';
        chatBubble.innerHTML = '<span>İlham için kahve önerelim!<span class="dot">•</span></span>';
        setTimeout(() => {
            document.body.appendChild(chatBubble);
          }, 2000);

  
      // Mark notification as shown in sessionStorage
      sessionStorage.setItem('notificationShown', 'true');
  
      // Remove bubble with fade-out after 30 seconds
      setTimeout(() => {
        chatBubble.classList.add('fade-out');
        setTimeout(() => {
          chatBubble.remove();
        }, 1000); // Match the fade-out duration in CSS
      }, 32000);
  
      // Inject CSS
      const style = document.createElement('style');
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
  
        /* Chatbot Small Bubble Start */
        .chat-bubble {
            z-index: 50;
            position: fixed;
            font-weight: 500;
            right: 135px;
            bottom: 70px;
            color: gray;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 5px 15px;
            font-size: 12px;
            box-shadow: 1px 11px 28px 0px rgba(0, 0, 0, 0.09);
            -webkit-box-shadow: 1px 11px 28px 0px rgba(0, 0, 0, 0.09);
            -moz-box-shadow: 1px 11px 28px 0px rgba(0, 0, 0, 0.07);
            animation: bubbleIn 0.6s ease-out;
            opacity: 1; /* Ensure full opacity on start */
            transition: opacity 1s ease-out;
        }
  
        .chat-bubble.fade-out {
            opacity: 0; /* Fade-out effect */
        }
  
        .chat-bubble span {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
  
        @media only screen and (max-width: 600px) {
          .chat-bubble {
            font-size: 10px;
            bottom: 46px;
            padding: 5px 10px;
          }
        }
  
        @keyframes bubbleIn {
            0% {
                transform: scale(0) translateY(50%);
                opacity: 0;
            }
            60% {
                transform: scale(1.1) translateY(-10%);
                opacity: 1;
            }
            100% {
                transform: scale(1) translateY(0);
            }
        }
  
        .dot {
            color: green;
            font-size: 16px;
            margin-left: 5px;
            padding-bottom: 2px; /* Added padding-bottom */
            line-height: 1;
            vertical-align: middle;
            animation: pulse 1s infinite;
            text-shadow: #1dc91d 1px 1px 7px;
        }
  
        @media only screen and (max-width: 600px) {
          .dot {
            font-size: 14px; 
            margin-bottom: 0;
          }
        }
  
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.5);
                opacity: 0.7;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
      `;
      document.head.appendChild(style);
    }
  })();
  
