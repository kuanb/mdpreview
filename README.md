# mdpreview

A minimal single-page markdown live preview — like [markdownlivepreview.com](https://markdownlivepreview.com/), but with dark mode.

## Features

- Live side-by-side markdown editor and preview
- GitHub-flavored markdown via [marked](https://github.com/markedjs/marked)
- HTML sanitization via [DOMPurify](https://github.com/cure53/DOMPurify)
- [Mermaid](https://mermaid.js.org/) diagram rendering from fenced ` ```mermaid ` blocks, themed with the app
- Dark / light theme toggle (dark by default)
- Content and theme persisted in `localStorage`
- Copy rendered HTML to clipboard
- No build step — just open `index.html`

## Usage

Open `index.html` in a browser, or serve the directory:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Files

- `index.html` — markup
- `styles.css` — themes and layout
- `app.js` — editor, renderer, persistence
