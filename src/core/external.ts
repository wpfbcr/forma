import { spawn } from 'node:child_process';
import { promises as fs, constants } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { AgentCall, Detection } from './types.js';
type Command = {
    file: string;
    prefix: string[];
};
export async function findCommand(engine: 'codex' | 'claude'): Promise<Command | null> {
    const dirs = [...(process.env.PATH || '').split(path.delimiter), path.join(os.homedir(), '.local', 'bin'), '/opt/homebrew/bin', '/usr/local/bin'];
    const nvm = path.join(os.homedir(), '.nvm', 'versions', 'node');
    try {
        const versions = await fs.readdir(nvm);
        dirs.push(...versions.sort().reverse().map(v => path.join(nvm, v, 'bin')));
    }
    catch { }
    if (process.env.APPDATA)
        dirs.push(path.join(process.env.APPDATA, 'npm'));
    for (const dir of [...new Set(dirs.filter(Boolean))])
        for (const ext of process.platform === 'win32' ? ['.exe', '.cmd', ''] : ['']) {
            const candidate = path.join(dir, engine + ext);
            try {
                await fs.access(candidate, process.platform === 'win32' ? constants.F_OK : constants.X_OK);
                if (ext === '.cmd') {
                    const entry = path.join(dir, 'node_modules', engine === 'codex' ? '@openai/codex/bin/codex.js' : '@anthropic-ai/claude-code/cli.js');
                    await fs.access(entry);
                    const node = dirs.map(d => path.join(d, 'node.exe'));
                    for (const bin of node)
                        try {
                            await fs.access(bin);
                            return { file: bin, prefix: [entry] };
                        }
                        catch { }
                    continue;
                }
                return { file: candidate, prefix: [] };
            }
            catch { }
        }
    return null;
}
export function capture(command: Command, args: string[], input: string, options: {
    cwd?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    includeStderr?:boolean;allowNonZero?:boolean;env?:NodeJS.ProcessEnv;
} = {}): Promise<string> {
    return new Promise((resolve, reject) => {
        if (options.signal?.aborted) {
            reject(new Error('执行已停止'));
            return;
        }
        const child = spawn(command.file, [...command.prefix, ...args], { cwd: options.cwd, env: options.env||process.env, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true, shell: false, detached: process.platform !== 'win32' });
        let output = '', size = 0, settled = false;
        let killTimer: ReturnType<typeof setTimeout> | undefined;
        const kill = () => { if (!child.pid)
            return; const pid = child.pid; try {
            if (process.platform === 'win32')
                spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }).on('error', () => child.kill());
            else {
                process.kill(-pid, 'SIGTERM');
                killTimer = setTimeout(() => { try {
                    process.kill(-pid, 'SIGKILL');
                }
                catch { } }, 1000);
                killTimer.unref();
            }
        }
        catch {
            child.kill();
        } };
        const finish = (error?: Error, result?: string) => { if (settled)
            return; settled = true; clearTimeout(timer); options.signal?.removeEventListener('abort', abort); error ? reject(error) : resolve(result || ''); };
        const abort = () => { kill(); finish(new Error('执行已停止')); };
        const timer = setTimeout(() => { kill(); finish(new Error('本机 Agent 执行超时，请检查登录状态与任务范围')); }, options.timeoutMs || 300000);
        options.signal?.addEventListener('abort', abort, { once: true });
        child.stdout.on('data', chunk => { size += chunk.length; if (size > 8 * 1024 * 1024) {
            kill();
            finish(new Error('本机 Agent 输出超过限制'));
        }
        else
            output += chunk.toString(); });
        child.stderr.on('data', chunk => {if(options.includeStderr){size+=chunk.length;if(size>1024*1024){kill();finish(new Error('状态输出超过限制'));}else output+=chunk.toString();}}); // Do not persist inherited credentials or raw diagnostic output.
        child.on('error', () => finish(new Error('无法启动本机 Agent，请检查安装与执行权限')));
        child.on('close', code => { clearTimeout(killTimer); finish(code === 0||options.allowNonZero ? undefined : new Error(`本机 Agent 退出（${code ?? '终止'}），请在终端确认登录和版本`), output); });
        child.stdin.on('error', () => { });
        child.stdin.end(input);
    });
}
export async function detectAgents(): Promise<Detection[]> { return Promise.all((['codex', 'claude'] as const).map(async (engine) => { const command = await findCommand(engine); if (!command)
    return { engine, installed: false }; try {
    const version = (await capture(command, ['--version'], '', { timeoutMs: 5000 })).trim().slice(0, 160);
    return { engine, installed: true, path: command.file, version };
}
catch {
    return { engine, installed: false, path: command.file, error: '已找到程序，但版本检查失败' };
} })); }
export function parseCodex(output: string) { let result = ''; for (const line of output.split('\n')) {
    if (!line.trim())
        continue;
    let event;
    try {
        event = JSON.parse(line);
    }
    catch {
        continue;
    }
    if (event.type === 'turn.failed' || event.type === 'error')
        throw new Error('Codex 执行失败，请检查其登录状态与服务配置');
    if (event.type === 'item.completed' && event.item?.type === 'agent_message')
        result = event.item.text;
} if (!result)
    throw new Error('Codex 未返回最终文本，请检查版本兼容性'); return result; }
export function parseClaude(output: string) { let value; try {
    value = JSON.parse(output);
}
catch {
    throw new Error('Claude Code 未返回有效 JSON');
} if (value.is_error)
    throw new Error('Claude Code 执行失败，请检查其登录状态与服务配置'); if (typeof value.result !== 'string' || !value.result.trim())
    throw new Error('Claude Code 未返回最终文本'); return value.result; }
export function externalInvocation(call: AgentCall, inherited: NodeJS.ProcessEnv = process.env) {
    const engine = call.agent.engine;
    if (engine === 'builtin') throw new Error('无效执行器');
    const writes = call.allowWrites && call.agent.tools.includes('write_files');
    const args = engine === 'codex'
        ? ['exec', '--json', '--color', 'never', '--sandbox', writes ? 'workspace-write' : 'read-only', '--skip-git-repo-check', '--ephemeral', '-C', call.cwd]
        : ['-p', '--output-format', 'json', '--no-session-persistence', '--permission-mode', 'dontAsk', '--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}', '--settings', '{"disableAllHooks":true}', '--tools', writes ? 'Read,Glob,Grep,Write,Edit' : call.agent.tools.includes('read_files') ? 'Read,Glob,Grep' : '', '--allowedTools', writes ? 'Read,Glob,Grep,Write,Edit' : 'Read,Glob,Grep'];
    const env = {...inherited}, selected = call.model;
    if (selected?.source === 'magpie') {
        if (selected.endpoint !== 'http://127.0.0.1:3425/v1') throw new Error('网关来源只允许已发现的本机 Magpie 地址');
        if (engine === 'codex') {
            args.push('-c', 'model_provider="forma_magpie"', '-c', 'model_providers.forma_magpie={name="Forma Magpie",base_url="http://127.0.0.1:3425/v1",wire_api="responses",env_key="FORMA_MAGPIE_KEY",supports_websockets=false}', '--model', selected.model);
            env.FORMA_MAGPIE_KEY = 'magpie';
        } else {
            delete env.CLAUDE_CODE_OAUTH_TOKEN;
            delete env.ANTHROPIC_AUTH_TOKEN;
            env.ANTHROPIC_API_KEY = 'magpie';
            env.ANTHROPIC_BASE_URL = 'http://127.0.0.1:3425';
            args.push('--model', selected.model);
        }
    } else if (selected?.source === engine && selected.model !== '__cli_default__') {
        args.push('--model', selected.model);
    }
    if (engine === 'codex') args.push('-');
    return {args, env};
}
export async function runExternal(call: AgentCall) {
    const engine = call.agent.engine;
    if (engine === 'builtin') throw new Error('无效执行器');
    const command = await findCommand(engine);
    if (!command) throw new Error(`未找到 ${engine}，请先安装并登录`);
    const {args, env} = externalInvocation(call);
    await call.onEvent(`调用本机 ${engine}，工作目录已隔离`);
    const result = await capture(command, args, call.system + '\n\n' + call.prompt, {cwd:call.cwd, signal:call.signal, env, timeoutMs:call.model?.timeoutMs});
    return engine === 'codex' ? parseCodex(result) : parseClaude(result);
}
