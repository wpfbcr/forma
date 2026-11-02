import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { atomicWrite } from './storage.js';
import type { Task, WorkspaceFile } from './types.js';
export async function safePath(root: string, relative: string, createParents = false) {
    if (!relative || path.isAbsolute(relative) || /^[a-zA-Z]:/.test(relative) || relative.includes('\\') || relative.split('/').some(p => p === '..' || p === '' || p === '.') || relative.includes('\0'))
        throw new Error('文件路径必须是工作空间内的相对路径');
    if (/[<>:"|?*\u0000-\u001f]/.test(relative) || relative.split('/').some(p => /[. ]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)))
        throw new Error('文件名包含 Windows 不支持或可能重定向的字符');
    const base = await fs.realpath(root);
    let current = base;
    const parts = relative.split('/');
    for (let i = 0; i < parts.length; i++) {
        current = path.join(current, parts[i]);
        try {
            const stat = await fs.lstat(current);
            if (stat.isSymbolicLink())
                throw new Error('不允许通过符号链接访问工作空间外的文件');
            if (i < parts.length - 1 && !stat.isDirectory())
                throw new Error('父路径不是目录');
        }
        catch (e) {
            if ((e as NodeJS.ErrnoException).code !== 'ENOENT')
                throw e;
            if (createParents && i < parts.length - 1)
                await fs.mkdir(current);
        }
    }
    if (!current.startsWith(base + path.sep))
        throw new Error('路径超出工作空间');
    return current;
}
export class Workspaces {
    async create(root: string, id: string) { if (!/^[a-zA-Z0-9_-]+$/.test(id))
        throw new Error('无效任务标识'); await fs.mkdir(root, { recursive: true }); const real = await fs.realpath(root); const dir = path.join(real, id); await fs.mkdir(dir, { recursive: false }); return dir; }
    async put(task: Task, relative: string, content: string, kind: WorkspaceFile['kind'], round = task.rounds.length) {
        if (Buffer.byteLength(content) > 2 * 1024 * 1024)
            throw new Error('单文件超过 2 MB 上限');
        const dest = await safePath(task.workspace.path, relative, true);
        let file = task.workspace.files.find(f => f.path === relative);
        if (!file) {
            file = { id: randomUUID(), path: relative, kind, versions: [] };
            task.workspace.files.push(file);
        }
        if (file.versions.at(-1)?.content !== content) {
            const version = { number: file.versions.length + 1, round, time: new Date().toISOString(), content };
            const history = await safePath(task.workspace.path, `.forma/versions/${file.id}/${version.number}.txt`, true);
            await atomicWrite(history, content);
            await atomicWrite(dest, content);
            file.versions.push(version);
        }
        return file;
    }
    async sync(task: Task) {
        await this.put(task, '会话/完整对话.md', task.chat.map(m => `## ${m.role === 'user' ? '用户' : 'Team Leader'} · 第 ${m.round} 轮\n\n${m.text}`).join('\n\n'), 'conversation');
        await this.put(task, '会话/执行记录.json', JSON.stringify(task.events, null, 2), 'conversation');
        await this.put(task, '上下文/摘要.md', task.summary || task.title, 'context');
    }
    async memberDirectory(task: Task, agentId: string) { if (!/^[a-zA-Z0-9_-]+$/.test(agentId))
        throw new Error('无效成员标识'); const marker = await safePath(task.workspace.path, `成员/${agentId}/.forma-member`, true); await atomicWrite(marker, 'Forma isolated member working directory'); return path.dirname(marker); }
    async read(root: string, relative: string) { if (relative.startsWith('.forma/'))
        throw new Error('内部记录不可通过成员工具读取'); const filename = await safePath(root, relative); const stat = await fs.stat(filename); if (!stat.isFile() || stat.size > 262144)
        throw new Error('只支持读取 256 KB 内的文本文件'); return fs.readFile(filename, 'utf8'); }
    async write(root: string, relative: string, content: string) { if (relative.startsWith('.forma/') || Buffer.byteLength(content) > 262144)
        throw new Error('文件写入超出限制'); await atomicWrite(await safePath(root, relative, true), content); return '已保存 ' + relative; }
    async list(root: string, relative = '') { const base = relative ? await safePath(root, relative) : root; const entries = await fs.readdir(base, { withFileTypes: true }); return entries.filter(e => !e.isSymbolicLink() && !e.name.startsWith('.')).slice(0, 200).map(e => ({ name: e.name, directory: e.isDirectory() })); }
    async collect(task: Task, agentId: string) { const root = await this.memberDirectory(task, agentId); let count = 0; const visit = async (dir: string, relative: string, depth: number): Promise<void> => { if (depth > 6 || count > 100)
        return; for (const e of await fs.readdir(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.') || ['node_modules', 'vendor'].includes(e.name) || e.isSymbolicLink())
            continue;
        const rel = relative ? relative + '/' + e.name : e.name;
        if (e.isDirectory()) {
            await visit(path.join(dir, e.name), rel, depth + 1);
        }
        else if (e.isFile() && count++ < 100) {
            const full = await safePath(root, rel);
            const stat = await fs.stat(full);
            if (stat.size > 262144)
                continue;
            const bytes = await fs.readFile(full);
            if (bytes.includes(0))
                continue;
            await this.put(task, `成员产物/${agentId}/${rel}`, bytes.toString('utf8'), 'work');
        }
    } }; await visit(root, '', 0); }
}
