import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync } from 'node:fs';
for (const project of ['tsconfig.json', 'tsconfig.renderer.json']) {
  const result = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', project], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
mkdirSync('dist/renderer', { recursive: true });
for (const file of ['index.html', 'styles.css']) cpSync(`src/renderer/${file}`, `dist/renderer/${file}`);
