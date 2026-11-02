import { promises as fs } from 'node:fs';
import { atomicWrite } from './storage.js';
export interface CryptoProvider {
    available(): Promise<boolean>;
    encrypt(value: string): Promise<Uint8Array>;
    decrypt(value: Uint8Array): Promise<string>;
}
export class Vault {
    private values: Record<string, string> = {};
    private queue: Promise<unknown> = Promise.resolve();
    constructor(private filename: string, private crypto: CryptoProvider) { }
    async open() { try {
        this.values = JSON.parse(await fs.readFile(this.filename, 'utf8'));
    }
    catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT')
            throw new Error('凭据存储读取失败');
    } }
    private change(fn: (draft: Record<string, string>) => void | Promise<void>) { const op = this.queue.then(async () => { const draft = { ...this.values }; await fn(draft); await atomicWrite(this.filename, JSON.stringify(draft)); this.values = draft; }); this.queue = op.catch(() => { }); return op; }
    async set(id: string, key: string) { await this.change(async (draft) => { if (!await this.crypto.available())
        throw new Error('系统安全存储不可用，未保存密钥。请先配置系统钥匙串。'); draft[id] = Buffer.from(await this.crypto.encrypt(key)).toString('base64'); }); }
    async get(id: string) { if (!this.values[id])
        return ''; if (!await this.crypto.available())
        throw new Error('系统凭据存储暂时不可用'); return this.crypto.decrypt(Buffer.from(this.values[id], 'base64')); }
    has(id: string) { return Boolean(this.values[id]); }
    async remove(id: string) { await this.change(draft => { delete draft[id]; }); }
}
