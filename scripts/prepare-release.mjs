import {createReadStream} from 'node:fs';
import {mkdir, readdir, copyFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const [input, output, version, repository, runId, commit] = process.argv.slice(2);
if (!input || !output || !/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(version || '') || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository || '') || !/^\d+$/.test(runId || '') || !/^[a-f0-9]{40}$/.test(commit || '')) {
    throw new Error('Usage: prepare-release artifacts output version owner/repo run-id commit-sha');
}
const specifications = [
    ['macos-arm64-unsigned', '.zip', `Forma-${version}-mac-arm64.zip`],
    ['macos-arm64-unsigned', '.dmg', `Forma-${version}-mac-arm64.dmg`],
    ['windows-x64-unsigned', '.exe', `Forma-${version}-win-x64.exe`]
];
await mkdir(output, {recursive:true});
const assets = [];
for (const [folder, extension, name] of specifications) {
    const dir = path.join(input, folder);
    const candidates = (await readdir(dir, {withFileTypes:true})).filter(e => e.isFile() && e.name.endsWith(extension));
    if (candidates.length !== 1) throw new Error(`Expected one ${extension} in ${folder}`);
    const source = path.join(dir, candidates[0].name);
    await copyFile(source, path.join(output, name));
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(source)) hash.update(chunk);
    assets.push({name, sha256:hash.digest('hex')});
}
const manifest = {version, repository, buildRun:`https://github.com/${repository}/actions/runs/${runId}`, commit, unsigned:true, assets};
await writeFile(path.join(output, 'BUILD_INFO.json'), JSON.stringify(manifest, null, 2) + '\n');
const manifestHash = createHash('sha256');
for await (const chunk of createReadStream(path.join(output, 'BUILD_INFO.json'))) manifestHash.update(chunk);
const sums = [...assets, {name:'BUILD_INFO.json', sha256:manifestHash.digest('hex')}];
await writeFile(path.join(output, 'SHA256SUMS.txt'), sums.map(a => `${a.sha256}  ${a.name}`).join('\n') + '\n');
console.log(`Prepared ${assets.length} unsigned installers, SHA256SUMS.txt and BUILD_INFO.json.`);
