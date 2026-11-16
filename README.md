# nimbleUI

A small, calm UI kit for building fast, focused web apps. **Plain CSS and a little vanilla JS: no framework, no build step, no dependencies.**

**[Live gallery](https://dferreiramarques.github.io/nimbleui-design-system/)**: toggle theme, accent and density, and try drag, dialogs and menus.

nimbleUI is made to cater the nimble suite of productivity apps by Monco.io, and is what keeps them looking and behaving like one family. It is deliberately small: neutral surfaces, one accent colour, a handful of components that cover most small tools, and behaviours you switch on with HTML attributes.

## Why use it

- **Dark and light change only colour.** Sizes, spacing, radii and shadows are defined once. Switching theme can never shift the layout, and a check (`tools/check-theme.mjs`) enforces it.
- **One accent per product.** Pick `emerald`, `rose`, `indigo`, `amber` or `violet` with `data-accent="…"`, or add your own as a 5-token swap.
- **Works without a toolchain.** Two `<link>` tags and two `<script>` tags. Copy the files into your project and you are done.
- **Behaviour from attributes.** Drag and sort (mouse, touch, keyboard), inline edit, dialogs, confirm, menus, tabs and toasts: `data-sortable`, `data-menu-toggle`, `NimbleUI.dialog`, `NimbleUI.toast`…
- **Safe by default.** No inline scripts or styles needed, so it fits a strict Content-Security-Policy. User text is set as text, never as HTML.
- **Built for phones too.** Components are checked at 375px with no horizontal scroll; long unbroken text wraps instead of widening the page.

## Is it for you?

Good fit: small to medium tools, dashboards, boards, editors and product pages; teams of one or a few; apps where you want a consistent look without adopting a framework.

Not a fit: apps that need a large component catalogue (data grids, date pickers, rich text), or that want typed components from a React/Vue library. nimbleUI is CSS and attributes, so it works *with* those frameworks, but it does not ship framework components.

## Quick start

```html
<!doctype html>
<html lang="en" data-theme="dark" data-accent="indigo">  <!-- accent: omit for emerald, or rose | indigo | amber | violet -->
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="nimble/theme.js"></script>              <!-- in <head>: auto | light | dark, remembered, wires the toggle -->
  <link rel="stylesheet" href="nimble/tokens.css">
  <link rel="stylesheet" href="nimble/components.css">
</head>
<body>
  <header class="topbar"><div class="wrap topbar__in">
    <a class="brand" href="/">My app</a><span class="grow"></span>
    <button class="btn btn--text btn--icon" data-theme-toggle data-theme-icon aria-label="Toggle theme"></button>
    <button class="btn btn--primary">New</button>
  </div></header>
  <main class="wrap">
    <div class="card"><h3 class="card__title">Hello</h3><p class="card__desc">A card.</p></div>
  </main>
  <script src="nimble/behaviors.js"></script>          <!-- end of <body>: drag/sort, dialogs, menus, tabs, toasts -->
</body>
</html>
```

1. Copy `src/tokens.css`, `src/components.css`, `src/theme.js` and `src/behaviors.js` into your project (for example into `nimble/`).
2. Use the classes and attributes you see in the [gallery](https://dferreiramarques.github.io/nimbleui-design-system/); its source (`index.html`) is the reference markup.
3. Want a different accent? Add two blocks to your own CSS (see below).

While trying it out you can link the files straight from the gallery host, for example `https://dferreiramarques.github.io/nimbleui-design-system/src/tokens.css`. For a real product, copy the files, so that a later change here cannot alter your app unannounced.

### Your own accent

An accent is five colours per theme. Add two colour-only blocks:

```css
[data-theme="light"][data-accent="ocean"] { --primary:#0e7490; --primary-h:#155e75; --primary-fg:#155e75; --primary-ink:#fff;    --primary-soft:rgba(14,116,144,.14); }
[data-theme="dark"][data-accent="ocean"]  { --primary:#22d3ee; --primary-h:#67e8f9; --primary-fg:#22d3ee; --primary-ink:#04222a; --primary-soft:rgba(34,211,238,.16); }
```

Then `<html data-accent="ocean">`. Only colours go in those blocks; that is the one rule that keeps themes from changing layout.

## What is in it

| Area | Components |
|---|---|
| Actions | buttons (primary, outline, text, danger, icon, sizes), segmented control, chips, tags |
| Forms | inputs, textarea, select, field with label, hint and error |
| Layout | top bar, wrap, cards, columns (board), list rows, tabs, empty states |
| Overlays | dialog, confirm, toast, menu/popover, tooltip (`data-tip`), drawer, context bar |
| Navigation | colour tabs, tabs with keyboard support, account menu pattern |
| Landing | hero, feature cards, steps, snippets, footer (a product-page template is included) |
| Behaviour | drag and sort across lists, inline edit, dialogs, menus, tabs, toasts, theme toggle |

The more complex patterns (workspace shell, sync status and conflicts, share dialog, matrix, import/export…) are written up in [`docs/PATTERNS.md`](docs/PATTERNS.md), with the markup and rules each one needs.

## Principles

1. **Colour is the only thing a theme may change.** Everything else is defined once in `:root`.
2. **Neutral surfaces, one accent.** Structure comes from four surface levels and 1px borders; the accent marks the primary action, focus, selection and drop targets.
3. **Small on purpose.** A component joins the kit when two products need it. Anything else stays in the app.
4. **Attributes over JavaScript.** If a behaviour can be declared in HTML, it is.
5. **It must survive real content.** Long names, empty states, narrow screens and strict CSPs are part of the checks, not afterthoughts.

Full detail in [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).

## Browser support

Current Chrome, Edge, Firefox and Safari. The kit relies on CSS custom properties, `color-mix()`, `:has()`, `scrollbar-gutter` and cascade layers, so very old browsers are not supported.

## Repository map

- `src/tokens.css`: colour tokens per theme, accents, and geometry (once, in `:root`)
- `src/css/{base,controls,overlays,board,page}.css`: the CSS in modules; `src/components.css` is all of them generated (`node tools/build-css.mjs`). Use `components.css`, or `tokens.css` plus only the modules you need (`base.css` is the reset: skip it if your app has its own). `components.layered.css` loads the kit in a cascade layer, so your own CSS always wins
- `src/theme.js`, `src/behaviors.js`: theme switching and attribute-driven behaviours
- `index.html`, `gallery.css`, `gallery.js`: the live gallery
- `docs/`: [DESIGN-SYSTEM](docs/DESIGN-SYSTEM.md) (principles, tokens), [BREAKPOINTS](docs/BREAKPOINTS.md) (mobile, with a runnable example in `examples/`), [PATTERNS](docs/PATTERNS.md), [DECISIONS](docs/DECISIONS.md) (why things are the way they are), [MIGRATING](docs/MIGRATING.md) (moving an existing app over, with test recipes)
- `templates/product-page/`: a product page plus privacy and terms; copy and fill the `{{PLACEHOLDER}}`s
- `tools/`: `check-theme.mjs` (themes are colour-only), `build-css.mjs`, `sync-apps.mjs` (keeps app copies up to date)
- `skill/SKILL.md`: a [Claude Code](https://claude.com/claude-code) skill so an assistant can apply the system to a new project; copy `skill/` to `~/.claude/skills/nimbleui-design-system/`

## Using it in more than one product

Copy the kit into each product and keep the copies in sync with `node tools/sync-apps.mjs`, or let the included GitHub Action open a "Sync nimbleUI kit" pull request in each product when the kit changes. See [`docs/MIGRATING.md`](docs/MIGRATING.md).

## Feedback and contributions

Issues and pull requests are welcome, especially for accessibility, mobile behaviour and patterns that two products already share. Keep to the principles above: a change that makes a theme alter layout will not be merged, and `node tools/check-theme.mjs src/tokens.css` plus `node tools/build-css.mjs --check` must pass.

## License

MIT, © 2026 David Marques.
