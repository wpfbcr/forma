import type { AgentCall, Model } from './types.js';
import type { Vault } from './vault.js';
import { Workspaces } from './workspace.js';
import { validateEndpoint } from './schema.js';
import { z } from 'zod';
const toolSpecs = [
    { name: 'list_files', description: 'List files within your assigned working directory.', parameters: { type: 'object', properties: { path: { type: 'string' } }, required: [] } },
    { name: 'read_file', description: 'Read a UTF-8 file within your assigned working directory.', parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
    { name: 'write_file', description: 'Write a UTF-8 file within your assigned working directory.', parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } }
];
async function boundedJson(response: Response) { const reader = response.body?.getReader(); if (!reader)
    throw new Error('服务商返回空响应'); const chunks: Uint8Array[] = []; let length = 0; while (true) {
    const { done, value } = await reader.read();
    if (done)
        break;
    length += value.length;
    if (length > 8 * 1024 * 1024) {
        await reader.cancel();
        throw new Error('模型响应超过 8 MB 限制');
    }
    chunks.push(value);
} try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
catch {
    throw new Error('服务商返回的内容不是有效 JSON');
} }
export class ModelClient {
    constructor(private vault: Pick<Vault, 'get'>, private workspaces: Workspaces, private request: typeof fetch = fetch) { }
    async post(model: Model, body: unknown, signal: AbortSignal) {
        const base = validateEndpoint(model.endpoint), key = await this.vault.get(model.id);
        const endpoint = model.protocol === 'anthropic' ? `${base}/messages` : `${base}/chat/completions`;
        const headers: Record<string, string> = { 'content-type': 'application/json' };
        if (model.protocol === 'anthropic') {
            headers['anthropic-version'] = '2023-06-01';
            if (key)
                headers['x-api-key'] = key;
        }
        else if (key)
            headers.authorization = 'Bearer ' + key;
        const response = await this.request(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.any([signal, AbortSignal.timeout(model.timeoutMs)]), redirect: 'error' });
        if (!response.ok)
            throw new Error(`模型服务返回 HTTP ${response.status}${response.status === 401 || response.status === 403 ? '，请检查认证与访问权限' : response.status === 429 ? '，请检查额度或稍后重试' : ''}`);
        return boundedJson(response);
    }
    async test(model: Model) { const result = await this.post(model, model.protocol === 'anthropic' ? { model: model.model, max_tokens: 64, messages: [{ role: 'user', content: 'Reply with OK.' }] } : { model: model.model, max_tokens: 64, messages: [{ role: 'user', content: 'Reply with OK.' }] }, new AbortController().signal); const text = model.protocol === 'anthropic' ? result.content?.filter((x: any) => x.type === 'text').map((x: any) => x.text).join('') : result.choices?.[0]?.message?.content; if (typeof text !== 'string' || !text.trim())
        throw new Error('连接成功，但未收到文本响应'); return { ok: true, capability: 'text', message: '文本调用成功；工具调用能力需通过实际任务验证。' }; }
    async run(call: AgentCall) {
        const model = call.model;
        if (!model)
            throw new Error('请先为 Agent 选择模型');
        const canRead = call.agent.tools.includes('read_files'), canWrite = call.allowWrites && call.agent.tools.includes('write_files');
        const specs = toolSpecs.filter(t => t.name === 'write_file' ? canWrite : canRead);
        const messages: any[] = [{ role: 'user', content: call.prompt }];
        let calls = 0;
        for (let turn = 0; turn <= call.maxToolCalls; turn++) {
            call.signal.throwIfAborted();
            const anthropic = model.protocol === 'anthropic';
            const body = anthropic ? { model: model.model, max_tokens: model.maxTokens, system: call.system, messages, ...(specs.length ? { tools: specs.map(t => ({ name: t.name, description: t.description, input_schema: t.parameters })) } : {}) } : { model: model.model, max_tokens: model.maxTokens, messages: [{ role: 'system', content: call.system }, ...messages], ...(specs.length ? { tools: specs.map(t => ({ type: 'function', function: t })) } : {}) };
            const response = await this.post(model, body, call.signal);
            const msg = anthropic ? { role: 'assistant', content: response.content } : response.choices?.[0]?.message;
            if (!msg)
                throw new Error('模型未返回有效消息');
            const toolCalls = anthropic ? (response.content || []).filter((x: any) => x.type === 'tool_use').map((x: any) => ({ id: x.id, name: x.name, input: x.input })) : (msg.tool_calls || []).map((x: any) => { let input; try {
                input = JSON.parse(x.function.arguments);
            }
            catch {
                input = null;
            } return { id: x.id, name: x.function.name, input }; });
            if (!toolCalls.length) {
                const text = anthropic ? (response.content || []).filter((x: any) => x.type === 'text').map((x: any) => x.text).join('\n') : msg.content;
                if (typeof text !== 'string' || !text.trim())
                    throw new Error('模型返回空内容');
                return text;
            }
            messages.push(msg);
            const results: any[] = [];
            for (const tool of toolCalls) {
                call.signal.throwIfAborted();
                if (++calls > call.maxToolCalls)
                    throw new Error('已达到本轮工具调用上限');
                let output: string;
                try {
                    if (!specs.some(s => s.name === tool.name))
                        throw new Error('此工具未授权');
                    if (tool.name === 'list_files') {
                        const arg = z.object({ path: z.string().default('') }).parse(tool.input);
                        output = JSON.stringify(await this.workspaces.list(call.cwd, arg.path));
                    }
                    else if (tool.name === 'read_file') {
                        const arg = z.object({ path: z.string() }).parse(tool.input);
                        output = await this.workspaces.read(call.cwd, arg.path);
                    }
                    else {
                        const arg = z.object({ path: z.string(), content: z.string().max(262144) }).parse(tool.input);
                        output = await this.workspaces.write(call.cwd, arg.path, arg.content);
                    }
                }
                catch (e) {
                    output = '工具错误：' + (e instanceof Error ? e.message : '未知错误');
                }
                await call.onEvent(`${tool.name} · ${output.startsWith('工具错误') ? '失败' : '完成'}`);
                if (anthropic)
                    results.push({ type: 'tool_result', tool_use_id: tool.id, content: output });
                else
                    messages.push({ role: 'tool', tool_call_id: tool.id, content: output });
            }
            if (anthropic)
                messages.push({ role: 'user', content: results });
        }
        throw new Error('Agent 未在工具调用限制内完成');
    }
}
