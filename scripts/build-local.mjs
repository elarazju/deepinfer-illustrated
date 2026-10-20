import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
if (!existsSync('public/figures/manifest.json')) console.warn('Download figures are missing. Local build continues; run npm run build:full before publishing.');
const result = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js','build'], {stdio:'inherit'});
process.exit(result.status ?? 1);
