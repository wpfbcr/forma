import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { Store } from './storage.js';
import { Workspaces } from './workspace.js';
import { Engine } from './engine.js';
import { Vault } from './vault.js';
import { ModelClient } from './models.js';
import { Resources } from './resources.js';
import { detectAgents, runExternal } from './external.js';
import { agentInput, entityId, materialInput, memoryInput, messageInput, modelInput, taskInput, teamInput, validateEndpoint } from './schema.js';
import type { Executor, Request } from './types.js';
export class Service {
    readonly engine: Engine;
    readonly client: ModelClient;
    readonly resources:Resources;
    constructor(readonly store:Store,readonly vault:Vault,readonly files:Workspaces,executor?:Executor){this.client=new ModelClient(vault,files);const runner=executor||{run:(call:import('./types.js').AgentCall)=>call.agent.source==='external'?runExternal(call):this.client.run(call)};this.resources=new Resources(store,runner);this.engine=new Engine(store,files,runner,(t,q)=>this.resources.prepare(t,q));}

    async dispatch(request: Request): Promise<unknown> {
        const p = request.payload;
        switch (request.action) {
            case 'skill.save':return this.resources.saveSkill(z.object({id:entityId.optional(),content:z.string().max(40000),enabled:z.boolean()}).parse(p));
            case 'skill.toggle':return this.resources.toggleSkill(entityId.parse(p));
            case 'skill.generate':{const v=z.object({agentId:entityId,description:z.string().min(1).max(12000)}).parse(p);const generated=await this.resources.generate(v.agentId,'根据用户需求创建指令型 Agent Skill。只输出 SKILL.md，包含 YAML name（英文小写短横线）、description，以及适用条件、步骤、输出要求、边界和示例。不得生成脚本或声称工具已授权。',v.description);return this.resources.saveSkill({content:generated.trim().replace(/^```(?:markdown|md)?\s*/,'').replace(/\s*```$/,''),enabled:false,origin:'ai'});}
            case 'knowledge.create':return this.resources.createLibrary(z.object({name:z.string().trim().min(1).max(100)}).parse(p).name);
            case 'knowledge.watch':return this.resources.toggleWatch(entityId.parse(p));
            case 'knowledge.sync':return this.resources.sync(entityId.parse(p));
            case 'knowledge.search':{const v=z.object({id:entityId,query:z.string().max(2000)}).parse(p);return this.resources.search(v.id,v.query);}
            case 'knowledge.docs':return this.resources.docs(entityId.parse(p));
            case 'knowledge.addText':{const v=z.object({id:entityId,name:z.string().min(1).max(200),content:z.string().min(1).max(262144)}).parse(p);return this.resources.addText(v.id,v.name,v.content);}
            case 'knowledge.compile':{const v=z.object({id:entityId,agentId:entityId}).parse(p);return this.resources.compile(v.id,v.agentId);}
            case 'knowledge.accept':return this.resources.acceptWiki(entityId.parse(p));
            case 'resources.bind':{const v=z.object({scope:z.enum(['agent','team','task']),id:entityId,knowledgeIds:z.array(entityId).max(12),skillIds:z.array(entityId).max(12)}).parse(p);await this.store.change(s=>{if(v.knowledgeIds.some(id=>!s.libraries?.some(l=>l.id===id))||v.skillIds.some(id=>!s.skills?.some(l=>l.id===id)))throw new Error('资源不存在');const target=(v.scope==='agent'?s.agents:v.scope==='team'?s.teams:s.tasks).find(x=>x.id===v.id);if(!target)throw new Error('绑定对象不存在');target.knowledgeIds=v.knowledgeIds;target.skillIds=v.skillIds;});return true;}
            case 'state.get': return this.store.snapshot();
            case 'agents.detect': return detectAgents();
            case 'agent.save': {
                const input = agentInput.parse(p);
                if ((input.source === 'custom') !== (input.engine === 'builtin'))
                    throw new Error('Agent 来源与执行方式不一致');
                const agent = { ...input, id: input.id || randomUUID() };
                await this.store.change(s => { const i = s.agents.findIndex(a => a.id === agent.id); if (i < 0)
                    s.agents.push(agent);
                else
                    s.agents[i] = {...s.agents[i],...agent}; });
                return agent.id;
            }
            case 'agent.delete': {
                const id = entityId.parse(p);
                await this.store.change(s => { if (s.teams.some(t => t.members.includes(id)))
                    throw new Error('请先从团队中移除此 Agent'); s.agents = s.agents.filter(a => a.id !== id); });
                return true;
            }
            case 'team.save': {
                const input = teamInput.parse(p);
                const team = { ...input, id: input.id || randomUUID(), members: [...new Set(input.members)] };
                await this.store.change(s => { if (!team.members.includes(team.leader))
                    throw new Error('Leader 必须是团队成员'); if (team.members.some(id => !s.agents.some(a => a.id === id)))
                    throw new Error('团队包含不存在的 Agent'); const i = s.teams.findIndex(t => t.id === team.id); if (i < 0)
                    s.teams.push(team);
                else
                    s.teams[i] = {...s.teams[i],...team}; });
                return team.id;
            }
            case 'team.delete': {
                const id = entityId.parse(p);
                await this.store.change(s => { s.teams = s.teams.filter(t => t.id !== id); });
                return true;
            }
            case 'model.save': {
                const input = modelInput.parse(p), id = input.id || randomUUID();
                const endpoint = validateEndpoint(input.endpoint);
                if (input.apiKey?.trim())
                    await this.vault.set(id, input.apiKey.trim());
                const { apiKey, ...publicInput } = input;
                const model = { ...publicInput, id, endpoint, hasKey: this.vault.has(id), status: 'untested' as const };
                await this.store.change(s => { const i = s.models.findIndex(m => m.id === id); if (i < 0)
                    s.models.push(model);
                else
                    s.models[i] = model; });
                return id;
            }
            case 'model.clearKey': {
                const id = entityId.parse(p);
                await this.vault.remove(id);
                await this.store.change(s => { const m = s.models.find(m => m.id === id); if (m) {
                    m.hasKey = false;
                    m.status = 'untested';
                } });
                return true;
            }
            case 'model.test': {
                const id = entityId.parse(p), m = this.store.snapshot().models.find(m => m.id === id);
                if (!m)
                    throw new Error('模型不存在');
                try {
                    const result = await this.client.test(m);
                    await this.store.change(s => { s.models.find(m => m.id === id)!.status = 'ready'; });
                    return result;
                }
                catch (e) {
                    await this.store.change(s => { s.models.find(m => m.id === id)!.status = 'failed'; });
                    throw e;
                }
            }
            case 'memory.save': {
                const input = memoryInput.parse(p), memory = { ...input, id: input.id || randomUUID() };
                await this.store.change(s => { const i = s.memories.findIndex(m => m.id === memory.id); if (i < 0)
                    s.memories.push(memory);
                else
                    s.memories[i] = memory; });
                return memory.id;
            }
            case 'memory.delete': {
                const id = entityId.parse(p);
                await this.store.change(s => { s.memories = s.memories.filter(m => m.id !== id); });
                return true;
            }
            case 'task.create': {
                const input = taskInput.parse(p);
                return this.engine.create(input.title, input.workspaceName, input.executor);
            }
            case 'task.send': {
                const input = messageInput.parse(p);
                await this.engine.send(input.taskId, input.message);
                return true;
            }
            case 'task.pause':
                await this.engine.pause(entityId.parse(p));
                return true;
            case 'task.stop':
                await this.engine.stop(entityId.parse(p));
                return true;
            case 'task.resume':
                await this.engine.resume(entityId.parse(p));
                return true;
            case 'task.material': {
                const input = materialInput.parse(p);
                const name = input.name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-');
                await this.engine.update(input.taskId, async (t) => { await this.files.put(t, '资料/' + name, input.content, 'input'); t.events.push({ time: new Date().toISOString(), actor: '用户', text: '添加资料：' + name }); await this.files.sync(t); });
                return true;
            }
            case 'task.memories': {
                const v = z.object({ taskId: entityId, memoryIds: z.array(entityId).max(50) }).parse(p);
                await this.engine.update(v.taskId, (t, s) => { t.contextMemoryIds = v.memoryIds.filter(id => s.memories.some(m => m.id === id)); });
                return true;
            }
            case 'settings.save': {
                const v = z.object({ theme: z.enum(['light', 'dark']), concurrency: z.number().int().min(1).max(4), maxToolCalls: z.number().int().min(1).max(20), allowFileWrites: z.boolean() }).parse(p);
                await this.store.change(s => { s.theme = v.theme; s.settings = { ...s.settings, concurrency: v.concurrency, maxToolCalls: v.maxToolCalls, allowFileWrites: v.allowFileWrites }; });
                return true;
            }
            default: throw new Error('不支持的操作');
        }
    }
}
