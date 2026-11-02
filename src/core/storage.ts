import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { AppState } from './types.js';
export async function atomicWrite(filename: string, content: string | Uint8Array) {
    await fs.mkdir(path.dirname(filename), { recursive: true });
    const temp = filename + '.' + randomUUID() + '.tmp';
    try {
        const handle = await fs.open(temp, 'wx', 0o600);
        try {
            await handle.writeFile(content);
            await handle.sync();
        }
        finally {
            await handle.close();
        }
        await fs.rename(temp, filename);
    }
    finally {
        await fs.rm(temp, { force: true });
    }
}
export function initialState(workspaceRoot: string): AppState { return { version: 1, theme: 'light', agents: [], teams: [], models: [], memories: [], tasks: [], settings: { workspaceRoot, concurrency: 2, maxToolCalls: 8, allowFileWrites: false } }; }
export class Store {
    private queue: Promise<unknown> = Promise.resolve();
    private value: AppState;
    onChange: (state: AppState) => void = () => { };
    constructor(readonly filename: string, initial: AppState) { this.value = initial; }
    async open() {
        try {
            const s = JSON.parse(await fs.readFile(this.filename, 'utf8'));
            if (s.version !== 1 || !Array.isArray(s.tasks) || !Array.isArray(s.agents) || !Array.isArray(s.models))
                throw new Error('不支持的数据文件格式');
            this.value = s;
        }
        catch (e) {
            if ((e as NodeJS.ErrnoException).code !== 'ENOENT')
                throw e;
        }
        for (const t of this.value.tasks) {
            if (['running', 'pausing'].includes(t.status)) {
                t.status = 'paused';
                t.interrupted = true;
                t.events.push({ time: new Date().toISOString(), actor: '系统', text: '应用关闭时执行被中断。请检查已有产物后再继续。' });
                for (const a of t.rounds.at(-1)?.assignments || [])
                    if (a.status === 'running')
                        a.status = 'pending';
            }
        }
        await atomicWrite(this.filename, JSON.stringify(this.value, null, 2));
        return this.snapshot();
    }
    snapshot() { return structuredClone(this.value); }
    async change<T>(fn: (state: AppState) => T | Promise<T>): Promise<T> {
        const operation = this.queue.then(async () => { const draft = structuredClone(this.value); const result = await fn(draft); await atomicWrite(this.filename, JSON.stringify(draft, null, 2)); this.value = draft; this.onChange(this.snapshot()); return result; });
        this.queue = operation.catch(() => { });
        return operation;
    }
    async flush() { await this.queue; }
}
