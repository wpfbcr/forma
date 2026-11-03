import type {AppState, Skill, SkillCategory} from './types.js';
import {icon as I} from './icons.js';
const e = (v:unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const title = (s:Skill) => s.displayName || s.name;
const tones = ['sage','blue','amber','violet','rose','slate','teal'];
const tone = (c?:SkillCategory) => tones.includes(c?.tone || '') ? c!.tone : 'slate';
const categoryIcon = (id:string) => ({writing:'file',research:'book',product:'canvas',design:'spark',development:'code',marketing:'globe',data:'model'}[id] || 'folder');
const actionLabels:Record<string,string>={categories:'管理分类','edit-category':'编辑分类','delete-category':'删除分类'};
const button = (text:string, action:string, id='', style='') => `<button type="button" class="btn ${style}" data-sact="${action}" ${actionLabels[action] ? `aria-label="${actionLabels[action]}"` : ''} ${id ? `data-id="${e(id)}"` : ''}>${text}</button>`;
export type SkillScope = 'all'|'github'|'personal'|'basic';
export function filterSkills(skills:Skill[], categories:SkillCategory[], query:string, scope:SkillScope, enabled='any') {
    const needle = query.trim().toLocaleLowerCase();
    return skills.filter(s => {
        if (scope === 'basic' ? s.origin !== 'builtin' : scope === 'github' ? s.origin !== 'github' : scope === 'personal' ? !['manual','ai'].includes(s.origin) : s.origin === 'builtin') return false;
        if (enabled !== 'any' && s.enabled !== (enabled === 'on')) return false;
        const text = [title(s),s.name,s.description,s.summary,...s.tags || [],s.source?.publisher,s.source?.repository,categories.find(c => c.id === s.categoryId)?.name].join(' ').toLocaleLowerCase();
        return !needle || text.includes(needle);
    });
}
export function skillsUI(state:()=>AppState, api:(action:string,payload?:unknown)=>Promise<any>, modal:(title:string,body:string)=>void, close:()=>void, render:()=>void, toast:(text:string)=>void, navigate:(page:string)=>void, modelChoices:()=>string) {
    let category = '', query = '', scope:SkillScope = 'all', enabled = 'any';
    const categories = () => state().skillCategories || [];
    const skill = (id?:string) => state().skills?.find(s => s.id === id);
    const categoryOptions = (selected='uncategorized') => categories().map(c => `<option value="${e(c.id)}" ${c.id === selected ? 'selected' : ''}>${e(c.name)}</option>`).join('');
    const footer = (text:string) => `<p class="processing-form-error" data-form-error role="alert"></p><div class="modal-footer">${button('取消','close')}<button type="submit" class="btn primary">${text}</button></div>`;
    const originName = (s:Skill) => s.source?.publisher || (s.origin === 'ai' ? 'AI 草稿' : s.origin === 'builtin' ? 'Forma 基础模板' : '自己编写');
    function view() {
        if (category && !categories().some(c => c.id === category)) category = '';
        const all = state().skills || [], pool = filterSkills(all,categories(),query,scope,enabled), shown = pool.filter(s => !category || s.categoryId === category);
        const curated = all.filter(s => s.origin === 'github').length;
        return `<div class="page-head skill-heading"><div><div class="eyebrow">A LIBRARY OF GOOD METHODS</div><h1>技能仓库</h1><p>找到合适的方法，交给你的 Agent。按工作场景组织，随时扩展。</p></div><div class="row wrap">${button(I('spark')+'AI 帮我写','ai-skill')}${button(I('plus')+'编写技能','new-skill','','primary')}</div></div><div class="skill-library-meta"><span>${I('book')}${curated} 项 GitHub 精选</span><span>${I('folder')}${categories().filter(c => c.id !== 'uncategorized').length} 个分类</span><span>已随应用收录 · 启用并绑定后使用</span></div><div class="skill-layout"><aside class="skill-categories"><div class="row between skill-category-heading"><h3>按场景查找</h3>${button(I('settings'),'categories','','ghost icon sm')}</div><button type="button" class="skill-category ${category === '' ? 'active' : ''}" data-sact="category" data-id=""><span>${I('list')}全部分类</span><small>${pool.length}</small></button>${categories().map(c => `<button type="button" class="skill-category ${category === c.id ? 'active' : ''}" data-sact="category" data-id="${e(c.id)}"><span>${I(categoryIcon(c.id))}${e(c.name)}</span><small>${pool.filter(s => s.categoryId === c.id).length}</small></button>`).join('')}<button type="button" class="skill-new-category" data-sact="new-category">${I('plus')}新建分类</button><div class="skill-library-note">技能提供方法与模板。实际可调用的工具由所选 Agent 决定。</div></aside><section class="skill-results"><div class="skill-toolbar"><label class="skill-search">${I('search')}<input id="skill-search" type="search" value="${e(query)}" placeholder="搜索技能、用途或来源…" aria-label="搜索技能"></label><select class="field skill-status-filter" id="skill-status-filter" aria-label="筛选启用状态"><option value="any" ${enabled === 'any' ? 'selected' : ''}>全部状态</option><option value="on" ${enabled === 'on' ? 'selected' : ''}>已启用</option><option value="off" ${enabled === 'off' ? 'selected' : ''}>未启用</option></select></div><div class="skill-tabs" role="tablist" aria-label="技能来源">${([['all','全部技能'],['github','GitHub 精选'],['personal','我创建的'],['basic','基础模板']] as const).map(([value,label]) => `<button type="button" role="tab" aria-selected="${scope === value}" class="${scope === value ? 'active' : ''}" data-sact="scope" data-value="${value}">${label}</button>`).join('')}</div><div class="skill-result-heading"><h2>${e(categories().find(c => c.id === category)?.name || ({all:'全部技能',github:'GitHub 精选',personal:'我创建的',basic:'基础模板'}[scope]))}</h2><span>${shown.length} 项${query ? '搜索结果' : '技能'}</span></div><div class="skill-grid">${shown.map(card).join('')}</div>${!shown.length ? `<div class="skill-empty">${I('search')}<h3>这里还没有匹配的技能</h3><p>试试其他关键词、分类或来源，也可以编写自己的方法。</p>${button('清除筛选','reset')}</div>` : ''}</section></div>`;
    }
    function card(s:Skill) {
        const c = categories().find(c => c.id === s.categoryId);
        return `<article class="skill-card skill-tone-${tone(c)}"><div class="skill-card-top"><span class="skill-icon">${I(categoryIcon(c?.id || ''))}</span><span class="skill-category-tag">${e(c?.name || '未分类')}</span></div><button type="button" class="skill-card-title" data-sact="detail" data-id="${e(s.id)}">${e(title(s))}</button><p class="skill-card-summary">${e(s.summary || s.description)}</p><div class="skill-tags">${(s.tags || []).slice(0,3).map(tag => `<span>${e(tag)}</span>`).join('')}</div><div class="skill-card-bottom"><button class="skill-source-label" type="button" data-sact="detail" data-id="${e(s.id)}"><span>${s.source ? I('globe') : I(s.origin === 'ai' ? 'spark' : 'file')}${e(originName(s))}</span><small>${s.source ? e(s.source.license) : `v${s.version}`}${s.source?.mode === 'copy' ? ' · 衍生副本' : ''}</small></button><button type="button" class="switch" role="switch" aria-label="${s.enabled ? '停用' : '启用'} ${e(title(s))}" aria-checked="${s.enabled}" data-sact="toggle" data-id="${e(s.id)}"></button></div><div class="skill-card-detail-row"><span>${s.enabled ? '已启用 · 绑定后使用' : '未启用'}</span><button type="button" data-sact="detail" data-id="${e(s.id)}">查看详情 ${I('arrow')}</button></div></article>`;
    }
    function detail(s:Skill) {
        const c = categories().find(c => c.id === s.categoryId), managed = ['builtin','github'].includes(s.origin);
        modal(e(title(s)), `<div class="modal-body skill-detail"><div class="row wrap"><span class="pill">${e(c?.name || '未分类')}</span><span class="pill">${e(originName(s))}</span><span class="pill ${s.enabled ? 'green' : ''}">${s.enabled ? '已启用' : '未启用'}</span></div><p class="skill-detail-summary">${e(s.summary || s.description)}</p>${s.example ? `<div class="skill-example"><span>试着这样使用</span><p>${e(s.example)}</p></div>` : ''}<p class="help">${e(s.requirements || '技能提供指令与模板，实际操作需由 Agent 已有工具完成。')}</p><form id="skill-organize" data-id="${e(s.id)}" class="skill-organize"><label class="form-label">所属分类<select class="field" name="categoryId">${categoryOptions(s.categoryId)}</select></label><button class="btn" type="submit">保存分类</button></form><details class="skill-content-details"><summary>查看技能内容 <small>${s.content.length.toLocaleString()} 字符 · v${s.version}</small></summary><pre class="file-preview">${e(s.content)}</pre></details>${s.source ? `<details class="skill-content-details"><summary>来源与开源许可 <small>${e(s.source.license)}</small></summary><div class="skill-attribution"><p><strong>${e(s.source.repository)}</strong></p><p>${e(s.source.path)}</p><p>固定版本 <code>${e(s.source.revision.slice(0,12))}</code> · ${s.source.mode === 'copy' ? '衍生副本' : 'Forma 指令适配版'}</p><p class="help">已保留上游原文、许可与来源记录。补充了 Forma 工具边界，并内联已有的配套 Markdown 参考。原工具的脚本、插件与连接器不会随技能执行。</p>${button(I('globe')+'打开 GitHub 原文','source',s.id)}<pre class="file-preview skill-license">${e(s.source.licenseText)}</pre></div></details>` : ''}<p class="help">技能启用后，还需要在 Agent、团队或任务中选择绑定。较长技能会占用更多上下文。</p></div><div class="modal-footer">${button('关闭','close')}${button(managed ? I('copy')+'复制并编辑' : I('edit')+'编辑技能', managed ? 'copy' : 'edit',s.id,'primary')}</div>`);
    }
    function edit(s?:Skill, copy=false) {
        if (s && ['builtin','github'].includes(s.origin) && !copy) {detail(s);return;}
        const template = '---\nname: my-skill\ndescription: 描述技能的适用场景\n---\n\n## 工作步骤\n\n1. 确认输入与目标。\n2. 根据实际资料完成工作。\n\n## 输出要求\n\n明确结论、依据与限制。';
        modal(copy ? '复制并编辑技能' : s ? '编辑技能' : '编写技能', `<form id="skill-editor" data-id="${copy ? '' : e(s?.id || '')}" data-copy="${copy ? e(s!.id) : ''}"><div class="modal-body"><div class="form-grid"><label class="form-label">显示名称<input class="field" name="displayName" required maxlength="100" value="${e(s ? title(s)+(copy ? '（副本）' : '') : '')}" placeholder="给这个方法起个容易找到的名称"></label><label class="form-label">分类<select class="field" name="categoryId">${categoryOptions(s?.categoryId || category || 'uncategorized')}</select></label></div><label class="form-label">标签<input class="field" name="tags" maxlength="220" value="${e((s?.tags || []).join('，'))}" placeholder="用逗号分隔，最多 8 个"></label><label class="form-label">SKILL.md 内容<textarea class="field skill-editor-content" name="content" required maxlength="100000" spellcheck="false">${e(s?.content || template)}</textarea></label>${s?.source ? '<p class="help">副本与后续修改会继续保留上游来源和许可。</p>' : ''}<label class="check"><input type="checkbox" name="enabled" ${s?.enabled ? 'checked' : ''}>启用此技能</label></div>${footer('保存技能')}</form>`);
    }
    function ai() {
        modal('让 AI 帮你编写技能', `<form id="skill-ai"><div class="modal-body"><div class="form-grid"><label class="form-label">分类<select class="field" name="categoryId">${categoryOptions(category || 'uncategorized')}</select></label><label class="form-label">使用模型<select class="field" name="modelId">${modelChoices()}</select></label></div><label class="form-label">描述你的工作方法<textarea class="field" name="description" required maxlength="12000" placeholder="例如：从会议记录中提取决定、负责人、截止时间和未决问题。"></textarea></label><p class="help">使用默认或本次指定的模型生成未启用草稿。完成后可以编辑、启用，再分配给 Agent。</p></div>${footer('生成技能草稿')}</form>`);
    }
    function manageCategories() {
        modal('管理技能分类', `<div class="modal-body"><p class="help">按自己的工作方式组织技能。删除分类会将其中技能移至“未分类”。</p><div class="skill-category-list">${categories().map(c => `<div class="skill-category-manage-row"><span class="skill-category-dot skill-tone-${tone(c)}">${I(categoryIcon(c.id))}</span><div class="grow"><strong>${e(c.name)}</strong><small>${state().skills?.filter(s => s.categoryId === c.id).length || 0} 项技能 · 含基础模板</small></div>${button(I('edit'),'edit-category',c.id,'ghost icon sm')}${c.id !== 'uncategorized' ? button(I('trash'),'delete-category',c.id,'ghost icon sm') : ''}</div>`).join('')}</div></div><div class="modal-footer">${button('关闭','close')}${button(I('plus')+'新增分类','new-category','','primary')}</div>`);
    }
    function editCategory(c?:SkillCategory) {
        const names = ['松绿','雾蓝','暖杏','藤紫','浅玫','石灰','青绿'];
        modal(c ? '编辑分类' : '新增分类', `<form id="skill-category-editor" data-id="${e(c?.id || '')}"><div class="modal-body"><label class="form-label">名称<input class="field" name="name" value="${e(c?.name || '')}" required maxlength="24" placeholder="例如：我的研究方法"></label><label class="form-label">配色<select name="tone" class="field">${tones.map((value,i) => `<option value="${value}" ${c?.tone === value ? 'selected' : ''}>${names[i]}</option>`).join('')}</select></label></div>${footer('保存分类')}</form>`);
    }
    function binding(scopeName:string, id:string) {
        const target = (scopeName === 'agent' ? state().agents : scopeName === 'team' ? state().teams : state().tasks).find(v => v.id === id);
        if (!target) return;
        modal('选择技能', `<form id="skill-binding" data-scope="${e(scopeName)}" data-id="${e(id)}"><div class="modal-body"><div class="row between"><p class="help">选择要交给此${scopeName === 'agent' ? ' Agent' : scopeName === 'team' ? '团队' : '任务'}的技能，筛选不会取消已选项。</p><button type="button" class="btn sm" data-kact="edit" data-scope="${e(scopeName)}" data-id="${e(id)}">配置知识库</button></div><div class="form-grid"><input class="field" id="skill-binding-query" placeholder="搜索名称或用途" aria-label="搜索可绑定技能"><select class="field" id="skill-binding-category" aria-label="筛选技能分类"><option value="">全部分类</option>${categoryOptions('__all__')}</select></div><div class="skill-binding-groups">${categories().filter(c=>(state().skills||[]).some(s=>s.categoryId===c.id)).map(c => `<section data-binding-group="${e(c.id)}"><h3>${e(c.name)}</h3>${(state().skills || []).filter(s => s.categoryId === c.id).map(s => `<label class="context-check" data-binding-skill data-category="${e(c.id)}" data-search="${e([title(s),s.name,s.summary || s.description].join(' ').toLocaleLowerCase())}"><input type="checkbox" name="skills" value="${e(s.id)}" ${target.skillIds?.includes(s.id) ? 'checked' : ''}><span>${e(title(s))}<small>${s.enabled ? '已启用' : '未启用'} · ${e(originName(s))}</small></span></label>`).join('')}</section>`).join('')}</div></div>${footer('保存技能选择')}</form>`);
    }
    const filterBinding = () => {
        const search = document.querySelector<HTMLInputElement>('#skill-binding-query')?.value.trim().toLocaleLowerCase() || '';
        const selected = document.querySelector<HTMLSelectElement>('#skill-binding-category')?.value || '';
        for (const label of document.querySelectorAll<HTMLElement>('[data-binding-skill]')) label.hidden = !!(selected && label.dataset.category !== selected) || !label.dataset.search?.includes(search);
        for (const group of document.querySelectorAll<HTMLElement>('[data-binding-group]')) group.hidden = ![...group.querySelectorAll<HTMLElement>('[data-binding-skill]')].some(el => !el.hidden);
    };
    document.addEventListener('input', event => {
        const el = event.target as HTMLInputElement;
        if (el.id === 'skill-search') {query = el.value;const caret = el.selectionStart;render();const next = document.querySelector<HTMLInputElement>('#skill-search');next?.focus();if (caret !== null) next?.setSelectionRange(caret,caret);}
        if (el.id === 'skill-binding-query') filterBinding();
    });
    document.addEventListener('change', event => {
        const el = event.target as HTMLSelectElement;
        if (el.id === 'skill-status-filter') {enabled = el.value;render();}
        if (el.id === 'skill-binding-category') filterBinding();
    });
    document.addEventListener('click', event => {
        const el = (event.target as Element).closest<HTMLButtonElement>('[data-sact]');
        if (!el) return;
        void (async () => {
            const s = skill(el.dataset.id);
            switch (el.dataset.sact) {
                case 'close': close();break;
                case 'scope': scope = el.dataset.value as SkillScope;category = '';render();break;
                case 'category': category = el.dataset.id || '';render();break;
                case 'reset': query = '';category = '';scope = 'all';enabled = 'any';render();break;
                case 'detail': if (s) detail(s);break;
                case 'toggle': if (s) {el.disabled = true;await api('skill.toggle',s.id);}break;
                case 'new-skill': edit();break;
                case 'edit': if (s) edit(s);break;
                case 'copy': if (s) edit(s,true);break;
                case 'ai-skill': ai();break;
                case 'source': if (s) await api('skill.openSource',s.id);break;
                case 'categories': manageCategories();break;
                case 'new-category': editCategory();break;
                case 'edit-category': editCategory(categories().find(c => c.id === el.dataset.id));break;
                case 'delete-category': {const c = categories().find(c => c.id === el.dataset.id);if (c) modal('删除分类',`<div class="modal-body"><p>删除“${e(c.name)}”后，其中 ${state().skills?.filter(s => s.categoryId === c.id).length || 0} 项技能会移到“未分类”。技能内容、启用状态和绑定会保留。</p></div><div class="modal-footer">${button('取消','categories')}${button('删除分类','confirm-delete-category',c.id,'danger')}</div>`);break;}
                case 'confirm-delete-category': await api('skill.category.delete',el.dataset.id);if (category === el.dataset.id) category = '';close();render();toast('分类已删除，技能已移至未分类');break;
            }
        })().catch(error => {el.disabled = false;toast(error.message);});
    });
    document.addEventListener('submit', event => {
        const form = event.target as HTMLFormElement;
        if (!form.id.startsWith('skill-')) return;
        event.preventDefault();event.stopImmediatePropagation();
        const submit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
        if (submit.disabled) return;
        submit.disabled = true;
        const data = new FormData(form), str = (key:string) => String(data.get(key) || '');
        void (async () => {
            switch (form.id) {
                case 'skill-editor': await api('skill.save',{id:form.dataset.id || undefined,copyFromId:form.dataset.copy || undefined,content:str('content'),displayName:str('displayName'),categoryId:str('categoryId'),tags:str('tags').split(/[,，]/).map(s => s.trim()).filter(Boolean),enabled:data.has('enabled')});close();scope = 'personal';category = '';query = '';enabled = 'any';render();toast('技能已保存，启用并绑定后即可使用');break;
                case 'skill-ai': await api('skill.start',{modelId:str('modelId') || undefined,description:str('description'),categoryId:str('categoryId')});close();navigate('activity');toast('技能草稿正在生成，可在处理记录中查看');break;
                case 'skill-organize': await api('skill.organize',{id:form.dataset.id,categoryId:str('categoryId')});close();render();toast('技能分类已保存');break;
                case 'skill-category-editor': {const id = await api('skill.category.save',{id:form.dataset.id || undefined,name:str('name'),tone:str('tone')});category = id;query = '';close();render();toast('分类已保存');break;}
                case 'skill-binding': {const target = (form.dataset.scope === 'agent' ? state().agents : form.dataset.scope === 'team' ? state().teams : state().tasks).find(v => v.id === form.dataset.id);await api('resources.bind',{scope:form.dataset.scope,id:form.dataset.id,knowledgeIds:target?.knowledgeIds || [],skillIds:data.getAll('skills')});close();render();toast('技能选择已保存');break;}
            }
        })().catch(error => {const out = form.querySelector('[data-form-error]');if (out) out.textContent = error.message;toast(error.message);}).finally(() => {submit.disabled = false;});
    },true);
    return {view,edit,ai,binding};
}
