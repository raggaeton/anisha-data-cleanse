(function () {
  const currentRolloutPercentage = 1; // Update this value as needed

  // Retrieve stored values from localStorage
  const storedRolloutPercentage = parseInt(localStorage.getItem('rolloutPercentage'), 10);
  const currentAssignment = localStorage.getItem('rag-client');

  // If the user is already included, keep them included
  if (currentAssignment === 'true') {
    loadScripts();
  } else if (storedRolloutPercentage !== currentRolloutPercentage || currentAssignment === null) {
    // For new users or if rollout percentage has changed
    const randomValue = Math.random() * 100;

    // Assign based on the current rollout percentage
    const userIncluded = randomValue < currentRolloutPercentage;
    localStorage.setItem('rag-client', userIncluded ? 'true' : 'false');

    // Update the stored rollout percentage
    localStorage.setItem('rolloutPercentage', currentRolloutPercentage);

    // Load scripts for new users who are included
    if (userIncluded) {
      loadScripts();
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
      `;
      document.head.appendChild(style);
    };
  }
})();
