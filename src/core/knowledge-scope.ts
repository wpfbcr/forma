import type { Task, KnowledgeBinding, Agent } from './types.js';
export function sharedBindings(ids:string[]=[]):KnowledgeBinding[]{return ids.map(libraryId=>({libraryId,audience:'all',memberIds:[]}));}
export function effectiveKnowledge(t:Task,a:Agent){const result=new Map<string,{libraryId:string;origin:string}>();if(t.inheritAgentKnowledge?.[a.id]!==false)for(const libraryId of a.knowledgeIds||[])result.set(libraryId,{libraryId,origin:'Agent 自带'});
 const add=(bindings:KnowledgeBinding[],origin:string)=>{for(const binding of bindings)if(binding.audience==='all'||binding.audience==='leader'&&a.id===t.leaderId||binding.audience==='selected'&&binding.memberIds.includes(a.id))result.set(binding.libraryId,{libraryId:binding.libraryId,origin});};
 add(t.teamKnowledgeBindings||[], '团队分配');add(t.knowledgeBindings||sharedBindings(t.knowledgeIds),'本次任务');for(const id of t.excludedKnowledgeIds?.[a.id]||[])result.delete(id);return [...result.values()];}
