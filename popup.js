// Popup script for Amazon Free Shipping Highlighter

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');

  // Get current tab to communicate with content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // Check if we're on an Amazon page
    if (!currentTab.url.includes('amazon.com')) {
      updateUI('not-amazon');
      return;
    }

    // Initialize popup state
    updateUI('active');
    
    // Add click handler for toggle button
    toggleButton.addEventListener('click', function() {
      const isCurrentlyActive = toggleButton.textContent.includes('Disable');
      
      // Send message to content script
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'toggle'
      }, function(response) {
        if (response && response.success) {
          updateUI(isCurrentlyActive ? 'inactive' : 'active');
        }
      });
    });
  });

  function updateUI(state) {
    switch (state) {
      case 'active':
        statusIndicator.className = 'status-indicator';
        statusText.textContent = 'Active';
        toggleButton.textContent = 'Disable Highlighting';
        toggleButton.className = 'toggle-button';
        break;
        
      case 'inactive':
        statusIndicator.className = 'status-indicator inactive';
        statusText.textContent = 'Inactive';
        toggleButton.textContent = 'Enable Highlighting';
        toggleButton.className = 'toggle-button inactive';
        break;
        
      case 'not-amazon':
        statusIndicator.className = 'status-indicator inactive';
        statusText.textContent = 'Not on Amazon';
        toggleButton.textContent = 'Go to Amazon.com';
        toggleButton.className = 'toggle-button inactive';
        toggleButton.onclick = function() {
          chrome.tabs.create({url: 'https://www.amazon.com'});
        };
        break;
    }
  }
}); 