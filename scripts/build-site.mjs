import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

function run(args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: 'inherit', env: { ...process.env, ...env },
    });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`${args[0]} exited ${code}`)));
  });
}

// Build and exports use the same source tree. Never publish previously committed pictures.
const base = 'http://127.0.0.1:4178';
const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4178', '--strictPort',
], { stdio: 'inherit' });
let serverExited = false;
server.once('exit', () => { serverExited = true; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60 && !serverExited; attempt++) {
    try { ready = (await fetch(base)).ok; } catch {}
    if (ready) break;
    await setTimeout(500);
  }
  if (!ready || serverExited) throw new Error('Export server could not start on its reserved port.');
  await run(['--import', 'tsx', 'scripts/export-svg.ts'], { PREVIEW_URL: base });
  const filenames = (await readdir('public/figures')).filter(name => /\.(svg|png)$/.test(name)).sort();
  if (filenames.length !== 72) throw new Error(`Expected 72 figure files, found ${filenames.length}`);
  const files = Object.fromEntries(await Promise.all(filenames.map(async name => [
    name, createHash('sha256').update(await readFile(`public/figures/${name}`)).digest('hex'),
  ])));
  await writeFile('public/figures/manifest.json', JSON.stringify({
    commit: process.env.GITHUB_SHA ?? 'local', files,
  }, null, 2));
  await run(['node_modules/vite/bin/vite.js', 'build']);
} finally {
  server.kill();
}
