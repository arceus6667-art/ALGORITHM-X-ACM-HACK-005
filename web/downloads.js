'use strict';
const os=document.getElementById('download-os'),arch=document.getElementById('download-arch');let assets=[];
const names={win:'Windows 10 / 11',mac:'macOS',linux:'Linux'};
if(/Mac/i.test(navigator.platform))os.value='mac';else if(/Linux/i.test(navigator.platform))os.value='linux';
function paint(){
 const windows=os.value==='win';
 document.getElementById('platform-note').textContent=names[os.value]+' · '+(arch.value==='arm64'?'ARM64':'x64')+(windows?' · .exe installer · No Node.js required.':' · Native application package.');
 document.getElementById('launch-note').textContent=windows?'Run the .exe installer, then open AgentTrap CRM from your desktop or Start menu.':os.value==='mac'?'Extract the native ZIP and open the AgentTrap CRM application.':'Extract the native TAR.GZ package and run the AgentTrap CRM executable.';
 for(const edition of ['trial','full']){
  const button=document.querySelector('.native-download[data-edition="'+edition+'"]'),status=document.querySelector('.native-status[data-edition="'+edition+'"]');
  const match=assets.find(a=>a.name.includes('-'+os.value+'-'+arch.value+'-'+edition+'.')&&(!windows||a.name.endsWith('.exe')));
  button.disabled=!match;button.textContent=match?'Download '+(edition==='trial'?'Trial':'Full')+(windows?' · .exe installer':' · '+names[os.value]):'Installer not available yet';button.dataset.url=match?.url||'';
  status.textContent=match?'Unsigned hackathon '+(windows?'installer':'package')+' · '+Math.round(match.size/1024/1024)+' MB':'Platform build is preparing. Refresh this page after it completes.';
 }
}
os.addEventListener('change',paint);arch.addEventListener('change',paint);document.querySelectorAll('.native-download').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.url)location.assign(button.dataset.url);}));paint();fetch('/api/downloads/releases').then(r=>r.json()).then(data=>{assets=data.assets||[];paint();}).catch(()=>paint());
