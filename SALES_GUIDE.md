# Fakebook – Sales Guide

## 1. One‑sentence pitch

**Fakebook is a browser extension that quietly checks whether a Facebook profile’s stated gender matches what’s implied by their profile picture, then surfaces clear, on‑page warnings when something looks off.**

## 2. Who this is for

- **Online safety & trust teams**
  - Platforms, communities, and dating apps whose members routinely click through to Facebook profiles to vet people.
  - Need fast, lightweight signals of possible misrepresentation without building heavy internal tooling.

- **Journalists, investigators, and OSINT practitioners**
  - Frequently evaluate whether a Facebook profile is genuine.
  - Want consistent, repeatable checks and an audit‑friendly visual marker on the page.

- **Parents, educators, and online safety advocates**
  - Care about spotting potential impersonation or catfishing profiles quickly.

- **Power users and security‑conscious individuals**
  - Heavy Facebook users who want an extra “sense check” when reviewing friend requests, group join requests, or message senders.

## 3. Core value propositions

- **Instant signal, no workflow change**
  - The badge and warnings appear **directly on the Facebook profile**, so there’s no need to copy links into external tools.

- **Multiple weak signals combined into one clear outcome**
  - Uses name‑based gender inference, profile text, and profile picture analysis together.
  - Surfaces a **simple status**: match, mismatch, picture‑only, profile‑only, or unknown.

- **Resilient to Facebook’s SPA navigation**
  - Follows you as you click from profile to profile without needing page reloads.
  - Debounces and caches results so it feels smooth and predictable.

- **Privacy‑respecting by design**
  - Only uses data that is already publicly visible on the profile.
  - Does not store or resell profile data; analysis is done locally or via standard ML APIs.

- **Works out of the box, but grows with you**
  - No token required for basic use.
  - Optional Hugging Face token unlocks more reliable image analysis and higher rate limits for heavy users or teams.

## 4. Quick demo script (3–5 minutes)

**Goal**: Show that Fakebook is fast, unobtrusive, and helpful when a profile looks suspicious.

1. **Open a normal Facebook profile**
   - Show that a small badge appears near the top of the page.
   - Point out the two lines: **Profile Gender** vs **Picture Gender**, and the overall status (e.g., Match / Picture Only).

2. **Open a suspicious or mismatched profile (or a prepared demo account)**
   - Scroll to show the banner and badge.
   - Highlight the mismatch text: e.g. “Profile indicates female, but profile picture suggests male.”
   - Emphasize that this is a **signal, not a verdict**; it’s prompting a closer look.

3. **Navigate between profiles without reloading the tab**
   - Click to a second and third profile using Facebook’s built‑in navigation.
   - Point out that Fakebook automatically:
     - Removes the old badge.
     - Adds a new badge for the current profile.
     - Avoids flickering or duplicate UI.

4. **Show limited‑data behavior**
   - Visit a profile with no visible picture or very sparse info.
   - Call out the “Partial / Limited data” messaging and how the tool refuses to over‑claim.

5. **Open the popup**
   - Show the simple controls:
     - Current page status (profile vs non‑profile).
     - Optional API token field.
     - “Test Current Profile” button to manually trigger analysis.

Close with: **“It’s like a second set of eyes that quietly flags when something feels off about a profile’s presentation, without interrupting how you already work.”**

## 5. Positioning vs alternatives

- **Versus manual review**
  - Manual review is subjective and time‑consuming.
  - Fakebook provides a **consistent baseline check** that can be done on every profile you open, in the background.

- **Versus heavy OSINT suites or enterprise tools**
  - OSINT suites are powerful but complex, expensive, and overkill for many teams.
  - Fakebook is **lightweight, install‑and‑go**, focused on one high‑value signal only.

- **Versus “AI people detectors” that scan the whole web**
  - Those tools often require pasting URLs into dashboards and may store/query large amounts of personal data.
  - Fakebook runs inside the browser, on the page you’re already viewing, minimizing friction and data movement.

## 6. Common objections and responses

- **“This could be wrong or biased.”**
  - Yes, it’s **not a definitive classifier**; it’s a heuristic signal.
  - The UI, wording, and documentation all emphasize that this is a prompt for further review, not a label.

- **“What about non‑binary or trans people?”**
  - Fakebook focuses on detecting **inconsistencies between self‑presentation signals**, not policing identity.
  - It can be tuned in messaging to emphasize caution and verification rather than judgment.

- **“Is this allowed by Facebook?”**
  - The extension only uses data a user’s browser already sees and does not bypass any controls.
  - It’s comparable to accessibility or productivity extensions that annotate existing pages.

- **“Will this slow down my browsing?”**
  - Profile detection is lightweight and debounced; image analysis is rate‑limited and cached per profile.
  - On most machines, the perceived overhead is negligible.

## 7. Packaging and pricing ideas (for sales conversations)

These are **starting points**, not hard rules; adjust up/down based on your market and how much support you include.

- **Free personal edition**
  - Chrome Web Store listing, no token required.
  - Great for individuals and as a “try before you buy” entry point.
  - **Price**: \$0, but you can optionally cap analysis volume (e.g., soft limit per day).

- **Pro / Team edition (concept)**
  - Bundled with a managed API token and higher‑confidence models.
  - Centralized config (e.g., list of domains/URLs where analysis is enabled).
  - Optional lightweight logging so teams can review which profiles triggered mismatches (subject to policy and privacy requirements).
  - **Example pricing options**:
    - **Seat‑based**: \$9–\$19 / user / month, billed annually.
    - **Team pack**: \$49–\$99 / month for up to 10 reviewers, then tiered.

- **Enterprise / OEM integration**
  - Integrate Fakebook’s logic into an internal reviewer tool or case‑management system.
  - Provide custom models, thresholds, or UX tailored to the org’s risk policies.
  - Include onboarding, SLAs, and possibly a private ML endpoint.
  - **Typical shape**: starting around \$5k–\$15k / year for small orgs, scaling with number of reviewers and required support / customization.

## 8. Talk tracks for different buyers

- **For Trust & Safety leads**
  - “You’re already asking your moderators to use judgment on sketchy profiles. Fakebook gives them a consistent, visual nudge when profile text and images don’t line up, without adding another dashboard.”

- **For Editors / Investigative teams**
  - “When your reporters check sources or social leads, this gives them a fast, repeatable check right on Facebook profiles, reducing the chance of missing obvious impersonations.”

- **For Parents / Safety advocates**
  - “This doesn’t block or censor, but it helps surface ‘something feels off here’ moments, so conversations about safety can happen sooner.”

## 9. Next steps for a prospect

- Install the extension in a test browser profile.
- Have a small group of reviewers or moderators use it for a week while doing normal work.
- Collect:
  - How often it surfaces useful mismatches.
  - How often it feels noisy or irrelevant.
  - Any specific cases where it helped catch a problem.
- Then discuss whether to:
  - Tune thresholds/messaging, or
  - Package a Pro/Team deployment with managed tokens and light governance.
