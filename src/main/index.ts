import {skillSourceUrl} from '../core/skills.js';
import { app, BrowserWindow, dialog, ipcMain, safeStorage, session, shell } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { Store, initialState, atomicWrite } from '../core/storage.js';
import { Workspaces } from '../core/workspace.js';
import { Vault } from '../core/vault.js';
import { Service } from '../core/service.js';
import { entityId } from '../core/schema.js';
import { zipWorkspace } from '../core/export.js';
let window: BrowserWindow | null = null, service: Service, quitting = false;
if (process.env.FORMA_DATA_DIR)
    app.setPath('userData', path.resolve(process.env.FORMA_DATA_DIR));
const renderer = pathToFileURL(path.join(__dirname, '../renderer/index.html')).href;
async function openWindow() { window = new BrowserWindow({ title: 'Forma', width: 1440, height: 940, minWidth: 720, minHeight: 640, backgroundColor: '#f6f7f3', webPreferences: { preload: path.join(__dirname, 'preload.js'), nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true } }); window.setMenuBarVisibility(false); window.webContents.setWindowOpenHandler(() => ({ action: 'deny' })); window.webContents.on('will-navigate', (event, url) => { if (url !== renderer)
    event.preventDefault(); }); window.webContents.on('will-attach-webview', event => event.preventDefault()); await window.loadURL(renderer); window.on('closed', () => { window = null; }); }
async function start() {
    const data = app.getPath('userData'), store = new Store(path.join(data, 'state.json'), initialState(path.join(data, 'workspaces')));
    await store.open();
    const vault = new Vault(path.join(data, 'credentials.enc.json'), { available: () => safeStorage.isAsyncEncryptionAvailable(), encrypt: s => safeStorage.encryptStringAsync(s), decrypt: async (b) => (await safeStorage.decryptStringAsync(Buffer.from(b))).result });
    await vault.open();
    service = new Service(store, vault, new Workspaces());
    await service.resources.initialize();
    store.onChange = s => { if (window && !window.isDestroyed())
        window.webContents.send('forma:state', s); };
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    ipcMain.handle('forma:request', async (event, raw) => {
        try {
            if (event.sender !== window?.webContents || event.senderFrame?.url !== renderer)
                throw new Error('请求来源不受信任');
            const request = z.object({ action: z.string().max(80), payload: z.unknown().optional() }).parse(raw);
            if(request.action==='skill.openSource'){const id=entityId.parse(request.payload);await shell.openExternal(skillSourceUrl(store.snapshot().skills?.find(s=>s.id===id)));return{ok:true,data:true};}
            if(request.action==='knowledge.chooseDirectory'){const v=z.object({name:z.string().min(1).max(100)}).parse(request.payload);const result=await dialog.showOpenDialog(window!,{title:'选择知识资料目录（只读）',properties:['openDirectory']});if(result.canceled)return{ok:true,data:null};const dir=await fs.realpath(result.filePaths[0]);const id=await service.resources.createLibrary(v.name,dir);await service.resources.sync(id);return{ok:true,data:id};}
            if(request.action==='knowledge.importFiles'){const id=entityId.parse(request.payload);service.resources.library(id);const result=await dialog.showOpenDialog(window!,{title:'导入知识资料',properties:['openFile','multiSelections'],filters:[{name:'文档',extensions:['md','txt','csv','json','pdf','docx','html']}]});return{ok:true,data:result.canceled?null:await service.resources.importFiles(id,result.filePaths)};}
            if (request.action === 'workspace.chooseRoot') {
                const result = await dialog.showOpenDialog(window!, { title: '选择新任务的工作空间根目录', properties: ['openDirectory', 'createDirectory'] });
                if (!result.canceled) {
                    const real = await fs.realpath(result.filePaths[0]);
                    await store.change(s => { s.settings.workspaceRoot = real; });
                }
                return { ok: true, data: !result.canceled };
            }
            if (request.action === 'workspace.open') {
                const task = service.engine.get(entityId.parse(request.payload));
                const error = await shell.openPath(task.workspace.path);
                if (error)
                    throw new Error(error);
                return { ok: true, data: true };
            }
            if (request.action === 'workspace.export') {
                const task = service.engine.get(entityId.parse(request.payload));
                const result = await dialog.showSaveDialog(window!, { title: '导出工作空间', defaultPath: task.workspace.name.replace(/[\\/:*?"<>|]/g, '-') + '.zip', filters: [{ name: 'ZIP', extensions: ['zip'] }] });
                if (!result.canceled && result.filePath)
                    await atomicWrite(result.filePath, zipWorkspace(task));
                return { ok: true, data: !result.canceled };
            }
            if (request.action === 'file.export') {
                const v = z.object({ taskId: entityId, fileId: entityId, version: z.number().int().min(1) }).parse(request.payload), t = service.engine.get(v.taskId), file = t.workspace.files.find(f => f.id === v.fileId), version = file?.versions.find(x => x.number === v.version);
                if (!file || !version)
                    throw new Error('文件版本不存在');
                const result = await dialog.showSaveDialog(window!, { defaultPath: path.basename(file.path) });
                if (!result.canceled && result.filePath)
                    await atomicWrite(result.filePath, version.content);
                return { ok: true, data: !result.canceled };
            }
            if (request.action === 'task.resume' && service.engine.get(entityId.parse(request.payload)).interrupted) {
                const answer = await dialog.showMessageBox(window!, { type: 'question', message: '上次执行被中断', detail: '继续会重新执行未完成的步骤。请先检查成员目录中的已有改动，外部操作无法自动撤销。', buttons: ['取消', '继续执行'], defaultId: 0, cancelId: 0 });
                if (answer.response !== 1)
                    return { ok: true, data: false };
            }
            return { ok: true, data: await service.dispatch(request) };
        }
        catch (error) {
            return { ok: false, error: error instanceof z.ZodError ? '输入内容不完整或格式错误' : error instanceof Error ? error.message : '操作失败' };
        }
    });
    await openWindow();
    app.on('activate', () => { if (!window)
        void openWindow(); });
}
app.whenReady().then(start).catch(error => { dialog.showErrorBox('Forma 无法启动', error instanceof Error ? error.message : '本地数据读取失败'); app.exit(1); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin')
    app.quit(); });
app.on('before-quit', event => { if (!quitting && service) {
    event.preventDefault();
    quitting = true;
    void Promise.all([service.resources.shutdown(),service.engine.shutdown()]).finally(() => app.quit());
} });
