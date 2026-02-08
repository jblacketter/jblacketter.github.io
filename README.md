# gregblacketter.github.io

Personal portfolio showcase — QA Engineer & AI Builder.

## Quick Start

Open `index.html` in a browser, or serve locally:

```bash
python -m http.server 8000 --directory .
# then visit http://localhost:8000
```

## Updating Content

All content is in **`data/content.json`**. Edit that file — no HTML changes needed.

### Add or Remove a Repo

In `content.json`, add or remove an entry in the `repos` array:

```json
{
  "name": "repo-name",
  "title": "Display Title",
  "description": "One-sentence description of what it does.",
  "impact": "Optional — what it demonstrates or achieves.",
  "tags": ["Language", "Framework", "Category"],
  "url": "https://github.com/jblacketter/repo-name"
}
```

### Update AI Activities

Edit the `currentFocus` array:

```json
{
  "title": "Activity Name",
  "description": "What you're exploring and why it matters.",
  "status": "active"
}
```

### Enable a Demo Video

Set `video.enabled` to `true` and update the fields. (Video embed support will be added when a video is ready.)

## Deploying

Push the contents of this directory to the `gregblacketter.github.io` repository. GitHub Pages will serve it automatically.

## File Structure

```
├── index.html          Main page
├── css/style.css       Styles (dark theme, card grid, animations)
├── js/main.js          Data rendering + scroll animations
├── data/content.json   All editable content
├── assets/images/      Graphics (favicon, og-image)
└── README.md           This file
```
