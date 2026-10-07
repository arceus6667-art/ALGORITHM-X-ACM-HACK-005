import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
const site='https://agenttrap-ai-governance.arceus6667.chatgpt.site';
export function createAccount({transport=fetch}={}){
 let config=null,session=null,identity=null,selected=null,lastLink=0,pendingLink=null,refreshing=null,generation=0;
 async function configuration(){if(!config){const r=await transport(site+'/api/auth/config',{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Account service unavailable');config=await r.json();if(!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(config.url))throw Error('Invalid account service');}return config;}
 async function request(path,body,token){const c=await configuration();const r=await transport(c.url+path,{method:body?'POST':'GET',headers:{apikey:c.publishableKey,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});const d=await r.json();if(!r.ok)throw Error(d.msg||d.message||d.error_description||d.error||'Account request failed');return d;}
 async function refresh(){if(!session)throw Error('Register or sign in with your verified email');if(session.expires_at<Date.now()/1000+90){if(!refreshing){const current=generation;refreshing=request('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token}).then(d=>{if(current!==generation)throw Error('Account changed during refresh');session={...d,expires_at:Date.now()/1000+d.expires_in};}).finally(()=>{refreshing=null;});}await refreshing;}return session.access_token;}
 async function rpc(action,payload={}){const current=generation;const result=action==='verify_domain'?await request('/functions/v1/agenttrap-verify-domain',payload,await refresh()):await request('/rest/v1/rpc/agenttrap_enterprise',{action,payload},await refresh());if(current!==generation)throw Error('Account changed during request');if(['me','profile','create_company','accept_invite'].includes(action)){identity=result;if(selected&&!result.companies.some(c=>c.id===selected))selected=null;selected||=result.companies[0]?.id;}return result;}
 return{
  async magicLink(email,register,name,origin){
   email=String(email).trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Enter a valid email');
   if(session)throw Error('Sign out before starting another sign-in');
   if(Date.now()-lastLink<60000)throw Error('Wait 60 seconds before requesting another link');
   if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(origin))throw Error('Invalid desktop return address');
   const verifier=randomBytes(32).toString('base64url'),state=randomBytes(32).toString('hex');
   const redirect=new URL(origin+'/auth/callback');redirect.searchParams.set('state',state);
   const c=await configuration();const r=await transport(c.url+'/auth/v1/otp?redirect_to='+encodeURIComponent(redirect.href),{method:'POST',headers:{apikey:c.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({email,create_user:register===true,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'s256'}),signal:AbortSignal.timeout(15000)});
   const d=await r.json();if(!r.ok)throw Error(d.msg||d.message||d.error||'Could not send sign-in email. Check SMTP configuration.');
   generation++;lastLink=Date.now();pendingLink={verifier,state,email,name:String(name||'').slice(0,120),expires:Date.now()+3600000};return {sent:true};
  },
  async completeLink(code,state){
   const p=pendingLink;if(!p||Date.now()>p.expires||typeof state!=='string'||state.length!==p.state.length||!timingSafeEqual(Buffer.from(state),Buffer.from(p.state)))throw Error('Invalid or expired sign-in request. Request a new link in the CRM.');
   if(typeof code!=='string'||code.length<10||code.length>2048)throw Error('Invalid sign-in link');
   pendingLink=null;const current=++generation;
   const d=await request('/auth/v1/token?grant_type=pkce',{auth_code:code,code_verifier:p.verifier});
   if(current!==generation)throw Error('Sign-in request changed');
   if(!d.access_token||!d.user?.email_confirmed_at||d.user.email?.toLowerCase()!==p.email)throw Error('Verified email session required');
   session={...d,expires_at:Date.now()/1000+d.expires_in};identity=null;selected=null;
   try{await rpc('me');if(p.name)await rpc('profile',{name:p.name});return await this.state();}catch(error){session=null;identity=null;selected=null;throw error;}
  },
  async logout(){generation++;pendingLink=null;if(session)await request('/auth/v1/logout',{},await refresh()).catch(()=>{});session=null;identity=null;selected=null;},
  async state(){if(!session)return {authenticated:false,requireAccount:true};await rpc('me');return {authenticated:true,requireAccount:true,userId:identity.userId,email:identity.email,profile:identity.profile,companies:identity.companies,companyId:selected};},
  async select(companyId){await rpc('me');if(!identity.companies.some(c=>c.id===companyId))throw Error('Company access denied');selected=companyId;return this.state();},
  async company(){await rpc('me');const company=identity.companies.find(c=>c.id===selected);if(!company)throw Error('Create a company or accept your company invitation first');return company;},
  async authorize(edition,operation){const company=await this.company();await rpc('authorize',{companyId:company.id,edition,operation});return company;},
  rpc,
 };
}
