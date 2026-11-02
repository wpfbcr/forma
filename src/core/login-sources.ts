import {promises as fs} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {capture, findCommand, runExternal} from './external.js';
import type {ModelClient} from './models.js';
import type {Model, AgentCall} from './types.js';

export interface LoginSource {
    engine: 'codex' | 'claude' | 'magpie';
    installed: boolean;
    status: 'signed-in' | 'signed-out' | 'unknown';
    authMode: 'subscription' | 'api-key' | 'unknown';
    models: {id: string; name: string}[];
    catalog: 'cache' | 'aliases' | 'gateway';
    message: string;
}

// Return only flags. Account details and credentials must never enter renderer state.
export function loginSummary(engine: 'codex' | 'claude', raw: string): Pick<LoginSource, 'status' | 'authMode'> {
    if (engine === 'claude') {
        try {
            const j = JSON.parse(raw), logged = j.loggedIn ?? j.logged_in;
            const method = String(j.authMethod || j.auth_method || '');
            return {
                status: logged === true ? 'signed-in' : logged === false ? 'signed-out' : 'unknown',
                authMode: /oauth|claude\.ai|subscription/i.test(method) ? 'subscription' : /api.key/i.test(method) ? 'api-key' : 'unknown'
            };
        } catch { return {status:'unknown', authMode:'unknown'}; }
    }
    return {
        status: /not logged|logged out|not authenticated|未登录/i.test(raw) ? 'signed-out' : /logged in|authenticated|已登录/i.test(raw) ? 'signed-in' : 'unknown',
        authMode: /api.key/i.test(raw) ? 'api-key' : /chatgpt|oauth|subscription/i.test(raw) ? 'subscription' : 'unknown'
    };
}

export function codexCatalog(json: unknown) {
    const rows = (json as {models?: unknown})?.models;
    if (!Array.isArray(rows)) return [];
    const seen = new Set<string>();
    return rows.filter(r => {
        if (!r || typeof r.slug !== 'string' || !r.slug || r.slug.length > 1000 || r.visibility === 'hide' || seen.has(r.slug)) return false;
        seen.add(r.slug);
        return true;
    }).slice(0, 1000).map(r => ({id:r.slug, name:typeof r.display_name === 'string' ? r.display_name : r.slug}));
}

export function importedModel(source: LoginSource, item: {id: string; name: string}): Model {
    return {
        id:'login-' + createHash('sha256').update(source.engine + '\0' + item.id).digest('hex').slice(0, 24),
        name:item.name,
        provider:source.engine === 'magpie' ? 'Magpie 本机网关' : source.engine === 'codex' ? 'Codex 当前登录' : 'Claude Code 当前登录',
        source:source.engine, protocol:'openai-compatible',
        endpoint:source.engine === 'magpie' ? 'http://127.0.0.1:3425/v1' : '',
        model:item.id, maxTokens:4096, timeoutMs:180000, hasKey:false, status:'untested'
    };
}

async function discoverCli(engine: 'codex' | 'claude'): Promise<LoginSource> {
    const command = await findCommand(engine);
    const base: LoginSource = {engine, installed:!!command, status:'unknown', authMode:'unknown', models:[], catalog:engine === 'codex' ? 'cache' : 'aliases', message:''};
    if (!command) return {...base, message:'未找到本机程序'};
    try {
        const raw = await capture(command, engine === 'codex' ? ['login', 'status'] : ['auth', 'status', '--json'], '', {timeoutMs:10000, includeStderr:true, allowNonZero:true});
        Object.assign(base, loginSummary(engine, raw));
    } catch { return {...base, message:'登录检查失败，请在终端检查登录状态与版本'}; }
    if (base.status !== 'signed-in') return {...base, message:base.status === 'signed-out' ? '请先在原工具中登录' : '无法确认登录，不读取或复制凭据文件'};
    if (engine === 'codex') {
        try {
            const file = path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'models_cache.json');
            const stat = await fs.stat(file);
            if (stat.size < 16 * 1024 * 1024) base.models = codexCatalog(JSON.parse(await fs.readFile(file, 'utf8')));
        } catch { /* The original CLI default remains usable when its cache is absent. */ }
        base.models = [{id:'__cli_default__', name:'Codex 当前默认模型'}, ...base.models.filter(m => m.id !== '__cli_default__')];
        base.message = '通过原 CLI 使用当前登录；缓存模型不是在线可用性或额度保证。';
    } else {
        base.models = [{id:'__cli_default__', name:'Claude Code 当前默认模型'}, ...['sonnet', 'opus', 'haiku'].map(id => ({id, name:'Claude ' + id}))];
        base.message = '模型别名交给 Claude Code 解析，可用性由当前账户和原工具决定。';
    }
    return base;
}

async function discoverGateway(client: ModelClient): Promise<LoginSource> {
    const base: LoginSource = {engine:'magpie', installed:false, status:'unknown', authMode:'unknown', models:[], catalog:'gateway', message:'未连接本机 Magpie 网关；可先使用原 CLI 登录源。'};
    try {
        // This is Magpie's documented local placeholder, not an account credential.
        const models = await client.listModels({endpoint:'http://127.0.0.1:3425/v1', protocol:'openai-compatible', apiKey:'magpie'}, 2500);
        return {...base, installed:true, status:'signed-in', models, message:'已连接本机 Magpie 接口；请确认网关正在运行，模型由该网关服务。'};
    } catch { return base; }
}

export async function discoverLoginSources(client: ModelClient): Promise<LoginSource[]> {
    return Promise.all([discoverCli('codex'), discoverCli('claude'), discoverGateway(client)]);
}

export async function routeCall(call: AgentCall, client: Pick<ModelClient, 'run'>, external: typeof runExternal = runExternal) {
    const source = call.model?.source || 'api';
    if (source === 'codex' || source === 'claude') {
        if (call.agent.source === 'external' && call.agent.engine !== source) throw new Error('跨原生工具使用另一登录源需要 Magpie 网关，请选择网关模型');
        return external({...call, agent:{...call.agent, source:'external', engine:source}});
    }
    if (call.agent.source === 'external' && call.model && source === 'api') throw new Error('原生 Agent 的跨服务商路由请选择本机 Magpie 网关模型，自建 Agent 可直接使用 API 模型');
    return call.agent.source === 'external' ? external(call) : client.run(call);
}
