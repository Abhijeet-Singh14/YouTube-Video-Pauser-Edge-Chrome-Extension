function getYouTubePlayer() {
    return document.querySelector('video');
  }
  
  function handleVisibilityChange() {
    const player = getYouTubePlayer();
    if (!player) return;
  
    if (document.hidden) {
      player.pause();
    } else {
      player.play();
    }
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const player = getYouTubePlayer();
    if (!player) return;
  
    switch (message.action) {
      case 'pause':
        player.pause();
        break;
      case 'unpause':
        player.play();
        break;
      case 'check':
        document.addEventListener('visibilitychange', handleVisibilityChange);
        break;
    }
  });
  