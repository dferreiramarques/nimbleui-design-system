# nimbleUI design system

Small, calm, dependency-free UI kit extracted from **Roadmaps**, **Taskboards** and **Diagramico**.
Dark and light differ **only in colour**; three accents (emerald, rose, indigo) via `data-accent`.

```html
<html data-theme="light">            <!-- add data-accent="rose" | "indigo" for other accents -->
<link rel="stylesheet" href="src/tokens.css">
<link rel="stylesheet" href="src/components.css">
<script src="src/theme.js"></script> <!-- optional: persists theme, wires [data-theme-toggle] buttons -->
```

- `src/tokens.css` — colour tokens per theme + geometry once in `:root`
- `src/components.css` — top bar, buttons, segmented, chips/tags, board, forms, dialog, toast, landing blocks
- `index.html` — live gallery (open it, toggle theme/accent)
- `docs/DESIGN-SYSTEM.md` — principles, tokens, how to add an accent
- `templates/product-page/` — product page template (+ privacy/terms), copy and fill `{{PLACEHOLDER}}`
- `skill/SKILL.md` — Claude Code skill (`nimbleui-design-system`); copy the `skill/` folder to `~/.claude/skills/nimbleui-design-system/`

MIT licensed.
