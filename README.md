# jblacketter.github.io

Personal portfolio showcase — **Greg Blacketter, QA Engineer & AI Builder**.

Live at: **https://jblacketter.github.io**

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
  "url": "https://github.com/jblacketter/repo-name",
  "image": "images/repo-name.svg"
}
```

For private repos, omit `url` and add `"private": true` and optionally `"badge": "In Progress"`.

### Add a Project Illustration

Create an SVG file in `images/` (400x200 viewBox, dark background `#1a2332`, use accent colors from the palette). Reference it via the `image` field in content.json.

### Update Current Focus

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

This repo is published via GitHub Pages at `jblacketter.github.io`. Push to `main` and it deploys automatically.

```bash
git add -A && git commit -m "Update site" && git push
```

To add a custom domain (e.g., `gregblacketter.com`), configure it in repo Settings > Pages > Custom domain.

## File Structure

```
├── index.html            Main page (hero, projects, demo, footer)
├── css/style.css         Styles (dark theme, animations, card grid)
├── js/main.js            Data rendering, scroll reveals, particle animation
├── data/content.json     All editable content (repos, focus, meta)
├── images/               SVG project illustrations (8 files)
│   ├── qaagent.svg       Terminal CLI mockup
│   ├── waylin.svg        iOS phone with map pins
│   ├── ai-handoff.svg    Tmux-style workflow panes
│   ├── ghost-job.svg     Browser with risk score badges
│   ├── unified.svg       Hub-and-spoke control plane
│   ├── playwright.svg    Test report with stats
│   ├── bdd-framework.svg Gherkin BDD output
│   └── benfords-law.svg  Digit frequency bar chart
└── README.md             This file
```

## Visual Features

- **Particle network** canvas animation in the hero (65 nodes, 6 accent colors)
- **CRT scanlines** subtle overlay across the page
- **Ambient glow** radial gradient pulsing at top
- **Conic gradient orbit** rotating in the hero background
- **Name shimmer** animated gradient on the heading
- **Staggered card entrances** with cascading delays
- **Pulsing glow borders** on project cards
- **Drifting focus cards** with gentle floating motion
- **Bobbing CTA button** on the GitHub link
- **8 unique accent colors** cycling per card via nth-child
- All animations respect `prefers-reduced-motion`

## Tech Stack

- Vanilla HTML/CSS/JS — no build tools, no frameworks
- Google Fonts: Space Grotesk (headings) + DM Sans (body)
- Data-driven rendering from JSON
- GitHub Pages hosting
