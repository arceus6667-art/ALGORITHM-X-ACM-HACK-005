import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {webcrypto} from 'node:crypto';
import {JSDOM} from 'jsdom';
const app=await fs.readFile('web/app.js','utf8');
const html=await fs.readFile('web/demo.html','utf8');
const wait=()=>new Promise(r=>setTimeout(r,30));
async function until(check){const end=Date.now()+2000;while(!check()){if(Date.now()>end)throw Error('Expected observer state did not settle');await new Promise(r=>setTimeout(r,10));}}
async function consoleDom(saved){
 const dom=new JSDOM(html,{url:'http://localhost/#provenance',runScripts:'outside-only'}),w=dom.window;
 Object.defineProperty(w,'crypto',{value:webcrypto});w.TextEncoder=TextEncoder;w.scrollTo=()=>{};w.AgentTrapDesktop={};w.AgentTrapAuth={ready:Promise.resolve(),session:{user:{id:'test'}},headers:async()=>({})};
 let workspace=saved,rev=saved?.revision||0;
 w.fetch=async(url,opt={})=>{if(opt.method==='POST'){const b=JSON.parse(opt.body);assert.equal(b.revision,rev);workspace={...b,revision:++rev};return{ok:true,json:async()=>({revision:rev})};}return{ok:true,json:async()=>workspace||{empty:true,revision:0}};};
 w.eval(app);await w.AgentTrapCRM.ready;
 return{dom,w,get saved(){return workspace;}};
}
function file(w,id,name,bytes){const input=w.document.getElementById(id);Object.defineProperty(input,'files',{configurable:true,value:[{name,size:Buffer.byteLength(bytes),arrayBuffer:async()=>new TextEncoder().encode(bytes).buffer,text:async()=>bytes}]});}
async function submit(w,id){const form=w.document.getElementById(id),button=form.querySelector('button[type=submit],button:not([type])'),before=w.document.getElementById('toast').textContent,eventCount=w.AgentTrapConsole.state.events.length;assert.ok(button);form.dispatchEvent(new w.SubmitEvent('submit',{cancelable:true,bubbles:true,submitter:button}));await until(()=>!w.AgentTrapConsole.state.busy&&(id==='verify-form'?w.AgentTrapConsole.state.events.length>eventCount:(w.AgentTrapConsole.state.events.length>eventCount||w.document.getElementById('toast').textContent!==before)));await wait();}
test('TraceSeal empty state, original registration, exact/modified comparison, deduplication and restore',async()=>{
 const c=await consoleDom(),{w,dom}=c;try{
 assert.equal(w.document.querySelector('#verify-form button').disabled,true);
 file(w,'register-file','original.png','binary-image-1');await submit(w,'register-asset-form');
 assert.equal(w.AgentTrapConsole.state.assets.length,1);assert.equal(w.document.querySelector('#verify-form button').disabled,false);assert.equal(c.saved.assets.length,1);
 file(w,'verify-file','same.png','binary-image-1');await submit(w,'verify-form');assert.match(w.document.getElementById('verify-result').textContent,/Exact Match/);
 file(w,'verify-file','changed.png','binary-image-2');await submit(w,'verify-form');assert.match(w.document.getElementById('verify-result').textContent,/Modified/);
 file(w,'register-file','same-name.png','binary-image-1');await submit(w,'register-asset-form');assert.equal(w.AgentTrapConsole.state.assets.length,1);
 Object.defineProperty(w.document.getElementById('register-file'),'files',{configurable:true,value:[{name:'too-large.pdf',size:11*1024*1024}]});await submit(w,'register-asset-form');assert.match(w.document.getElementById('toast').textContent,/Maximum file size/);assert.equal(w.AgentTrapConsole.state.assets.length,1);
 const restored=await consoleDom(c.saved);try{assert.equal(restored.w.document.getElementById('verify-asset').options.length,1);assert.equal(restored.w.AgentTrapConsole.state.events.length,3);}finally{restored.dom.window.close();}
 }finally{dom.window.close();}
});
test('Console analysis, policy, approvals, settings, audit verification and navigation',async()=>{
 const{w,dom}=await consoleDom();const state=w.AgentTrapConsole.state;try{
 for(const key of Object.keys(w.AgentTrapConsole.renderers)){w.location.hash=key;w.AgentTrapConsole.render();assert.ok(w.document.getElementById('main').textContent.trim());}
 w.location.hash='analyze';await wait();w.AgentTrapConsole.render();w.document.getElementById('asset-text').value='password=secret123';await submit(w,'analysis-form');assert.equal(state.last.result.action,'BLOCK');
 w.document.getElementById('asset-text').value='Restricted planning';w.document.getElementById('asset-class').value='Restricted';await submit(w,'analysis-form');assert.equal(state.last.result.action,'APPROVAL_REQUIRED');
 w.location.hash='approvals';await wait();w.AgentTrapConsole.render();const form=w.document.querySelector('.approval-form');form.querySelector('[name=reason]').value='Reviewed by test analyst';const approve=form.querySelector('button[value=Approved]');form.dispatchEvent(new w.SubmitEvent('submit',{cancelable:true,bubbles:true,submitter:approve}));await wait();assert.equal(state.approvals[0].status,'Approved');
 w.location.hash='policies';await wait();w.AgentTrapConsole.render();w.document.getElementById('policy-name').value='Test rule';await submit(w,'new-policy');assert.equal(state.policies.length,3);const toggle=w.document.querySelector('[data-policy=POL-003]');toggle.checked=false;toggle.dispatchEvent(new w.Event('change',{bubbles:true}));await wait();assert.equal(state.policies[2].enabled,false);
 w.location.hash='settings';await wait();w.AgentTrapConsole.render();w.document.getElementById('risk-threshold').value=85;await submit(w,'settings-form');assert.equal(state.settings.threshold,85);
 w.location.hash='audit';await wait();w.AgentTrapConsole.render();w.document.querySelector('[data-action=verify-chain]').click();await wait();assert.match(w.document.getElementById('toast').textContent,/Audit chain verified/);
 let exported;w.URL.createObjectURL=blob=>{exported=blob;return'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=()=>{};await w.AgentTrapExport();assert.ok(exported.size>100);
 state.events[0].action='TAMPERED';w.document.querySelector('[data-action=verify-chain]').click();await wait();assert.match(w.document.getElementById('toast').textContent,/verification failed/);
 }finally{dom.window.close();}
});
const content=await fs.readFile('extension/content.js','utf8');
test('Browser observer holds blocked submissions, resumes allowed prompts, hashes files, redacts secrets and fails closed',async()=>{
 const dom=new JSDOM('<form><textarea></textarea><button type="submit" aria-label="Send">Send</button><input type="file"></form>',{url:'https://chatgpt.com/',runScripts:'outside-only'}),w=dom.window;
 Object.defineProperty(w,'crypto',{value:webcrypto});w.TextEncoder=TextEncoder;let allow=false,offline=false,submissions=0,events=[];
 w.chrome={runtime:{sendMessage:async m=>{events.push(m.event);if(offline)throw Error('offline');return{ok:true,allowed:allow,decision:allow?'ALLOW':'BLOCK',risk:allow?10:95,threshold:80};}}};
 w.eval(content);const form=w.document.querySelector('form');form.requestSubmit=()=>submissions++;w.document.querySelector('textarea').value='password=secret123 email@company.example';
 form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>/blocked/.test(w.document.getElementById('agenttrap-protection-status')?.textContent||''));assert.equal(submissions,0);assert.match(w.document.getElementById('agenttrap-protection-status').textContent,/blocked/);assert.doesNotMatch(events[0].preview,/secret123|email@/);
 allow=true;form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>submissions===1);
 offline=true;form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>/held/.test(w.document.getElementById('agenttrap-protection-status')?.textContent||''));assert.equal(submissions,1);assert.match(w.document.getElementById('agenttrap-protection-status').textContent,/held/);
 offline=false;const input=w.document.querySelector('input');Object.defineProperty(input,'files',{value:[{name:'photo.png',size:3,arrayBuffer:async()=>new TextEncoder().encode('abc').buffer}]});input.dispatchEvent(new w.Event('change',{bubbles:true,cancelable:true}));await until(()=>events.at(-1)?.kind==='file_selected');assert.equal(events.at(-1).fingerprint,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 dom.window.close();
});
