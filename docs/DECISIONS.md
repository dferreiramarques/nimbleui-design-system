# nimbleUI — decisions log

## Settled
1. **Name/home:** nimbleUI, repo `dferreiramarques/nimbleui-design-system` (public, MIT), also installed as the Claude skill `nimbleui-design-system`.
2. **Base:** the Roadmaps system (landing section of `app.css` / `product-page.css`), which Taskboards and Diagramico product pages already share.
3. **Dark/light change only colours** (David's global rule). Verified: 0 non-colour diffs in the gallery for all accents.
4. **One accent per product** via `data-accent`: emerald (Roadmaps), rose (Taskboards), indigo (Diagramico). Accent = 6 tokens.
5. **No inline script / `style=""`** (CSP). State via attributes (`aria-pressed`, `hidden`, `data-*`).
6. **Product page template** with fixed section order; template + recipe in the repo and the skill.
7. **Done:** `behaviors.js` (sort, edit, dialog, confirm, menu, tabs, toast), switch/check/radio, spinner, skeleton, sync chip, list rows, tooltip, auto theme, compact density. Verified in the gallery: 0 non-colour diffs across 3 accents × 2 densities.

## Decided (2026-11-15, after the audit)
- **A. Scope: unify all apps.** nimbleUI becomes the base of the Roadmaps, Taskboards and Diagramico apps. One font stack (Inter + JetBrains Mono); Figtree and IBM Plex are retired. Diagramico's 13px/dense editor UI becomes an opt-in `data-density="compact"` (size change, never tied to theme). Migration of the Taskboards and Diagramico apps is a separate, per-repo task (visual regression risk).
- **C. Drag: pointer events** (touch, autoscroll, Esc cancels, keyboard reorder). Indicator is the `.drop-slot` class, never inline `style`. Roadmaps migrates off native HTML5 drag.
- **D. Theme: auto by default** (`prefers-color-scheme` when nothing is stored; choice auto/light/dark). One shadow geometry for both themes; Diagramico's dark `0 8px 24px` becomes the light `0 6px 20px` value (or the reverse) — a single value in `:root`.
- **G. Source of truth: this repo.** Roadmaps/Taskboards/Diagramico copy `tokens.css` + `components.css` from here; `product-page.css` is no longer generated from `app.css`, and the drift test compares against this repo.
- **Defaults taken without asking:** E (CSP) → strict, no `unsafe-inline`; Diagramico must move its inline script/style to files when it migrates. F (naming) → BEM modifiers (`.btn--primary`), so `.btn.primary` and `.ibtn.on` are renamed on migration. H → follows D (auto), legal pages included.

## Found while auditing the three products — open (see questions)
| # | Topic | Roadmaps / nimbleUI | Taskboards | Diagramico |
|---|---|---|---|---|
| A | Scope of the system | Product page **and** app share it | Product page shares it; **app has its own** Fluent-style tokens (`--f-*`, 2/4/6/8 radii) | Product page shares it; **app has its own** tokens (`--panel/--ink/--line`, 10px panels) |
| B | Fonts | Inter + JetBrains Mono, 15px base | Figtree / Segoe UI Variable | IBM Plex Sans/Mono, 13px base |
| C | Drag & drop | Native HTML5 `draggable` + `.drop-slot` class (no touch, no autoscroll) | Pointer events, touch, autoscroll, cancel; indicator styled with **inline `cssText`** (breaks rule 5) | n/a (canvas) |
| D | Theme switching | Explicit `data-theme` + localStorage | `[data-theme]` blocks | `auto` via `prefers-color-scheme` + host theme; **dark shadow geometry differs** (`0 8px 24px` vs `0 6px 20px`) → breaks rule 3 |
| E | CSP | strict | — | `'unsafe-inline'` for scripts and styles |
| F | Class naming | `.btn--primary` (BEM modifiers) | BEM (`.card__edit-btn`) | `.btn.primary`, `.ibtn.on` |
| G | Source of truth | `app.css` landing → generated `product-page.css` (a test fails on drift) | copy | copy |
| H | Default theme | legal pages default dark | — | — |

Item G is new: nimbleUI added `--primary-fg` and removed the per-element `[data-theme="dark"] …{color}` rules, so `tokens.css/components.css` already differ from `product-page.css`. One of them has to become the reference.
