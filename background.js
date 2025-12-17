// Background Service Worker for Facebook Gender Checker
// Handles image analysis API calls

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeImage') {
    analyzeImageGender(request.imageUrl)
      .then(gender => {
        try {
          sendResponse({ gender: gender });
        } catch (error) {
          // Response already sent or context invalidated
          console.log('[Background] Could not send response:', error.message);
        }
      })
      .catch(error => {
        console.error('[Background] Error analyzing image:', error);
        try {
          sendResponse({ gender: null });
        } catch (responseError) {
          // Response already sent
          console.log('[Background] Could not send error response');
        }
      });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'setApiToken') {
    try {
      chrome.storage.sync.set({ apiToken: request.token }, () => {
        try {
          sendResponse({ success: true });
        } catch (error) {
          console.log('[Background] Could not send token response');
        }
      });
      return true;
    } catch (error) {
      console.error('[Background] Error setting token:', error);
      try {
        sendResponse({ success: false, error: error.message });
      } catch (responseError) {
        // Response already sent
      }
      return true;
    }
  }
});

async function analyzeImageGender(imageUrl) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Convert to base64
    const base64 = await blobToBase64(blob);
    
    // Try with API token first (if provided)
    const apiToken = await getApiToken();
    
    if (apiToken) {
      // Use Hugging Face API with token for better results
      try {
        const hfResponse = await fetch(
          'https://api-inference.huggingface.co/models/caidas/swin-base-patch4-window7-224-in22k',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: base64.split(',')[1]
            })
          }
        );
        
        if (hfResponse.ok) {
          const result = await hfResponse.json();
          // Process result based on model output
          // This depends on the specific model used
        }
      } catch (error) {
        console.log('Token-based API failed, trying free alternative');
      }
    }
    
    // Free alternative: Use a simple image analysis approach
    // Since most free APIs require keys, we'll use a basic heuristic
    // For production, users should add a Hugging Face token
    
    // Try Hugging Face public endpoint (may work without token for some models)
    try {
      // Convert blob to base64 for API
      const base64Data = base64.split(',')[1];
      
      const hfPublicResponse = await fetch(
        'https://api-inference.huggingface.co/models/rizvandwiki/gender-classification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: base64Data
          })
        }
      );
      
      if (hfPublicResponse.ok) {
        const result = await hfPublicResponse.json();
        // Process the result - format depends on model
        if (Array.isArray(result) && result.length > 0) {
          const prediction = result[0];
          if (prediction.label) {
            const label = prediction.label.toLowerCase();
            if (label.includes('male') || label.includes('man')) {
              return 'male';
            } else if (label.includes('female') || label.includes('woman')) {
              return 'female';
            }
          }
          // Alternative format: score-based
          if (prediction.score && prediction.label) {
            if (prediction.score > 0.6) {
              const label = prediction.label.toLowerCase();
              if (label.includes('male') || label.includes('man')) {
                return 'male';
              } else if (label.includes('female') || label.includes('woman')) {
                return 'female';
              }
            }
          }
        }
      } else if (hfPublicResponse.status === 503) {
        // Model is loading, wait and retry
        console.log('Model loading, will retry on next check');
      }
    } catch (error) {
      console.log('Public Hugging Face API failed:', error.message);
    }
    
    // Final fallback: Basic heuristic (very limited accuracy)
    return await analyzeImageWithHeuristic(imageUrl);
    
  } catch (error) {
    console.error('Error in image analysis:', error);
    return null;
  }
}

async function analyzeImageWithHeuristic(imageUrl) {
  // Basic heuristic: This is a very simple fallback
  // It doesn't actually analyze the image, just returns null
  // In a production app, you'd want to use a proper ML model or API
  
  // Note: For actual gender detection from images, you need:
  // 1. A face detection library (like face-api.js)
  // 2. A gender classification model
  // 3. Or a proper API service
  
  // This is just a placeholder that indicates detection wasn't possible
  return null;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getApiToken() {
  // Get API token from storage
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiToken'], (result) => {
      resolve(result.apiToken || null);
    });
  });
}

// Note: setApiToken is now handled in the main listener above

