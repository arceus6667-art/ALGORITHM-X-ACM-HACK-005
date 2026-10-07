import {startDesktop} from './server.mjs';
import {spawn} from 'node:child_process';
const server=await startDesktop();
console.log('AgentTrap CRM is running locally. Open:',server.url);
const cmd=process.platform==='win32'?'cmd':process.platform==='darwin'?'open':'xdg-open';
const args=process.platform==='win32'?['/c','start','',server.url]:[server.url];
spawn(cmd,args,{stdio:'ignore'}).on('error',()=>console.log('Open the local URL above in your browser.'));
process.on('SIGINT',()=>server.close().then(()=>process.exit()));
