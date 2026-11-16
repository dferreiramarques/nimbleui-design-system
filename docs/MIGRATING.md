# Migrating an app to nimbleUI — checklist and learnings

First migration: **Roadmaps** (branch `nimbleui-migration`). Use this for Taskboards, Diagramico and new apps.

## Checklist

1. **Vendor the kit:** copy `src/{tokens,components}.css`, `theme.js`, `behaviors.js` to `public/nimble/` (or similar). Never edit the copy; change the kit repo, then re-copy. Add a test that the files are served.
2. **Page heads:** `<meta name="nimble-theme-key" content="<old storage key>">` (keeps users' saved theme) → `theme.js` in `<head>` → `tokens.css`, `components.css`, then the app's own CSS. `behaviors.js` at the end of `<body>` before the app script.
3. **Slim the app CSS:** delete everything the kit now provides (tokens, base, buttons, chips, cards, dialog, toast, forms, landing blocks). Keep only app-specific rules. Search for per-theme rules (`[data-theme="dark"] .x { color }`) and replace with a token (`--primary-fg`…).
4. **Map classes** with the table in `PATTERNS.md` (legacy → nimbleUI). Rename, don't alias.
5. **Replace behaviours, not just styles:** native HTML5 drag → `data-sortable` + `nimble:sort`; hand-written menus → `.menu` + `data-menu-toggle`; hand-written dialogs → `.overlay[hidden]` + `NimbleUI.dialog.open/close`; toast → `NimbleUI.toast`; theme toggle → `data-theme-toggle[data-theme-icon]`.
6. **Tests:** theme blocks colour-only (`tools/check-theme.mjs` or the same logic in the app's test), pages load the kit, no `style=""`, CSP unchanged.
7. **Verify in a browser:** both themes (computed non-colour diff = 0), 375px width (no horizontal scroll), a real drag with pointer events, keyboard sort, Esc on dialogs/menus, focus returns to the opener.
8. **Ship on a branch**, test with the real backend, then merge.

## Learnings (from Roadmaps)

- **Apps re-render everything.** Roadmaps rebuilds the board with `replaceChildren` on each change. The event model (`nimble:sort` → update data → re-render) fits that; never keep references to DOM nodes across a sort. Restoring focus after the re-render is the app's job (`requestAnimationFrame` + selector).
- **The item itself may be a button** (tabs). The drag guard must only skip interactive elements *inside* the item, not the item.
- **Touch: hold, then move.** Starting the drag on the 250ms timer steals still long-presses that apps use for context menus. The drag starts on the first move after the hold.
- **Keys the app already handles win.** Sorting by keyboard ignores keydowns with `defaultPrevented` (Roadmaps uses Enter to open a card) and can be disabled per container (`data-sortable-keyboard="off"`, e.g. tabs that select on Space/Enter).
- **Focus order with menus → dialogs.** A menu item that opens a dialog must not get its toggle refocused afterwards; the kit only refocuses if focus is still inside the menu.
- **Responsive-hide modifiers come last.** `.menu__item--m { display:none }` lost to a later `.menu__row { display:flex }` (same specificity). Put "hidden on desktop" rules after the display rules, or use `[hidden]`.
- **Name collisions.** The app had its own `@keyframes pulse`; the kit's `pulse` (opacity) won/lost depending on order. Rename app keyframes (`dot-pulse`) — and prefer prefixed names for new kit keyframes.
- **Keep the user's saved theme.** Reuse the old localStorage key via the meta tag; default to `auto` only when nothing is stored. Some pages had a toggle button that was never wired — wire every toggle with `data-theme-toggle`.
- **CSP:** setting CSS custom properties with `style.setProperty` is allowed under `style-src 'self'`; inline `style=""` attributes and `setAttribute('style', …)` are not. The kit only uses the former (drag ghost position).
- **Stable ids for items.** `nimble:sort` gives the element and `newIndex` among items only; map with `data-id`, and keep placeholders (`.empty`) outside `[data-sortable-item]`.

- **Slimming CSS drops rules silently.** After deleting what the kit provides, diff the selector lists: extract every selector from the old app CSS and from kit + new app CSS, and review what is missing (Roadmaps lost `.tones/.tone-opt` — unstyled buttons — and `.btn--del-left` this way). Do it before the browser check; keep the script in the app's tools.
- **Check dialogs against short screens** (≈ 630px of viewport height): dialogs must not scroll. Put short fields side by side (title + column, tag + when) rather than shrinking spacing.

- **Prove the pages did not change.** Serve the old and the new `public/` on two ports (a tiny server with CORS), fetch each page, inline its CSS into a `srcdoc` iframe, and compare `getComputedStyle` of every element in both themes at 1280 and 375px. It caught a lost specificity (`.lp-hero .lp-note` became `.lp-note` and lost to `.lp-hero p`) and a missing `position: relative`. Expected leftovers are deliberate (e.g. no `grab` cursor on a static demo; accent links on light legal pages now use `--primary-fg`, which has better contrast).

- **Big apps migrate in phases.** Phase 1: tokens only (alias the app's own colour/radius/shadow names to nimble tokens in one non-theme `:root` block), fonts, theme, product pages. Phase 2: components and behaviours, one at a time. Loading the kit's `components.css` in an app that already has `.card`, `.toast`, `.topbar`, `.btn…` classes makes them collide; load it only once the app's components are renamed.
- **Mirrored folders.** Taskboards ships the same files from the repo root (GitHub Pages) and `public/` (Render): edit the root, copy to `public/`, and `cmp` them before committing. Bump the service-worker cache name and list the new files.
- **Kit gaps show up in the parity check, not in the code review:** `.lp-demo`, `.doc__date` and the 480px topbar rule were missing from the kit and were only caught by comparing computed styles of the old and new product pages.
- **Simulate a signed-in app** by seeding the app's own localStorage keys (profile hint + boards) and hiding the sign-in gate; load old and new versions under `/m/` and `/b/` of one server so iframes are same-origin and can be compared.

## Testing recipes

- **Fake backend page:** copy `public/`, replace the sync/auth script with a stub that calls the app's hooks with sample data; serve with `python -m http.server`. Lets you exercise the whole UI without credentials.
- **Theme parity:** in the page, snapshot `getComputedStyle` of every element minus colour-like properties (`color|background|shadow|fill|stroke|caret|filter|backdrop|^-`) in `light` and `dark`, with menus/dialogs open; the diff must be empty. Repeat per accent and density.
- **Pointer-event drags:** dispatch `pointerdown` on the item, `pointermove` on `document` (past 5px, then over the target), `pointerup`; assert `.drag-ghost` exists, the `.drop-slot` is in the target, and the app state changed.
- **Browser pane quirks:** transitions/animations freeze and `requestAnimationFrame` is delayed while the pane is hidden — inject `*{transition:none!important;animation:none!important}` and wait before asserting focus; static files can be served from cache — add `?v=N` or `cache:'reload'`.

## Candidates to promote into the kit (after a second app needs them)

`.menu__row` (label + value row in menus), the account pill + mobile ☰ pattern (Roadmaps `.user`, Taskboards `.user-pill`), colour-coded orderable tabs (`.rtab`) and the colour popover, share/copy rows (`.copyrow`), drop overlay, shelves. Promote when Taskboards is migrated, so each addition is shared by two apps and tested twice.
