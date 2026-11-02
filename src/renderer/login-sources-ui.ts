const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]!));
type Source = {engine:'codex'|'claude'|'magpie';status:string;authMode:string;message:string;models:{id:string;name:string}[]};

export function loginSourcesUI(api:(a:string,p?:unknown)=>Promise<any>, modal:(t:string,b:string)=>void, close:()=>void, toast:(s:string)=>void, navigate:(p:string)=>void) {
    let sequence = 0;
    async function discover() {
        const marker = 'login-discovery-' + ++sequence;
        modal('发现本机登录源', `<div class="modal-body" id="${marker}" role="status"><p>正在检查 Codex、Claude Code 的登录状态和本机 Magpie 网关…</p><p class="help">仅检查状态和模型目录，不发起生成，不复制登录令牌。检查最多约 10 秒。</p></div>`);
        try {
            const sources: Source[] = await api('models.discoverLogins');
            if (!document.getElementById(marker)) return;
            modal('本机登录源', `<div class="modal-body"><p class="help">选择模型加入模型中心后，即可作为默认模型或分配给自建 Agent。CLI 登录源由原工具执行；跨原生工具路由使用 Magpie 网关模型。</p>${sources.map(s => `<section class="knowledge-choice"><div class="row between"><h3>${s.engine === 'codex' ? 'Codex' : s.engine === 'claude' ? 'Claude Code' : 'Magpie 网关'}</h3><span class="pill ${s.status === 'signed-in' ? 'green' : ''}">${s.status === 'signed-in' ? (s.authMode === 'subscription' ? '已登录 · 订阅' : s.authMode === 'api-key' ? '原工具 API 认证' : '可用来源') : s.status === 'signed-out' ? '未登录' : '未确认可用'}</span></div><p class="help">${esc(s.message)}</p>${s.models.length ? `<label class="form-label">模型<select class="field" data-login-select="${s.engine}">${s.models.map(m => `<option value="${esc(m.id)}">${esc(m.name)}${m.name !== m.id && m.id !== '__cli_default__' ? ' · ' + esc(m.id) : ''}</option>`).join('')}</select></label><button type="button" class="btn primary" data-lact="import" data-engine="${s.engine}">加入模型中心</button>` : ''}</section>`).join('')}<p class="help">登录、退出及认证刷新由原工具管理。模型列表不代表额度或调用已通过验证。</p><button type="button" class="btn" data-lact="discover">重新检查</button></div>`);
        } catch (error) {
            if (document.getElementById(marker)) modal('登录源检查失败', `<div class="modal-body"><p role="alert">${esc((error as Error).message)}</p><button type="button" class="btn primary" data-lact="discover">重试检查</button></div>`);
        }
    }
    document.addEventListener('click', e => {
        const el = (e.target as Element).closest<HTMLButtonElement>('[data-lact]');
        if (!el) return;
        void (async () => {
            if (el.dataset.lact === 'discover') await discover();
            else if (el.dataset.lact === 'import') {
                const select = document.querySelector<HTMLSelectElement>(`[data-login-select="${el.dataset.engine}"]`);
                if (!select) return;
                el.disabled = true;
                el.textContent = '正在验证并接入…';
                try {
                    await api('model.importLogin', {engine:el.dataset.engine, modelId:select.value});
                    close();
                    navigate('models');
                    toast('已加入模型中心，可设置默认或分配给 Agent');
                } finally {
                    el.disabled = false;
                    el.textContent = '加入模型中心';
                }
            }
        })().catch(error => toast(error.message));
    });
}
