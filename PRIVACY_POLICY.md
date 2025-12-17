# Privacy Policy for Facebook Gender Profile Checker

**Last Updated:** December 17, 2025

## Overview

Facebook Gender Profile Checker ("the Extension") is designed to detect potential mismatches between Facebook profile information and profile pictures. This privacy policy explains what data the Extension accesses, how it is used, and how your privacy is protected.

## Data Collection and Usage

### What Data is Accessed

The Extension accesses only publicly visible information from Facebook profiles that you choose to view, including:
- Profile names
- Publicly visible gender information from profile "About" sections
- Profile pictures that are publicly accessible

### How Data is Used

- **Local Analysis**: Profile information is analyzed locally in your browser to detect potential inconsistencies
- **External API Processing**: Profile pictures and names may be sent to third-party APIs (Genderize.io and Hugging Face) for gender detection analysis
- **Display Only**: Analysis results are displayed to you via on-page badges and warnings
- **No Storage**: The Extension does NOT store, save, or retain any profile data, analysis results, or personal information

### Optional API Token Storage

- If you choose to provide a Hugging Face API token for improved accuracy, it is stored **locally on your device only** using Chrome's storage API
- Your API token is never transmitted to anyone except Hugging Face when making analysis requests
- You can delete your stored API token at any time through the extension popup

## Data Sharing

### Third-Party Services

The Extension uses these third-party services to perform analysis:

1. **Genderize.io** - For name-based gender inference
   - We send only the first name extracted from profiles
   - View their privacy policy: https://genderize.io/

2. **Hugging Face** - For image-based gender detection
   - We send only publicly visible profile pictures
   - View their privacy policy: https://huggingface.co/privacy

### What We Do NOT Do

- We do NOT sell, rent, or share your data with advertisers or data brokers
- We do NOT store or maintain a database of profiles you've viewed
- We do NOT track your browsing history
- We do NOT collect personal information about you
- We do NOT use data for any purpose other than providing the core functionality of gender mismatch detection

## Data Retention

- **No data is retained** - All analysis is performed in real-time and results are not stored
- API tokens (if provided) are stored locally on your device until you remove them
- No logs, databases, or records of your usage are maintained

## Permissions Explained

The Extension requests the following Chrome permissions:

- **activeTab**: To access the current Facebook page you're viewing
- **storage**: To save your optional API token locally on your device
- **scripting**: To inject analysis code into Facebook pages
- **notifications**: To display alerts when mismatches are detected
- **host_permissions**: To access Facebook.com (for analysis) and external APIs (Genderize.io, Hugging Face) for gender detection

## User Control

You have full control:
- The Extension only analyzes profiles you actively visit
- You can disable or uninstall the Extension at any time
- You can dismiss warning badges on any profile
- All processing happens locally or transiently through APIs with no persistent storage

## Children's Privacy

The Extension does not knowingly collect or process information from children under 13 years of age. The Extension is designed for adult users who wish to verify profile authenticity on social media.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this document. Continued use of the Extension after changes constitutes acceptance of the updated policy.

## Legal Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) where applicable

## Contact

If you have questions or concerns about this privacy policy or the Extension's data practices, please contact:

**Email:** [Your contact email]

## Your Rights

Depending on your location, you may have rights including:
- The right to know what personal information is collected
- The right to delete personal information
- The right to opt-out of data sharing

Since this Extension does not collect or store personal information, these rights are inherently protected by the Extension's design.

## Certification

The developer of this Extension certifies that:
- User data is not sold or transferred to third parties outside of the approved use cases (transient API analysis)
- User data is not used for purposes unrelated to the Extension's single purpose
- User data is not used to determine creditworthiness or for lending purposes
