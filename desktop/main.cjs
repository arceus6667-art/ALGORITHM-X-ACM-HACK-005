const {app,BrowserWindow,Notification,shell}=require('electron');
const path=require('node:path');const fs=require('node:fs');
const edition=JSON.parse(fs.readFileSync(path.join(__dirname,'edition.json'),'utf8')).edition;const {pathToFileURL}=require('node:url');
let service,window;
if(!app.requestSingleInstanceLock())app.quit();
app.on('second-instance',()=>{window?.show();window?.focus();});
app.whenReady().then(async()=>{
 const {startDesktop}=await import(pathToFileURL(path.join(__dirname,'server.mjs')));
 service=await startDesktop({dataDir:path.join(app.getPath('userData'),edition),notify:()=>{if(Notification.isSupported())new Notification({title:'AgentTrap security alert',body:'Suspicious AI activity detected. Review your local CRM.'}).show();}});
 window=new BrowserWindow({width:1400,height:900,minWidth:800,minHeight:600,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
 window.webContents.setWindowOpenHandler(({url})=>{if(url.startsWith('https://agenttrap-ai-governance.arceus6667.chatgpt.site/'))shell.openExternal(url);return{action:'deny'};});
 window.webContents.on('will-navigate',(event,url)=>{if(new URL(url).origin!==new URL(service.url).origin)event.preventDefault();});
 window.webContents.session.setPermissionRequestHandler((_contents,permission,callback)=>callback(permission==='notifications'));
 await window.loadURL(service.url);
}).catch(error=>{console.error(error.message);app.quit();});
app.on('window-all-closed',()=>app.quit());app.on('before-quit',()=>service?.close());
