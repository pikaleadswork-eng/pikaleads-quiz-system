/**
 * Remove connection status notification if it exists
 * This is a cleanup script to remove the notification added by previous version
 */

export function removeConnectionNotification() {
  // Remove on page load
  const existingNotification = document.getElementById('connection-status-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Also remove any future attempts to add it
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.id === 'connection-status-notification') {
          node.remove();
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Auto-run on import
if (typeof window !== 'undefined') {
  removeConnectionNotification();
}
