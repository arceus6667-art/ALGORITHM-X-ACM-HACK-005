import {createClient} from 'npm:@supabase/supabase-js@2.117.3';
Deno.serve(async req=>{
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':'https://agenttrap-ai-governance.arceus6667.chatgpt.site','Access-Control-Allow-Headers':'authorization, apikey, content-type'};
 const answer=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return answer({error:'Method not allowed'},405);
 try{
 const authorization=req.headers.get('Authorization');if(!authorization?.startsWith('Bearer '))return answer({error:'Sign in required'},401);
 const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_ANON_KEY')!;
 const client=createClient(url,key,{global:{headers:{Authorization:authorization}},auth:{persistSession:false}});
 const {data:{user},error:authError}=await client.auth.getUser(authorization.slice(7));if(authError||!user?.email_confirmed_at)return answer({error:'Verified email required'},401);
 const body=await req.json();if(!/^[a-f0-9-]{36}$/.test(body.companyId||''))return answer({error:'Invalid company'},400);
 const {data:membership}=await client.from('agenttrap_members').select('role,active').eq('company_id',body.companyId).eq('user_id',user.id).single();
 if(!membership?.active||membership.role!=='owner')return answer({error:'Company owner permission required'},403);
 const {data:company}=await client.from('agenttrap_companies').select('id,domain').eq('id',body.companyId).single();if(!company||!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(company.domain))return answer({error:'Company domain unavailable'},400);
 const name='_agenttrap-verify.'+company.domain,expected='agenttrap-company='+company.id;
 const dns=await fetch('https://cloudflare-dns.com/dns-query?name='+encodeURIComponent(name)+'&type=TXT',{headers:{Accept:'application/dns-json'},signal:AbortSignal.timeout(8000)});if(!dns.ok)return answer({error:'DNS verifier unavailable'},503);
 const result=await dns.json();const found=result.Status===0&&(result.Answer||[]).some((r:{type:number,data:string})=>r.type===16&&typeof r.data==='string'&&r.data.replace(/"\s*"/g,'').replace(/^"|"$/g,'')===expected);
 if(!found)return answer({verified:false,message:'TXT record not found yet. Set '+name+' to '+expected+' and retry after DNS propagation.'});
 const admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
 const {error}=await admin.from('agenttrap_companies').update({ownership_verified:true}).eq('id',company.id);if(error)return answer({error:'Domain verification could not be saved'},503);
 await admin.from('agenttrap_admin_events').insert({company_id:company.id,actor_id:user.id,action:'Domain control verified by DNS TXT',detail:{domain:company.domain}});
 return answer({verified:true});
 }catch{return answer({error:'Verification failed. Check your sign-in and DNS record.'},400);}
});
