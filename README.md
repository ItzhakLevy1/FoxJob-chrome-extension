# ScaleFox Job Tracker Extension

A lightweight Google Chrome extension designed to automatically track and visually mark job applications on the ScaleFox job board (`jobs.scalefox.ai`).

## Features

- **Automated Tracking:** Detects when you click the **Apply** button inside a specific job page.
- **Visual Indicators:** Automatically highlights job cards you have already applied to in the main listings with a distinct green border, background tint, and a `✅ Applied` badge.
- **Dynamic Content Support:** Uses a `MutationObserver` to ensure new jobs loaded via infinite scroll or dynamic navigation are scanned and marked seamlessly.
- **Persistent Storage:** Saves applied job IDs locally in your browser's `localStorage` under the key `scalefox_applied_jobs`.
- **Status Banner:** Displays a small, non-intrusive status banner on the top-right corner to confirm the extension is active.

---

## File Structure

scalefox-job-tracker/
├── manifest.json   # Extension configuration and permissions
├── content.js       # Core logic for tracking clicks and marking jobs
├── styles.css       # Custom styles for the banner and highlighted jobs
└── README.md        # Documentation
Installation Instructions
Since this is a custom extension not published on the Chrome Web Store, you can install it manually using Chrome's Developer Mode:

Download/Clone this repository or copy the files into a local folder (e.g., scalefox-job-tracker).

Open Google Chrome and navigate to: chrome://extensions/

In the top-right corner, toggle the Developer mode switch to ON.

In the top-left corner, click the Load unpacked button.

Select the scalefox-job-tracker folder containing your files.

Refresh your ScaleFox jobs page, and the extension will be active!

How it Works
ID Extraction: The extension parses the unique job UUID directly from the job links (e.g., extracting 60c91a7e-cf3b-4d40-9e8f-eef574676ab4 from /jobs/...).

Event Listening: A global click listener captures anytime a button or link containing the word "Apply" is clicked, storing that job's ID.

DOM Manipulation: The main listings are scanned, matching job cards against stored IDs, and applying the .applied-job CSS class to matched elements.

### 💡 A little tip for the future:
If in the future you want to reset the list of jobs you applied to in order to "start over", you can simply open the DevTools on the website (F12), go to the **Application** -> **Local Storage** tab, and delete the line for `scalefox_applied_jobs`, or run in the console:
```javascript
localStorage.removeItem("scalefox_applied_jobs");