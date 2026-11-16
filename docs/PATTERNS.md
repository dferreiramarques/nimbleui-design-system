# nimbleUI — UI patterns

Patterns are compositions of the kit's components and behaviours, taken from the three apps. Each entry says **where it comes from**, **how to build it**, and its **status**:

- **kit** — buildable today with `components.css` + `behaviors.js`.
- **css-todo** — the layout CSS exists only in the owning app; it is added to the kit when that app is migrated (so the kit never carries unused, untested CSS).

Rules that apply to every pattern: colours only change with the theme · no inline `<script>`/`style=""` · state in attributes (`aria-pressed`, `hidden`, `data-*`) · text via `textContent` · the kit never persists (listen to `nimble:*` events and save in the app).

---

## 1. Page shell (app pages) — *Roadmaps, Taskboards* · kit

Sticky `.topbar` (blurred) over a `main.wrap`. Order in the bar: brand · primary context (tabs / title) · `.grow` · status chip · theme toggle · account.

```html
<header class="topbar"><div class="wrap topbar__in">
  <a class="brand" href="/">…</a> <div id="context">…</div> <span class="grow"></span>
  <span class="sync" data-state="saved">Saved</span>
  <button class="btn btn--text btn--icon" data-theme-toggle aria-label="Toggle theme">…</button>
  <span class="menu-wrap">…account menu (pattern 3)…</span>
</div></header>
<main class="wrap"><section class="hero">…</section> …content… </main>
<div class="toasts" aria-live="polite"></div>
```

**Phones (≤ 700px):** the bar keeps only the open item with ‹ › and one ☰ button. Brand link, sync chip, theme toggle, account, "new", export/import and sign-out all move into the ☰ menu (items flagged mobile-only are hidden above 700px). Rule: *any new top-bar control must also exist in the menu.*

## 2. Workspace shell (editors) — *Diagramico* · css-todo

Full-bleed canvas with **floating panels** (`.panel` = `--surface` + 1px border + `--sh-md`, radius 10): top bar (doc name + save state + export), left **tool rail** (icon buttons, key hint bottom-right), **contextual bar** that follows the selection, bottom-right zoom, bottom-left help. `pointer-events:none` on the bar container, `auto` on its children, so the canvas stays clickable. Respect `env(safe-area-inset-*)`. Under 940px height the rail becomes two columns; under 700px width panels dock to edges. Use `data-density="compact"` here.

## 3. Account menu — *Roadmaps `.user`, Taskboards `.user-pill`* · kit

Avatar+name pill button (`btn--outline`, rounded) opening a `.menu.menu--end`: email line (muted), items, `.menu__sep`, destructive/sign-out last. Mobile: replace the pill with a ☰ `btn--icon` and prepend the mobile-only items (new, about, sync status, theme). Events: `nimble:menuselect`.

**Install:** an icon-only button in the top bar breaks narrow bars (it wrapped the account pill), so put it in the account menu instead: `<button class="menu__item menu__row" role="menuitem" data-install hidden><span>Install app</span><span class="install-ico"></span></button>`, and on the product page as `<button class="btn btn--outline btn--lg" data-install hidden><span class="install-ico"></span> Install the app</button>` (load `behaviors.js` there). It stays hidden until the browser offers installation, and again once installed or when running as an installed app. Needs a `manifest.webmanifest` with PNG icons (192, 512, maskable) and an `apple-touch-icon`. Event: `nimble:install {outcome}`. iOS Safari has no install prompt, so it never shows there (Share → Add to Home Screen).

## 4. Auth gate and empty state — *Roadmaps `.login`, `.welcome`* · kit

Centered card (`--r-xl`, `--sh-md`): logo mark, h1, one line of copy, one `btn--primary btn--lg` (provider icon + label), optional `btn--text btn--sm` ("Use a different account"), status line with `role="status"`. **Empty state** (no items yet) uses the same card with one primary action — never an empty page. Errors go in the status line in `--danger`, not in an alert.

## 5. Board: columns, cards, inline edit — *Roadmaps, Taskboards* · kit

`.cols > .col[data-col] > .col__head + .col__list[data-sortable][data-sortable-group]` with `.card[data-sortable-item]` children (title `data-editable`). Drag between columns, keyboard sort, `nimble:sort` → renumber and save. Column counts update from the event. Per card: hover actions (`.card__actions`, always visible on touch) — edit (opens dialog), delete (confirm). Cards with only a title have no empty footer. Empty column → `.empty` placeholder, kept out of the sortable items so it never receives a drag target.

## 6. Item dialog (create/edit) — *Roadmaps feature dialog, Taskboards modal* · kit

`.overlay > .dialog` with `.field`s: text `.input`, `.textarea`, optional selectors. Level/priority pickers (Taskboards `modal__level-btn`) = `.seg` with `aria-pressed`. Toggles = `.switch`. Reuse labels = `.tag--btn` chips (`aria-pressed`). Enter saves in single-line fields, Esc cancels, invalid → `aria-invalid="true"` + `.field__hint`. Destructive action sits left in the footer; Cancel + primary right.

## 7. Colour-coded tabs — *Roadmaps `.rtab`* · in kit (`.rtabs`)

Pill tabs, one colour per tab (`--tab-color`, automatic or picked), selected = tinted fill + coloured border. Reorderable (`data-sortable-axis="x"`, `nimble:sort`), `+` dashed tab to add, right-click (long-press on touch) opens a small colour popover (6×N swatches + custom input; `aria-pressed` on the active one). ≤ 700px: only the open tab shows between ‹ › buttons. For plain section switching use `.seg` or `.tabs__list`; this pattern is for *user-owned, orderable, colourable* items.

## 8. Collapsible shelves and drop targets — *Taskboards archive/done* · in kit (`.shelf`)

A 48px header strip (label, count, chevron, action) that expands to ~300px, holding compact rows. While a card is dragged, shelves show a `.drop-overlay` ("ARCHIVE", "MARK DONE") and the dashed `over` outline; dropping emits `nimble:sort`. Collapse state is the app's to remember. `<details class="shelf shelf--ok"><summary class="shelf__head" data-sortable-drop="#list">…label, count, chevron…</summary><div class="shelf__body">…</div></details>`: no script to open/close; the tone modifier (`--ok/--info/--warn`) sets its colour.

## 9. Matrix (2×2) — *Taskboards quick-wins* · in kit (`.matrix`)

Four `.col`-style quadrants (impact × effort: quick wins, big bets, fill-ins, time sinks) each with title, count and a sortable list; axis labels outside; an "unrated" tray below. Dropping into a quadrant sets two attributes of the card — handle in the `nimble:sort` listener by reading the target container's `data-*`. `.matrix` with `.matrix__axis` labels and four `.matrix__quad` (`--hl` highlights the quick wins); one column on phones.

## 10. Filter chips — *Taskboards owner filter* · kit

Row of `.chip--btn` / `.tag--btn` with `aria-pressed`; "All" resets. Filtering hides items with `hidden`; counts reflect the filter; drag is disabled while filtered (or shows a notice).

## 11. Drawer / document list — *Diagramico* · in kit (`.drawer`, `.doclist`)

Left drawer (`min(340px,100vw)`, `--sh-lg`, scrim behind, Esc/backdrop close; reuse dialog focus handling) with header (title + close), search/new, and a list of `.listrow`s: name, mono meta line, row actions revealed on hover/focus (always on touch), current item tinted `--primary-soft`. Same rows serve a full-page directory (Roadmaps `.dcard` grid is the card variant of this).

## 12. Contextual toolbar and tooltips — *Diagramico ctxbar/rail* · in kit (`.ctxbar`, `data-tip`)

Small `.panel` of `btn--icon btn--sm` + selects + swatch rows, positioned next to the selection, `max-width: 100vw − 20px` with horizontal scroll hidden. Every icon-only button has `aria-label` and `data-tip`; shortcuts shown in the tip. Keep it keyboard reachable (toolbar order = visual order).

## 13. Share and embed — *Roadmaps share dialog* · kit

`.dialog--wide`: visibility `.switch` ("Public link"), then **copy rows** (`.input` read-only + `btn--outline` "Copy"; success → `NimbleUI.toast`) for the link and a `.snippet`/`.textarea.code` for the embed code. Errors `--danger`, caveats `--warn` as text under the field. Turning sharing off revokes immediately and says so. Public page = read-only board (same `.cols`, no actions), a `.shippedbox` list of shipped items, and a footer line attributing the product.

## 14. Sync status and conflicts — *Roadmaps `sync.js`* · kit

Always-visible `.sync` chip: `saved` · `saving` · `offline` · `error` (also a dot on the ☰ button on phones). Rules the UI must express: never save after a failed/ambiguous load; **ask before overwriting** a newer remote copy (`NimbleUI.confirm`, danger = false, both choices explicit); offline edits are flagged and reconciled later; a different account must not inherit local data (explain, then clear). Failures are a toast + the chip, not a modal, unless data could be lost.

## 15. Destructive actions — all apps · kit

One path: `NimbleUI.confirm({ title, message, confirmLabel, danger: true })` naming what is deleted and what else it affects (e.g. the public copy). Focus starts on Cancel. After deleting something cheap to restore, prefer **toast with Undo** over a confirm. Never a native `confirm()`.

## 16. Import / export and file drop — *Roadmaps backup, Taskboards, Diagramico imports* · in kit (`.dropzone`, `data-filedrop`)

Export/Import live in the account menu. Import: hidden `<input type=file>`, then a dialog stating **merge vs replace** (replace on a shared item warns about revoking its public copy). Dropping a file over the page shows a full-window `.drop-overlay` ("Drop to import"). Always validate/clean on import (rebuild field by field; text stays text). `.dropzone` with `data-filedrop`, `data-filedrop-input="#file"`, `data-filedrop-accept=".json"`; event `nimble:filedrop {files}`.

## 17. Help, shortcuts and tours — *Diagramico, Taskboards help modal* · kit

Help = a `.dialog--wide` with sections (`.eyebrow` titles) and rows of `kbd` + description. A guided tour = a sequence of anchored `.menu`-style popovers with Next/Back/Skip and `aria-live` step text; offered once, restartable from help. Shortcut list must match the real handlers.

## 18. Changelog / "Shipped" — *Roadmaps* · kit

`.ships` list of `.ship` rows (title, one-line description, date); older entries behind a "previous" link. Public pages show the same list, read-only.

---

## Migration map (legacy → nimbleUI)

| Legacy | nimbleUI |
|---|---|
| Roadmaps `.user__menu/.user__item/.user__sep` | `.menu/.menu__item/.menu__sep` (+ `.menu--end`) |
| Roadmaps `.rtab-ghost`, `.rtab-marker`, `body.tab-dragging` | `.drag-ghost`, `.drop-slot--x`, `html.is-sorting` (native drag removed) |
| Roadmaps `.card.dragging`, `.col.over`, `.drop-slot` | `.is-dragging`, `.over` on the zone, `.drop-slot` |
| Roadmaps `[data-theme="dark"] .x { color }` rules | `var(--primary-fg)` |
| Roadmaps `#sync` `.chip--muted` | `.sync[data-state]` |
| Taskboards `modal-overlay.hidden`, `.modal__*` | `.overlay[hidden]`, `.dialog__*` |
| Taskboards `--f-*` tokens, Figtree, radii 2/4/6/8 | `--surface/--border/--text…`, Inter, radii 6/8/12/16 |
| Taskboards `.topbar__btn`, `.user-pill` | `.btn`, pattern 3 |
| Taskboards `dropIndicator` (inline cssText) | `.drop-slot` |
| Taskboards `modal__level-btn`, `modal__toggle` | `.seg__btn`, `.switch` |
| Diagramico `.btn.primary`, `.ibtn`, `.ibtn.on` | `.btn--primary`, `.btn--icon`, `aria-pressed="true"` |
| Diagramico `--panel/--panel-2/--line/--ink/--muted/--accent` | `--surface/--surface-2/--border/--text/--muted/--primary` |
| Diagramico `.tip`, `.modal`, `.scrim`, `.drawer` | `[data-tip]`, `.overlay/.dialog`, `.overlay` (drawer variant, pattern 11) |
| Diagramico IBM Plex 13px | Inter + `data-density="compact"` |
| Diagramico shadow `0 8px 24px` (dark) vs `0 6px 20px` | single `--sh-*` geometry |
