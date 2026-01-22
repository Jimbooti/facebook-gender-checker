# Privacy Policy for Facebook Profile Checker (Free)

**Last Updated:** January 22, 2026

## Overview

Facebook Profile Checker (Free) ("the Extension") helps verify Facebook profiles by detecting potential gender mismatches using name-based analysis. This privacy policy explains what data is accessed, how it is used, and how your privacy is protected.

---

## Data Collection and Usage

### What Data is Accessed

The Extension accesses only:
- **Profile first names** extracted from Facebook profile pages you visit
- **No other data** - We do NOT access profile pictures, "About" sections, posts, friends lists, or any other information

### How Data is Used

- **Name-Based Analysis Only**: The first name from a profile is sent to Genderize.io API to estimate gender based on name patterns
- **Real-Time Processing**: Analysis happens in real-time; no data is stored permanently
- **Display Only**: Results are shown via an on-page badge
- **Daily Limit**: You get 5 free checks per day (counter stored locally on your device)

### What We Store Locally (On Your Device)

The Extension stores these items on **your device only** using Chrome's storage API:
1. **Privacy acceptance flag** - Records that you accepted the privacy disclosure
2. **Daily check count** - Tracks how many checks you've used today (resets at midnight)
3. **Last check date** - Determines when to reset the daily counter

**Important:** We do NOT store profile names, analysis results, or any profile data. Everything is processed in real-time and immediately discarded.

---

## Data Sharing

### Third-Party Service

The Extension uses **ONE** third-party service:

**Genderize.io** - For name-based gender inference
- We send ONLY the first name extracted from profiles (e.g., "Mark" from "Mark Zuckerberg")
- Names are sent via secure HTTPS connection
- Genderize.io does not permanently store the data
- View their privacy policy: https://genderize.io/privacy

### What We Do NOT Do

- ❌ We do NOT analyze or upload profile pictures
- ❌ We do NOT use AI image recognition (that's in the PRO version only)
- ❌ We do NOT access Hugging Face or any other AI services
- ❌ We do NOT store or maintain a database of profiles you've viewed
- ❌ We do NOT track your browsing history beyond Facebook profiles
- ❌ We do NOT collect personal information about you
- ❌ We do NOT sell, rent, or share your data with advertisers or data brokers
- ❌ We do NOT use data for advertising, marketing, or analytics

---

## Permissions Explained

The Extension requests these Chrome permissions:

| Permission | Why We Need It | What We Access |
|------------|----------------|----------------|
| **activeTab** | To read the first name from Facebook profiles you visit | Current tab content when you click the extension |
| **storage** | To save your privacy acceptance and daily check count locally | Your device's local storage only |
| **host_permissions** | To access Facebook.com and Genderize.io API | Facebook profile pages + Genderize.io API endpoint |

**No other permissions are requested.** We do NOT request:
- ❌ Scripting permission
- ❌ Notifications permission
- ❌ Tabs permission
- ❌ History permission
- ❌ Cookies permission

---

## Data Retention

- **Zero retention** - Profile names and analysis results are NOT stored
- **Local counters only** - Check count and date stored on your device (deleted when you uninstall)
- **No logs** - We do not maintain any logs, databases, or records of your usage
- **No tracking** - Your usage is not tracked, monitored, or reported to anyone
- **No analytics** - We do not use Google Analytics or any tracking services

---

## User Control

You have full control:
- ✅ The Extension only analyzes profiles you actively visit
- ✅ You must accept the privacy disclosure before any analysis runs
- ✅ You can disable or uninstall the Extension at any time
- ✅ You can close the on-page badge on any profile
- ✅ All locally stored data (privacy flag, check count) is deleted when you uninstall
- ✅ You can reset your daily counter by clearing extension data

---

## FREE vs PRO Version

This privacy policy is for the **FREE version** available on the Chrome Web Store.

### FREE Version (This Extension)
- ✅ Name-based gender detection (Genderize.io only)
- ✅ 5 checks per day
- ✅ No image analysis
- ✅ No API tokens required
- ✅ Basic permissions only

### PRO Version (Separate Gumroad Product)
The PRO version includes additional features:
- AI-powered image analysis (profile pictures sent to Hugging Face)
- 500-5,000 checks per month
- Optional API token storage (for Hugging Face access)
- Additional permissions required

**If you upgrade to PRO, a separate privacy policy applies to those additional features.**

---

## Children's Privacy

The Extension does not knowingly collect or process information from children under 13 years of age. The Extension is designed for adult users who wish to verify profile authenticity on social media platforms.

---

## Legal Compliance

This Extension complies with:
- **Chrome Web Store Developer Program Policies**
- **General Data Protection Regulation (GDPR)** principles
- **California Consumer Privacy Act (CCPA)** where applicable
- **Data minimization principles** - We only access what's absolutely necessary

---

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this document. We will not make changes that materially affect your privacy without notifying users through the extension or Chrome Web Store listing. Continued use of the Extension after changes constitutes acceptance of the updated policy.

---

## Contact

If you have questions or concerns about this privacy policy or the Extension's data practices:

**GitHub Repository:** https://github.com/Jimbooti/facebook-gender-checker  
**Report Issues:** https://github.com/Jimbooti/facebook-gender-checker/issues  
**Email:** [Your contact email if available]

---

## Your Rights (GDPR/CCPA)

Since this Extension is designed with privacy by default:

### Right to Know
✅ **You have the right to know what data is collected.**  
Answer: Only first names from Facebook profiles are sent to Genderize.io. No other data is collected.

### Right to Delete
✅ **You have the right to delete your personal information.**  
Answer: No personal information is stored. Uninstalling the extension removes all local data (privacy flag, check count).

### Right to Opt-Out
✅ **You have the right to opt-out of data collection.**  
Answer: Don't accept the privacy disclosure, or uninstall the extension at any time.

### Right to Access
✅ **You have the right to access your data.**  
Answer: No data about you is stored. You can view your local storage via Chrome DevTools.

Your privacy rights are inherently protected by the Extension's privacy-first design.

---

## Developer Certification

As the developer of this Extension, I certify that:

- ✅ User data is NOT sold or transferred to third parties (except transient API analysis via Genderize.io)
- ✅ User data is NOT used for purposes unrelated to the Extension's single purpose (profile verification)
- ✅ User data is NOT used to determine creditworthiness or for lending purposes
- ✅ Only necessary permissions are requested (activeTab, storage, host_permissions)
- ✅ No deceptive or misleading practices are employed
- ✅ The Extension complies with Chrome Web Store policies

---

## Security

- 🔒 All API calls to Genderize.io are made over **HTTPS** (encrypted connections)
- 🔒 No data is transmitted to our servers (we don't have any servers)
- 🔒 Local storage is protected by Chrome's built-in security
- 🔒 No third-party tracking scripts or analytics are included
- 🔒 The extension code is static and does not load remote code

---

## Transparency

This Extension is designed to be transparent:
- The privacy disclosure modal shows before any functionality runs
- You must explicitly accept before any API calls are made
- The on-page badge clearly shows what information was analyzed
- All source code is available for review (contact for access)

---

**This privacy policy applies specifically to the FREE version (v1.0.2+) of Facebook Profile Checker available on the Chrome Web Store.**

**For PRO version privacy details, see the separate PRO privacy policy.**
