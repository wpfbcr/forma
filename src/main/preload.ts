import { contextBridge, ipcRenderer } from 'electron';
import type { AppState, Request, Reply } from '../core/types.js';
contextBridge.exposeInMainWorld('forma', {
    request: (request: Request): Promise<Reply> => ipcRenderer.invoke('forma:request', request),
    onState: (callback: (state: AppState) => void) => { const listener = (_event: unknown, state: AppState) => callback(state); ipcRenderer.on('forma:state', listener); return () => ipcRenderer.removeListener('forma:state', listener); }
});
