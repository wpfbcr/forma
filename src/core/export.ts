import type { Task } from './types.js';
export function createZip(files: {
    name: string;
    content: string;
}[]) {
    const encoder = new TextEncoder(), parts: Uint8Array[] = [], central: Uint8Array[] = [];
    let offset = 0;
    const table = Array.from({ length: 256 }, (_, n) => { for (let i = 0; i < 8; i++)
        n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
    const crc32 = (bytes: Uint8Array) => { let c = 0xffffffff; for (const b of bytes)
        c = table[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
    const now = new Date(), dt = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate(), tm = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    for (const f of files) {
        const name = encoder.encode(f.name), data = encoder.encode(f.content), crc = crc32(data), head = new Uint8Array(30 + name.length), v = new DataView(head.buffer);
        v.setUint32(0, 0x04034b50, true);
        v.setUint16(4, 20, true);
        v.setUint16(6, 0x0800, true);
        v.setUint16(10, tm, true);
        v.setUint16(12, dt, true);
        v.setUint32(14, crc, true);
        v.setUint32(18, data.length, true);
        v.setUint32(22, data.length, true);
        v.setUint16(26, name.length, true);
        head.set(name, 30);
        parts.push(head, data);
        const c = new Uint8Array(46 + name.length), w = new DataView(c.buffer);
        w.setUint32(0, 0x02014b50, true);
        w.setUint16(4, 20, true);
        w.setUint16(6, 20, true);
        w.setUint16(8, 0x0800, true);
        w.setUint16(12, tm, true);
        w.setUint16(14, dt, true);
        w.setUint32(16, crc, true);
        w.setUint32(20, data.length, true);
        w.setUint32(24, data.length, true);
        w.setUint16(28, name.length, true);
        w.setUint32(42, offset, true);
        c.set(name, 46);
        central.push(c);
        offset += head.length + data.length;
    }
    const centralSize = central.reduce((s, b) => s + b.length, 0), end = new Uint8Array(22), view = new DataView(end.buffer);
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(8, files.length, true);
    view.setUint16(10, files.length, true);
    view.setUint32(12, centralSize, true);
    view.setUint32(16, offset, true);
    const all = [...parts, ...central, end], result = new Uint8Array(offset + centralSize + 22);
    let cursor = 0;
    for (const b of all) {
        result.set(b, cursor);
        cursor += b.length;
    }
    return result;
}
export function zipWorkspace(t: Task) { const files = t.workspace.files.map(f => ({ name: f.path, content: f.versions.at(-1)!.content })); for (const f of t.workspace.files)
    if (f.kind === 'output')
        for (const v of f.versions)
            files.push({ name: `历史版本/v${v.number}/${f.path}`, content: v.content }); files.push({ name: 'workspace.json', content: JSON.stringify({ title: t.title, team: t.teamName, chat: t.chat, rounds: t.rounds, events: t.events }, null, 2) }); return createZip(files); }
