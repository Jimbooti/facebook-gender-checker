// Facebook Gender Profile Checker - Content Script
// Detects gender mismatches between profile info and profile pictures

class FacebookGenderChecker {
  constructor() {
    this.isProfilePage = false;
    this.profileData = null;
    this.checkInterval = null;
    this.init();
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startChecking());
    } else {
      this.startChecking();
    }
  }

  startChecking() {
    // Check if we're on a profile page
    this.detectProfilePage();
    
    if (this.isProfilePage) {
      console.log('[FB Gender Checker] Starting profile analysis...');
      this.extractProfileData();
      // Analyze will be called after data extraction or async
    } else {
      console.log('[FB Gender Checker] Not a profile page - skipping analysis');
      // Don't try to extract data if it's not a profile page
      // This prevents false positives on messages, posts, etc.
    }
  }

  detectProfilePage() {
    // Check for profile page indicators
    const url = window.location.href;
    console.log('[FB Gender Checker] Checking URL:', url);
    
    // STRICT: Exclude all non-profile pages first
    const excludedPaths = [
      '/groups/', '/pages/', '/events/', '/marketplace/', '/watch/', 
      '/login', '/signup', '/recover', '/help', '/about', '/privacy',
      '/settings', '/messages', '/notifications', '/bookmarks',
      '/games/', '/apps/', '/developers/', '/business/', '/ads/',
      '/stories/', '/reels/', '/video/', '/photo/', '/post/',
      '/p/', '/story/', '/permalink/', '/hashtag/', '/search/',
      '/home', '/feed', '/newsfeed'
    ];
    
    const isExcluded = excludedPaths.some(path => url.includes(path));
    if (isExcluded) {
      console.log('[FB Gender Checker] ✗ Excluded page detected (not a profile)');
      this.isProfilePage = false;
      return;
    }
    
    // STRICT: Only specific profile URL patterns
    const profilePatterns = [
      /^https?:\/\/(www\.)?facebook\.com\/profile\.php\?id=\d+/,  // Old style: /profile.php?id=123
      /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+$/,         // Just username (no path)
      /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/$/,      // Username with trailing slash
      /^https?:\/\/(www\.)?facebook\.com\/people\/[^\/]+/         // People pages
    ];
    
    const isProfileUrl = profilePatterns.some(pattern => pattern.test(url));
    console.log('[FB Gender Checker] URL matches profile pattern:', isProfileUrl);
    
    // STRICT: Must have BOTH profile picture AND profile name to be considered a profile
    const profilePicSelectors = [
      'img[data-imgperflogname="profilePicture"]',
      'img[data-imgperflogname="profileCoverPhoto"]'
    ];
    
    const profileNameSelectors = [
      'h1[data-testid="user-name"]',
      'h1[dir="auto"]'
    ];
    
    // Check for profile structure indicators (more reliable)
    const profileStructureSelectors = [
      '[data-pagelet="ProfileTilesFeed"]',
      '[data-pagelet="ProfileTimeline"]'
    ];
    
    let foundProfilePic = false;
    let foundProfileName = false;
    let foundProfileStructure = false;
    
    // Must find profile picture
    for (const selector of profilePicSelectors) {
      try {
        if (document.querySelector(selector)) {
          foundProfilePic = true;
          console.log('[FB Gender Checker] Found profile picture:', selector);
          break;
        }
      } catch (e) {
        // Skip invalid selectors
      }
    }
    
    // Must find profile name
    for (const selector of profileNameSelectors) {
      try {
        if (document.querySelector(selector)) {
          foundProfileName = true;
          console.log('[FB Gender Checker] Found profile name:', selector);
          break;
        }
      } catch (e) {
        // Skip invalid selectors
      }
    }
    
    // Check for profile structure
    for (const selector of profileStructureSelectors) {
      try {
        if (document.querySelector(selector)) {
          foundProfileStructure = true;
          console.log('[FB Gender Checker] Found profile structure:', selector);
          break;
        }
      } catch (e) {
        // Skip invalid selectors
      }
    }
    
    // STRICT: Must be a profile URL AND have profile elements
    // OR have both profile picture AND name (strong indicators)
    const hasProfileElements = (foundProfilePic && foundProfileName) || foundProfileStructure;
    
    this.isProfilePage = isProfileUrl && hasProfileElements;
    
    // Debug logging
    console.log('[FB Gender Checker] Detection results:', {
      isProfileUrl,
      foundProfilePic,
      foundProfileName,
      foundProfileStructure,
      hasProfileElements,
      isProfilePage: this.isProfilePage
    });
    
    if (this.isProfilePage) {
      console.log('[FB Gender Checker] ✓ Profile page confirmed:', url);
    } else {
      console.log('[FB Gender Checker] ✗ Not a profile page - missing required elements');
    }
  }

  extractProfileData() {
    try {
      console.log('[FB Gender Checker] Extracting profile data...');
      
      // Extract profile name with multiple selectors
      const nameSelectors = [
        'h1[data-testid="user-name"]',
        'h1[dir="auto"]',
        'span[dir="auto"]',
        '[data-pagelet="ProfileTilesFeed"] h1',
        'div[role="main"] h1'
      ];
      
      let nameElement = null;
      for (const selector of nameSelectors) {
        nameElement = document.querySelector(selector);
        if (nameElement) break;
      }
      
      const name = nameElement ? nameElement.textContent.trim() : null;
      console.log('[FB Gender Checker] Profile name:', name);

      // Try to extract gender from profile info
      let gender = null;
      
      // Look for gender indicators in the profile with multiple selectors
      const aboutSelectors = [
        '[data-testid="profile-about-section"]',
        '[data-pagelet="ProfileTilesFeed"]',
        'div[role="main"] div[dir="auto"]'
      ];
      
      for (const selector of aboutSelectors) {
        const aboutSection = document.querySelector(selector);
        if (aboutSection) {
          const aboutText = aboutSection.textContent.toLowerCase();
          if (aboutText.includes('male') || aboutText.includes('man') || aboutText.includes('he/him') || aboutText.includes('he / him')) {
            gender = 'male';
            console.log('[FB Gender Checker] Gender found in about section: male');
            break;
          } else if (aboutText.includes('female') || aboutText.includes('woman') || aboutText.includes('she/her') || aboutText.includes('she / her')) {
            gender = 'female';
            console.log('[FB Gender Checker] Gender found in about section: female');
            break;
          }
        }
      }

      // Extract profile picture URL with multiple selectors
      const picSelectors = [
        'img[data-imgperflogname="profilePicture"]',
        'img[data-imgperflogname="profileCoverPhoto"]',
        'img[alt*="profile picture" i]',
        'img[alt*="Profile picture" i]',
        'a[href*="/photo"] img',
        '[role="main"] img[src*="scontent"][src*="fbcdn"]'
      ];
      
      let profilePicElement = null;
      let profilePicUrl = null;
      
      for (const selector of picSelectors) {
        profilePicElement = document.querySelector(selector);
        if (profilePicElement && profilePicElement.src) {
          profilePicUrl = profilePicElement.src;
          // Get high-res version if available
          if (profilePicUrl.includes('&width=')) {
            profilePicUrl = profilePicUrl.replace(/&width=\d+/, '&width=500');
          }
          console.log('[FB Gender Checker] Profile picture found');
          break;
        }
      }

      this.profileData = { name, gender, profilePicUrl };
      console.log('[FB Gender Checker] Profile data extracted:', this.profileData);
      
      // If no explicit gender found, try to infer from name using genderize API
      if (!gender && name) {
        console.log('[FB Gender Checker] Inferring gender from name...');
        this.inferGenderFromName(name).then(inferredGender => {
          if (inferredGender) {
            console.log('[FB Gender Checker] Inferred gender:', inferredGender);
            this.profileData.gender = inferredGender;
            // Now analyze with the inferred gender
            this.analyzeProfile();
          } else {
            console.log('[FB Gender Checker] Could not infer gender from name');
            // Still try to analyze picture if we have one
            if (this.profileData.profilePicUrl) {
              this.analyzeProfile();
            }
          }
        });
      } else if (gender) {
        // We have gender, proceed with analysis immediately
        this.analyzeProfile();
      } else if (profilePicUrl) {
        // No gender but have picture - try to analyze picture only
        this.analyzeProfile();
      }
      
      // Show status indicator
      this.showStatusIndicator('Analyzing profile...');
    } catch (error) {
      console.error('[FB Gender Checker] Error extracting profile data:', error);
    }
  }

  async inferGenderFromName(name) {
    try {
      // Extract first name
      const firstName = name.split(' ')[0];
      
      // Use genderize.io API (free tier available)
      const response = await fetch(`https://api.genderize.io?name=${encodeURIComponent(firstName)}`);
      const data = await response.json();
      
      if (data.gender && data.probability > 0.7) {
        return data.gender;
      }
    } catch (error) {
      console.error('Error inferring gender from name:', error);
    }
    return null;
  }

  async analyzeProfile() {
    console.log('[FB Gender Checker] ===== STARTING ANALYSIS =====');
    console.log('[FB Gender Checker] Profile data:', this.profileData);
    
    if (!this.profileData) {
      console.log('[FB Gender Checker] No profile data to analyze');
      this.showStatusIndicator('Error: No profile data found');
      this.showProfileBadge({
        profileGender: 'Error',
        pictureGender: 'No data',
        status: 'error'
      });
      return;
    }

    // Show initial status
    this.showStatusIndicator('Step 1: Extracting profile information...');
    await new Promise(resolve => setTimeout(resolve, 500));

    // If no picture, show what we have
    if (!this.profileData.profilePicUrl) {
      console.log('[FB Gender Checker] No profile picture URL found');
      this.showStatusIndicator('No profile picture found');
      
      if (this.profileData.gender) {
        this.showProfileBadge({
          profileGender: this.profileData.gender,
          pictureGender: 'No picture available',
          status: 'profile_only'
        });
        this.showStatusIndicator('✓ Analysis complete - check badge');
      } else {
        this.showProfileBadge({
          profileGender: 'Not found',
          pictureGender: 'No picture',
          status: 'unknown'
        });
        this.showStatusIndicator('Limited data - check badge');
      }
      return;
    }

    // Update status
    this.showStatusIndicator('Step 2: Analyzing profile picture...');
    console.log('[FB Gender Checker] Starting picture analysis...');
    
    let pictureGender = null;
    try {
      // Analyze profile picture for gender with timeout
      const analysisPromise = this.analyzeProfilePicture(this.profileData.profilePicUrl);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => {
        console.log('[FB Gender Checker] Picture analysis timed out');
        resolve(null);
      }, 20000)); // 20 second timeout
      
      pictureGender = await Promise.race([analysisPromise, timeoutPromise]);
      console.log('[FB Gender Checker] Picture gender detected:', pictureGender);
    } catch (error) {
      console.error('[FB Gender Checker] Error analyzing picture:', error);
      pictureGender = null;
    }

    // Update status
    this.showStatusIndicator('Step 3: Compiling results...');
    await new Promise(resolve => setTimeout(resolve, 300));

    // ALWAYS show results badge - show what we found
    console.log('[FB Gender Checker] Showing results badge');
    console.log('[FB Gender Checker] Profile gender:', this.profileData.gender);
    console.log('[FB Gender Checker] Picture gender:', pictureGender);
    
    if (pictureGender && this.profileData.gender) {
      // Check for mismatch
      if (pictureGender !== this.profileData.gender) {
        console.log('[FB Gender Checker] ⚠️ MISMATCH DETECTED!');
        this.showMismatchWarning(pictureGender, this.profileData.gender);
        this.showProfileBadge({
          profileGender: this.profileData.gender,
          pictureGender: pictureGender,
          status: 'mismatch'
        });
        this.showStatusIndicator('⚠️ Mismatch detected - see badge');
      } else {
        console.log('[FB Gender Checker] ✓ Genders match');
        this.hideMismatchWarning();
        this.showProfileBadge({
          profileGender: this.profileData.gender,
          pictureGender: pictureGender,
          status: 'match'
        });
        this.showStatusIndicator('✓ Analysis complete - genders match');
      }
    } else if (pictureGender) {
      // Only picture gender detected
      console.log('[FB Gender Checker] Showing badge with picture gender only');
      this.showProfileBadge({
        profileGender: this.profileData.gender || 'Not found',
        pictureGender: pictureGender,
        status: 'picture_only'
      });
      this.showStatusIndicator('✓ Analysis complete - check badge');
    } else if (this.profileData.gender) {
      // Only profile gender detected
      console.log('[FB Gender Checker] Showing badge with profile gender only');
      this.showProfileBadge({
        profileGender: this.profileData.gender,
        pictureGender: pictureGender || 'Analysis failed',
        status: 'profile_only'
      });
      this.showStatusIndicator('✓ Analysis complete - check badge');
    } else {
      // Show badge anyway with what we know
      console.log('[FB Gender Checker] Showing badge with limited data');
      this.showProfileBadge({
        profileGender: 'Not detected',
        pictureGender: pictureGender || 'Not analyzed',
        status: 'unknown'
      });
      this.showStatusIndicator('Analysis complete - limited data');
    }
    
    // Verify badge was created
    setTimeout(() => {
      const badge = document.getElementById('fb-gender-checker-badge');
      if (badge) {
        console.log('[FB Gender Checker] ✓ Badge created and visible');
        console.log('[FB Gender Checker] Badge position:', window.getComputedStyle(badge).position);
        console.log('[FB Gender Checker] Badge top:', window.getComputedStyle(badge).top);
        console.log('[FB Gender Checker] Badge right:', window.getComputedStyle(badge).right);
      } else {
        console.error('[FB Gender Checker] ✗ Badge was NOT created!');
      }
    }, 500);
    
    console.log('[FB Gender Checker] ===== ANALYSIS COMPLETE =====');
  }

  async analyzeProfilePicture(imageUrl) {
    // Always use direct API call - more reliable and doesn't depend on background script
    console.log('[FB Gender Checker] Analyzing profile picture using direct API call');
    try {
      return await this.analyzeImageDirectly(imageUrl);
    } catch (error) {
      console.error('[FB Gender Checker] Error analyzing profile picture:', error);
      return null;
    }
  }

  async analyzeImageDirectly(imageUrl) {
    // Direct API call from content script (fallback when background script unavailable)
    try {
      console.log('[FB Gender Checker] Using direct API call for image analysis');
      
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Convert to base64
      const base64 = await this.blobToBase64(blob);
      const base64Data = base64.split(',')[1];
      
      // Try Hugging Face public endpoint
      const hfResponse = await fetch(
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
      
      if (hfResponse.ok) {
        const result = await hfResponse.json();
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
          if (prediction.score && prediction.label && prediction.score > 0.6) {
            const label = prediction.label.toLowerCase();
            if (label.includes('male') || label.includes('man')) {
              return 'male';
            } else if (label.includes('female') || label.includes('woman')) {
              return 'female';
            }
          }
        }
      } else if (hfResponse.status === 503) {
        console.log('[FB Gender Checker] Model is loading, will retry later');
      }
    } catch (error) {
      console.error('[FB Gender Checker] Direct API call failed:', error);
    }
    
    return null;
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  showMismatchWarning(pictureGender, profileGender) {
    // Remove existing warning if any
    this.hideMismatchWarning();

    // Create warning banner
    const warning = document.createElement('div');
    warning.id = 'fb-gender-checker-warning';
    warning.className = 'fb-gender-warning';
    
    const content = document.createElement('div');
    content.className = 'fb-gender-warning-content';
    
    const icon = document.createElement('span');
    icon.className = 'fb-gender-warning-icon';
    icon.textContent = '⚠️';
    
    const text = document.createElement('span');
    text.className = 'fb-gender-warning-text';
    text.textContent = `Gender Mismatch Detected: Profile indicates ${profileGender}, but profile picture suggests ${pictureGender}`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'fb-gender-warning-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => warning.remove());
    
    content.appendChild(icon);
    content.appendChild(text);
    content.appendChild(closeBtn);
    warning.appendChild(content);

    // Insert at the top of the page
    const body = document.body;
    if (body) {
      body.insertBefore(warning, body.firstChild);
    }
  }

  hideMismatchWarning() {
    const existing = document.getElementById('fb-gender-checker-warning');
    if (existing) {
      existing.remove();
    }
  }

  showStatusIndicator(message) {
    // Remove existing status indicator
    const existing = document.getElementById('fb-gender-checker-status');
    if (existing) {
      existing.remove();
    }

    // Create status indicator
    const status = document.createElement('div');
    status.id = 'fb-gender-checker-status';
    status.className = 'fb-gender-status';
    
    const content = document.createElement('div');
    content.className = 'fb-gender-status-content';
    
    const icon = document.createElement('span');
    icon.className = 'fb-gender-status-icon';
    icon.textContent = '🔍';
    
    const text = document.createElement('span');
    text.className = 'fb-gender-status-text';
    text.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'fb-gender-status-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => status.remove());
    
    content.appendChild(icon);
    content.appendChild(text);
    content.appendChild(closeBtn);
    status.appendChild(content);

    // Insert at the top of the page (after warning if exists)
    const body = document.body;
    if (body) {
      const warning = document.getElementById('fb-gender-checker-warning');
      if (warning) {
        body.insertBefore(status, warning.nextSibling);
      } else {
        body.insertBefore(status, body.firstChild);
      }
      
      // Auto-hide after 5 seconds if not a warning
      if (!message.includes('Mismatch')) {
        setTimeout(() => {
          if (status.parentElement) {
            status.remove();
          }
        }, 5000);
      }
    }
  }

  showProfileBadge(data) {
    console.log('[FB Gender Checker] Showing profile badge with data:', data);
    
    // Remove existing badge
    const existing = document.getElementById('fb-gender-checker-badge');
    if (existing) {
      existing.remove();
    }

    // Create badge
    const badge = document.createElement('div');
    badge.id = 'fb-gender-checker-badge';
    badge.className = 'fb-gender-badge';
    
    // Determine badge color and icon based on status
    let badgeClass = '';
    let icon = '🔍';
    let title = 'Gender Analysis';
    
    if (data.status === 'mismatch') {
      badgeClass = 'fb-gender-badge-mismatch';
      icon = '⚠️';
      title = 'Gender Mismatch Detected';
    } else if (data.status === 'match') {
      badgeClass = 'fb-gender-badge-match';
      icon = '✓';
      title = 'Gender Match';
    } else if (data.status === 'picture_only' || data.status === 'profile_only') {
      badgeClass = 'fb-gender-badge-partial';
      icon = 'ℹ️';
      title = 'Partial Analysis';
    } else {
      badgeClass = 'fb-gender-badge-unknown';
      icon = '❓';
      title = 'Analysis Incomplete';
    }
    
    badge.classList.add(badgeClass);
    
    // Build content
    const content = document.createElement('div');
    content.className = 'fb-gender-badge-content';
    
    const header = document.createElement('div');
    header.className = 'fb-gender-badge-header';
    header.innerHTML = `<span class="fb-gender-badge-icon">${icon}</span><span class="fb-gender-badge-title">${title}</span>`;
    
    const body = document.createElement('div');
    body.className = 'fb-gender-badge-body';
    
    const profileRow = document.createElement('div');
    profileRow.className = 'fb-gender-badge-row';
    profileRow.innerHTML = `
      <span class="fb-gender-badge-label">Profile Gender:</span>
      <span class="fb-gender-badge-value">${data.profileGender}</span>
    `;
    
    const pictureRow = document.createElement('div');
    pictureRow.className = 'fb-gender-badge-row';
    pictureRow.innerHTML = `
      <span class="fb-gender-badge-label">Picture Gender:</span>
      <span class="fb-gender-badge-value">${data.pictureGender || 'Not analyzed'}</span>
    `;
    
    body.appendChild(profileRow);
    body.appendChild(pictureRow);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'fb-gender-badge-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => badge.remove());
    
    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(closeBtn);
    badge.appendChild(content);

    // ALWAYS insert at top of page as fixed position - guaranteed visibility
    if (!document.body) {
      // Wait for body
      setTimeout(() => this.showProfileBadge(data), 100);
      return;
    }
    
    document.body.appendChild(badge);
    
    // Force it to be visible
    badge.style.display = 'block';
    badge.style.visibility = 'visible';
    badge.style.opacity = '1';
    
    console.log('[FB Gender Checker] Badge inserted into body');
    console.log('[FB Gender Checker] Badge position:', badge.style.position);
    console.log('[FB Gender Checker] Badge computed style:', window.getComputedStyle(badge).position);
    
    // Also show a browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Gender Analysis Complete', {
        body: `Profile: ${data.profileGender}, Picture: ${data.pictureGender || 'Not analyzed'}`,
        icon: chrome.runtime.getURL('icons/icon48.png')
      });
    }
    
    // Also try to insert in profile area if possible (but keep fixed one)
    setTimeout(() => {
      const profileName = document.querySelector('h1[data-testid="user-name"], h1[dir="auto"]');
      const mainContent = document.querySelector('[role="main"], [data-pagelet="ProfileTilesFeed"], [data-pagelet="ProfileTimeline"]');
      
      if (profileName && profileName.parentElement) {
        // Try to add a second badge near profile name
        const profileBadge = badge.cloneNode(true);
        profileBadge.id = 'fb-gender-checker-badge-profile';
        profileBadge.style.position = 'relative';
        profileBadge.style.margin = '15px 0';
        
        const container = profileName.parentElement;
        if (container.nextSibling) {
          container.parentElement.insertBefore(profileBadge, container.nextSibling);
        } else {
          container.parentElement.appendChild(profileBadge);
        }
        console.log('[FB Gender Checker] Also added badge near profile name');
      } else if (mainContent) {
        const profileBadge = badge.cloneNode(true);
        profileBadge.id = 'fb-gender-checker-badge-profile';
        profileBadge.style.position = 'relative';
        profileBadge.style.margin = '15px 0';
        mainContent.insertBefore(profileBadge, mainContent.firstChild);
        console.log('[FB Gender Checker] Also added badge in main content');
      }
    }, 500);
  }
}

// Initialize checker
let checker = null;

// Listen for manual check requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'forceCheck') {
    console.log('[FB Gender Checker] Manual check triggered from popup');
    try {
      // Force profile detection to true and try anyway
      if (!checker) {
        checker = new FacebookGenderChecker();
      }
      
      // Override detection and force check
      checker.isProfilePage = true;
      checker.startChecking();
      
      // Show status that we're checking
      checker.showStatusIndicator('Manual check triggered - analyzing...');
      
      sendResponse({ success: true, message: 'Check initiated' });
    } catch (error) {
      console.error('[FB Gender Checker] Error in forceCheck:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});

// Also listen for custom events (for direct script injection fallback)
window.addEventListener('fbGenderCheckerForceCheck', () => {
  console.log('[FB Gender Checker] Force check event received');
  if (!checker) {
    checker = new FacebookGenderChecker();
  }
  checker.isProfilePage = true;
  checker.startChecking();
  checker.showStatusIndicator('Manual check triggered - analyzing...');
});

// Re-check when navigating (Facebook uses SPA)
const observer = new MutationObserver(() => {
  if (!checker) {
    checker = new FacebookGenderChecker();
  } else {
    // Re-check after navigation (debounced)
    clearTimeout(checker.checkTimeout);
    checker.checkTimeout = setTimeout(() => {
      checker.startChecking();
    }, 2000);
  }
});

// Wait for body to exist before observing
if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  checker = new FacebookGenderChecker();
  
  // Don't show test badge - only show real results
} else {
  // Wait for body to load
  const bodyObserver = new MutationObserver((mutations, obs) => {
    if (document.body) {
      obs.disconnect();
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      checker = new FacebookGenderChecker();
      
      // Don't show test badge - only show real results
    }
  });
  bodyObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

