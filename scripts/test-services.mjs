import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import vm from 'node:vm';import {webcrypto} from 'node:crypto';
import worker from '../worker/index.js';
test('Web guest/signed trial durations, terms, expiry, restart prevention and origin enforcement',async()=>{
 const rows=new Map();const DB={prepare(sql){return{bind(...args){return{first:async()=>rows.get(args[0])||null,run:async()=>{if(!rows.has(args[0]))rows.set(args[0],{subject:args[0],mode:args[1],started_at:args[2],expires_at:args[3],terms_version:args[4]});}};}};}};
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({id:'user-1',email_confirmed_at:'2026-10-07'});
 const env={DB,SUPABASE_URL:'https://test.supabase.co',SUPABASE_PUBLISHABLE_KEY:'public-test'};
 const call=(route,body,signed=false,origin='https://test.example')=>worker.fetch(new Request('https://test.example/api/trial/'+route,{method:body?'POST':'GET',headers:{origin,cookie:'__Host-agenttrap-guest=11111111-1111-4111-8111-111111111111',...(signed?{authorization:'Bearer test'}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);
 try{let r=await call('status');let d=await r.json();assert.equal(d.durationSeconds,300);assert.equal(d.active,false);assert.equal((await call('start',{accepted:false,termsVersion:d.termsVersion})).status,400);
 const terms={accepted:true,termsVersion:d.termsVersion};r=await call('start',terms);d=await r.json();assert.equal(d.expiresAt-d.startedAt,300000);assert.equal((await call('authorize',{})).status,200);
 assert.equal((await (await call('start',terms)).json()).startedAt,d.startedAt);rows.get('guest:11111111-1111-4111-8111-111111111111').expires_at=Date.now()-1;assert.equal((await call('authorize',{})).status,402);assert.equal((await call('start',terms,false,'https://evil.example')).status,403);
 d=await (await call('start',terms,true)).json();assert.equal(d.durationSeconds,1800);assert.equal(d.expiresAt-d.startedAt,1800000);
 }finally{globalThis.fetch=original;}
});
test('Extension provider permissions, sender verification, paused mode and CRM bridge decisions',async()=>{
 let listener;const settings={enabled:true,hosts:['chatgpt.com','claude.ai','gemini.google.com','copilot.microsoft.com','internal.example'],token:'test-pair-token'};let calls=[];
 const chrome={storage:{local:{setAccessLevel(){},get:async()=>settings}},runtime:{id:'extension-id',getURL:p=>'chrome-extension://extension-id/'+p,onMessage:{addListener(fn){listener=fn;}}},permissions:{contains:async()=>true,onRemoved:{addListener(){}}},webRequest:{onBeforeRequest:{addListener(){}}}};
 const context=vm.createContext({chrome,URL,AbortSignal,fetch:async(url,opt)=>{calls.push({url,body:JSON.parse(opt.body)});return Response.json({allowed:false,decision:'BLOCK',risk:95,threshold:80});}});
 vm.runInContext(await fs.readFile('extension/background.js','utf8'),context);
 const check=(host,id='extension-id')=>new Promise(r=>listener({action:'check',event:{kind:'prompt_submit_intent',fingerprint:'a'.repeat(64),signals:['Credential pattern']}},{id,tab:{id:1},url:'https://'+host+'/'},r));
 for(const host of settings.hosts){const r=await check(host);assert.equal(r.decision,'BLOCK');assert.equal(calls.at(-1).body.host,host);}
 const before=calls.length;assert.equal((await check('evil.example')).ok,false);assert.equal((await check('chatgpt.com','evil-id')).ok,false);assert.equal(calls.length,before);
 settings.enabled=false;assert.equal((await check('chatgpt.com')).monitoring,false);assert.equal(calls.length,before);
});
