# nimbleUI — design system rationale

Extracted from three products by the same author: **Roadmaps** (emerald), **Taskboards** (rose), **Diagramico** (indigo).
They already shared one system (`product-page.css`); nimbleUI makes it a standalone, dependency-free kit.

## Principles

1. **Dark/light only change colours.** Colours are tokens with per-theme values. Sizes, scale, type, spacing, radii, shadow *geometry*, layout and motion are defined once in `:root`. A `[data-theme]` block never contains a non-colour property. To verify, compare computed styles in both themes: the non-colour diff must be empty.
2. **Neutral zinc surfaces, one accent.** Structure comes from `--bg → --surface → --surface-2 → --surface-3` and 1px borders; the accent marks the primary action, focus, selection and drop targets.
3. **Accent is a 5-token swap:** `--primary`, `--primary-h` (hover), `--primary-fg` (accent used as text/icon on surfaces), `--primary-ink` (text on solid accent), `--primary-soft` (focus ring / tinted fills), `--glow` (page halo). Presets via `data-accent`: *emerald* (default), *rose*, *indigo*, *amber*, *violet*.
4. **Semantic hues are separate from the accent:** `--success --info --warn --danger --secondary --contrast`, and status hues `--now --next --later` for columns. Tags/chips tint with `color-mix(in srgb, var(--tone) 16%, transparent)`.
5. **Calm density:** controls 36px (30 small, 44 large), radii 6/8/12/16, 140–220ms eased transitions, focus ring = 2px outline + 3px soft halo. `prefers-reduced-motion` disables animation.
6. **No inline script/style needed** (CSP-friendly): theming via attributes, state via `aria-pressed`, `[hidden]`, `data-*`.

## Tokens

| Group | Tokens |
|---|---|
| Surfaces | `--bg --surface --surface-2 --surface-3 --border --border-strong` |
| Text | `--text --muted --subtle` |
| Accent | `--primary --primary-h --primary-fg --primary-ink --primary-soft --glow` |
| Theme name | `--theme: light\|dark` (set per theme; read it from JS with `getComputedStyle` to pick canvas/chart palettes) |
| Semantic | `--success --info --warn --danger --secondary --contrast` · `--now --next --later` |
| Shadow/overlay | `--shadow-c --overlay` (colour) · `--sh-sm --sh-md --sh-lg` (geometry, in `:root`) |
| Geometry | `--r-sm 6 · --r-md 8 · --r-lg 12 · --r-xl 16`, `--ring 3px`, `--wrap 1180px`, `--fast 140ms`, `--norm 220ms`, `--ease` |
| Type | `--font` Inter · `--mono` JetBrains Mono; base 15px/1.55 (`.9375rem`) |

## Components (`components.css`)

Top bar (`.topbar .brand .nav .actions`) · buttons (`.btn --primary --outline --text --danger --icon --sm --lg`) · segmented (`.seg .seg__btn[aria-pressed]`) · page header (`.hero`) · `.chip` / `.tag[data-tone]` / `.eyebrow` · board (`.cols .col[data-col] .card .drop-slot .empty`) · forms (`.field .input .textarea .select`) · dialog (`.overlay .dialog`) · `.toast` · landing (`.lp-hero .lp-sec .lp-head .grid2/3 .fcard .steps .step .snippet .lp-foot`) · legal pages (`.doc`).

## Adding a new accent

Add two blocks to your own CSS (colour only), e.g.

```css
[data-theme="light"][data-accent="amber"] { --primary:#d97706; --primary-h:#b45309; --primary-fg:#b45309; --primary-ink:#fff; --primary-soft:rgba(217,119,6,.14); --glow:rgba(217,119,6,.10); }
[data-theme="dark"][data-accent="amber"]  { --primary:#fbbf24; --primary-h:#fcd34d; --primary-fg:#fbbf24; --primary-ink:#1c1304; --primary-soft:rgba(251,191,36,.16); --glow:rgba(251,191,36,.12); }
```

Check contrast: `--primary-ink` on `--primary`, and `--primary-fg` on `--bg`/`--surface`, ≥ 4.5:1 in both themes.

## Product page recipe

Template: `templates/product-page/` (`index.html`, `privacy.html`, `terms.html`). Copy the folder, replace every `{{PLACEHOLDER}}`, set `data-accent`, fix the three `../../src/` paths.

Section order (fixed — drop sections, don't reorder): **top bar → hero → demo → features (3 `fcard`) → how it works (`steps`, optional `snippet`) → proof (2 `fcard`) → final CTA → footer**.

- **Top bar:** brand, ≤ 4 anchor links (hidden ≤ 820px), theme toggle, one `btn--primary` CTA.
- **Hero:** eyebrow = 3 facts separated by `·`; h1 states the outcome with the key phrase in `<em>` (the accent); one paragraph ≤ 40 words; CTAs = `btn--primary btn--lg` + `btn--outline btn--lg`; one trust line (`.lp-note`).
- **Demo:** a static, believable example of the product directly under the hero (board, screenshot, widget). Never an empty placeholder.
- **Copy:** benefits not mechanisms; sentences short; same CTA wording top, hero and bottom; no more than one `--primary` button per viewport zone.
- **Legal:** `privacy.html` and `terms.html` use `.doc`; link them in the footer (and from OAuth consent screens if needed).
- **Accent:** one per product via `data-accent`; add new accents as colour-only blocks (see above). Don't restyle components per product.
- **Rules:** no inline `<script>`/`style=""`; theme differences are colour only (verify computed styles in both themes); check at 375px width — no horizontal scroll.

## Behaviours (`src/behaviors.js`)

Dependency-free, CSP-safe, wired by attributes; results are bubbling `CustomEvent`s. The kit never persists anything — listen and save in your app. Load at the end of `<body>`; `theme.js` stays in `<head>`.

| Behaviour | Markup | Events / API |
|---|---|---|
| **Sort** (drag) | container `[data-sortable][data-sortable-group][data-sortable-axis="x"][data-sortable-handle]`, items `[data-sortable-item]` (direct children; `[data-handle]`, `[data-no-drag]`) | `nimble:sort {item, from, to, oldIndex, newIndex}` on the target container. Mouse/pen: 5px threshold · touch: 250ms long-press · autoscroll at edges · Esc cancels · keyboard: Space/Enter grab, arrows move (←/→ across lists), Space/Enter drop, Esc cancel · screen-reader announcements |
| **Edit** (inline) | `[data-editable]` / `="multiline"`, `data-maxlength`, `data-allow-empty`, `[data-edit-trigger="#id"]` | dblclick / Enter / F2; Enter saves (multiline Ctrl/Cmd+Enter), Esc cancels, blur saves · `nimble:edit {value, oldValue}` (cancelable) · `NimbleUI.edit(el)` |
| **Dialog** | `.overlay[hidden] > .dialog`, `[data-dialog-open="#id"]`, `[data-dialog-close][data-dialog-result]`, `[data-static]` | focus trap, Esc/backdrop close, focus returns to opener · `nimble:dialogopen`, `nimble:dialogclose {result}` (cancelable) · `NimbleUI.dialog.open/close` |
| **Confirm** | — | `NimbleUI.confirm({title, message, confirmLabel, cancelLabel, danger}) → Promise<boolean>` |
| **Menu** | `.menu-wrap > button[data-menu-toggle="#id"] + .menu[hidden] > .menu__item[role=menuitem][data-value]` | arrows/Home/End/Esc, outside click · `nimble:menuselect {item, value}` |
| **Tabs** | `[data-tabs] > .tabs__list[role=tablist] > .tab[role=tab][aria-controls]` + `[role=tabpanel]` | arrows/Home/End · `nimble:tab {tab, panel}` |
| **Toast** | — | `NimbleUI.toast(text, {tone: 'success\|info\|warn\|error\|loading', duration, sticky})`; same text+tone is not stacked, it shows (×n); returns `{el, dismiss()}` |

Sort extras: `nimble:sortstart {item, from}` / `nimble:sortend {item, committed}` (UI state while dragging; `html.is-sorting` is also set); item `[data-no-drag]` = not draggable (pointer and keyboard); `[data-sortable-over="class"]` on a list = class toggled on its zone (`[data-sortable-zone]`) while hovered; any element with `[data-sortable-drop="#list"]` (e.g. a collapsed shelf) drops at the end of that list when hovered; `NimbleUI.sortable.cancel()` / `.active()`. The page only autoscrolls when it can actually scroll (a fixed `overflow:hidden` layout never does).

Dynamic content: a `MutationObserver` makes new sortable/editable nodes focusable; call `NimbleUI.init(root)` after inserting tabs.

Extra components (CSS only): `.switch`, `.check`, `.radio` (+ `.opt` label), `.spinner`, `.skeleton`, `.sync[data-state=saved|saving|offline|error]`, `.list/.listrow`, `[data-tip]` tooltip, `.menu`, `.tabs__list/.tab`, `.sr-only`.

## Theme and density

`theme.js`: preference `auto | light | dark` (default **auto** = `prefers-color-scheme`), stored in `localStorage['nimble-theme']`; sets `data-theme` (resolved) and `data-theme-pref`. `[data-theme-toggle]` flips; `[data-theme-set="auto|light|dark"]` sets (and gets `aria-pressed`). `data-density="compact"` on `<html>` or a wrapper shrinks controls (`--ctl-h 30`, `--field-h 32`, `--fs .8125rem`) — a size, never tied to the theme.

## Mobile and overflow rules

Breakpoints, per-product phone modes, test results and a worked example: [BREAKPOINTS.md](BREAKPOINTS.md).

Built into `components.css`; keep them when adding components:

- **Grid tracks use `minmax(0, 1fr)`**, never plain `1fr` (it is `minmax(auto, 1fr)` and grows with long content). Applies to every single-column fallback (`.cols`, `.grid2/3`, `.steps`, `.row2`).
- **Flex/grid children that hold text get `min-width: 0`** (`.col`, `.card`, `.fcard`, `.field`, `.listrow__main`, `.hero__row > *`, `.dialog__body > *`).
- **`body { overflow-wrap: anywhere }`**: unbroken names, URLs and ids wrap; `pre/code/.snippet` opt out and scroll inside their own box. `anywhere` (not `break-word`) also lowers the min-content size, which is what keeps flex/grid tracks inside the viewport.
- **Rows of actions wrap** (`.card__foot { flex-wrap: wrap }`), so five icon buttons never push a card wider than the screen.
- `body { overflow-x: clip }` is only a safety net. If you need it to hide something, there is a bug.
- Check with the **Long content** section of the gallery at 320, 360, 375, 393 and 412px, and with real data (long names, taglines with URLs).

## Using the kit inside an app that has its own CSS

- Load `components.layered.css` instead of `components.css`: the kit goes into the `nimble` cascade layer, so the app's un-layered rules win over same-named classes (`.card`, `.toast`, `.topbar`). Anything the app does not set still falls through, so measure (computed-style diff before/after) and add overrides where needed (for example `button, input { line-height: normal }`, or `.card__actions { opacity: 1 }` when the kit would hide it).
- Dialogs can keep the app's own markup: `overlay[data-dialog-overlay][hidden] > panel[data-dialog-panel]`, `[data-dialog-close]` on the close buttons; open and close with `NimbleUI.dialog.open/close` and listen to `nimble:dialogclose` to reset state (it also fires on Esc and backdrop clicks).

## CSS modules

`src/css/*.css` are the sources; `src/components.css` is generated from them (`node tools/build-css.mjs`, `--check` in CI) and is byte-for-byte the whole kit, so existing apps keep working. Pick modules when you cannot take everything:

| Module | Contains | Pairs with |
|---|---|---|
| `base.css` | reset (`box-sizing`, `margin`), body type and background, focus ring, `.wrap .ico .grow .mono .dim .sr-only`, reduced motion | everything (skip in apps with their own reset) |
| `controls.css` | `.btn`, `.seg`, `.chip/.tag/.eyebrow`, forms, `.tab`, `.switch/.check/.radio`, spinner/skeleton/sync, tooltip, inline edit | `behaviors.js` (edit, tabs) |
| `overlays.css` | `.overlay/.dialog`, `.toasts/.toast`, `.menu` | `behaviors.js` (dialog, confirm, toast, menu) |
| `board.css` | `.cols/.col/.card`, `.empty`, `.drop-slot`, `.drag-ghost`, `.list/.listrow` | `behaviors.js` (sort) |
| `page.css` | `.topbar/.brand/.nav`, `.hero`, landing blocks, `.doc` | — |

Example (a dense editor with its own reset that only needs toasts and dialogs): `tokens.css` + `overlays.css` + `behaviors.js`, then override what the app wants (colours, position) in its own CSS.
