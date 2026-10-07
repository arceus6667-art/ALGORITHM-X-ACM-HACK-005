import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';import {startDesktop} from '../server.mjs';
async function open(edition,dataDir){const service=await startDesktop({requireAccount:false,editionOverride:edition,dataDir,port:0});const u=new URL(service.url),token=new URLSearchParams(u.hash.slice(1)).get('session');const call=async(p,body,extras={})=>{const r=await fetch(u.origin+p,{method:body?'POST':'GET',headers:{'X-Desktop-Token':token,...(body?{'Content-Type':'application/json'}:{}),...extras},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json()};};return{...service,call,u,token};}
test('Desktop Trial persists quotas and rejects full-only operations',async()=>{const directory=await fs.mkdtemp(path.join(os.tmpdir(),'agenttrap-test-'));let service=await open('trial',directory);try{const html=await fetch(service.u.origin+'/');assert.match(await html.text(),/desktop.js/);for(let i=0;i<5;i++)assert.equal((await service.call('/api/desktop/authorize',{operation:'analysis'})).status,200);assert.equal((await service.call('/api/desktop/authorize',{operation:'analysis'})).status,402);assert.equal((await service.call('/api/desktop/pair-code',{})).status,403);assert.equal((await service.call('/api/desktop/authorize',{operation:'policy'})).status,403);for(let i=0;i<3;i++)assert.equal((await service.call('/api/desktop/authorize',{operation:'integrity'})).status,200);assert.equal((await service.call('/api/desktop/authorize',{operation:'integrity'})).status,402);await service.close();service=await open('trial',directory);assert.equal((await service.call('/api/desktop/status')).data.usage.analysis,5);assert.equal((await service.call('/api/desktop/authorize',{operation:'analysis'})).status,402);}finally{await service.close();await fs.rm(directory,{recursive:true,force:true});}});
test('Full pairing, consent, append-only audit, hostile origins and notification transport',async()=>{const directory=await fs.mkdtemp(path.join(os.tmpdir(),'agenttrap-full-test-'));const service=await open('full',directory);const ext='chrome-extension://'+'a'.repeat(32);try{
 assert.equal((await fetch(service.u.origin+'/api/workspace')).status,401);
 assert.equal((await service.call('/api/desktop/pair-code',{}, {Origin:'https://evil.example'})).status,403);
 const workspace={revision:0,assets:[{id:'AST-1',hash:'b'.repeat(64),classification:'Confidential'}],policies:[],events:[{type:'Original audit'}],approvals:[],settings:{threshold:75,minimum:70,version:1}};
 assert.equal((await service.call('/api/workspace',workspace)).data.revision,1);
 assert.equal((await service.call('/api/workspace',{...workspace,revision:1,events:[]})).status,409);
 assert.equal((await service.call('/api/desktop/monitoring',{enabled:true,consent:false})).status,400);
 const code=(await service.call('/api/desktop/pair-code',{})).data.code;
 assert.equal((await service.call('/bridge/pair',{code:'wrong'},{Origin:ext})).status,403);
 const paired=await service.call('/bridge/pair',{code},{Origin:ext});assert.equal(paired.status,200);
 assert.equal((await service.call('/bridge/pair',{code},{Origin:ext})).status,403);
 const event={kind:'file_selected',host:'chatgpt.com',provider:'ChatGPT',fingerprint:'b'.repeat(64),fileName:'sensitive.png',fileSize:200,signals:[],rawPrompt:'NEVER STORE THIS'};
 const extHeaders={Origin:ext,Authorization:'Bearer '+paired.data.token};
 assert.equal((await service.call('/bridge/event',event,extHeaders)).status,403);
 await service.call('/api/desktop/monitoring',{enabled:true,consent:true});
 assert.equal((await service.call('/bridge/event',event,extHeaders)).status,200);
 const activity=(await service.call('/api/desktop/activity')).data;assert.equal(activity.chainValid,true);assert.equal(activity.events[0].severity,'HIGH');assert.equal(activity.events[0].registeredAsset,'AST-1');assert.equal(activity.events[0].rawPrompt,undefined);
 const file=await fs.readFile(path.join(directory,'workspace.json'),'utf8');assert.ok(!file.includes('NEVER STORE THIS'));
 const realFetch=globalThis.fetch;let published;
 try{globalThis.fetch=async(...args)=>{if(String(args[0]).startsWith('https://push.example')){published=args;return new Response('accepted',{status:200});}return realFetch(...args);};await service.call('/api/desktop/phone',{server:'https://push.example',topic:'private-test-topic',token:'test-not-a-real-secret'});assert.equal((await service.call('/api/desktop/test-phone',{})).data.delivered,true);assert.equal(published[1].headers.Authorization,'Bearer test-not-a-real-secret');assert.ok(!published[1].body.includes('sensitive.png'));}finally{globalThis.fetch=realFetch;}
 await service.call('/api/desktop/unpair',{});assert.equal((await service.call('/bridge/event',event,extHeaders)).status,403);
 const stored=JSON.parse(await fs.readFile(path.join(directory,'workspace.json'),'utf8'));stored.activity[0].kind='modified';await fs.writeFile(path.join(directory,'workspace.json'),JSON.stringify(stored));
 }finally{await service.close();}
 const second=await open('full',directory);try{assert.equal((await second.call('/api/desktop/activity')).data.chainValid,false);}finally{await second.close();await fs.rm(directory,{recursive:true,force:true});}
});
