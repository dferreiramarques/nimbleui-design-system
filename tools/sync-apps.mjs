// Usage: node tools/sync-apps.mjs [--write] [--only <repo>]
// Compares the kit copies in the app checkouts (tools/apps.json) with src/ and reports drift.
// With --write it overwrites the drifted files (never adds files a destination does not already have).
// Exit code 1 when there is drift and --write was not given, so it can run as a check.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = {
  'tokens.css': 'src/tokens.css', 'components.css': 'src/components.css', 'components.layered.css': 'src/components.layered.css',
  'theme.js': 'src/theme.js', 'behaviors.js': 'src/behaviors.js', 'overlays.css': 'src/css/overlays.css',
  'base.css': 'src/css/base.css', 'controls.css': 'src/css/controls.css', 'board.css': 'src/css/board.css', 'page.css': 'src/css/page.css'
};
const norm = s => s.replace(/\r\n/g, '\n');
const write = process.argv.includes('--write');
const oi = process.argv.indexOf('--only');
const only = oi > 0 ? process.argv[oi + 1] : null;   // limit to one app repo (the first path segment in apps.json)
const { destinations } = JSON.parse(readFileSync(path.join(root, 'tools', 'apps.json'), 'utf8'));
let drift = 0;
for (const d of destinations) {
  if (only && d.split('/')[0] !== only) continue;
  const dir = path.resolve(root, '..', d);
  if (!existsSync(dir)) { console.log(`skip   ${d} (not checked out)`); continue; }
  for (const [name, rel] of Object.entries(SRC)) {
    const dst = path.join(dir, name);
    if (!existsSync(dst)) continue;
    const src = readFileSync(path.join(root, rel), 'utf8');
    if (norm(readFileSync(dst, 'utf8')) === norm(src)) continue;
    drift++;
    if (write) { writeFileSync(dst, src); console.log(`wrote  ${d}/${name}`); } else console.log(`drift  ${d}/${name}`);
  }
}
console.log(drift ? (write ? `${drift} file(s) updated` : `${drift} file(s) out of date: run with --write`) : 'all app copies match the kit');
process.exit(drift && !write ? 1 : 0);
