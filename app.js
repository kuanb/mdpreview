(() => {
  const DEFAULT_MD = `# Welcome to Markdown Live Preview

Type markdown on the **left**, see the rendered output on the **right**.

## Features

- GitHub-flavored markdown
- Live preview as you type
- Dark and light themes
- Works offline after first load

## Example

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

### Code

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Language | Year |
| -------- | ---- |
| C        | 1972 |
| Python   | 1991 |
| Rust     | 2010 |

### Task list

- [x] Write markdown
- [x] See preview
- [ ] Profit

### Mermaid diagram

\`\`\`mermaid
graph LR
  A[Write markdown] --> B{Render}
  B -->|plain| C[HTML]
  B -->|fenced| D[Diagram]
\`\`\`

---

[Learn more about Markdown](https://www.markdownguide.org/).
`;

  const STORAGE = {
    md: "mdpreview:content",
    theme: "mdpreview:theme",
  };

  const editor = document.getElementById("editor");
  const preview = document.getElementById("preview");
  const themeBtn = document.getElementById("theme-btn");
  const resetBtn = document.getElementById("reset-btn");
  const copyBtn = document.getElementById("copy-btn");

  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false,
  });

  let mermaidSeq = 0;

  function initMermaid(theme) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: theme === "dark" ? "dark" : "default",
      fontFamily: 'inherit',
    });
  }

  async function render() {
    const raw = marked.parse(editor.value);
    preview.innerHTML = DOMPurify.sanitize(raw, { ADD_ATTR: ["class"] });

    const blocks = preview.querySelectorAll("pre > code.language-mermaid");
    if (!blocks.length) return;

    const targets = [];
    blocks.forEach((code) => {
      const pre = code.parentElement;
      const wrap = document.createElement("div");
      wrap.className = "mermaid";
      wrap.id = `mermaid-${++mermaidSeq}`;
      wrap.textContent = code.textContent;
      pre.replaceWith(wrap);
      targets.push(wrap);
    });

    try {
      await mermaid.run({ nodes: targets });
    } catch (err) {
      targets.forEach((el) => {
        if (!el.querySelector("svg")) {
          el.classList.add("mermaid-error");
          el.textContent = `Mermaid error: ${err.message || err}`;
        }
      });
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE.md, editor.value); } catch (_) {}
  }

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    initMermaid(theme);
    try { localStorage.setItem(STORAGE.theme, theme); } catch (_) {}
  }

  const savedMd = (() => {
    try { return localStorage.getItem(STORAGE.md); } catch (_) { return null; }
  })();
  editor.value = savedMd ?? DEFAULT_MD;

  const savedTheme = (() => {
    try { return localStorage.getItem(STORAGE.theme); } catch (_) { return null; }
  })();
  applyTheme(savedTheme || "dark");

  render();

  editor.addEventListener("input", () => {
    render();
    save();
  });

  themeBtn.addEventListener("click", () => {
    const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    render();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset editor to the default sample?")) {
      editor.value = DEFAULT_MD;
      render();
      save();
    }
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preview.innerHTML);
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = original; }, 1200);
    } catch (_) {
      alert("Copy failed. Select and copy manually.");
    }
  });

  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.slice(0, start) + "  " + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      render();
      save();
    }
  });
})();
