firebase.initializeApp({apiKey:"AIzaSyDRcucG7Qr9EKySpSPY2UglZ_WQTmhf6Uo",authDomain:"script-web-8d4a7.firebaseapp.com",databaseURL:"https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"script-web-8d4a7",storageBucket:"script-web-8d4a7.firebasestorage.app",messagingSenderId:"529307129610",appId:"1:529307129610:web:a3f2e4a3b6e0791cec8cf3"});
const auth=firebase.auth(),db=firebase.database(),$=s=>document.querySelector(s),DEV='michellyjow',DBURL='https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app',TS=firebase.database.ServerValue.TIMESTAMP;
let me=null,isDev=false,uname='',msgs=[],reply=null,editing=null,att=null,last=0,editLoader=null,view='chat',devUid=null,stuck=true,unread=0,seen=null,typeT=null;
const U={},M={};
const isDeveloper=()=>isDev;
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const btn=(t,f,c)=>{const b=h('button',c||'',t);b.onclick=f;return b};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const copy=async t=>{try{await navigator.clipboard.writeText(t);toast('Copied')}catch(e){toast('Copy manually')}};
const PAL=['#2F6FED','#D9480F','#2B8A3E','#9C36B5','#C2255C','#0B7285'];
const col=n=>{let x=0;for(const c of String(n).toLowerCase())x=(x*31+c.charCodeAt(0))>>>0;return PAL[x%PAL.length]};
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
const snip=slug=>'loadstring(game:HttpGet("'+location.origin+(slug?'/loaders/'+slug:'/loader')+'"))()';

/* ---------- splash ---------- */
let sp=1,spDone=false,spReady=false;
const paintSp=()=>{$('#spp').textContent=sp+'%';$('#spb').style.width=sp+'%';$('#spt').textContent=sp<30?'Preparing the model':sp<60?'Loading modules':sp<90?'Connecting to server':'Almost ready'};
const spTick=()=>{if(sp<100){sp=Math.min(spReady?100:96,sp+(spReady?10+Math.floor(Math.random()*16):2+Math.floor(Math.random()*8)));paintSp();setTimeout(spTick,60+Math.random()*140)}else if(!spDone){spDone=true;setTimeout(()=>$('#splash').classList.add('out'),350)}};
spTick();setTimeout(()=>spReady=true,7000);

/* ---------- icons ---------- */
const IC={copy:'<path d="M9 9h10v10H9zM5 15V5h10"/>',reply:'<path d="M9 7L4 12l5 5M4 12h10a6 6 0 0 1 6 6"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',del:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',file:'<path d="M14 3H6v18h12V7zM14 3v4h4"/>',heart:'<path d="M12 21s-7.5-4.6-10-9.3C.3 8 2 4.5 5.6 4.5c2 0 3.5 1 6.4 4 2.9-3 4.4-4 6.4-4C22 4.5 23.7 8 22 11.7 19.5 16.4 12 21 12 21z"/>'};
const svg=n=>'<svg viewBox="0 0 24 24">'+IC[n]+'</svg>';
const ib=(n,f,extra)=>{const b=h('button',extra||'');b.innerHTML=svg(n);b.onclick=f;return b};
const fico=()=>{const s=h('span');s.innerHTML=svg('file');return s};

/* ---------- accent colors ---------- */
const ACC=[['#2F6FED','#49C7E8'],['#7C3AED','#C084FC'],['#059669','#34D399'],['#EA580C','#FBBF24'],['#DB2777','#F472B6']];
function setAcc(i){const[a,b]=ACC[i],r=document.documentElement.style;r.setProperty('--a',a);r.setProperty('--g','linear-gradient(135deg,'+a+','+b+')');document.querySelectorAll('#sw button').forEach((e,j)=>e.classList.toggle('on',j===i));try{localStorage.setItem('ax-acc',i)}catch(e){}}
ACC.forEach((c,i)=>{const b=h('button');b.style.background='linear-gradient(135deg,'+c[0]+','+c[1]+')';b.onclick=()=>setAcc(i);$('#sw').append(b)});
try{setAcc(+(localStorage.getItem('ax-acc'))||0)}catch(e){setAcc(0)}

/* ---------- theme ---------- */
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem('ax-theme',t)}catch(e){}};
try{setTheme(localStorage.getItem('ax-theme')||'light')}catch(e){}
$('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');

/* ---------- small helpers ---------- */
let rt;const sched=()=>{clearTimeout(rt);rt=setTimeout(render,60)};
const getU=uid=>{if(!U[uid]){U[uid]={};db.ref('users/'+uid).get().then(s=>{U[uid]=s.val()||{};sched()})}return U[uid]};
const dn=(uid,fb)=>getU(uid).displayName||fb||'?';
function paint(el,uid,name){const u=getU(uid);el.style.background=u.avatar?'url('+u.avatar+') center/cover':col(name);el.textContent=u.avatar?'':(dn(uid,name)[0]||'?').toUpperCase()}
const rd=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)});
async function shrink(f,max,q,sq){const im=new Image();im.src=await rd(f);await im.decode();let w=im.width,hh=im.height,sx=0,sy=0,sw=w,sh=hh;
 if(sq){const m=Math.min(w,hh);sx=(w-m)/2;sy=(hh-m)/2;sw=sh=w=hh=m}
 const k=Math.min(1,max/Math.max(w,hh)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(hh*k);
 const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,sx,sy,sw,sh,0,0,c.width,c.height);return c.toDataURL('image/jpeg',q)}
const ld=(id,f)=>{if(M[id])return f(M[id]);db.ref('media/'+id+'/data').get().then(s=>{if(s.val()){M[id]=s.val();f(M[id])}})};
function lnk(t){const f=document.createDocumentFragment();let i=0;t.replace(/https?:\/\/[^\s<]+/g,(u,p)=>{f.append(t.slice(i,p));const a=h('a','',u);a.href=u;a.target='_blank';a.rel='noopener noreferrer';f.append(a);i=p+u.length;return u});f.append(t.slice(i));return f}

/* ---------- nav ---------- */
function go(v){if(v==='dev'&&!isDeveloper())v='chat';view=v;document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));if(v==='dev')devLoad()}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));

/* ---------- auth + profile ---------- */
function fillMe(){$('#who').textContent=dn(me.uid,uname);paint($('#pav'),me.uid,uname);$('#dnin').value=getU(me.uid).displayName||uname}
const openAuth=()=>{$('#mout').hidden=!me;$('#min').hidden=!!me;$('#devbtn').hidden=!isDeveloper();if(me)fillMe();$('#modal').hidden=false};
$('#acc').onclick=openAuth;$('#mx').onclick=()=>$('#modal').hidden=true;
$('#logout').onclick=()=>{auth.signOut();$('#modal').hidden=true};
$('#devbtn').onclick=()=>{$('#modal').hidden=true;go('dev')};
$('#pav').onclick=()=>$('#avin').click();
$('#avin').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||!me)return;try{const a=await shrink(f,160,.8,true);await db.ref('users/'+me.uid+'/avatar').set(a);U[me.uid]={...getU(me.uid),avatar:a};fillMe();render();toast('Photo updated')}catch(x){toast('Failed to update photo')}};
$('#dnsave').onclick=async()=>{const v=$('#dnin').value.trim();if(v.length<2||v.length>24)return toast('Name must be 2-24 characters');try{await db.ref('users/'+me.uid+'/displayName').set(v);U[me.uid]={...getU(me.uid),displayName:v};fillMe();render();toast('Name updated')}catch(x){toast('Failed to update name')}};
async function cred(reg){const u=$('#au').value.trim(),p=$('#ap').value;
 if(!/^[a-zA-Z0-9_]{3,20}$/.test(u))return toast('Username: 3-20 letters, numbers or _');if(p.length<6)return toast('Password must be 6+ characters');
 const k=u.toLowerCase(),email=k+'@aetherx.local';
 try{if(reg){if((await db.ref('usernames/'+k).get()).exists())return toast('Username already taken');
  const c=await auth.createUserWithEmailAndPassword(email,p);await db.ref('usernames/'+k).set(c.user.uid);await db.ref('users/'+c.user.uid).set({username:u})}
 else await auth.signInWithEmailAndPassword(email,p);
 $('#modal').hidden=true;$('#ap').value=''}catch(e){toast(e.code==='auth/email-already-in-use'?'Username already taken':'Wrong username or password')}}
$('#login').onclick=()=>cred(false);$('#reg').onclick=()=>cred(true);
auth.onAuthStateChanged(async u=>{me=u;isDev=false;uname='';
 if(u){const[a,b]=await Promise.all([db.ref('users/'+u.uid).get(),db.ref('usernames/'+DEV).get()]);U[u.uid]=a.val()||{};uname=U[u.uid].username||'';isDev=b.val()===u.uid}
 spReady=true;$('#inp').disabled=!me;$('#inp').placeholder=me?'Write a message…':'Log in to send messages';if(view==='dev'&&!isDev)go('chat');render();mineWatch()});
db.ref('usernames/'+DEV).on('value',s=>{devUid=s.val();sched()});
db.ref('config/links/discord').on('value',s=>{const a=$('#dc'),v=s.val();a.hidden=!v;if(v)a.href=v});
db.ref('config/announcement').on('value',s=>{const v=s.val(),a=$('#ann');a.hidden=!v;a.textContent=v||''});
db.ref('.info/connected').on('value',s=>{if(s.val()){const r=db.ref('presence').push();r.onDisconnect().remove();r.set(TS)}});
db.ref('presence').on('value',s=>{$('#onl').textContent=s.numChildren();$('#sOn').textContent=s.numChildren()});

/* ---------- typing indicator ---------- */
function setTyping(on){if(!me)return;const r=db.ref('typing/'+me.uid);if(on){r.onDisconnect().remove();r.set({name:dn(me.uid,uname),time:TS})}else r.remove()}
db.ref('typing').on('value',s=>{const t=$('#typing'),others=[];s.forEach(c=>{if(!me||c.key!==me.uid)if(Date.now()-(c.val().time||0)<6000)others.push(c.val().name)});
 if(others.length){t.hidden=false;t.textContent=(others.length===1?others[0]+' is typing…':others.length+' people are typing…')}else t.hidden=true});

/* ---------- chat ---------- */
const dl=d=>{const t=new Date(),y=new Date(Date.now()-864e5);return d.toDateString()===t.toDateString()?'Today':d.toDateString()===y.toDateString()?'Yesterday':d.toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})};
db.ref('globalChat').orderByChild('time').limitToLast(100).on('value',s=>{msgs=[];s.forEach(c=>{msgs.push({id:c.key,...c.val()})});render();notify()});
function media(m,b){if(!m.mid)return;
 if(m.kind==='img'){const im=h('img','mimg');im.onclick=()=>{$('#lb img').src=im.src;$('#lb').hidden=false};im.onload=()=>{if(stuck)$('#msgs').scrollTop=1e9};ld(m.mid,d=>im.src=d);b.append(im)}
 else{const a=h('a','fchip');a.append(fico(),h('span','',(m.fname||'file')+' · '+Math.max(1,Math.ceil((m.fsize||0)/1024))+' KB'));ld(m.mid,d=>{a.href=d;a.download=m.fname||'file'});b.append(a)}}
function reacts(m,b){const likes=m.likes||{},keys=Object.keys(likes),mine=me&&likes[me.uid];
 const r=h('div','react'+(mine?' on':''));r.innerHTML=svg('heart')+(keys.length?'<b>'+keys.length+'</b>':'');
 r.onclick=()=>{if(!me)return openAuth();db.ref('globalChat/'+m.id+'/likes/'+me.uid).set(mine?null:true)};b.append(r)}
function render(){const box=$('#msgs');stuck=box.scrollHeight-box.scrollTop-box.clientHeight<90;box.textContent='';let pd='',pu=null;
 if(!msgs.length)box.append(h('div','empty','No messages yet. Say hi.'));
 msgs.forEach(m=>{const d=new Date(m.time),k=d.toDateString();if(k!==pd){pd=k;pu=null;box.append(h('div','sep',dl(d)))}
  const mine=me&&m.uid===me.uid,first=pu!==m.uid;pu=m.uid;
  const row=h('div','row'+(mine?' mine':'')+(first?' first':''));row.dataset.id=m.id;
  if(!mine){const av=h('div','av'+(first?'':' ghost'));paint(av,m.uid,m.name);row.append(av)}
  const t=(m.text||'').toLowerCase(),ment=me&&!mine&&uname&&(t.includes('@'+uname.toLowerCase())||t.includes('@'+dn(me.uid,uname).toLowerCase()));
  const b=h('div','bub'+(ment?' ment':''));
  if(first&&!mine){const n=h('div','nm',dn(m.uid,m.name));n.style.color=col(m.name);if(m.uid===devUid)n.append(h('span','dtag','DEV'));b.append(n)}
  if(m.replyTo){const q=h('div','quote');q.append(h('b','',m.replyTo.name),h('span','',m.replyTo.text));
   q.onclick=()=>{const tgt=document.querySelector('[data-id="'+m.replyTo.id+'"]');if(!tgt)return toast('Original message is older');tgt.scrollIntoView({block:'center',behavior:'smooth'});tgt.classList.add('flash');setTimeout(()=>tgt.classList.remove('flash'),1400)};b.append(q)}
  media(m,b);if(m.text){const tx=h('div','tx');tx.append(lnk(m.text));b.append(tx)}
  const mt=h('div','meta');mt.append(h('span','',d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})));if(m.edited)mt.append(h('span','','edited'));b.append(mt);
  reacts(m,b);
  const ac=h('div','acts');
  if(m.text)ac.append(ib('copy',()=>copy(m.text)));
  if(me&&!mine)ac.append(ib('reply',()=>{reply={id:m.id,name:dn(m.uid,m.name),text:(m.text||'['+(m.kind==='img'?'photo':'file')+']').slice(0,80)};editing=null;bar('Replying to '+reply.name+': '+reply.text);$('#inp').focus()}));
  if(mine&&m.text&&Date.now()-m.time<3e5)ac.append(ib('edit',()=>{editing=m.id;reply=null;bar('Editing message');$('#inp').value=m.text;$('#inp').focus()}));
  if(mine||isDeveloper())ac.append(ib('del',()=>confirm('Delete this message?')&&db.ref().update({['globalChat/'+m.id]:null,...(m.mid?{['media/'+m.mid]:null}:{})})));
  if(ac.children.length)b.append(ac);row.append(b);box.append(row)});
 if(stuck)box.scrollTop=box.scrollHeight;$('#down').hidden=stuck}
const bar=(t,img)=>{$('#bar').hidden=!t;const e=$('#bart');e.textContent='';if(img){const i=h('img','thumb');i.src=img;e.append(i)}e.append(t||'')};
$('#barx').onclick=()=>{reply=null;editing=null;att=null;$('#inp').value='';bar()};
$('#lb').onclick=()=>$('#lb').hidden=true;

/* ---------- attach menu ---------- */
const am=$('#amenu');
$('#att').onclick=e=>{e.stopPropagation();if(!me)return openAuth();am.hidden=!am.hidden;$('#egrid').hidden=true};
document.addEventListener('click',e=>{if(!am.contains(e.target))am.hidden=true});
$('#acam').onclick=()=>{am.hidden=true;$('#fcam').click()};
$('#aimg').onclick=()=>{am.hidden=true;$('#fimg').click()};
$('#afile').onclick=()=>{am.hidden=true;$('#ffile').click()};
$('#aemo').onclick=e=>{e.stopPropagation();$('#egrid').hidden=!$('#egrid').hidden};
'😀😂😍😎😭😡👍👏🙏🔥✨💯🎉❤️👀🤝😅🤔😴🥳💀🫡😮‍💨'.match(/\p{Extended_Pictographic}\uFE0F?/gu).forEach(x=>$('#egrid').append(btn(x,()=>{$('#inp').value+=x;$('#inp').focus()})));
async function pick(f){if(!f)return;
 try{if(f.type.startsWith('image/')){att={kind:'img',name:f.name||'photo.jpg',data:await shrink(f,900,.75)}}
  else{if(f.size>7e5)return toast('File too big (max 700 KB)');att={kind:'file',name:f.name,size:f.size,data:await rd(f)}}
  reply=null;editing=null;bar(att.name+' · press Send',att.kind==='img'?att.data:null)}catch(x){toast('Could not read file')}}
['fcam','fimg','ffile'].forEach(id=>$('#'+id).onchange=e=>{const f=e.target.files[0];e.target.value='';pick(f)});
$('#inp').onpaste=e=>{const f=[...(e.clipboardData?e.clipboardData.files:[])][0];if(f&&me){e.preventDefault();pick(f)}};
$('#msgs').onscroll=()=>{const b=$('#msgs');$('#down').hidden=b.scrollHeight-b.scrollTop-b.clientHeight<90};
$('#down').onclick=()=>{$('#msgs').scrollTop=1e9};
$('#inp').oninput=()=>{setTyping(true);clearTimeout(typeT);typeT=setTimeout(()=>setTyping(false),2500)};
function notify(){const l=msgs[msgs.length-1];if(!l)return;if(seen!==null&&l.id!==seen&&me&&l.uid!==me.uid&&document.hidden){unread++;document.title='('+unread+') Aether X';if(snd)beep()}seen=l.id}

/* ---------- send ---------- */
async function send(){if(!me)return openAuth();const t=$('#inp').value.trim().slice(0,300);if(!t&&!att)return;if(Date.now()-last<2000)return toast('Wait 2 seconds');last=Date.now();
 try{if(editing){if(!t)return;await db.ref('globalChat/'+editing).update({text:t,edited:true})}
  else{const o={uid:me.uid,name:uname,text:t,time:TS,replyTo:reply,edited:false};
   if(att){const mid=db.ref('media').push().key;await db.ref('media/'+mid).set({uid:me.uid,kind:att.kind,name:att.name,data:att.data});o.mid=mid;o.kind=att.kind;o.fname=att.name;if(att.size)o.fsize=att.size}
   await db.ref('globalChat').push(o)}
  $('#inp').value='';reply=null;editing=null;att=null;bar();setTyping(false)}catch(e){toast('Failed to send')}}
$('#send').onclick=send;$('#inp').onkeydown=e=>{if(e.key==='Enter')send()};

/* ---------- sound ---------- */
const bgm=$('#bgm');bgm.volume=.4;
let snd=true;try{snd=localStorage.getItem('ax-snd')!=='0'}catch(e){}
function paintSnd(){$('#snd').classList.toggle('on',snd)}
function beep(){try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.05;o.start();o.stop(c.currentTime+.12)}catch(e){}}
function stopAll(){bgm.pause()}
function playAll(){if(!snd||document.hidden)return;bgm.play().catch(()=>{})}
let audioUnlocked=false;
function unlockAudio(){audioUnlocked=true;$('#soundchip').hidden=true;playAll()}
['pointerdown','touchstart','keydown'].forEach(ev=>addEventListener(ev,()=>{if(!audioUnlocked)unlockAudio()},{passive:true}));
setTimeout(()=>{if(!audioUnlocked&&snd)$('#soundchip').hidden=false},1200);
$('#soundchip').onclick=unlockAudio;
$('#snd').onclick=()=>{snd=!snd;try{localStorage.setItem('ax-snd',snd?'1':'0')}catch(e){}paintSnd();if(snd)unlockAudio();else stopAll()};
paintSnd();
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();else{unread=0;document.title='Aether X';playAll()}});

/* ---------- loader modes ---------- */
let lmode='protect';const TAG='--[[AXOBF1]]';
function obfLua(src){const key=1+Math.floor(Math.random()*251);const bytes=[...new TextEncoder().encode(src)].map(b=>b^key);
 return TAG+'local k,d='+key+',{'+bytes.join(',')+'}local s={}for i=1,#d do s[i]=string.char(d[i]~k)end return(load or loadstring)(table.concat(s))()'}
function deobfLua(src){if(!src.includes(TAG))return null;const m=src.match(/local k,d=(\d+),\{([\d,]*)\}/);if(!m)return null;
 const key=+m[1],bytes=m[2].split(',').filter(Boolean).map(Number);return new TextDecoder().decode(new Uint8Array(bytes.map(b=>b^key)))}
function setLmode(m){lmode=m;document.querySelectorAll('#lmode button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
 const protect=m==='protect';
 $('#lname').style.display=protect?'':'none';$('#imp').style.display=protect?'':'none';
 $('#gen').textContent=protect?(editLoader?'Save changes':'Generate loader'):m==='obf'?'Obfuscate':'Deobfuscate';
 $('#out').hidden=true;document.querySelectorAll('#v-loader h3,#lq,#mine').forEach(e=>e.style.display=protect?'':'none');setStep(1)}
document.querySelectorAll('#lmode button').forEach(b=>b.onclick=()=>setLmode(b.dataset.m));

/* ---------- loader ---------- */
const setStep=n=>[1,2,3].forEach(i=>$('#s'+i).classList.toggle('on',i<=n));
function resetForm(){editLoader=null;$('#lname').value='';$('#lname').readOnly=false;$('#lcode').value='';$('#gen').textContent='Generate loader';setStep(1)}
$('#gen').onclick=async()=>{
 if(lmode==='obf'){const code=$('#lcode').value;if(!code.trim())return toast('Paste code to obfuscate');const out=obfLua(code);$('#out').textContent=out;$('#out').hidden=false;await copy(out);return}
 if(lmode==='deobf'){const code=$('#lcode').value;const out=deobfLua(code);if(!out)return toast('Not recognized as an Aether X obfuscated script');$('#out').textContent=out;$('#out').hidden=false;await copy(out);return}
 if(!me)return openAuth();const name=$('#lname').value.trim(),code=$('#lcode').value,slug=slugify(name);
 if(!slug||!code.trim())return toast('Enter a name and code');setStep(2);const r=db.ref('loaders/'+slug);
 try{if(editLoader)await r.update({code,updated:Date.now()});
  else{if((await r.get()).exists()){setStep(1);return toast('Name already taken')}await r.set({code,name,ownerUid:me.uid,created:Date.now(),updated:Date.now()})}
  const sn=snip(slug);$('#out').textContent=sn;$('#out').hidden=false;await copy(sn);setStep(3);editLoader=null;$('#lname').readOnly=false;$('#gen').textContent='Generate loader'}
 catch(e){setStep(1);toast('Failed: '+e.message)}};
let mineRef=null;
function filterMine(){const q=$('#lq').value.trim().toLowerCase();document.querySelectorAll('#mine .item').forEach(e=>e.hidden=!!q&&!e.dataset.n.includes(q))}
$('#lq').oninput=filterMine;
function mineWatch(){if(mineRef)mineRef.off();const l=$('#mine');l.textContent='';if(!me)return l.append(h('div','card','Log in to create loaders.'));
 mineRef=db.ref('loaders').orderByChild('ownerUid').equalTo(me.uid);
 mineRef.on('value',s=>{l.textContent='';if(!s.exists())return l.append(h('div','card','No loaders yet. Create your first one above.'));
  s.forEach(c=>{const v=c.val(),slug=c.key,it=h('div','card item'),i=h('div');
   i.append(h('b','',v.name||slug),h('small','','/loaders/'+slug+' · '+(v.code||'').length+' chars'));
   const a=h('div','two');a.append(btn('Copy',()=>copy(snip(slug)),'ghost'),btn('Code',()=>copy(v.code||''),'ghost'),btn('Edit',()=>{editLoader=slug;$('#lname').value=v.name||slug;$('#lname').readOnly=true;$('#lcode').value=v.code;$('#gen').textContent='Save changes';$('#out').hidden=true;setStep(1);$('#v-loader').scrollTop=0},'ghost'),btn('Delete',()=>confirm('Delete this loader?')&&c.ref.remove(),'ghost danger'));
   it.dataset.n=((v.name||slug)+' '+slug).toLowerCase();it.append(i,a);l.append(it)});filterMine()})}
$('#imp').onclick=()=>$('#fimp').click();
$('#fimp').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;if(f.size>5e5)return toast('File too big (max 500 KB)');$('#lcode').value=await f.text();if(!$('#lname').value&&!editLoader)$('#lname').value=f.name.replace(/\.[^.]+$/,'');toast('Imported '+f.name)};

/* ---------- developer ---------- */
async function devLoad(){if(!isDeveloper())return;
 $('#dcin').value=(await db.ref('config/links/discord').get()).val()||'';$('#anin').value=(await db.ref('config/announcement').get()).val()||'';$('#mcode').value=(await db.ref('loaders/__main__/code').get()).val()||'';
 try{const j=await(await fetch(DBURL+'/loaders.json?shallow=true')).json();$('#sLd').textContent=j?Object.keys(j).filter(k=>k!=='__main__').length:0}catch(e){}}
const dev=(f,ok)=>async()=>{if(!isDeveloper())return;try{await f();toast(ok)}catch(e){toast('Denied')}};
$('#dcsave').onclick=dev(()=>db.ref('config/links/discord').set($('#dcin').value.trim()),'Saved');
$('#ansave').onclick=dev(()=>db.ref('config/announcement').set($('#anin').value.trim()),'Published');
$('#msave').onclick=dev(()=>db.ref('loaders/__main__').update({code:$('#mcode').value,updated:Date.now()}),'Saved');
$('#clear').onclick=()=>{if(isDeveloper()&&confirm('Delete all loaded messages?')){const u={};msgs.forEach(m=>{u['globalChat/'+m.id]=null;if(m.mid)u['media/'+m.mid]=null});db.ref().update(u).then(()=>toast('Chat cleared')).catch(()=>toast('Denied'))}};
$('#mcopy').onclick=()=>copy(snip());
