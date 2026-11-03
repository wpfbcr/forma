import {promises as fs} from 'node:fs';
import path from 'node:path';
import {randomUUID, createHash} from 'node:crypto';
import {parse as parseYaml} from 'yaml';
import {z} from 'zod';
import {Store, atomicWrite} from './storage.js';
import type {Skill, SkillCategory} from './types.js';

export const uncategorized = 'uncategorized';
const tones = ['sage','blue','amber','violet','rose','slate','teal'] as const;
const categorySchema = z.object({id:z.string().regex(/^[a-z0-9-]+$/), name:z.string().trim().min(1).max(24), tone:z.enum(tones)});
const mdSchema = z.object({name:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(64), description:z.string().trim().min(1).max(1024)});
export function parseSkill(content:string) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
    if (!match) throw new Error('技能需要 YAML 元数据和 Markdown 正文');
    const meta = mdSchema.parse(parseYaml(match[1]));
    if (!match[2].trim()) throw new Error('技能正文不能为空');
    if (content.length > 100000) throw new Error('技能超过 100000 字符');
    return meta;
}
const assetRoot = path.join(__dirname, '../../resources/skills');
const itemSchema = z.object({
    id:z.string().regex(/^curated-[a-z0-9-]+$/), displayName:z.string().min(1).max(100), summary:z.string().min(1).max(300),
    categoryId:z.string(), tags:z.array(z.string().max(24)).max(8), example:z.string(), requirements:z.string(),
    repository:z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/), path:z.string().min(1),
    revision:z.string().regex(/^[a-f0-9]{40}$/), publisher:z.string(), license:z.enum(['MIT','Apache-2.0']),
    upstreamSha256:z.string().regex(/^[a-f0-9]{64}$/), contentSha256:z.string().regex(/^[a-f0-9]{64}$/)
});
export async function loadSkillCatalog():Promise<{categories:SkillCategory[];skills:Skill[]}> {
    const manifest = z.object({version:z.literal(1), categories:z.array(categorySchema), skills:z.array(itemSchema)}).parse(JSON.parse(await fs.readFile(path.join(assetRoot, 'catalog.json'), 'utf8')));
    const ids = new Set<string>();
    const categoryIds = new Set(manifest.categories.map(c => c.id));
    if (!categoryIds.has(uncategorized) || categoryIds.size !== manifest.categories.length) throw new Error('技能分类目录无效');
    const skills:Skill[] = [];
    for (const item of manifest.skills) {
        if (ids.has(item.id) || !categoryIds.has(item.categoryId)) throw new Error('精选技能目录无效');
        ids.add(item.id);
        const dir = path.join(assetRoot, item.id);
        const [content, original, licenseText] = await Promise.all(['SKILL.md','UPSTREAM.md','LICENSE.txt'].map(name => fs.readFile(path.join(dir, name), 'utf8')));
        const digest = (v:string) => createHash('sha256').update(v).digest('hex');
        if (digest(content) !== item.contentSha256 || digest(original) !== item.upstreamSha256 || !licenseText.trim()) throw new Error('精选技能文件校验失败');
        skills.push({id:item.id, ...parseSkill(content), content, version:1, enabled:false, origin:'github', displayName:item.displayName, summary:item.summary, categoryId:item.categoryId, tags:item.tags, example:item.example, requirements:item.requirements,
            source:{catalogId:item.id, repository:item.repository, path:item.path, revision:item.revision, url:`https://github.com/${item.repository}/blob/${item.revision}/${item.path}`, publisher:item.publisher, license:item.license, licenseText, upstreamSha256:item.upstreamSha256, mode:'adapted'}});
    }
    return {categories:manifest.categories, skills};
}
const legacy = [
    ['evidence-answer','资料问答','research','依据给定证据回答。每个关键结论引用证据提供的 citation 标识；没有依据时明确说明，不补造来源。'],
    ['document-compare','跨文档对比','research','逐项比较资料的共同点、差异和冲突。输出对比表，注明来源，不把未核实推断当作事实。'],
    ['research-report','研究报告','research','先定义问题与范围，再整理证据、分析、限制与结论。只使用实际提供的资料，不声称已联网研究。'],
    ['writing-editor','写作改稿','writing','明确受众、目的与语气，保留原意和事实，输出修改稿及主要修改说明。'],
    ['meeting-notes','会议纪要','writing','提取决定、行动项、负责人、截止时间与未解决问题。原文未说明的信息标为待确认。'],
    ['requirements-plan','需求拆解','product','将目标拆解为有输入、交付物、依赖和验收条件的任务。先说明需要澄清的关键约束。'],
    ['code-review','代码审阅','development','根据实际代码识别可复现问题，说明触发条件、影响和修复方向。区分确认缺陷与建议，不伪造测试。'],
    ['retrospective','项目复盘','product','根据工作记录总结有效方法、失败原因、改进行动，生成值得保留的知识和技能草稿建议。']
];
export interface SaveSkill {id?:string;copyFromId?:string;content:string;enabled:boolean;origin?:'manual'|'ai';displayName?:string;categoryId?:string;tags?:string[];}
export class SkillLibrary {
    constructor(private store:Store, private directory:string) {}
    async initialize() {
        const catalog = await loadSkillCatalog();
        await this.store.change(s => {
            s.skills ??= [];
            s.skillCategories ??= catalog.categories;
            if (!s.skillCategories.some(c => c.id === uncategorized)) s.skillCategories.push({id:uncategorized, name:'未分类', tone:'slate'});
            const valid = (id?:string) => s.skillCategories!.some(c => c.id === id) ? id : uncategorized;
            for (const [name,title,category,body] of legacy) {
                const id = 'builtin-' + name;
                let item = s.skills.find(v => v.id === id);
                if (!item) {item = {id,name,description:title,content:`---\nname: ${name}\ndescription: ${title}\n---\n\n${body}`,version:1,enabled:true,origin:'builtin'};s.skills.push(item);}
                item.displayName ??= title;
                item.categoryId = valid(item.categoryId || category);
            }
            for (const item of catalog.skills) {
                const old = s.skills.find(v => v.id === item.id);
                if (!old) s.skills.push({...item, categoryId:valid(item.categoryId)});
                else if (old.origin === 'github') {
                    const changed = old.content !== item.content;
                    Object.assign(old, item, {enabled:old.enabled, categoryId:valid(old.categoryId), displayName:old.displayName || item.displayName, tags:old.tags || item.tags, version:old.version + (changed ? 1 : 0)});
                }
            }
            for (const item of s.skills) item.categoryId = valid(item.categoryId);
        });
        for (const item of this.store.snapshot().skills || []) await this.write(item);
    }
    async write(skill:Skill) {
        if (!/^[a-zA-Z0-9_-]{1,120}$/.test(skill.id)) throw new Error('无效技能标识');
        const dir = path.join(this.directory, skill.id);
        await atomicWrite(path.join(dir, 'SKILL.md'), skill.content);
        if (skill.source) {
            const {licenseText, ...source} = skill.source;
            await atomicWrite(path.join(dir, 'LICENSE.txt'), licenseText);
            await atomicWrite(path.join(dir, 'SOURCE.json'), JSON.stringify(source, null, 2));
        }
    }
    private validateCategory(id?:string) {
        const value = id || uncategorized;
        if (!this.store.snapshot().skillCategories?.some(c => c.id === value)) throw new Error('技能分类不存在，请重新选择');
        return value;
    }
    async save(input:SaveSkill) {
        if (input.id && input.copyFromId) throw new Error('编辑与复制不能同时进行');
        const meta = parseSkill(input.content), state = this.store.snapshot();
        const old = state.skills?.find(s => s.id === input.id);
        if (input.id && !old) throw new Error('技能不存在');
        if (old && ['builtin','github'].includes(old.origin)) throw new Error('请复制预置或精选技能为自己的版本');
        const base = input.copyFromId ? state.skills?.find(s => s.id === input.copyFromId) : old;
        if (input.copyFromId && !base) throw new Error('原技能不存在');
        const skill:Skill = {...meta, id:old?.id || randomUUID(), content:input.content, enabled:input.enabled, origin:old?.origin || input.origin || 'manual', version:(old?.version || 0) + 1,
            displayName:input.displayName?.trim() || old?.displayName || base?.displayName || meta.name,
            categoryId:this.validateCategory(input.categoryId || old?.categoryId || base?.categoryId), tags:input.tags || old?.tags || base?.tags || [],
            source:base?.source ? {...base.source, mode:input.copyFromId ? 'copy' : base.source.mode} : undefined};
        await this.write(skill);
        await this.store.change(s => {if (!s.skillCategories?.some(c => c.id === skill.categoryId)) throw new Error('技能分类已变更，请重新选择');s.skills ??= [];const i = s.skills.findIndex(v => v.id === skill.id);if (i < 0) s.skills.push(skill);else s.skills[i] = skill;});
        return skill.id;
    }
    async toggle(id:string) {
        await this.store.change(s => {const skill = s.skills?.find(v => v.id === id);if (!skill) throw new Error('技能不存在');skill.enabled = !skill.enabled;});
    }
    async organize(id:string, categoryId:string) {
        this.validateCategory(categoryId);
        await this.store.change(s => {if (!s.skillCategories?.some(c => c.id === categoryId)) throw new Error('技能分类不存在');const skill = s.skills?.find(v => v.id === id);if (!skill) throw new Error('技能不存在');skill.categoryId = categoryId;});
    }
    async saveCategory(input:{id?:string;name:string;tone?:SkillCategory['tone']}) {
        const name = input.name.trim();
        if (!name || name.length > 24) throw new Error('分类名称需为 1–24 个字符');
        if (input.tone && !tones.includes(input.tone)) throw new Error('无效分类配色');
        const id = input.id || 'category-' + randomUUID();
        await this.store.change(s => {
            s.skillCategories ??= [];
            const old = s.skillCategories.find(c => c.id === input.id);
            if (input.id && !old) throw new Error('分类不存在');
            if (s.skillCategories.some(c => c.id !== id && c.name.normalize('NFKC').toLowerCase() === name.normalize('NFKC').toLowerCase())) throw new Error('已存在同名分类');
            if (old) {old.name = name;old.tone = input.tone || old.tone;}
            else {if (s.skillCategories.length >= 64) throw new Error('最多支持 64 个分类');s.skillCategories.push({id,name,tone:input.tone || 'sage'});}
        });
        return id;
    }
    async deleteCategory(id:string) {
        if (id === uncategorized) throw new Error('未分类用于保留技能，不能删除');
        await this.store.change(s => {
            if (!s.skillCategories?.some(c => c.id === id)) throw new Error('分类不存在');
            s.skillCategories = s.skillCategories.filter(c => c.id !== id);
            for (const skill of s.skills || []) if (skill.categoryId === id) skill.categoryId = uncategorized;
        });
    }
}

export function skillSourceUrl(skill?:Skill) {
    const source=skill?.source;
    if (!source || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source.repository) || !/^[a-f0-9]{40}$/.test(source.revision) || !/^[A-Za-z0-9_./-]+$/.test(source.path) || source.path.split('/').some(p=>!p||p==='.'||p==='..')) throw new Error('技能来源无效');
    return `https://github.com/${source.repository}/blob/${source.revision}/${source.path}`;
}
