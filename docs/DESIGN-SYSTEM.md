# nimbleUI — design system rationale

Extracted from three products by the same author: **Roadmaps** (emerald), **Taskboards** (rose), **Diagramico** (indigo).
They already shared one system (`product-page.css`); nimbleUI makes it a standalone, dependency-free kit.

## Principles

1. **Dark/light only change colours.** Colours are tokens with per-theme values. Sizes, scale, type, spacing, radii, shadow *geometry*, layout and motion are defined once in `:root`. A `[data-theme]` block never contains a non-colour property. To verify, compare computed styles in both themes: the non-colour diff must be empty.
2. **Neutral zinc surfaces, one accent.** Structure comes from `--bg → --surface → --surface-2 → --surface-3` and 1px borders; the accent marks the primary action, focus, selection and drop targets.
3. **Accent is a 5-token swap:** `--primary`, `--primary-h` (hover), `--primary-fg` (accent used as text/icon on surfaces), `--primary-ink` (text on solid accent), `--primary-soft` (focus ring / tinted fills), `--glow` (page halo). Presets via `data-accent`: *emerald* (default), *rose*, *indigo*.
4. **Semantic hues are separate from the accent:** `--success --info --warn --danger --secondary --contrast`, and status hues `--now --next --later` for columns. Tags/chips tint with `color-mix(in srgb, var(--tone) 16%, transparent)`.
5. **Calm density:** controls 36px (30 small, 44 large), radii 6/8/12/16, 140–220ms eased transitions, focus ring = 2px outline + 3px soft halo. `prefers-reduced-motion` disables animation.
6. **No inline script/style needed** (CSP-friendly): theming via attributes, state via `aria-pressed`, `[hidden]`, `data-*`.

## Tokens

| Group | Tokens |
|---|---|
| Surfaces | `--bg --surface --surface-2 --surface-3 --border --border-strong` |
| Text | `--text --muted --subtle` |
| Accent | `--primary --primary-h --primary-fg --primary-ink --primary-soft --glow` |
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
