import JSZip from 'jszip';

export const CHROME_EXTENSION_MANIFEST = {
  manifest_version: 3,
  name: "Job-Fit Scorer & ATS Assistant",
  version: "1.0.0",
  description: "1-Click scraper for LinkedIn & Indeed job descriptions directly into Job-Fit Scorer & Resume Builder.",
  action: {
    default_popup: "popup.html",
    default_icon: {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  },
  permissions: ["activeTab", "scripting", "clipboardWrite"],
  host_permissions: [
    "https://*.linkedin.com/*",
    "https://*.indeed.com/*",
    "https://*.greenhouse.io/*",
    "https://*.lever.co/*"
  ]
};

export const POPUP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Job Scraper</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; width: 320px; padding: 16px; margin: 0; background: #0f172a; color: #f8fafc; }
    h2 { font-size: 16px; margin: 0 0 8px 0; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
    p { font-size: 12px; color: #94a3b8; line-height: 1.4; margin: 0 0 16px 0; }
    button { width: 100%; padding: 10px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: background 0.2s; }
    button:hover { background: #1d4ed8; }
    .status { margin-top: 12px; font-size: 12px; padding: 8px; border-radius: 6px; display: none; }
    .status.success { background: #064e3b; color: #34d399; display: block; }
    .status.error { background: #7f1d1d; color: #f87171; display: block; }
    .badge { display: inline-block; font-size: 10px; background: #1e293b; color: #38bdf8; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="badge">Job-Fit Scorer Companion</div>
  <h2>🎯 Quick Job Scraper</h2>
  <p>Open any LinkedIn, Indeed, or Greenhouse job listing and click below to extract the title, company, and description.</p>
  <button id="scrapeBtn">Scrape Current Job Post</button>
  <div id="status" class="status"></div>
  <script src="popup.js"></script>
</body>
</html>`;

export const POPUP_JS = `document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.className = 'status';
  statusDiv.style.display = 'none';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    statusDiv.textContent = 'Could not access active browser tab.';
    statusDiv.className = 'status error';
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // LinkedIn job scraper heuristics
      let title = document.querySelector('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1')?.innerText || '';
      let company = document.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name')?.innerText || '';
      let description = document.querySelector('#job-details, .jobs-description__content, .jobsearch-jobDescriptionText')?.innerText || document.body.innerText;
      
      const payload = {
        title: title.trim(),
        company: company.trim(),
        description: description.trim().slice(0, 5000),
        url: window.location.href,
        scrapedAt: new Date().toISOString()
      };

      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      return payload;
    }
  }, (results) => {
    if (results && results[0] && results[0].result) {
      statusDiv.textContent = '✓ Copied job details to clipboard! Paste into Job-Fit Scorer.';
      statusDiv.className = 'status success';
    } else {
      statusDiv.textContent = 'Could not extract job text on this page. Try selecting the text manually.';
      statusDiv.className = 'status error';
    }
  });
});`;

export const README_MD = `# Job-Fit Scorer & ATS Assistant Chrome Extension

### How to Install in 3 Easy Steps:
1. Download and extract this zip file into a folder on your computer.
2. In Google Chrome or Microsoft Edge, navigate to: \`chrome://extensions/\`
3. Toggle on **"Developer mode"** in the top right corner, then click **"Load unpacked"** and select this folder!

### How to Use:
1. Open any job posting on **LinkedIn**, **Indeed**, **Greenhouse**, or **Lever**.
2. Click the extension icon in your Chrome toolbar.
3. Click **"Scrape Current Job Post"**.
4. The full job title, company, and description will be automatically formatted and copied to your clipboard, ready to paste straight into Job-Fit Scorer's 1-Click Tailor or Matcher!
`;

export async function downloadChromeExtensionZip(): Promise<void> {
  const zip = new JSZip();
  zip.file('manifest.json', JSON.stringify(CHROME_EXTENSION_MANIFEST, null, 2));
  zip.file('popup.html', POPUP_HTML);
  zip.file('popup.js', POPUP_JS);
  zip.file('README.md', README_MD);

  // Generate blank placeholder 1x1 transparent png for icon
  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  zip.file('icon.png', base64Png, { base64: true });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JobScraper-ChromeExtension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
