// Popup script for Facebook Gender Checker

document.addEventListener('DOMContentLoaded', () => {
  const apiTokenInput = document.getElementById('apiToken');
  const saveTokenButton = document.getElementById('saveToken');
  const tokenStatus = document.getElementById('tokenStatus');
  const testButton = document.getElementById('testButton');
  const testStatus = document.getElementById('testStatus');
  const currentStatus = document.getElementById('currentStatus');

  // Check current page status immediately
  checkCurrentPageStatus();

  // Load saved token
  chrome.storage.sync.get(['apiToken'], (result) => {
    if (result.apiToken) {
      apiTokenInput.value = result.apiToken;
    }
  });

  function checkCurrentPageStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].url) {
        if (currentStatus) {
          currentStatus.innerHTML = '<div class="status error">Could not access current tab</div>';
        }
        return;
      }

      const url = tabs[0].url;
      if (!url.includes('facebook.com')) {
        if (currentStatus) {
          currentStatus.innerHTML = '<div class="status error">⚠️ Not on Facebook. Navigate to a Facebook profile page.</div>';
        }
        return;
      }

      // Check if it's a profile page
      const isProfile = /facebook\.com\/(profile\.php\?id=\d+|people\/[^\/]+|[a-zA-Z0-9.]+(\/|$))/.test(url) && 
                       !url.includes('/messages/') && !url.includes('/groups/') && !url.includes('/pages/');

      if (isProfile) {
        if (currentStatus) {
          currentStatus.innerHTML = '<div class="status success">✓ On Facebook profile page. Analysis should appear on the page.</div>';
        }
        // Automatically trigger check
        triggerPageCheck(tabs[0].id);
      } else {
        if (currentStatus) {
          currentStatus.innerHTML = '<div class="status error">⚠️ Not on a profile page. Go to someone\'s profile to see analysis.</div>';
        }
      }
    });
  }

  function triggerPageCheck(tabId) {
    // Try to send message
    chrome.tabs.sendMessage(tabId, { action: 'forceCheck' }, (response) => {
      if (chrome.runtime.lastError) {
        // Inject script directly
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).then(() => {
          // Wait a bit then trigger
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { action: 'forceCheck' });
          }, 500);
        }).catch(err => {
          console.log('Script injection failed:', err);
        });
      }
    });
  }

  // Save token
  saveTokenButton.addEventListener('click', () => {
    const token = apiTokenInput.value.trim();
    
    if (token) {
      chrome.runtime.sendMessage(
        { action: 'setApiToken', token: token },
        (response) => {
          if (response && response.success) {
            showStatus(tokenStatus, 'Token saved successfully!', 'success');
          } else {
            showStatus(tokenStatus, 'Error saving token', 'error');
          }
        }
      );
    } else {
      // Clear token
      chrome.storage.sync.remove(['apiToken'], () => {
        showStatus(tokenStatus, 'Token cleared', 'success');
      });
    }
  });

  // Test button - trigger analysis on current page
  testButton.addEventListener('click', () => {
    testButton.disabled = true;
    testButton.textContent = 'Testing...';
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].url) {
        testButton.disabled = false;
        testButton.textContent = 'Test Current Profile';
        showStatus(testStatus, 'Could not access current tab', 'error');
        return;
      }
      
      if (!tabs[0].url.includes('facebook.com')) {
        testButton.disabled = false;
        testButton.textContent = 'Test Current Profile';
        showStatus(testStatus, 'Please navigate to a Facebook page first', 'error');
        return;
      }
      
      // Try to send message - handle errors gracefully
      try {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'forceCheck' }, (response) => {
          testButton.disabled = false;
          testButton.textContent = 'Test Current Profile';
          
          if (chrome.runtime.lastError) {
            // Content script might not be loaded yet, try injecting it
            console.log('Content script error:', chrome.runtime.lastError.message);
            showStatus(testStatus, 'Triggering analysis... (check page for status)', 'success');
            
            // Try to execute script directly
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                // This will be executed in the page context
                console.log('[FB Gender Checker] Direct script execution');
                // Dispatch a custom event that content script can listen to
                window.dispatchEvent(new CustomEvent('fbGenderCheckerForceCheck'));
              }
            }).catch(err => {
              console.log('Script injection failed:', err);
            });
          } else if (response && response.success) {
            showStatus(testStatus, '✓ Analysis triggered! Check the page for results.', 'success');
          } else {
            showStatus(testStatus, 'Analysis triggered. Check the page for status indicators.', 'success');
          }
        });
      } catch (error) {
        testButton.disabled = false;
        testButton.textContent = 'Test Current Profile';
        showStatus(testStatus, 'Error: ' + error.message, 'error');
      }
    });
  });

  function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status ${type}`;
    setTimeout(() => {
      element.textContent = '';
      element.className = '';
    }, 5000);
  }
});

