---
name: nimbleui-design-system
description: Apply the nimbleUI design system — the calm zinc-neutral look of Roadmaps, Taskboards and Diagramico (Inter + JetBrains Mono, 36px controls, radii 6/8/12/16, sticky blurred top bar, .btn/.seg/.chip/.tag/.card/.col/.dialog/.toast/.fcard components, landing blocks) with one accent per product (emerald default, rose = Taskboards, indigo = Diagramico) via data-accent, and dark/light themes where ONLY colours change. Use when the user asks for "o design system nimbleUI", "o estilo do Roadmaps / Taskboards / Diagramico", wants a new app, product page or landing to look like those products, or a reskin with another accent. Trigger even without the words "design system", e.g. "faz isto parecer o Roadmaps".
---

# nimbleUI design system

Kit sem dependências extraído de Roadmaps, Taskboards e Diagramico. Repo: https://github.com/dferreiramarques/nimbleui-design-system
(local: `D:\Documents\GitHub\nimbleui-design-system\` — `src/tokens.css`, `src/components.css`, `src/theme.js`, galeria `index.html`, racional em `docs/DESIGN-SYSTEM.md`). Cópias dos ficheiros em `assets/` desta skill.

## Passo 1 — instalar
Copia `tokens.css`, `components.css`, `theme.js` (de `assets/` ou do repo) para o projeto, ex. `design-system/`.

```html
<html lang="en" data-theme="light">   <!-- data-accent="rose" | "indigo"; omitir = emerald -->
<link rel="stylesheet" href="design-system/tokens.css">
<link rel="stylesheet" href="design-system/components.css">
<script src="design-system/theme.js"></script>   <!-- externo (CSP-safe); botões com data-theme-toggle -->
```
Fontes (opcional): Google Fonts Inter 400–700 + JetBrains Mono 400/500.

## Passo 2 — usar componentes e tokens, não CSS novo
- Barra: `.topbar > .wrap.topbar__in` com `.brand`, `.nav`, `.grow`, `.actions`. Botões: `.btn` + `--primary|--outline|--text|--danger|--icon|--sm|--lg` (uma `--primary` por zona).
- Segmentado: `.seg > .seg__btn[aria-pressed]`. Estado: `.chip(--ok|--info|--danger|--muted)`, `.tag[data-tone=success|info|warn|danger|secondary|contrast]`, `.eyebrow`.
- Quadro: `.cols > .col[data-col=now|next|later] > .col__head + .col__list > .card`; `.empty`; `.drop-slot`.
- Formulário: `.field > label + .input|.textarea|.select` (`aria-invalid="true"` = erro). Diálogo: `.overlay > .dialog` (`__head/__body/__foot`). `.toast`.
- Landing: `.lp-hero` (h1 com `<em>` = acento), `.lp-sec/.lp-head`, `.grid2/.grid3`, `.fcard`, `.steps/.step`, `.snippet`, `.lp-foot`; páginas legais `.doc`.
- Tokens: superfícies `--bg --surface --surface-2 --surface-3 --border --border-strong`; texto `--text --muted --subtle`; acento `--primary --primary-h --primary-fg --primary-ink --primary-soft --glow`; semântica `--success --info --warn --danger`; estado `--now --next --later`; geometria `--r-sm|md|lg|xl --ring --fast --norm --sh-sm|md|lg`.

## Regras
1. **Dark/light só mudam cores.** Cores em tokens por tema; tamanhos, tipografia, espaçamento, raios, geometria de sombras, layout, animações ficam em `:root`/componentes uma só vez. Nunca regras não-cor dentro de `[data-theme]`. Ao verificar UI, comparar estilos calculados nos dois temas — a lista de diferenças não-cor tem de ficar vazia.
2. **Um acento por produto** (5 tokens + `--glow`). Texto de acento sobre superfícies = `--primary-fg`; texto sobre fundo de acento = `--primary-ink`. Novo acento = dois blocos só de cor (`[data-theme=light][data-accent=x]`, `[data-theme=dark][data-accent=x]`), contraste ≥ 4.5:1.
3. Superfícies neutras zinc dão a estrutura; acento só para ação principal, foco, seleção, alvos de drop.
4. Sem `<script>`/`style=""` inline (CSP); estado por atributos (`aria-pressed`, `hidden`, `data-*`).
5. Mobile: o layout colapsa a ≤ 900px (`.cols`), ≤ 860px (`.grid2/3`); `.nav` esconde-se a ≤ 820px — controlos extra vão para um menu.
6. Respeitar `prefers-reduced-motion` (o kit já trata).
