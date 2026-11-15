// Usage: node tools/check-theme.mjs [path/to/tokens.css] [path/to/app.css ...]
// Fails if a [data-theme…] block declares anything but custom properties and color-scheme (tokens file),
// or anything but colour-ish properties (other CSS files). Rule: dark/light only change colours.
import { readFileSync } from 'node:fs';

const [tokensPath = 'src/tokens.css', ...others] = process.argv.slice(2);
const strip = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = css => [...strip(css).matchAll(/([^{}]*\[data-theme[^{]*)\{([^}]*)\}/g)].map(m => ({ sel: m[1].trim(), body: m[2] }));
const decls = body => body.split(';').map(x => x.trim()).filter(Boolean);
let bad = 0;

for (const { sel, body } of blocks(readFileSync(tokensPath, 'utf8'))) {
  for (const d of decls(body)) if (!/^(--[a-z0-9-]+|color-scheme)\s*:/.test(d)) { console.error(`${tokensPath}: non-colour in "${sel}": ${d}`); bad++; }
}
const COLOURISH = /^(color|background(-color|-image)?|border(-[a-z]+)?-color|border-color|fill|stroke|box-shadow|outline-color|caret-color|--[a-z0-9-]+)\s*:/;
for (const f of others) {
  for (const { sel, body } of blocks(readFileSync(f, 'utf8'))) {
    for (const d of decls(body)) if (!COLOURISH.test(d)) { console.error(`${f}: non-colour in "${sel}": ${d}`); bad++; }
  }
}
console.log(bad ? `${bad} problem(s)` : 'themes are colour-only');
process.exit(bad ? 1 : 0);
