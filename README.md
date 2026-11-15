# nimbleUI design system

Small, calm, dependency-free UI kit extracted from **Roadmaps**, **Taskboards** and **Diagramico**.
Dark and light differ **only in colour**; three accents (emerald, rose, indigo) via `data-accent`.

```html
<html data-theme="light">            <!-- add data-accent="rose" | "indigo" for other accents -->
<link rel="stylesheet" href="src/tokens.css">
<link rel="stylesheet" href="src/components.css">
<script src="src/theme.js"></script>     <!-- in <head>: auto|light|dark, persists, wires [data-theme-toggle]/[data-theme-set] -->
<script src="src/behaviors.js"></script> <!-- end of <body>: drag/sort, inline edit, dialog, menu, tabs, toast -->
```

- `src/tokens.css` — colour tokens per theme + geometry once in `:root`
- `src/components.css` — top bar, buttons, segmented, chips/tags, board, forms, dialog, toast, landing blocks
- `src/behaviors.js` — attribute-driven behaviours (sort/drag, inline edit, dialog, confirm, menu, tabs, toast); see docs
- `index.html` — live gallery (open it, toggle theme/accent)
- `docs/DESIGN-SYSTEM.md` — principles, tokens, how to add an accent
- `docs/PATTERNS.md` — the complex UI patterns of the apps (shell, account menu, board, tabs, shelves, matrix, drawer, share, sync/conflicts…) + legacy→nimbleUI migration map
- `docs/DECISIONS.md` — decisions log
- `templates/product-page/` — product page template (+ privacy/terms), copy and fill `{{PLACEHOLDER}}`
- `skill/SKILL.md` — Claude Code skill (`nimbleui-design-system`); copy the `skill/` folder to `~/.claude/skills/nimbleui-design-system/`

MIT licensed.
