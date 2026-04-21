# GMP+ Helpdesk Customer Journey

Interactive customer journey map for the GMP+ International Helpdesk, covering seven customer segments across three urgency bands, a 12-stage journey track, and the three 2026 strategic goals.

## Run locally

The page loads React, ReactDOM and Babel standalone from unpkg and compiles the JSX in the browser, so any static server will do:

```sh
python -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000/>.

Opening `index.html` directly via `file://` will not work because browsers block `<script type="text/babel" src="...">` over that protocol.

## Structure

- `index.html` &mdash; entry point, loads React/Babel and the three JSX sources
- `styles.css` &mdash; full stylesheet (colours, typography, layout, print rules)
- `src/micons.jsx` &mdash; inline Material-style SVG icon set
- `src/data.jsx` &mdash; segments, urgencies, matrix, stages, lanes, goals
- `src/app.jsx` &mdash; React components and root render
- `assets/` &mdash; GMP+ logo and favicon

## Views

Toggle between **Interactive** (filters, click-to-focus stage column, drawer with helpdesk actions/pains/moments of truth) and **Poster** (flat print-ready layout) from the top bar. `Print / PDF` uses the browser print dialog with A3 landscape print styles.
