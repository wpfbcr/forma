export type Source = 'custom' | 'external';
export type TaskStatus = 'running' | 'pausing' | 'paused' | 'done' | 'stopped' | 'failed';
export interface Model {
    id: string;
    name: string;
    provider: string;
    protocol: 'openai-compatible' | 'anthropic';
    endpoint: string;
    model: string;
    maxTokens: number;
    timeoutMs: number;
    hasKey: boolean;
    status: 'untested' | 'ready' | 'failed';
}
export interface Agent {
    knowledgeIds?:string[]; skillIds?:string[];
    id: string;
    name: string;
    source: Source;
    engine: 'builtin' | 'codex' | 'claude';
    role: string;
    model: string;
    mode: string;
    tools: string[];
    memoryIds: string[];
    mark: string;
    tone: string;
}
export interface Team {
    knowledgeBindings?:KnowledgeBinding[]; inheritAgentKnowledge?:Record<string,boolean>; excludedKnowledgeIds?:Record<string,string[]>;
    knowledgeIds?:string[]; skillIds?:string[];
    id: string;
    name: string;
    description: string;
    leader: string;
    members: string[];
    roles: Record<string, string>;
    models: Record<string, string>;
    positions: Record<string, {
        x: number;
        y: number;
    }>;
}
export interface Memory {
    id: string;
    title: string;
    body: string;
    scope: 'personal' | 'workspace';
}
export interface Chat {
    id: string;
    role: 'user' | 'leader';
    text: string;
    time: string;
    round: number;
    fileId?: string;
    fileVersion?: number;
}
export interface FileVersion {
    number: number;
    round: number;
    time: string;
    content: string;
}
export interface WorkspaceFile {
    id: string;
    path: string;
    kind: 'input' | 'output' | 'work' | 'context' | 'conversation';
    versions: FileVersion[];
}
export interface Assignment {
    id: string;
    agentId: string;
    task: string;
    dependencies: string[];
    status: 'pending' | 'running' | 'done' | 'failed';
    result?: string;
    error?: string;
}
export interface RoundContext {
    resources?:ResourceContext;
    sharedMemoryIds?: string[];
    goal: string;
    request: string;
    summary: string;
    chat: Chat[];
    materials: {
        path: string;
        content: string;
    }[];
    memories: Memory[];
}
export interface Round {
    number: number;
    request: string;
    phase: 'plan' | 'members' | 'review' | 'done';
    context: RoundContext;
    assignments: Assignment[];
}
export interface Task {
    teamKnowledgeBindings?:KnowledgeBinding[];
    knowledgeBindings?:KnowledgeBinding[]; inheritAgentKnowledge?:Record<string,boolean>; excludedKnowledgeIds?:Record<string,string[]>;
    knowledgeIds?:string[]; skillIds?:string[];
    id: string;
    title: string;
    teamName: string;
    teamId?: string;
    leaderId: string;
    members: Agent[];
    models: Model[];
    status: TaskStatus;
    created: number;
    updated: number;
    chat: Chat[];
    rounds: Round[];
    pending: string[];
    events: {
        time: string;
        actor: string;
        text: string;
    }[];
    summary: string;
    error?: string;
    interrupted: boolean;
    workspace: {
        name: string;
        path: string;
        files: WorkspaceFile[];
    };
    contextMemoryIds: string[];
}
export interface AppState {
    libraries?:Library[]; skills?:Skill[];
    version: 1;
    theme: 'light' | 'dark';
    agents: Agent[];
    teams: Team[];
    models: Model[];
    memories: Memory[];
    tasks: Task[];
    settings: {
        workspaceRoot: string;
        concurrency: number;
        maxToolCalls: number;
        allowFileWrites: boolean;
    };
}
export interface Detection {
    engine: 'codex' | 'claude';
    installed: boolean;
    path?: string;
    version?: string;
    error?: string;
}
export interface Request {
    action: string;
    payload?: unknown;
}
export interface Reply<T = unknown> {
    ok: boolean;
    data?: T;
    error?: string;
}
export interface AgentCall {
    agent: Agent;
    model?: Model;
    system: string;
    prompt: string;
    cwd: string;
    signal: AbortSignal;
    allowWrites: boolean;
    maxToolCalls: number;
    onEvent: (text: string) => Promise<void>;
}
export interface Executor {
    run(call: AgentCall): Promise<string>;
}

export interface Skill { id:string; name:string; description:string; content:string; version:number; enabled:boolean; origin:"builtin"|"manual"|"ai"; }
export interface Library { id:string; name:string; directory?:string; count:number; version:number; status:"ready"|"indexing"|"failed"; error?:string; wiki?:string; wikiDraft?:string; wikiVersion?:number; autoSync?:boolean; }
export interface Evidence { libraryId:string; library:string; sourceId:string; source:string; sourceVersion:number; citation:string; text:string; }
export interface ResourceContext { byAgent:Record<string,{evidence:Evidence[];skills:Skill[];knowledge?:{libraryId:string;name:string;version:number;origin:string}[]}>; }

export interface KnowledgeBinding { libraryId:string; audience:"all"|"leader"|"selected"; memberIds:string[]; }
