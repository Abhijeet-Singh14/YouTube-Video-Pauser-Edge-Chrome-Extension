chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ extensionEnabled: true }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error setting default state:', chrome.runtime.lastError);
    } else {
      console.log('Default state set to enabled.');
    }
  });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.storage.sync.get('extensionEnabled', (data) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving state:', chrome.runtime.lastError);
      return;
    }
    if (data.extensionEnabled !== false) { // default to enabled
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url.includes('youtube.com/watch')) {
            const action = (tab.id === activeInfo.tabId) ? 'unpause' : 'pause';
            chrome.tabs.sendMessage(tab.id, { action }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
              }
            });
          }
        });
      });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch')) {
    chrome.storage.sync.get('extensionEnabled', (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving state:', chrome.runtime.lastError);
        return;
      }
      if (data.extensionEnabled !== false) { // default to enabled
        chrome.tabs.sendMessage(tabId, { action: 'check' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
          }
        });
      }
    });
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  chrome.storage.sync.get('extensionEnabled', (data) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving state:', chrome.runtime.lastError);
      return;
    }
    if (data.extensionEnabled !== false) { // default to enabled
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url.includes('youtube.com/watch')) {
          const action = (windowId === chrome.windows.WINDOW_ID_NONE) ? 'pause' : 'unpause';
          chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError);
            }
          });
        }
      });
    }
  });
});
