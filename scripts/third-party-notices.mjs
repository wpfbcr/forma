import {readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const sections = ['Forma runtime dependency licenses', 'Generated from package-lock.json and installed package license files.', 'JSZip is used under its MIT option. Electron runtime notices are distributed separately with Electron.'];
let count = 0;
for (const [dir, meta] of Object.entries(lock.packages).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    if (!dir || meta.dev) continue;
    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    if (pkg.version !== meta.version) throw new Error(`Installed version differs from lockfile: ${dir}`);
    const names = (await readdir(dir)).filter(name => /^(?:licen[cs]e|copying|notice)(?:[._-].*)?$/i.test(name)).sort();
    const texts = [];
    for (const name of names) {
        try { texts.push(`${name}\n\n${await readFile(path.join(dir, name), 'utf8')}`); }
        catch (error) { if (error.code !== 'EISDIR') throw error; }
    }
    if (!texts.length) {
        for (const name of (await readdir(dir)).filter(name => /^readme(?:\.|$)/i.test(name)).sort()) {
            const readme = await readFile(path.join(dir, name), 'utf8');
            const section = readme.match(/^#{1,6}\s*licen[cs]e\s*\r?\n([\s\S]*?)(?=^#{1,6}\s|$(?![\s\S]))/im);
            if (section) texts.push(`${name} license declaration (as shipped upstream)\n\n${section[0]}`);
        }
    }
    if (!texts.length) throw new Error(`No license declaration found for ${pkg.name}; inspect package before distribution`);
    sections.push(`\n${'='.repeat(72)}\n${pkg.name} ${pkg.version}\nDeclared license: ${pkg.license || meta.license || 'see text'}\n${'='.repeat(72)}\n\n${texts.join('\n\n')}`);
    count++;
}
await writeFile('THIRD_PARTY_LICENSES.txt', sections.join('\n\n').replace(/[ \t]+$/gm, '').trimEnd() + '\n');
console.log(`Collected license files for ${count} runtime packages.`);
