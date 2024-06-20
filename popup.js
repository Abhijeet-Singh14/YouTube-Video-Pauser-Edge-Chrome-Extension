// Function to show a notification message in the popup
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.color = isError ? 'red' : 'black';

  // Clear notification after 3 seconds
  setTimeout(() => {
    notification.textContent = '';
  }, 3000);
}

// Function to update the toggle button state and show notifications
function updateExtensionState(isEnabled) {
  const toggleBtn = document.getElementById('toggleBtn');
  toggleBtn.textContent = isEnabled ? 'Deactivate Extension' : 'Activate Extension';
  toggleBtn.classList.toggle('active', isEnabled);

  // Show notification based on state
  if (isEnabled) {
    showNotification('Extension activated.');
  } else {
    showNotification('Extension deactivated.');
  }
}

// Function to handle toggle button click
document.getElementById('toggleBtn').addEventListener('click', () => {
  chrome.storage.sync.get('extensionEnabled', (data) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving state:', chrome.runtime.lastError);
      showNotification('Error retrieving state. Please try again.', true);
      return;
    }
    const newState = !data.extensionEnabled;
    chrome.storage.sync.set({ extensionEnabled: newState }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting new state:', chrome.runtime.lastError);
        showNotification('Error setting new state. Please try again.', true);
      } else {
        updateExtensionState(newState);
      }
    });
  });
});

// Function to initialize the toggle button state on load
chrome.storage.sync.get('extensionEnabled', (data) => {
  if (chrome.runtime.lastError) {
    console.error('Error retrieving state:', chrome.runtime.lastError);
    showNotification('Error retrieving state. Please try again.', true);
    updateExtensionState(false); // Default to disabled state
  } else {
    updateExtensionState(data.extensionEnabled !== false); // Default to enabled state
  }
});
