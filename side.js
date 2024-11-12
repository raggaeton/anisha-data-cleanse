// Check if "rag-client" is set to true in localStorage
if (localStorage.getItem('rag-client') === 'true') {
  // Load the Botpress inject script
  var script1 = document.createElement('script');
  script1.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
  script1.defer = true;
  document.head.appendChild(script1);

  // Load the Botpress config script after the inject script has loaded
  script1.onload = function() {
    var script2 = document.createElement('script');
    script2.src = 'https://mediafiles.botpress.cloud/17a32590-61ca-44a6-89b7-ab13d83f5a61/webchat/config.js';
    script2.defer = true;
    document.head.appendChild(script2);

    // Add the custom CSS for .bpFab and .bpComposerPoweredBy
    var style = document.createElement('style');
    style.innerHTML = `
      .bpFab { right: 5.5rem !important; }
    `;
    document.head.appendChild(style);

  };
}
