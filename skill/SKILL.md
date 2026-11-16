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

## Comportamentos (`behaviors.js`, no fim do `<body>`; `theme.js` no `<head>`)
Por atributos, sem dependências, resultados em `CustomEvent` (a app persiste; o kit nunca guarda nada):
- **Drag/ordenar:** contentor `[data-sortable][data-sortable-group="g"]` (`data-sortable-axis="x"`, `data-sortable-handle`), itens filhos diretos `[data-sortable-item]` (`[data-no-drag]` exclui). Pointer events (rato 5px, toque long-press 250ms, autoscroll, Esc cancela); teclado: Espaço agarra, setas movem (←/→ entre listas), Espaço larga. Evento `nimble:sort {item,from,to,oldIndex,newIndex}`. Indicador = `.drop-slot`, nunca `style` inline.
- **Editar inline:** `[data-editable]` (`="multiline"`, `data-maxlength`, `data-allow-empty`); duplo clique/Enter/F2, Enter grava, Esc cancela; `nimble:edit {value,oldValue}` (cancelável).
- **Diálogo:** `.overlay[hidden] > .dialog` + `[data-dialog-open="#id"]` / `[data-dialog-close][data-dialog-result]`; foco preso e devolvido; `nimble:dialogclose {result}`. `NimbleUI.confirm({title,message,confirmLabel,danger})` → Promise<boolean>. `NimbleUI.toast(texto,{tone:'warn'})`.
- **App com CSS próprio:** carregar `components.layered.css` (kit na layer `nimble`; o CSS da app ganha); modais da app: `data-dialog-overlay` + `data-dialog-panel` + `data-dialog-close`. Toast: `NimbleUI.toast(texto,{tone:'success|info|warn|error|loading',duration})`, repetidos viram (×n).
- **Menu:** `.menu-wrap > [data-menu-toggle="#id"] + .menu[hidden] > .menu__item[role=menuitem][data-value]` → `nimble:menuselect`. **Tabs:** `[data-tabs] > .tabs__list[role=tablist] > .tab[role=tab][aria-controls]` + `[role=tabpanel]`.
- **Só CSS:** `.switch/.check/.radio` (+`.opt`), `.spinner`, `.skeleton`, `.sync[data-state=saved|saving|offline|error]`, `.list/.listrow`, `[data-tip]`, `.sr-only`.
- **Tema:** `theme.js` → `auto|light|dark` (por defeito **auto**); `[data-theme-toggle]`, `[data-theme-set="auto|light|dark"]`. **Densidade:** `data-density="compact"` (só tamanhos). Decisões e histórico em `docs/DECISIONS.md` do repo.

## Padrões (`docs/PATTERNS.md`, cópia em `assets/PATTERNS.md`)
Composições complexas das apps, com origem, markup e estado (kit / css-todo): shell de app e fluxo mobile (≤700px: só item aberto + ‹ › + ☰), shell de editor com painéis flutuantes, menu de conta, gate de login e estado vazio, board (colunas+cartões+drag+edição), diálogo de item, tabs coloridas ordenáveis, shelves/alvos de drop, matriz 2×2, chips de filtro, drawer/lista de documentos, barra contextual, partilha/embed, estado de sync e conflitos, ações destrutivas (confirm/undo), import/export e drop de ficheiros, ajuda/tour, changelog. Termina com o **mapa de migração** (classes/tokens legados → nimbleUI). Consultar antes de migrar uma app ou criar um ecrã complexo.

## Migrar uma app (`docs/MIGRATING.md`, cópia em `assets/MIGRATING.md`)
Checklist (copiar o kit para `public/nimble/`, `<meta name="nimble-theme-key">`, reduzir o CSS da app, mapear classes, trocar comportamentos, testes, verificar em browser, branch) + learnings (apps que re-renderizam tudo, item que é botão, toque: segurar e mover, teclas já tratadas pela app, foco menu→diálogo, ordem de regras responsivas, colisões de @keyframes, CSP e `style.setProperty`) + receitas de teste. `tools/check-theme.mjs` valida que os temas só mudam cores.

## Página de produto
Template pronto: `templates/product-page/` do repo (cópia em `assets/product-page/` desta skill): `index.html`, `privacy.html`, `terms.html`. Copiar, substituir todos os `{{PLACEHOLDER}}`, definir `data-accent`, ajustar os 3 caminhos `../../src/`.
Ordem fixa: barra → hero (eyebrow com 3 factos, h1 com `<em>` no resultado, 1 parágrafo ≤ 40 palavras, CTA primário + outline, linha de confiança) → demo estática real → 3 `fcard` → `steps` (+ `snippet`) → 2 `fcard` de confiança → CTA final → rodapé com Privacy/Terms. Retirar secções, não reordenar. Mesmo texto de CTA em cima, no hero e no fim; benefícios, não mecanismos. Detalhe em `docs/DESIGN-SYSTEM.md`.

## Regras
1. **Dark/light só mudam cores.** Cores em tokens por tema; tamanhos, tipografia, espaçamento, raios, geometria de sombras, layout, animações ficam em `:root`/componentes uma só vez. Nunca regras não-cor dentro de `[data-theme]`. Ao verificar UI, comparar estilos calculados nos dois temas — a lista de diferenças não-cor tem de ficar vazia.
2. **Um acento por produto** (5 tokens + `--glow`). Texto de acento sobre superfícies = `--primary-fg`; texto sobre fundo de acento = `--primary-ink`. Novo acento = dois blocos só de cor (`[data-theme=light][data-accent=x]`, `[data-theme=dark][data-accent=x]`), contraste ≥ 4.5:1.
3. Superfícies neutras zinc dão a estrutura; acento só para ação principal, foco, seleção, alvos de drop.
4. Sem `<script>`/`style=""` inline (CSP); estado por atributos (`aria-pressed`, `hidden`, `data-*`).
5. Mobile: o layout colapsa a ≤ 900px (`.cols`), ≤ 860px (`.grid2/3`); `.nav` esconde-se a ≤ 820px — controlos extra vão para um menu.
6. Respeitar `prefers-reduced-motion` (o kit já trata).
