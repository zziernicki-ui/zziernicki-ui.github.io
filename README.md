# Zachary Ziernicki — Personal Site

My personal portfolio, hand-built with plain HTML, CSS, and JavaScript — no
frameworks, no build step. Hosted with GitHub Pages.

**Live:** https://zziernicki-ui.github.io

## Structure

```
.
├── index.html              # all the markup, one page
├── css/
│   └── styles.css          # all styles, organised section-by-section
├── js/
│   └── main.js             # theme toggle, nav, scroll reveals, counters,
│                           # cert filter, gallery lightbox, case-study viewer
├── assets/
│   ├── img/                # photos + placeholder graphics
│   └── case-studies/       # case-study PDFs embedded by the site
└── README.md
```

## Features

- Light / dark theme that remembers your choice (`localStorage`)
- Responsive layout with an accessible mobile menu
- Scroll-reveal animations and count-up statistics
- Two case studies with an in-page PDF viewer ("Read case study")
- Filterable certifications grid
- Photo gallery with a keyboard-navigable lightbox (Esc / ← / →)
- Respects `prefers-reduced-motion` and `prefers-color-scheme`
- Semantic HTML, skip link, visible focus states

## Editing

Anything that still needs your input is marked with an `EDIT:` comment.
To re-skin the entire site, change `--accent` at the top of `css/styles.css`.

## Deploying to GitHub Pages

1. Create a repo named **`zziernicki-ui.github.io`** (must match your GitHub
   username exactly).
2. Push this folder to the `main` branch.
3. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / root**.
4. Wait ~1 minute, then visit `https://zziernicki-ui.github.io`.

No build step — GitHub serves these files directly.

## Local preview

No Node or Python required — a small PowerShell static server is included:

```powershell
powershell -ExecutionPolicy Bypass -File .claude/serve.ps1
```

Then open http://localhost:8123.
