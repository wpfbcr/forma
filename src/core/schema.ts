import { z } from 'zod';
export const entityId = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
const text = z.string().trim().min(1).max(1000);
export const modelInput = z.object({ id: entityId.optional(), name: text, provider: text, protocol: z.enum(['openai-compatible', 'anthropic']), endpoint: z.string().url().max(2000), model: text, maxTokens: z.number().int().min(64).max(32768).default(4096), timeoutMs: z.number().int().min(5000).max(600000).default(120000), apiKey: z.string().max(8192).optional() });
export const agentInput = z.object({ id: entityId.optional(), name: text, source: z.enum(['custom', 'external']), engine: z.enum(['builtin', 'codex', 'claude']), role: z.string().trim().min(1).max(12000), model: z.string().max(80), mode: z.string().max(100).default('先计划后执行'), tools: z.array(z.enum(['read_files', 'write_files'])).max(2), memoryIds: z.array(entityId).max(50), mark: z.string().max(4).default('A'), tone: z.string().max(20).default('') });
export const teamInput = z.object({ id: entityId.optional(), name: text, description: z.string().max(2000), leader: entityId, members: z.array(entityId).min(1).max(12), roles: z.record(entityId, z.string().max(2000)), models: z.record(entityId, entityId).default({}), positions: z.record(entityId, z.object({ x: z.number().min(0).max(5000), y: z.number().min(0).max(5000) })).default({}) });
export const memoryInput = z.object({ id: entityId.optional(), title: text, body: z.string().trim().min(1).max(20000), scope: z.enum(['personal', 'workspace']) });
export const taskInput = z.object({ title: z.string().trim().min(1).max(12000), workspaceName: z.string().trim().max(100), executor: z.string().regex(/^(team|agent):[a-zA-Z0-9_-]{1,80}$/) });
export const messageInput = z.object({ taskId: entityId, message: z.string().trim().min(1).max(30000) });
export const materialInput = z.object({ taskId: entityId, name: text, content: z.string().max(262144) });
export const planSchema = z.object({ reply: z.string().max(20000), assignments: z.array(z.object({ id: entityId, agentId: entityId, task: z.string().min(1).max(16000), dependencies: z.array(entityId).max(12).default([]) })).max(12) });
export function validateEndpoint(endpoint: string) { const u = new URL(endpoint); if (u.username || u.password || u.search || u.hash)
    throw new Error('服务地址不能包含认证信息、查询参数或片段'); if (u.protocol !== 'https:' && !(u.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)))
    throw new Error('云端服务请使用 HTTPS；HTTP 仅允许本机服务'); return u.toString().replace(/\/$/, ''); }
