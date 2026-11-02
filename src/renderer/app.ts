import { resourceUI } from './resources-ui.js';
import { icon as I } from './icons.js';
import type { Agent, AppState, Detection, Memory, Model, Reply, Request, Task, Team, WorkspaceFile } from './types.js';
declare global {
    interface Window {
        forma: {
            request: (request: Request) => Promise<Reply>;
            onState: (cb: (state: AppState) => void) => () => void;
        };
    }
}
const app = document.getElementById('app')!, modal = document.getElementById('modal') as HTMLDialogElement;
let state: AppState, page = 'home', taskId = '', teamId = '', memberId = '', teamView = 'canvas', workspaceTab = 'files', mobileTab = 'chat', collapsed = false, agentFilter = 'all', query = '', toastTimer: ReturnType<typeof setTimeout>, previewId = '', previewVersion = 1, dragged = false;
const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const btn = (label: string, action: string, attrs = '', cls = '') => `<button type="button" class="btn ${cls}" data-act="${action}" ${attrs}>${label}</button>`;
const avatar = (a?: Agent, small = false) => `<span class="avatar ${esc(a?.tone || '')} ${small ? 'sm' : ''}">${esc(a?.mark || a?.name.slice(0, 1) || 'A')}</span>`;
const agent = (id: string) => state.agents.find(a => a.id === id);
const team = (id: string) => state.teams.find(t => t.id === id);
const task = () => state.tasks.find(t => t.id === taskId);
const modelName = (id: string) => state.models.find(m => m.id === id)?.name || '尚未配置';
const engineName = (value: string) => ({ builtin: '自建 Agent', codex: 'Codex', claude: 'Claude Code' }[value] || value);
const statusName = (value: string) => ({ running: '执行中', pausing: '正在暂停', paused: '已暂停', done: '本轮完成', stopped: '已停止', failed: '执行失败', pending: '待执行' }[value] || value);
function toast(text: string) { const el = document.getElementById('toast')!; el.textContent = text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500); }
async function api<T = unknown>(action: string, payload?: unknown): Promise<T> { const result = await window.forma.request({ action, payload }); if (!result.ok)
    throw new Error(result.error || '操作失败'); return result.data as T; }
function navigate(value: string) { page = value; localStorage.setItem('forma-view', JSON.stringify({ page, taskId, teamId })); render(); }
function showModal(title: string, body: string) { modal.innerHTML = `<div class="modal-head"><h2 id="modal-title">${title}</h2>${btn(I('close'), 'close', 'aria-label="关闭"', 'ghost icon')}</div>${body}`; if (!modal.open)
    modal.showModal(); }
function close() { modal.close(); }
const actions = (submit: string) => `<div class="modal-footer">${btn('取消', 'close')}<button class="btn primary" type="submit">${submit}</button></div>`;
const selectModels = (selected: string) => `<option value="">选择已配置的模型</option>${state.models.map(m => `<option value="${m.id}" ${m.id === selected ? 'selected' : ''}>${esc(m.name)} · ${esc(m.provider)}</option>`).join('')}`;
let renderedKey = '';
const resources=resourceUI(()=>state,api,showModal,close,render,toast);
function render() {
    if (!state)
        return;
    const key = JSON.stringify([page, taskId, teamId, memberId]);
    const preserve = key === renderedKey;
    const fields = preserve ? [...app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('form [name]')].map(el => ({ form: el.closest('form')?.id, name: el.name, value: el.value, checked: el instanceof HTMLInputElement ? el.checked : undefined, focused: el === document.activeElement, caret: el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.selectionStart : null })) : [];
    renderedKey = key;
    const input = document.getElementById('leader-message') as HTMLTextAreaElement | null, draft = input?.value, focused = input === document.activeElement, caret = input?.selectionStart, stream = document.querySelector('.dialogue-stream'), scrollTop = stream?.scrollTop || 0, nearBottom = stream ? stream.scrollHeight - stream.clientHeight - scrollTop < 80 : true;
    document.body.dataset.theme = state.theme;
    document.body.dataset.page = page;
    const titles: Record<string, string> = { home: '工作台', agents: '我的 Agent', teams: '我的团队', team: '团队画布', task: '任务工作空间', models: '模型中心', resources: '记忆与工具', settings: '设置', knowledge:'知识库',skills:'技能仓库' };
    app.innerHTML = `<div class="app"><aside class="sidebar"><div class="brand"><span class="logo"></span><span class="brand-name">forma</span></div><div class="workspace">${I('folder')}<span class="grow">我的个人空间</span><span class="pill" style="color:#b8c9b6;background:#ffffff0a">本地</span></div>${[['home', 'home', '工作台'], ['agents', 'agent', '我的 Agent'], ['teams', 'team', '我的团队'], ['models', 'model', '模型中心'], ['knowledge','book','知识库'], ['skills','spark','技能仓库'], ['resources', 'book', '记忆与工具']].map(([p, ic, label]) => `<button class="nav ${(page === p || page === 'task' && p === 'home' || page === 'team' && p === 'teams') ? 'active' : ''}" data-act="nav" data-page="${p}">${I(ic)}${label}</button>`).join('')}<div class="nav-label">YOUR SPACE, YOUR AGENTS</div><button class="nav" data-act="new-agent">${I('plus')}创建你的 Agent</button><div class="sidebar-bottom"><button class="nav ${page === 'settings' ? 'active' : ''}" data-act="nav" data-page="settings">${I('settings')}设置</button><div class="side-note">${I('shield')}数据保存在这台电脑</div></div></aside><div class="main"><header class="topbar"><div class="row">${btn(I('menu'), 'menu', 'aria-label="打开导航"', 'ghost icon mobile-menu')}<div class="breadcrumb">个人空间 <span>/</span><span>${titles[page]}</span></div></div><div class="top-actions">${btn(I('search'), 'search', 'aria-label="快速查找"', 'ghost icon')}<span class="pill">0.2 Alpha</span>${btn(I(state.theme === 'dark' ? 'sun' : 'moon'), 'theme', 'aria-label="切换主题"', 'ghost icon')}</div></header><main class="content" id="content">${view()}</main></div></div>`;
    for (const field of fields) {
        const el = [...app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('form [name]')].find(el => el.closest('form')?.id === field.form && el.name === field.name);
        if (!el)
            continue;
        el.value = field.value;
        if (el instanceof HTMLInputElement && field.checked !== undefined)
            el.checked = field.checked;
        if (field.focused) {
            el.focus({ preventScroll: true });
            if (field.caret !== null && (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) && !['number', 'checkbox', 'radio'].includes(el.type))
                el.setSelectionRange(field.caret, field.caret);
        }
    }
    const next = document.getElementById('leader-message') as HTMLTextAreaElement | null;
    if (next && preserve) {
        next.value = draft || '';
        if (focused) {
            next.focus({ preventScroll: true });
            next.setSelectionRange(caret || 0, caret || 0);
        }
    }
    const nextStream = document.querySelector('.dialogue-stream');
    if (nextStream)
        nextStream.scrollTop = nearBottom ? nextStream.scrollHeight : scrollTop;
    if (page === 'team')
        requestAnimationFrame(drawEdges);
}
function view() { if(page==='knowledge')return resources.knowledge();if(page==='skills')return resources.skills(); if (page === 'agents')
    return agentsView(); if (page === 'models')
    return modelsView(); if (page === 'teams')
    return teamsView(); if (page === 'team')
    return teamViewHTML(); if (page === 'resources')
    return resourcesView(); if (page === 'settings')
    return settingsView(); if (page === 'task')
    return taskView(); return homeView(); }
function homeView() { const ready = state.agents.length > 0; return `<section class="hero"><div class="eyebrow">A LITTLE SPACE FOR BIG IDEAS</div><h1>今天，想完成什么？</h1><p>交给你打造的 Agent，让想法在协作中成为成果。</p><div class="hero-mark"><span class="ring"></span><span class="ring"></span></div><form id="new-task" class="composer"><label class="sr-only" for="task-goal">任务目标</label><textarea id="task-goal" name="title" placeholder="描述一个目标，让 Leader 组织团队完成…" required maxlength="12000"></textarea><div class="workspace-start">${I('folder')}<label for="workspace-name">本次工作空间</label><input id="workspace-name" name="workspaceName" placeholder="按任务目标命名，也可以自己填写" maxlength="100"></div><div class="composer-footer"><select class="inline-select" name="executor" aria-label="执行团队或 Agent" required><option value="">选择团队或 Agent</option><optgroup label="我的团队">${state.teams.map(t => `<option value="team:${t.id}">${esc(t.name)}</option>`).join('')}</optgroup><optgroup label="单个 Agent">${state.agents.map(a => `<option value="agent:${a.id}">${esc(a.name)}</option>`).join('')}</optgroup></select><button class="btn primary" type="submit" ${ready ? '' : 'disabled'}>开始任务 ${I('arrow')}</button></div></form></section>${!ready ? `<div class="notice">${I('info')}先创建一个自建 Agent，或接入已经安装的 Codex、Claude Code。首次任务会建立真实工作目录。</div><div class="row wrap">${btn(I('plus') + '创建我的 Agent', 'new-agent', '', 'primary')}${btn(I('terminal') + '接入已有 Agent', 'detect')}</div>` : ''}<div class="home-grid"><section><div class="section-head"><h2>最近的工作</h2><span class="small muted">${state.tasks.length} 个工作空间</span></div><div class="panel">${state.tasks.slice().sort((a, b) => b.updated - a.updated).map(t => `<div class="task-row" role="button" tabindex="0" data-act="task" data-id="${t.id}"><span class="avatar sm">${I('file')}</span><div class="grow"><div class="task-title">${esc(t.title)}</div><div class="meta">${esc(t.teamName)} · ${new Date(t.updated).toLocaleDateString()} · ${t.rounds.length} 轮</div></div><span class="pill ${t.status === 'failed' ? 'orange' : 'green'}">${statusName(t.status)}</span>${I('chevron')}</div>`).join('') || '<div class="empty">新的工作，从上面的目标开始。</div>'}</div></section><section><div class="section-head"><h2>我的团队</h2>${btn('全部 ' + I('arrow'), 'nav', 'data-page="teams"', 'ghost sm')}</div><div class="panel">${state.teams.slice(0, 3).map(t => `<div class="team-shortcut" role="button" tabindex="0" data-act="team" data-id="${t.id}"><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><div class="row between"><div class="av-stack">${t.members.slice(0, 5).map(id => avatar(agent(id), true)).join('')}</div><span class="small muted">${t.members.length} 位成员</span></div></div>`).join('') || '<div class="empty">把你的 Agent 组合成团队。</div>'}</div></section></div>`; }
function agentsView() { const list = state.agents.filter(a => (agentFilter === 'all' || a.source === agentFilter) && (a.name + a.role).toLowerCase().includes(query.toLowerCase())); return `<div class="page-head"><div><div class="eyebrow">BUILT BY YOU</div><h1>我的 Agent</h1><p>定义职责、模型、记忆和工具，或接入本机成熟 Agent。</p></div><div class="row wrap">${btn(I('terminal') + '接入已有 Agent', 'detect')}${btn(I('plus') + '创建 Agent', 'new-agent', '', 'primary')}</div></div><div class="filters"><div class="segmented">${[['all', '全部'], ['custom', '我创建的'], ['external', '已接入']].map(([v, l]) => `<button class="${agentFilter === v ? 'active' : ''}" data-act="filter" data-value="${v}">${l}</button>`).join('')}</div><label class="input-search">${I('search')}<input id="agent-search" placeholder="搜索名称与职责" value="${esc(query)}" aria-label="搜索 Agent"></label></div><div class="grid">${list.map(a => `<article class="agent-card"><div class="row between">${avatar(a)}<span class="pill ${a.source === 'custom' ? 'green' : ''}">${engineName(a.engine)}</span></div><h3>${esc(a.name)}</h3><p class="desc">${esc(a.role)}</p><div class="card-model">${I(a.source === 'custom' ? 'model' : 'terminal')}${a.source === 'custom' ? esc(modelName(a.model)) : '使用原 Agent 的模型配置'}</div><div class="card-foot"><span>${state.teams.filter(t => t.members.includes(a.id)).length} 个团队</span><div class="row"><button class="btn ghost sm" data-ract="binding" data-scope="agent" data-id="${a.id}">知识与技能</button>${btn('配置', 'edit-agent', `data-id="${a.id}"`, 'ghost sm')}${btn(I('trash'), 'delete-agent', `data-id="${a.id}" aria-label="删除 ${esc(a.name)}"`, 'ghost icon sm')}</div></div></article>`).join('')}<button class="add-card" data-act="new-agent">${I('plus')}<strong>下一位搭档，由你定义</strong><span>自建 Agent 与本机工具都属于你</span></button></div>`; }
function modelsView() { return `<div class="page-head"><div><div class="eyebrow">THE RIGHT MODEL FOR THE JOB</div><h1>模型中心</h1><p>填写自己的服务商与模型，密钥独立加密保存在本机。</p></div>${btn(I('plus') + '添加模型', 'new-model', '', 'primary')}</div><div class="notice">${I('info')}支持 OpenAI 兼容 Chat Completions 和 Anthropic Messages。测试连接会产生一次简短的真实调用；本地服务可不填密钥。</div><div class="panel">${state.models.map(m => `<div class="model-row"><span class="avatar">${I('model')}</span><div class="grow"><h3>${esc(m.name)}</h3><p>${esc(m.provider)} · ${esc(m.model)}</p><p>${esc(m.endpoint)}</p></div><span class="pill ${m.status === 'ready' ? 'green' : ''}">${m.status === 'ready' ? '文本调用已验证' : m.status === 'failed' ? '测试失败' : '尚未测试'}</span>${btn('测试连接', 'test-model', `data-id="${m.id}"`, 'sm')}${btn(I('edit'), 'edit-model', `data-id="${m.id}" aria-label="编辑 ${esc(m.name)}"`, 'ghost icon')}</div>`).join('') || '<div class="empty">还没有模型连接。也可以直接接入本机已有 Agent。</div>'}</div>`; }
function teamsView() { return `<div class="page-head"><div><div class="eyebrow">BETTER TOGETHER</div><h1>我的团队</h1><p>选择成员、指定 Leader，自定义协作职责。</p></div><div class="row">${btn(I('canvas') + '画布创建', 'new-team', 'data-view="canvas"')}${btn(I('plus') + '快捷创建', 'new-team', 'data-view="list"', 'primary')}</div></div><div class="grid">${state.teams.map(t => `<article class="panel team-card"><div class="row between"><span class="avatar">${I('team')}</span><span class="pill">${t.members.length} 位成员</span></div><h2 style="margin-top:16px">${esc(t.name)}</h2><p>${esc(t.description)}</p><div class="row between"><div class="av-stack">${t.members.map(id => avatar(agent(id), true)).join('')}</div><span class="small muted">Leader · ${esc(agent(t.leader)?.name)}</span></div><div class="row between team-bottom"><button class="btn ghost sm" data-ract="binding" data-scope="team" data-id="${t.id}">资源</button>${btn('编辑团队', 'team', `data-id="${t.id}"`, 'ghost sm')}${btn('开始工作 ' + I('arrow'), 'run-team', `data-id="${t.id}"`, 'sm')}</div></article>`).join('')}<button class="add-card" data-act="new-team">${I('plus')}<strong>创建自己的团队</strong><span>从你的 Agent 库挑选成员</span></button></div>`; }
function teamPosition(t: Team, id: string) { if (t.positions[id])
    return t.positions[id]; if (id === t.leader)
    return { x: 275, y: 35 }; const i = t.members.filter(a => a !== t.leader).indexOf(id); return { x: 28 + (i % 3) * 240, y: 220 + Math.floor(i / 3) * 150 }; }
function teamViewHTML() { const t = team(teamId); if (!t)
    return '<div class="empty">团队不存在。</div>'; if (!t.members.includes(memberId))
    memberId = t.leader; const a = agent(memberId)!; return `<div class="page-head"><div><h1>${esc(t.name)}</h1><p>${esc(t.description)}</p></div><div class="row wrap">${btn('团队设置', 'edit-team', `data-id="${t.id}"`)}${btn('运行团队 ' + I('play'), 'run-team', `data-id="${t.id}"`, 'primary')}</div></div><div class="row between"><div class="segmented"><button class="${teamView === 'canvas' ? 'active' : ''}" data-act="team-view" data-value="canvas">画布</button><button class="${teamView === 'list' ? 'active' : ''}" data-act="team-view" data-value="list">快捷列表</button></div>${btn('自动布局', 'arrange', '', 'ghost sm')}</div><div class="team-editor"><section class="canvas-shell"><div class="canvas-top"><span class="small muted">汇报关系 · 成员向 Leader 提交</span>${btn(I('plus') + '添加成员', 'edit-team', `data-id="${t.id}"`, 'sm')}</div>${teamView === 'canvas' ? `<div class="canvas-wrap"><div class="canvas-stage" id="canvas-stage" style="height:${Math.max(440, 230 + Math.ceil((t.members.length - 1) / 3) * 150)}px"><svg class="edges" id="edges"></svg>${t.members.map(id => { const a = agent(id)!, p = teamPosition(t, id); return `<button class="node ${id === memberId ? 'selected' : ''}" data-node="${id}" data-act="member" data-id="${id}" style="left:${p.x}px;top:${p.y}px"><div class="row">${avatar(a, true)}<div><strong class="node-name">${esc(a.name)}</strong><div class="small muted">${engineName(a.engine)}</div></div></div><div class="node-role"><span>${esc((t.roles[id] || a.role).slice(0, 25))}</span>${id === t.leader ? '<span class="pill green">LEADER</span>' : ''}</div></button>`; }).join('')}</div></div>` : `<div class="member-list">${t.members.map(id => `<div class="member-line">${avatar(agent(id), true)}<div class="grow"><h3>${esc(agent(id)?.name)}</h3><span class="small muted">${esc(t.roles[id] || agent(id)?.role)}</span></div>${btn('配置', 'member', `data-id="${id}"`, 'sm')}</div>`).join('')}</div>`}<div class="canvas-caption">点击编辑职责，拖动节点调整布局。运行任务时保留团队配置快照。</div></section><aside class="panel inspector"><div class="inspect-top">${avatar(a)}<h3>${esc(a.name)}</h3><p class="small muted">此团队中的职责</p></div><form id="member-form"><label class="form-label">工作职责<textarea class="field" name="role" required>${esc(t.roles[a.id] || a.role)}</textarea></label><label class="form-label">模型<select class="field" name="model" ${a.source === 'external' ? 'disabled' : ''}>${a.source === 'external' ? '<option>沿用 Agent 自身配置</option>' : selectModels(t.models[a.id] || a.model)}</select></label><button class="btn primary" type="submit">保存成员配置</button></form></aside></div>`; }
function resourcesView() { return `<div class="page-head"><div><div class="eyebrow">CONTEXT THAT STAYS WITH YOU</div><h1>记忆与工具</h1><p>记忆由你选择附加到 Agent 或任务，工作空间之间独立。</p></div>${btn(I('plus') + '添加记忆', 'new-memory', '', 'primary')}</div><div class="resource-layout"><section class="panel">${state.memories.map(m => `<article class="memory-item"><div class="row between"><h3>${esc(m.title)}</h3>${btn(I('edit'), 'edit-memory', `data-id="${m.id}" aria-label="编辑记忆"`, 'ghost icon')}</div><span class="pill">${m.scope === 'personal' ? '个人偏好' : '工作约定'}</span><p>${esc(m.body)}</p></article>`).join('') || '<div class="empty">添加希望长期保留的偏好或工作约定。</div>'}</section><section class="panel"><div class="tool-item">${I('folder')}<div><h3>工作目录文件工具</h3><p class="small muted">列出、读取文件；写入需同时开启全局和 Agent 权限。</p></div></div><div class="tool-item">${I('terminal')}<div><h3>本机成熟 Agent</h3><p class="small muted">沿用自身认证。Codex 使用自身沙箱；Claude Code 使用限定工具集合。</p></div></div><div class="tool-item">${I('info')}<p class="small muted">搜索服务、MCP 与通用命令工具尚未开放。界面不会将未实现的能力标记为可用。</p></div></section></div>`; }
function settingsView() { return `<div class="page-head"><div><h1>设置</h1><p>本地优先，由你掌控。</p></div></div><form id="settings-form" class="panel settings-group"><h3>运行与存储</h3><div class="setting-line"><div><strong>工作空间根目录</strong><p style="overflow-wrap:anywhere">${esc(state.settings.workspaceRoot)}</p></div>${btn('更改目录', 'choose-root')}</div><div class="form-grid"><label class="form-label">最大并行成员数<input class="field" type="number" name="concurrency" min="1" max="4" value="${state.settings.concurrency}" required></label><label class="form-label">每次调用的工具次数上限<input class="field" type="number" name="maxToolCalls" min="1" max="20" value="${state.settings.maxToolCalls}" required></label></div><label class="check"><input type="checkbox" name="allowFileWrites" ${state.settings.allowFileWrites ? 'checked' : ''}>允许已获授权的 Agent 写入自己的工作目录</label><p class="help">仍需在每个 Agent 中启用写入。外部程序的权限边界取决于其自身实现，工作目录隔离不等于完整的操作系统隔离。</p><div class="row" style="margin-top:22px"><button class="btn primary" type="submit">保存设置</button></div></form><div class="notice">${I('info')}Forma 0.2 Alpha · 数据为本机文件存储。正式签名、跨平台完整验证和自动更新将在后续发布中完成。</div>`; }
function taskView() { const t = task(); if (!t)
    return '<div class="empty">请选择任务。</div>'; const r = t.rounds.at(-1)!, leader = t.members.find(a => a.id === t.leaderId)!; const phase = ['plan', 'members', 'review', 'done'].indexOf(r.phase); return `<div class="page-head task-heading"><div><h1 title="${esc(t.title)}">${esc(t.title)}</h1><p>${esc(t.teamName)} · 第 ${r.number} 轮 · ${statusName(t.status)}</p></div><div class="row page-actions wrap">${btn(I('folder') + (collapsed ? '展开空间' : '收起空间'), 'toggle-workspace', '', 'workspace-toggle')}${t.status === 'running' ? btn('暂停', 'pause') : t.status === 'pausing' ? '<span class="pill">正在收尾</span>' : ['paused', 'failed'].includes(t.status) ? btn('继续', 'resume', '', 'primary') : ''}${['running', 'pausing', 'paused'].includes(t.status) ? btn('停止', 'stop') : ''}${btn(I('download') + '导出', 'export-workspace')}</div></div><div class="workspace-location" title="${esc(t.workspace.path)}">${I('folder')}<div class="grow"><strong>${esc(t.workspace.name)}</strong></div><span class="pill">${t.workspace.files.length} 个文件</span>${btn('打开目录', 'open-workspace', '', 'ghost sm')}</div><div class="segmented task-view-switch"><button class="${mobileTab === 'chat' ? 'active' : ''}" data-act="mobile" data-value="chat">与 Leader 对话</button><button class="${mobileTab === 'workspace' ? 'active' : ''}" data-act="mobile" data-value="workspace">工作空间</button></div><div class="task-workspace show-${mobileTab} ${collapsed ? 'focus-mode' : ''}"><section class="panel leader-panel"><div class="leader-header">${avatar(leader, true)}<div class="grow"><h3>${esc(leader.name)}</h3><span class="small muted">Team Leader · 分派、协调与交付</span></div><span class="pill green">持续对话</span></div><div class="stage-strip">${['规划分工', '成员执行', '审阅验收', '成果交付'].map((l, i) => `<div class="stage-item ${phase > i ? 'complete' : ''} ${phase === i ? 'active' : ''}"><b>${phase > i ? '✓' : i + 1}</b>${l}</div>`).join('')}</div>${t.error ? `<div class="pending-banner" role="alert">${esc(t.error)}</div>` : ''}<div class="dialogue-stream" aria-label="与 Leader 的完整对话">${t.chat.map((m, i) => `${!i || t.chat[i - 1].round !== m.round ? `<div class="round-divider">第 ${m.round} 轮 · ${m.round > 1 ? '沿用当前上下文' : '新任务'}</div>` : ''}<div class="dialogue-item ${m.role === 'user' ? 'user' : 'leader'}">${m.role === 'leader' ? avatar(leader, true) : ''}<div class="grow"><div class="dialogue-meta">${m.role === 'user' ? '你' : esc(leader.name) + ' · Leader'}<span>${new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div><div class="bubble"><p>${esc(m.text)}</p>${m.fileId ? `<button class="chat-file" data-act="file" data-id="${m.fileId}" data-version="${m.fileVersion}">${I('file')}<div class="grow"><strong>任务成果.md</strong><small>v${m.fileVersion} · 历史版本已保留</small></div>${I('chevron')}</button>` : ''}</div></div></div>`).join('')}${['running', 'pausing'].includes(t.status) ? '<div class="leader-typing"><span class="running-indicator"></span>正在执行，进度同步到工作空间…</div>' : ''}</div>${t.pending.length ? `<div class="pending-banner">${t.pending.length} 条补充要求等待当前轮结束</div>` : ''}<form id="leader-form" class="leader-composer"><label class="sr-only" for="leader-message">与 Team Leader 对话</label><textarea id="leader-message" name="message" placeholder="向 Leader 提问、补充要求，或告诉它下一步怎么改…" required maxlength="30000"></textarea><div class="row between"><div class="row">${btn(I('plus') + '资料', 'new-material', '', 'ghost sm')}<span class="context-chip">${I('book')}沿用 ${t.rounds.length} 轮上下文</span></div><button class="btn primary" type="submit">发送 ${I('up')}</button></div></form></section><aside class="panel workspace-inspector"><div class="workspace-inspector-header"><div class="row between"><h3>本次工作空间</h3>${btn(I('plus'), 'new-material', 'aria-label="添加任务资料"', 'ghost icon sm')}</div><p>真实文件 · 完整上下文 · 历史版本</p></div><div class="workspace-tabs">${[['files', '资料'], ['context', '上下文'], ['execution', '执行']].map(([v, l]) => `<button class="tab ${workspaceTab === v ? 'active' : ''}" data-act="workspace-tab" data-value="${v}">${l}</button>`).join('')}</div><div class="workspace-pane">${workspaceTab === 'files' ? filesView(t) : workspaceTab === 'context' ? contextView(t) : executionView(t)}</div><div class="workspace-bottom">${btn(I('download') + '导出完整工作空间', 'export-workspace', '', 'ghost sm')}</div></aside></div>`; }
function filesView(t: Task) { return [['input', '参考资料'], ['output', '交付成果'], ['work', '计划与过程'], ['context', '上下文快照'], ['conversation', '完整记录']].map(([kind, label]) => { const files = t.workspace.files.filter(f => f.kind === kind); return `<div class="workspace-folder"><div class="workspace-folder-title"><span>${label}</span><span>${files.length}</span></div>${files.map(f => `<button class="workspace-file" data-act="file" data-id="${f.id}">${I('file')}<span class="grow">${esc(f.path.split('/').at(-1))}<small>${esc(f.path)}</small></span><span class="version">v${f.versions.length}</span></button>`).join('') || '<div class="small muted" style="font-size:11px;padding:7px">暂无文件</div>'}</div>`; }).join(''); }
function contextView(t: Task) { const r = t.rounds.at(-1)!; return `<button class="btn sm" data-ract="binding" data-scope="task" data-id="${t.id}">选择知识与技能</button><div class="context-section"><h4>原始目标</h4><p>${esc(t.title)}</p></div><div class="context-section"><h4>本轮要求</h4><p>${esc(r.request)}</p></div><div class="context-section"><h4>上轮工作摘要</h4><p>${esc(r.context.summary || '初始任务')}</p></div><div class="context-stats"><span class="pill">${t.chat.length} 条消息</span><span class="pill">${r.context.materials.length} 份本轮资料</span></div><div class="context-section" style="margin-top:20px"><div class="row between"><h4>任务级记忆</h4>${btn('选择', 'task-memories', '', 'ghost sm')}</div><p>${t.contextMemoryIds.map(id => state.memories.find(m => m.id === id)?.title).filter(Boolean).map(esc).join('\n') || '未附加。仍保留当前任务的全部对话。'}</p></div><div class="context-scope">每轮保留启动时的上下文快照。成员收到各自的任务要求、资料与依赖结果；新增资料从下一轮开始使用。</div>`; }
function executionView(t: Task) { const r = t.rounds.at(-1)!; return `<div class="row between"><h3>第 ${r.number} 轮</h3><span class="pill">${statusName(t.status)}</span></div>${r.assignments.map(a => `<div class="execution-member"><div class="row">${avatar(t.members.find(m => m.id === a.agentId), true)}<strong class="grow">${esc(t.members.find(m => m.id === a.agentId)?.name)}</strong><span class="pill">${({ pending: '待执行', running: '执行中', done: '已提交', failed: '失败' })[a.status]}</span></div><p>${esc(a.task)}</p>${a.dependencies.length ? `<p>依赖：${a.dependencies.map(esc).join('、')}</p>` : ''}${a.error ? `<p style="color:var(--red)">${esc(a.error)}</p>` : ''}</div>`).join('') || '<p class="help">Leader 正在判断是否需要分工。</p>'}<div class="execution-log"><h4 class="small">最近记录</h4>${t.events.slice(-12).map(e => `<div class="log-line"><span class="log-time">${new Date(e.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><span>${esc(e.actor)} · ${esc(e.text)}</span></div>`).join('')}</div>`; }
function agentDialog(id = '', engine: 'builtin' | 'codex' | 'claude' = 'builtin') { const a = agent(id), source = a?.source || (engine === 'builtin' ? 'custom' : 'external'); engine = a?.engine || engine; showModal(id ? '配置 Agent' : '创建你的 Agent', `<form id="agent-form" data-id="${id}" data-source="${source}" data-engine="${engine}"><div class="modal-body"><div class="notice">${I(source === 'external' ? 'terminal' : 'agent')}${source === 'external' ? engineName(engine) + ' · 沿用本机认证与模型配置。安装状态不代表登录可用。' : '定义自己的角色，模型与工具由你选择。'}</div><div class="form-grid"><label class="form-label">名称<input class="field" name="name" value="${esc(a?.name || (source === 'external' ? engineName(engine) : ''))}" required maxlength="100"></label><label class="form-label">模型<select class="field" name="model" ${source === 'external' ? 'disabled' : ''}>${source === 'external' ? '<option value="">沿用自身配置</option>' : selectModels(a?.model || '')}</select></label></div><label class="form-label">职责与交付要求<textarea class="field" name="role" required maxlength="12000">${esc(a?.role || '')}</textarea></label><label class="form-label">工作方式<select class="field" name="mode">${['先计划后执行', '直接执行', '研究后回答', '审阅与反馈'].map(v => `<option ${a?.mode === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label class="form-label">文件工具 · 仅分配的工作目录</label><div class="checks">${[['read_files', '列出与读取文件'], ['write_files', '写入文件']].map(([v, l]) => `<label class="check"><input type="checkbox" name="tools" value="${v}" ${a?.tools.includes(v) ? 'checked' : ''}>${l}</label>`).join('')}</div><p class="help">写入还需在设置中开启全局权限。外部程序使用自身权限机制，Forma 不提供额外操作系统沙箱。</p><details><summary>附加记忆</summary>${state.memories.map(m => `<label class="context-check"><input type="checkbox" name="memories" value="${m.id}" ${a?.memoryIds.includes(m.id) ? 'checked' : ''}><span>${esc(m.title)}<small>${esc(m.body)}</small></span></label>`).join('') || '<p class="help">先在记忆与工具中添加记忆。</p>'}</details></div>${actions(id ? '保存配置' : '创建 Agent')}</form>`); }
async function detectDialog() { showModal('接入本机 Agent', '<div class="modal-body"><p class="muted">正在检查 Codex 与 Claude Code 的安装版本…</p></div>'); const results = await api<Detection[]>('agents.detect'); showModal('接入本机 Agent', `<div class="modal-body"><p class="small muted">只检查程序版本，不读取登录凭据，也不调用模型。</p>${results.map(d => `<div class="detected"><span class="avatar">${I('terminal')}</span><div class="grow"><h3>${engineName(d.engine)}</h3><p>${esc(d.installed ? d.version : d.error || '未找到安装')}</p><p style="overflow-wrap:anywhere">${esc(d.path || '')}</p></div>${btn('接入', 'connect', `data-engine="${d.engine}" ${d.installed ? '' : 'disabled'}`, 'sm')}</div>`).join('')}<p class="help" style="margin-top:16px">请先在终端完成安装和登录；检测成功后即可添加为个人 Agent。</p></div>`); }
function modelDialog(id = '') { const m = state.models.find(m => m.id === id); showModal(id ? '编辑模型' : '添加模型', `<form id="model-form" data-id="${id}"><div class="modal-body"><div class="form-grid"><label class="form-label">显示名称<input class="field" name="name" value="${esc(m?.name || '')}" required></label><label class="form-label">服务商名称<input class="field" name="provider" value="${esc(m?.provider || '')}" required></label></div><label class="form-label">协议<select class="field" name="protocol"><option value="openai-compatible" ${m?.protocol === 'openai-compatible' ? 'selected' : ''}>OpenAI 兼容 · Chat Completions</option><option value="anthropic" ${m?.protocol === 'anthropic' ? 'selected' : ''}>Anthropic · Messages</option></select></label><label class="form-label">服务地址（包含 /v1，不含具体接口）<input class="field" type="url" name="endpoint" value="${esc(m?.endpoint || '')}" placeholder="https://your-provider.example/v1" required></label><label class="form-label">模型标识<input class="field" name="model" value="${esc(m?.model || '')}" placeholder="填写服务商提供的 model ID" required></label><label class="form-label">API 密钥<input class="field" type="password" name="apiKey" autocomplete="new-password" placeholder="${m?.hasKey ? '已加密保存，留空保持不变' : '本地服务可留空'}"><div class="help">密钥不会回显，也不会写入工作空间或导出文件。</div></label><div class="form-grid"><label class="form-label">最大输出 token<input class="field" type="number" name="maxTokens" min="64" max="32768" value="${m?.maxTokens || 4096}" required></label><label class="form-label">单次请求超时（秒）<input class="field" type="number" name="timeout" min="5" max="600" value="${(m?.timeoutMs || 120000) / 1000}" required></label></div>${m?.hasKey ? btn('移除已保存的密钥', 'clear-key', `data-id="${id}"`, 'danger sm') : ''}</div>${actions('保存模型')}</form>`); }
function teamDialog(id = '') { if (!state.agents.length) {
    toast('请先创建或接入至少一个 Agent');
    return;
} const t = team(id); showModal(id ? '编辑团队' : '创建我的团队', `<form id="team-form" data-id="${id}"><div class="modal-body"><label class="form-label">团队名称<input class="field" name="name" value="${esc(t?.name || '')}" required></label><label class="form-label">团队目标<textarea class="field" name="description">${esc(t?.description || '')}</textarea></label><label class="form-label">Leader<select class="field" name="leader" required><option value="">由你指定负责人</option>${state.agents.map(a => `<option value="${a.id}" ${t?.leader === a.id ? 'selected' : ''}>${esc(a.name)} · ${engineName(a.engine)}</option>`).join('')}</select></label><label class="form-label">团队成员（Leader 会自动加入）</label><div class="checks">${state.agents.map(a => `<label class="check"><input type="checkbox" name="members" value="${a.id}" ${t?.members.includes(a.id) ? 'checked' : ''}>${esc(a.name)}</label>`).join('')}</div><p class="help" style="margin-top:15px">保存后在画布或列表中编辑职责。外部 Agent 担任 Leader 需要其模型能稳定返回分工 JSON。</p></div>${actions('保存团队')}</form>`); }
function memoryDialog(id = '') { const m = state.memories.find(m => m.id === id); showModal('编辑记忆', `<form id="memory-form" data-id="${id}"><div class="modal-body"><label class="form-label">标题<input class="field" name="title" value="${esc(m?.title || '')}" required></label><label class="form-label">类型<select class="field" name="scope"><option value="personal" ${m?.scope === 'personal' ? 'selected' : ''}>个人偏好</option><option value="workspace" ${m?.scope === 'workspace' ? 'selected' : ''}>工作约定</option></select></label><label class="form-label">内容<textarea class="field" name="body" required maxlength="20000">${esc(m?.body || '')}</textarea></label>${m ? btn('删除这条记忆', 'delete-memory', `data-id="${m.id}"`, 'danger sm') : ''}</div>${actions('保存记忆')}</form>`); }
function materialDialog() { showModal('添加任务资料', `<form id="material-form"><div class="modal-body"><label class="form-label">文件名<input class="field" name="name" placeholder="需求补充.md" required></label><label class="form-label">资料内容<textarea class="field" name="content" required maxlength="262144" style="min-height:180px"></textarea></label><p class="help">写入当前工作目录，并在下一轮上下文中使用。</p></div>${actions('保存资料')}</form>`); }
function memoryPicker() { const t = task()!; showModal('选择任务级记忆', `<form id="task-memory-form"><div class="modal-body">${state.memories.map(m => `<label class="context-check"><input type="checkbox" name="memories" value="${m.id}" ${t.contextMemoryIds.includes(m.id) ? 'checked' : ''}><span>${esc(m.title)}<small>${esc(m.body)}</small></span></label>`).join('') || '<p class="muted">先添加个人记忆。</p>'}<p class="help">这些记忆明确共享给当前任务，下一轮生效。</p></div>${actions('保存选择')}</form>`); }
function fileDialog(id: string, version?: number) { const f = task()?.workspace.files.find(f => f.id === id); if (!f)
    return; previewId = id; previewVersion = version || f.versions.length; const v = f.versions.find(v => v.number === previewVersion)!; showModal(esc(f.path.split('/').at(-1)), `<div class="modal-body"><div class="file-preview-tools"><span class="small muted">${esc(f.path)}</span><label>版本 <select class="inline-select" id="file-version">${f.versions.slice().reverse().map(v => `<option value="${v.number}" ${v.number === previewVersion ? 'selected' : ''}>v${v.number} · 第 ${v.round} 轮</option>`).join('')}</select></label></div><pre class="file-preview">${esc(v.content)}</pre></div><div class="modal-footer">${btn('关闭', 'close')}${btn(I('download') + '保存此版本', 'export-file', '', 'primary')}</div>`); }
function drawEdges() { const t = team(teamId), svg = document.getElementById('edges'), stage = document.getElementById('canvas-stage'); if (!t || !svg || !stage)
    return; const lead = stage.querySelector(`[data-node="${t.leader}"]`) as HTMLElement; const x = lead.offsetLeft + lead.offsetWidth / 2, y = lead.offsetTop + lead.offsetHeight; svg.innerHTML = t.members.filter(id => id !== t.leader).map(id => { const n = stage.querySelector(`[data-node="${id}"]`) as HTMLElement, tx = n.offsetLeft + n.offsetWidth / 2, ty = n.offsetTop, mid = (y + ty) / 2; return `<path class="edge" d="M ${x} ${y} C ${x} ${mid} ${tx} ${mid} ${tx} ${ty}"/>`; }).join(''); }
async function action(el: HTMLElement) {
    const id = el.dataset.id || '';
    switch (el.dataset.act) {
        case 'nav':
            navigate(el.dataset.page!);
            break;
        case 'menu':
            document.querySelector('.sidebar')?.classList.toggle('open');
            break;
        case 'close':
            close();
            break;
        case 'theme':
            await api('settings.save', { theme: state.theme === 'light' ? 'dark' : 'light', ...state.settings, workspaceRoot: undefined });
            break;
        case 'new-agent':
            agentDialog();
            break;
        case 'edit-agent':
            agentDialog(id);
            break;
        case 'detect':
            await detectDialog();
            break;
        case 'connect':
            agentDialog('', el.dataset.engine as 'codex' | 'claude');
            break;
        case 'delete-agent':
            if (confirm('删除这个 Agent？已开始的任务保留配置快照。'))
                await api('agent.delete', id);
            break;
        case 'filter':
            agentFilter = el.dataset.value!;
            render();
            break;
        case 'new-model':
            modelDialog();
            break;
        case 'edit-model':
            modelDialog(id);
            break;
        case 'test-model':
            el.setAttribute('disabled', '');
            try {
                await api('model.test', id);
                toast('文本调用成功；工具能力需通过实际任务验证');
            }
            finally {
                el.removeAttribute('disabled');
            }
            break;
        case 'clear-key':
            if (confirm('移除此模型的已保存密钥？')) {
                await api('model.clearKey', id);
                close();
            }
            break;
        case 'new-team':
            teamView = el.dataset.view || 'canvas';
            teamDialog();
            break;
        case 'edit-team':
            teamDialog(id);
            break;
        case 'team':
            teamId = id;
            memberId = team(id)?.leader || '';
            navigate('team');
            break;
        case 'member':
            if (!dragged) {
                memberId = id;
                render();
            }
            break;
        case 'team-view':
            teamView = el.dataset.value!;
            render();
            break;
        case 'arrange':
            await api('team.save', { ...team(teamId), positions: {} });
            break;
        case 'run-team':
            navigate('home');
            (document.querySelector('[name=executor]') as HTMLSelectElement).value = 'team:' + id;
            document.getElementById('task-goal')?.focus();
            break;
        case 'new-memory':
            memoryDialog();
            break;
        case 'edit-memory':
            memoryDialog(id);
            break;
        case 'delete-memory':
            if (confirm('删除这条记忆？历史任务快照仍保留原内容。')) {
                await api('memory.delete', id);
                close();
            }
            break;
        case 'choose-root':
            await api('workspace.chooseRoot');
            break;
        case 'task':
            taskId = id;
            mobileTab = 'chat';
            navigate('task');
            break;
        case 'pause':
            await api('task.pause', taskId);
            break;
        case 'stop':
            await api('task.stop', taskId);
            break;
        case 'resume':
            await api('task.resume', taskId);
            break;
        case 'mobile':
            mobileTab = el.dataset.value!;
            render();
            break;
        case 'toggle-workspace':
            collapsed = !collapsed;
            render();
            break;
        case 'workspace-tab':
            workspaceTab = el.dataset.value!;
            render();
            break;
        case 'new-material':
            materialDialog();
            break;
        case 'task-memories':
            memoryPicker();
            break;
        case 'file':
            fileDialog(id, Number(el.dataset.version) || undefined);
            break;
        case 'open-workspace':
            await api('workspace.open', taskId);
            break;
        case 'export-workspace':
            if (await api('workspace.export', taskId))
                toast('工作空间已导出');
            break;
        case 'export-file':
            if (await api('file.export', { taskId, fileId: previewId, version: previewVersion }))
                toast('文件已保存');
            break;
        case 'search':
            showModal('快速查找', `<div class="modal-body"><label class="input-search">${I('search')}<input id="global-search" placeholder="搜索任务、Agent 或团队" autofocus></label><div id="search-results">${searchResults('')}</div></div>`);
            break;
        case 'search-task':
            close();
            taskId = id;
            navigate('task');
            break;
        case 'search-team':
            close();
            teamId = id;
            navigate('team');
            break;
    }
}
function searchResults(q: string) { return [...state.agents.map(a => ({ name: a.name, action: 'edit-agent', id: a.id, type: 'Agent' })), ...state.teams.map(t => ({ name: t.name, action: 'search-team', id: t.id, type: '团队' })), ...state.tasks.map(t => ({ name: t.title, action: 'search-task', id: t.id, type: '任务' }))].filter(v => v.name.toLowerCase().includes(q.toLowerCase())).slice(0, 15).map(v => `<button class="command-item" data-act="${v.action}" data-id="${v.id}">${esc(v.name)}<small>${v.type}</small></button>`).join('') || '<div class="empty">没有匹配结果</div>'; }
document.addEventListener('click', e => { const target = (e.target as Element).closest<HTMLElement>('[data-act]'); if (target)
    void action(target).catch(e => toast(e.message)); });
document.addEventListener('input', e => { const input = e.target as HTMLInputElement; if (input.id === 'agent-search') {
    query = input.value;
    const caret = input.selectionStart;
    render();
    const next = document.getElementById('agent-search') as HTMLInputElement;
    next.focus();
    next.setSelectionRange(caret, caret);
} if (input.id === 'global-search')
    document.getElementById('search-results')!.innerHTML = searchResults(input.value); });
document.addEventListener('change', e => { const input = e.target as HTMLSelectElement; if (input.id === 'file-version')
    fileDialog(previewId, Number(input.value)); });
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const trigger = document.createElement('button');
    trigger.dataset.act = 'search';
    void action(trigger).catch(e => toast(e.message));
} if ((e.target as HTMLElement).id === 'leader-message' && e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    (e.target as HTMLTextAreaElement).form?.requestSubmit();
} if ((e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement).matches('[role=button][data-act]')) {
    e.preventDefault();
    void action(e.target as HTMLElement).catch(e => toast(e.message));
} });
document.addEventListener('submit', e => { e.preventDefault(); const form = e.target as HTMLFormElement, button = form.querySelector<HTMLButtonElement>('button[type=submit]'); if (button?.disabled)
    return; button?.setAttribute('disabled', ''); void submit(form).catch(e => toast(e.message)).finally(() => button?.removeAttribute('disabled')); });
async function submit(f: HTMLFormElement) {
    const d = new FormData(f), str = (k: string) => String(d.get(k) || '');
    switch (f.id) {
        case 'new-task':
            taskId = await api<string>('task.create', { title: str('title'), workspaceName: str('workspaceName'), executor: str('executor') });
            mobileTab = 'chat';
            navigate('task');
            break;
        case 'agent-form': {
            const old = agent(f.dataset.id || '');
            await api('agent.save', { id: f.dataset.id || undefined, name: str('name'), source: f.dataset.source, engine: f.dataset.engine, role: str('role'), model: str('model'), mode: str('mode'), tools: d.getAll('tools'), memoryIds: d.getAll('memories'), mark: old?.mark || str('name').slice(0, 1), tone: old?.tone || (f.dataset.source === 'external' ? 'dark' : 'purple') });
            close();
            navigate('agents');
            break;
        }
        case 'model-form':
            await api('model.save', { id: f.dataset.id || undefined, name: str('name'), provider: str('provider'), protocol: str('protocol'), endpoint: str('endpoint'), model: str('model'), apiKey: str('apiKey'), maxTokens: Number(str('maxTokens')), timeoutMs: Number(str('timeout')) * 1000 });
            (f.elements.namedItem('apiKey') as HTMLInputElement).value = '';
            close();
            navigate('models');
            break;
        case 'team-form': {
            const old = team(f.dataset.id || ''), members = [...new Set([str('leader'), ...d.getAll('members').map(String)])];
            const roles = { ...old?.roles };
            for (const id of members)
                roles[id] ??= agent(id)?.role || '';
            teamId = await api<string>('team.save', { id: f.dataset.id || undefined, name: str('name'), description: str('description'), leader: str('leader'), members, roles, models: old?.models || {}, positions: old?.positions || {} });
            close();
            navigate('team');
            break;
        }
        case 'member-form': {
            const t = team(teamId)!;
            await api('team.save', { ...t, roles: { ...t.roles, [memberId]: str('role') }, models: agent(memberId)?.source === 'custom' && str('model') ? { ...t.models, [memberId]: str('model') } : t.models });
            toast('成员配置已保存');
            break;
        }
        case 'memory-form':
            await api('memory.save', { id: f.dataset.id || undefined, title: str('title'), body: str('body'), scope: str('scope') });
            close();
            render();
            break;
        case 'settings-form':
            await api('settings.save', { theme: state.theme, concurrency: Number(str('concurrency')), maxToolCalls: Number(str('maxToolCalls')), allowFileWrites: d.has('allowFileWrites') });
            toast('设置已保存');
            break;
        case 'leader-form': {
            const message = str('message');
            await api('task.send', { taskId, message });
            (document.getElementById('leader-message') as HTMLTextAreaElement).value = '';
            break;
        }
        case 'material-form':
            await api('task.material', { taskId, name: str('name'), content: str('content') });
            close();
            toast('资料已写入工作空间，下一轮使用');
            break;
        case 'task-memory-form':
            await api('task.memories', { taskId, memoryIds: d.getAll('memories') });
            close();
            toast('任务级记忆已更新，下一轮使用');
            break;
    }
}
let drag: {
    node: HTMLElement;
    id: string;
    x: number;
    y: number;
    startX: number;
    startY: number;
} | null = null;
document.addEventListener('pointerdown', e => { const node = (e.target as Element).closest<HTMLElement>('[data-node]'); if (!node || e.button !== 0)
    return; dragged = false; drag = { node, id: node.dataset.node!, x: node.offsetLeft, y: node.offsetTop, startX: e.clientX, startY: e.clientY }; node.setPointerCapture(e.pointerId); });
document.addEventListener('pointermove', e => { if (!drag)
    return; const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY; if (Math.abs(dx) + Math.abs(dy) > 5)
    dragged = true; if (!dragged)
    return; const stage = document.getElementById('canvas-stage')!; drag.node.style.left = Math.max(5, Math.min(stage.clientWidth - 210, drag.x + dx)) + 'px'; drag.node.style.top = Math.max(5, Math.min(stage.clientHeight - 120, drag.y + dy)) + 'px'; drawEdges(); });
document.addEventListener('pointerup', () => { if (drag && dragged) {
    const t = team(teamId)!;
    void api('team.save', { ...t, positions: { ...t.positions, [drag.id]: { x: drag.node.offsetLeft, y: drag.node.offsetTop } } }).catch(e => toast(e.message));
} drag = null; setTimeout(() => dragged = false, 0); });
document.addEventListener('pointercancel', () => { drag = null; });
window.addEventListener('resize', () => { if (page === 'team')
    drawEdges(); });
async function boot() { if (!window.forma) {
    app.innerHTML = '<div class="empty">请通过 Forma 桌面应用打开。此界面需要本地运行服务。</div>';
    return;
} state = await api<AppState>('state.get'); try {
    const saved = JSON.parse(localStorage.getItem('forma-view') || '{}');
    if (saved.page === 'task' && state.tasks.some(t => t.id === saved.taskId)) {
        page = 'task';
        taskId = saved.taskId;
    }
}
catch { } window.forma.onState(next => { state = next; render(); }); render(); }
void boot().catch(e => { app.innerHTML = `<div class="empty">启动失败：${esc(e.message)}</div>`; });
