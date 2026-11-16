# Breakpoints and mobile

How the kit responds to screen width, what each product adds on top, what was tested, and a worked example. The overflow rules (`minmax(0, 1fr)`, `min-width: 0`, `overflow-wrap`) are in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md#mobile-and-overflow-rules); this page is about the breakpoints themselves.

## The kit's breakpoints

All are `max-width` queries (desktop first). Colours never change at a breakpoint, only layout.

| Width | What changes | Where |
|---|---|---|
| ≤ 960px | `.steps` goes from 4 to 2 columns | `page.css` |
| ≤ 900px | `.cols` (the board) stacks to one column | `board.css` |
| ≤ 860px | `.grid3` and `.grid2` go to one column | `page.css` |
| ≤ 820px | `.nav` (top-bar section links) is hidden | `page.css` |
| ≤ 560px | `.steps` goes to one column | `page.css` |
| ≤ 520px | `.row2` (two-field row) goes to one column; the destructive button in a dialog footer takes its own row | `controls.css`, `overlays.css` |
| ≤ 480px | tighter top bar (`gap: 8px`, smaller primary button padding) | `page.css` |
| `(hover: none)` | card actions are always visible (there is no hover on touch) | `board.css` |
| `(prefers-reduced-motion: reduce)` | animations and transitions are removed | `base.css` |

Two groups: **page** blocks (landing: nav, grids, steps) and **app** blocks (board, forms, dialogs). They are independent on purpose, so a landing page and an app can change layout at different widths.

## What the products add

The kit only handles what is generic. The app's own chrome (top bar, menus) switches to its phone mode at the product's own breakpoint:

| Product | Phone breakpoint | What it does |
|---|---|---|
| Roadmaps | 700px | top bar keeps the open roadmap with ‹ › and a ☰ menu; everything else moves into the menu |
| Taskboards | 700px (and 480px) | same idea: the top bar collapses and its controls move into the menu |
| Diagramico | 700px | the editor's own layout adapts to a narrow canvas |
| Veredicto | 600px | one-column forms, icon-only "New" button |
| Kanbi Cards | 600px | sync chip hidden, compact header |

## Recommended scale for new work

Use these when you write your own rules so products stay predictable:

- **480px**: small phones (tighten spacing)
- **700px**: **phone mode**: the top bar collapses to the essentials plus a menu
- **900px**: **tablet and below**: multi-column layouts stack (matches the kit's board)
- **1100px+**: nothing special; the layout is centred in `--wrap`

Known inconsistency: Veredicto and Kanbi Cards use 600px for their phone mode while the other products use 700px. Between 600 and 700px those two still show their desktop chrome; both were checked at 375px and below with no overflow. If you touch them, prefer 700px.

## Test results

Checked on the gallery, the product-page template and the example below at 25 widths from 320 to 1280px (320, 360, 375, 393, 412, 480, 481, 520, 521, 560, 561, 600, 700, 701, 768, 820, 821, 860, 861, 900, 901, 960, 961, 1024, 1280), including the width on each side of every breakpoint:

- **No horizontal overflow at any width.** `documentElement.scrollWidth` equals `clientWidth` everywhere, including with long unbroken titles.
- **Every breakpoint switches exactly where documented** (for example `.cols` is 1 column at 900px and 3 at 901px).
- **Top bar never overflows** (no wrap, no clipped controls) on the landing template.

Known gaps, none blocking:

- **Touch target size:** kit controls are 36px high (`--ctl-h`), below the usual 44px guideline for touch. `--ctl-h-lg` is 44px. The example below shows enlarging buttons on touch screens (`pointer: coarse`) without changing the kit.
- **Notches:** the top bar does not add `env(safe-area-inset-*)` padding (the drawer does). Add `viewport-fit=cover` and safe-area padding in your app if you target full-screen PWAs.
- **Landscape phones** (about 640 to 900px wide, short) use the tablet layout; nothing was tuned for short heights.

## Example

[`examples/responsive.html`](../examples/responsive.html) is a complete page: three board columns that stack at 900px, and a top bar that moves secondary actions into a menu at 700px. The app-specific part is only this:

```css
.phone-only { display: none; }
@media (max-width: 700px) {
  .desktop-only { display: none; }     /* secondary actions leave the top bar ... */
  .phone-only   { display: flex; }     /* ... and live in the menu instead */
  .topbar__in   { flex-wrap: nowrap; gap: 8px; }
}
@media (pointer: coarse) { .btn { min-height: 44px; } .btn--icon { min-width: 44px; } }   /* bigger touch targets */
```

```html
<button class="btn btn--text desktop-only">Export</button>
<span class="menu-wrap phone-only">
  <button class="btn btn--text btn--icon" data-menu-toggle="#m" aria-label="Menu">☰</button>
  <div class="menu menu--end" id="m" hidden>
    <button class="menu__item">Export</button>
  </div>
</span>
```

Rules that kept this safe: only layout properties inside the media queries (no colours: those stay in the tokens), the menu is the kit's own `.menu` + `data-menu-toggle`, and nothing uses a fixed width.

## How to test a layout at many widths

Open the page, then run this in the console. It loads the page in a hidden iframe at each width and reports overflow (0 is good):

```js
const out = [];
for (const w of [320, 375, 412, 600, 700, 701, 900, 901, 1280]) {
  const f = document.createElement('iframe');
  f.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:800px;border:0;visibility:hidden`;
  f.src = location.href; document.body.append(f);
  await new Promise(r => f.onload = r); await new Promise(r => setTimeout(r, 250));
  const e = f.contentDocument.documentElement;
  out.push(`${w}px overflow=${e.scrollWidth - e.clientWidth}`); f.remove();
}
out.join('\n')
```

Test one pixel on each side of every breakpoint you use, and test with real data (long names, many tags, empty states), not only the demo content.
