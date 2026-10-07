import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
const canonical=v=>JSON.stringify(normalize(v));
function normalize(v){return Array.isArray(v)?v.map(normalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;}
const hash=v=>createHash('sha256').update(v).digest('hex');
const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const defaultHosts=['chatgpt.com','claude.ai','gemini.google.com','copilot.microsoft.com'];
export async function startDesktop({dataDir,port=43127,notify=()=>{},editionOverride}={}){
 const edition=editionOverride||(JSON.parse(await fs.readFile(path.join(root,'edition.json'),'utf8')).edition);
 if(!['trial','full'].includes(edition))throw Error('Invalid edition');
 const full=edition==='full';dataDir||=path.join(os.homedir(),'.agenttrap-crm',edition);await fs.mkdir(dataDir,{recursive:true,mode:0o700});
 const file=path.join(dataDir,'workspace.json');let db;
 try{db=JSON.parse(await fs.readFile(file,'utf8'));}catch(error){if(error.code!=='ENOENT')throw Error('Local database could not be read. Preserve the file and restore from your export.');db={revision:0,workspace:null,usage:{analysis:0,integrity:0},activity:[],monitoring:false};}
 let queue=Promise.resolve();const token=randomBytes(32).toString('hex');let pairCode=null,pairExpiry=0,pairAttempts=0,extensionToken=null,extensionId=null,phone=null;
 const persist=async()=>{await fs.writeFile(file+'.tmp',JSON.stringify(db),{mode:0o600});await fs.rename(file+'.tmp',file);};
 const mutate=fn=>{const p=queue.then(fn);queue=p.catch(()=>{});return p;};
 function chainValid(){let previous='0'.repeat(64);for(const e of db.activity){const {digest,...body}=e;if(body.previousDigest!==previous||hash(canonical(body))!==digest)return false;previous=digest;}return true;}
 function config(){return{edition,full,usage:db.usage,limits:full?null:{analysis:5,integrity:3,policies:2},monitoring:db.monitoring,paired:!!extensionToken,activityCount:db.activity.length,chainValid:chainValid(),phoneConfigured:!!phone,license:'Hackathon evaluation. Commercial billing and licenses are not implemented.'};}
 async function phoneAlert(test=false){if(!phone)return {delivered:false,error:'Configure an authenticated ntfy topic first.'};try{const r=await fetch(phone.server+'/'+encodeURIComponent(phone.topic),{method:'POST',headers:{Authorization:'Bearer '+phone.token,'Content-Type':'text/plain','Title':test?'AgentTrap test alert':'AgentTrap security alert','Priority':'4'},body:test?'Phone notifications are connected.':'Suspicious AI activity detected. Review your local AgentTrap CRM.',signal:AbortSignal.timeout(10000)});return{delivered:r.ok,error:r.ok?null:'Push service rejected the notification ('+r.status+').'};}catch{return{delivered:false,error:'Push service is unreachable.'};}}
 async function read(req){let chunks=[],size=0;for await(const c of req){size+=c.length;if(size>1500000)throw Error('Request exceeds size limit');chunks.push(c);}return JSON.parse(Buffer.concat(chunks).toString()||'{}');}
 const server=http.createServer(async(req,res)=>{
 const host=req.headers.host;if(host!==`127.0.0.1:${server.address().port}`){res.writeHead(403);res.end('Invalid local host');return;}
 const origin=`http://${host}`,url=new URL(req.url,origin),p=url.pathname;
 const extOrigin=/^chrome-extension:\/\/[a-p]{32}$/.test(req.headers.origin||'');
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"};
 if(p.startsWith('/bridge/')&&extOrigin){headers['Access-Control-Allow-Origin']=req.headers.origin;headers['Access-Control-Allow-Headers']='Content-Type, Authorization';headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Private-Network']='true';}
 const send=(data,status=200)=>{res.writeHead(status,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify(data));};
 if(req.method==='OPTIONS'&&p.startsWith('/bridge/')&&extOrigin){res.writeHead(204,headers);res.end();return;}
 try{
 if(p==='/bridge/pair'&&req.method==='POST'){
 if(!full||!extOrigin)return send({error:'Pairing is available only in Full edition.'},403);
 const b=await read(req);if(!pairCode||Date.now()>pairExpiry||++pairAttempts>5||!equal(String(b.code||''),pairCode))return send({error:'Invalid or expired pairing code. Create a new code in your CRM.'},403);
 extensionToken=randomBytes(32).toString('hex');extensionId=req.headers.origin;pairCode=null;return send({token:extensionToken});
 }
 if(p==='/bridge/event'&&req.method==='POST'){
 if(!full||!db.monitoring||!extOrigin||req.headers.origin!==extensionId||!equal(req.headers.authorization||'','Bearer '+extensionToken))return send({error:'Monitoring is paused or pairing is not authorized.'},403);
 const b=await read(req);if(!defaultHosts.includes(b.host)&&!/^internal:/.test(b.provider||''))return send({error:'Unsupported destination'},400);
 if(!['prompt_submit_intent','file_selected','paste_observed','network_request'].includes(b.kind))return send({error:'Unsupported event'},400);
 if(!/^[a-f0-9]{64}$/.test(b.fingerprint||'')&&b.kind!=='network_request')return send({error:'Missing SHA-256 fingerprint'},400);
 const event=await mutate(async()=>{
 if(db.activity.length>=10000)throw Error('Activity storage limit reached. Export and archive records.');
 const signals=Array.isArray(b.signals)?b.signals.filter(x=>['Credential pattern','Prompt manipulation signal','Email address'].includes(x)):[];
 const asset=db.workspace?.assets?.find(a=>a.hash===b.fingerprint);
 const suspicious=signals.some(x=>x!=='Email address')||!!asset&&['Confidential','Restricted'].includes(asset.classification);
 const e={id:randomBytes(12).toString('hex'),timestamp:new Date().toISOString(),provider:String(b.provider||b.host).slice(0,100),host:String(b.host).slice(0,253),kind:b.kind,fingerprint:b.fingerprint||null,characters:Math.max(0,Math.min(Number(b.characters)||0,1000000)),fileName:b.kind==='file_selected'?String(b.fileName||'').slice(0,254):null,fileSize:Math.max(0,Number(b.fileSize)||0),signals,registeredAsset:asset?.id||null,severity:suspicious?'HIGH':'INFO',observation:'Browser observation; provider retention or downstream use is not visible.',previousDigest:db.activity.at(-1)?.digest||'0'.repeat(64)};
 e.digest=hash(canonical(e));db.activity.push(e);await persist();return e;
 });if(event.severity==='HIGH'){notify();if(phone)phoneAlert().then(result=>{if(!result.delivered)console.warn(result.error);});}return send({recorded:true,id:event.id});
 }
 if(p.startsWith('/api/')){
 if(req.headers.origin&&req.headers.origin!==origin)return send({error:'Untrusted origin'},403);
 if(!equal(req.headers['x-desktop-token']||'',token))return send({error:'Local session required'},401);
 if(p==='/api/desktop/status'&&req.method==='GET')return send(config());
 if(p==='/api/desktop/authorize'&&req.method==='POST'){const {operation}=await read(req);return await mutate(async()=>{
 if(!['analysis','integrity','policy','approval','settings'].includes(operation))return send({error:'Unknown operation'},400);
 if(!full&&['policy','approval','settings'].includes(operation))return send({error:'This feature requires Full Hackathon edition.'},403);
 if(!full&&db.usage[operation]>=(operation==='analysis'?5:3))return send({error:'Desktop Trial limit reached. Export your records or use Full edition.'},402);
 if(!full)db.usage[operation]++;await persist();return send({allowed:true});});}
 if(p==='/api/workspace'&&req.method==='GET')return send(db.workspace?{...db.workspace,revision:db.revision,empty:false}:{revision:db.revision,empty:true});
 if(p==='/api/workspace'&&req.method==='POST'){const b=await read(req);return await mutate(async()=>{
 if(b.revision!==db.revision)return send({error:'Workspace changed. Reload before saving.'},409);
 if(!['assets','events','policies','approvals'].every(k=>Array.isArray(b[k]))||!b.settings)return send({error:'Invalid workspace'},400);
 if(!full&&(b.assets.length>5||b.policies.length>2))return send({error:'Desktop Trial quota exceeded'},403);
 const old=db.workspace?.events||[];if(b.events.length<old.length||old.some((e,i)=>canonical(e)!==canonical(b.events[i])))return send({error:'Existing audit events cannot be rewritten.'},409);
 const {assets,events,policies,approvals,settings}=b;db.workspace={assets,events,policies,approvals,settings};db.revision++;await persist();return send({revision:db.revision,saved:true});});}
 if(p==='/api/desktop/activity'&&req.method==='GET')return send({events:db.activity,chainValid:chainValid()});
 if(!full)return send({error:'Full edition required'},403);
 if(p==='/api/desktop/pair-code'&&req.method==='POST'){pairCode=randomBytes(6).toString('hex').toUpperCase();pairExpiry=Date.now()+300000;pairAttempts=0;return send({code:pairCode,expiresAt:pairExpiry});}
 if(p==='/api/desktop/monitoring'&&req.method==='POST'){const b=await read(req);if(b.enabled&&!b.consent)return send({error:'Explicit monitoring consent required'},400);await mutate(async()=>{db.monitoring=b.enabled===true;await persist();});return send(config());}
 if(p==='/api/desktop/unpair'&&req.method==='POST'){extensionToken=null;extensionId=null;pairCode=null;await mutate(async()=>{db.monitoring=false;await persist();});return send(config());}
 if(p==='/api/desktop/phone'&&req.method==='POST'){const b=await read(req);const u=new URL(b.server);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||!/^[-a-zA-Z0-9_]{3,100}$/.test(b.topic)||typeof b.token!=='string'||b.token.length<10)return send({error:'Use an HTTPS ntfy server, a private topic, and an access token.'},400);phone={server:u.origin,topic:b.topic,token:b.token};return send({configured:true,note:'Access token stays in memory and must be entered again after restart.'});}
 if(p==='/api/desktop/test-phone'&&req.method==='POST')return send(await phoneAlert(true));
 return send({error:'Not found'},404);
 }
 if(!['GET','HEAD'].includes(req.method))return send({error:'Method not allowed'},405);
 const name=p==='/'?'demo.html':p.slice(1);if(!/^[a-zA-Z0-9_.-]+$/.test(name))return send({error:'Not found'},404);
 const bytes=await fs.readFile(path.join(root,'ui',name));const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp'}[path.extname(name)]||'application/octet-stream';res.writeHead(200,{...headers,'Content-Type':type});res.end(req.method==='HEAD'?undefined:bytes);
 }catch(error){if(error.code==='ENOENT')send({error:'Not found'},404);else send({error:error.message},400);}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 return{url:`http://127.0.0.1:${server.address().port}/#session=${token}`,close:()=>new Promise(resolve=>server.close(resolve))};
}
