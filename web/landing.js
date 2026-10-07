'use strict'; const menu=document.querySelector('.mobile-menu');menu.addEventListener('click',()=>{const open=document.querySelector('nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');}));
document.getElementById('launch-demo').addEventListener('submit',event=>{event.preventDefault();const params=new URLSearchParams(new FormData(event.target));location.href='demo.html?'+params.toString()+'#analyze';});

const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const typed=document.getElementById('hero-typed');
const phrase='PRIVATE DATA AT RISK';
let typingTimer,characters=phrase.length,deleting=true;
function typeStep(){
 if(motionPreference.matches||document.hidden)return;
 characters+=deleting?-1:1;
 typed.textContent=phrase.slice(0,characters);
 let delay=deleting?48:95;
 if(characters===0){deleting=false;delay=450;}
 if(characters===phrase.length){deleting=true;delay=2300;}
 typingTimer=setTimeout(typeStep,delay);
}
function syncMotion(){
 clearTimeout(typingTimer);
 if(motionPreference.matches){characters=phrase.length;deleting=true;typed.textContent=phrase;return;}
 if(!document.hidden)typingTimer=setTimeout(typeStep,characters===phrase.length?2300:100);
}
if(typed){syncMotion();motionPreference.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);}
const revealTargets=document.querySelectorAll('.section-heading,.feature-grid article,.plan-card,.platform-list a,.about-grid>div');
if('IntersectionObserver' in window&&!motionPreference.matches){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}, {threshold:0.08});
 revealTargets.forEach((element,index)=>{element.classList.add('reveal');element.style.setProperty('--reveal-delay',(index%3)*90+'ms');observer.observe(element);});
 motionPreference.addEventListener('change',()=>{if(motionPreference.matches){revealTargets.forEach(element=>element.classList.add('is-visible'));observer.disconnect();}});
}
