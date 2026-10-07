import {createClient} from '@supabase/supabase-js';
const auth={client:null,session:null,config:null,error:null};
auth.ready=(async()=>{
 try{
 const r=await fetch('/api/auth/config',{cache:'no-store'});const config=await r.json();if(!r.ok)throw new Error(config.error||'Sign-in is temporarily unavailable.');auth.config=config;
 auth.client=createClient(config.url,config.publishableKey,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
 const {data,error}=await auth.client.auth.getSession();if(error)throw error;auth.session=data.session;
 auth.client.auth.onAuthStateChange((event,session)=>{auth.session=session;window.dispatchEvent(new CustomEvent('agenttrap-auth',{detail:{event,signedIn:!!session}}));});
 return auth;
 }catch(e){auth.error=e.message;return auth;}
})();
auth.headers=async()=>{await auth.ready;if(auth.error)throw new Error(auth.error);const {data,error}=await auth.client.auth.getSession();if(error)throw error;auth.session=data.session;return data.session?{Authorization:'Bearer '+data.session.access_token}:{};};
auth.signOut=async()=>{await auth.ready;const {error}=await auth.client.auth.signOut();if(error)throw error;sessionStorage.removeItem('agenttrap-guest-draft');location.assign('/signin.html');};
window.AgentTrapAuth=auth;
const page=document.getElementById('auth-page');
if(page){(async()=>{
 let address='',cooldown=0,busy=false;
 const status=document.getElementById('auth-status'),send=document.getElementById('send-code'),verify=document.getElementById('verify-code'),input=document.getElementById('auth-address'),google=document.getElementById('google-signin');
 const message=(text,error=false)=>{status.textContent=text;status.classList.toggle('error',error);};
 function paint(){send.disabled=busy||cooldown>Date.now();send.textContent=busy?'Please wait…':cooldown>Date.now()?'Resend in '+Math.ceil((cooldown-Date.now())/1000)+'s':'Send verification';}
 const finish=()=>{message('Verified. Opening your workspace…');location.replace('/demo.html?welcome=1#dashboard');};
 await auth.ready;
 if(auth.error){message(auth.error,true);send.disabled=true;google.disabled=true;}else{
 if(auth.session)finish();
 const external=auth.config.providers||{};
 if(external.google===false)document.getElementById('google-note').textContent='Google sign-in is awaiting activation by the administrator.';
 google.addEventListener('click',async()=>{if(external.google===false){message('Google sign-in has not been activated for this workspace yet.',true);return;}google.disabled=true;try{const {error}=await auth.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/signin.html'}});if(error)throw error;}catch(e){message(e.message,true);google.disabled=false;}});
 document.getElementById('send-form').addEventListener('submit',async e=>{e.preventDefault();if(busy||cooldown>Date.now())return;address=input.value.trim();
 busy=true;paint();try{const payload={email:address,options:{emailRedirectTo:location.origin+'/signin.html'}};const {error}=await auth.client.auth.signInWithOtp(payload);if(error)throw error;cooldown=Date.now()+60000;document.getElementById('code-form').hidden=false;message('Check your email. Enter the verification code if provided, or follow the sign-in link.');document.getElementById('auth-code').focus();}catch(e){message(e.message,true);}finally{busy=false;paint();}});
 document.getElementById('code-form').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;busy=true;verify.disabled=true;try{const token=document.getElementById('auth-code').value.trim();const payload={email:address,token,type:'email'};const {data,error}=await auth.client.auth.verifyOtp(payload);if(error)throw error;if(!data.session)throw new Error('Verification did not create a session. Request a new code.');finish();}catch(e){message(e.message,true);}finally{busy=false;verify.disabled=false;}});
 window.addEventListener('agenttrap-auth',e=>{if(e.detail.signedIn)finish();});setInterval(paint,1000);
 }
})();}
