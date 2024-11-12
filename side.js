// Check if "rag-client" is set to true in localStorage
if (localStorage.getItem('rag-client') === 'true') {
  // Load the Botpress inject script
  var script1 = document.createElement('script');
  script1.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
  script1.defer = true;
  document.head.appendChild(script1);

  // Load the Botpress config script after the inject script has loaded
  script1.onload = function() {
    var script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2024/10/07/12/20241007120304-O0RURIDS.js';
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
