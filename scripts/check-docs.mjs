import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const files = (await readdir(root)).filter(f => f.endsWith('.md'));
async function collect(dir) {
    for (const entry of await readdir(dir, {withFileTypes:true})) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) await collect(file);
        else if (file.endsWith('.md')) files.push(file);
    }
}
await collect('docs');
await collect('.github');
const failures = [];
let checked = 0;
for (const file of files) {
    const source = await readFile(file, 'utf8');
    const targets = [...source.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)].map(m => m[1]);
    targets.push(...[...source.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]));
    for (const target of targets) {
        if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) continue;
        const clean = decodeURIComponent(target.split(/[?#]/)[0]);
        if (!clean) continue;
        const absolute = path.resolve(path.dirname(file), clean);
        if (!absolute.startsWith(root + path.sep)) {
            failures.push(`${file}: local link leaves the repository`);
            continue;
        }
        try { await stat(absolute); checked++; }
        catch { failures.push(`${file}: missing local target ${clean}`); }
    }
}
const version = JSON.parse(await readFile('package.json', 'utf8')).version;
for (const file of ['README.md', 'README_EN.md']) {
    if (!(await readFile(file, 'utf8')).includes(version)) failures.push(`${file}: package version ${version} is missing`);
}
if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exitCode = 1;
} else console.log(`Documentation OK: ${files.length} Markdown files, ${checked} local targets, version ${version}.`);
