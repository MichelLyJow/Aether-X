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
const VERIFY='<path d="M12 2l2.4 1.4 2.8-.4 1.1 2.6 2.6 1.1-.4 2.8L22 12l-1.4 2.4.4 2.8-2.6 1.1-1.1 2.6-2.8-.4L12 22l-2.4-1.4-2.8.4-1.1-2.6-2.6-1.1.4-2.8L2 12l1.4-2.4-.4-2.8 2.6-1.1 1.1-2.6 2.8.4z"/><path d="M8.5 12.2l2.3 2.3 4.5-4.8" fill="none" stroke="#fff" stroke-width="1.8"/>';
function badges(uid,isDev){const f=document.createDocumentFragment();
 const bd=isDev?{verified:true,staff:true}:(getU(uid).badges||{});
 if(bd.verified){const s=h('span','bverify');s.innerHTML='<svg viewBox="0 0 24 24" fill="#2F6FED">'+VERIFY+'</svg>';s.title='Verified';f.append(s)}
 if(bd.staff){const im=h('img','bstaff');im.src='/logo.png';im.title='Developer / Moderator';im.onerror=()=>im.remove();f.append(im)}
 return f}

/* ---------- accent colors ---------- */
const ACC=[['#18181B','#2F6FED'],['#2F6FED','#49C7E8'],['#7C3AED','#C084FC'],['#059669','#34D399'],['#EA580C','#FBBF24'],['#DB2777','#F472B6']];
function setAcc(i){const[a,b]=ACC[i],r=document.documentElement.style;r.setProperty('--a',a);r.setProperty('--g','linear-gradient(135deg,'+a+','+b+')');document.querySelectorAll('#sw button').forEach((e,j)=>e.classList.toggle('on',j===i));try{localStorage.setItem('ax-acc',i)}catch(e){}}
ACC.forEach((c,i)=>{const b=h('button');b.style.background='linear-gradient(135deg,'+c[0]+','+c[1]+')';b.onclick=()=>setAcc(i);$('#sw').append(b)});
try{const v=localStorage.getItem('ax-acc');setAcc(v===null?0:+v)}catch(e){setAcc(0)}

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
const ld=(id,f,onfail)=>{if(M[id])return f(M[id]);db.ref('media/'+id+'/data').get().then(s=>{if(s.exists()){M[id]=s.val();f(M[id])}else if(onfail)onfail()}).catch(()=>{if(onfail)onfail()})};
function lnk(t){const f=document.createDocumentFragment();let i=0;t.replace(/https?:\/\/[^\s<]+/g,(u,p)=>{f.append(t.slice(i,p));const a=h('a','',u);a.href=u;a.target='_blank';a.rel='noopener noreferrer';f.append(a);i=p+u.length;return u});f.append(t.slice(i));return f}

/* ---------- nav ---------- */
function go(v){if(v==='dev'&&!isDeveloper())v='chat';view=v;document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));if(v==='dev')devLoad();if(v==='missions')renderMissions()}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));

/* ---------- auth + profile ---------- */
function fillMe(){$('#who').textContent=dn(me.uid,uname);paint($('#pav'),me.uid,uname);$('#dnin').value=getU(me.uid).displayName||uname;
 $('#whobadges').innerHTML='';$('#whobadges').append(badges(me.uid,isDeveloper()));
 const id=getU(me.uid).axid;$('#myid').textContent=id?'ID: '+id:'ID: —'}
$('#idcopy').onclick=()=>{const id=getU(me.uid).axid;if(id)copy(id);else toast('No ID yet')};
const openAuth=()=>{$('#mout').hidden=!me;$('#min').hidden=!!me;$('#devbtn').hidden=!isDeveloper();if(me)fillMe();$('#modal').hidden=false};
$('#acc').onclick=openAuth;
const closeModal=()=>$('#modal').hidden=true;
document.querySelector('#modal .backdrop').onclick=closeModal;
$('#mhandle').onclick=closeModal;
$('#logout').onclick=()=>{auth.signOut();$('#modal').hidden=true};
$('#devbtn').onclick=()=>{$('#modal').hidden=true;go('dev')};
$('#pav').onclick=()=>$('#avin').click();
$('#avin').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||!me)return;try{const a=await shrink(f,160,.8,true);await db.ref('users/'+me.uid+'/avatar').set(a);U[me.uid]={...getU(me.uid),avatar:a};fillMe();render();toast('Photo updated')}catch(x){toast('Failed to update photo')}};
$('#dnsave').onclick=async()=>{const v=$('#dnin').value.trim();if(v.length<2||v.length>24)return toast('Name must be 2-24 characters');try{await db.ref('users/'+me.uid+'/displayName').set(v);U[me.uid]={...getU(me.uid),displayName:v};fillMe();render();toast('Name updated')}catch(x){toast('Failed to update name')}};
async function cred(reg){const u=$('#au').value.trim(),p=$('#ap').value;
 if(!/^[a-zA-Z0-9_]{3,20}$/.test(u))return toast('Username: 3-20 letters, numbers or _');if(p.length<6)return toast('Password must be 6+ characters');
 const k=u.toLowerCase(),email=k+'@aetherx.local';
 try{if(reg){if((await db.ref('usernames/'+k).get()).exists())return toast('Username already taken');
  const c=await auth.createUserWithEmailAndPassword(email,p);await db.ref('usernames/'+k).set(c.user.uid);
  let id,tries=0;do{id=String(Math.floor(100000+Math.random()*900000));tries++}while(tries<8&&(await db.ref('axids/'+id).get()).exists());
  await db.ref('axids/'+id).set(c.user.uid);await db.ref('users/'+c.user.uid).set({username:u,axid:id})}
 else await auth.signInWithEmailAndPassword(email,p);
 $('#modal').hidden=true;$('#ap').value=''}catch(e){toast(e.code==='auth/email-already-in-use'?'Username already taken':'Wrong username or password')}}
$('#login').onclick=()=>cred(false);$('#reg').onclick=()=>cred(true);
auth.onAuthStateChanged(async u=>{me=u;isDev=false;uname='';
 if(u){const[a,b]=await Promise.all([db.ref('users/'+u.uid).get(),db.ref('usernames/'+DEV).get()]);U[u.uid]=a.val()||{};uname=U[u.uid].username||'';isDev=b.val()===u.uid}
 spReady=true;$('#inp').disabled=!me;$('#inp').placeholder=me?'Write a message…':'Log in to send messages';if(view==='dev'&&!isDev)go('chat');render();mineWatch()});
db.ref('usernames/'+DEV).on('value',s=>{devUid=s.val();sched()});
db.ref('config/links/discord').on('value',s=>{const a=$('#dc'),v=s.val();a.hidden=!v;if(v)a.href=v});
db.ref('config/announcement').on('value',s=>{const v=s.val(),a=$('#ann');a.hidden=!v;a.textContent=v||''});
db.ref('.info/connected').on('value',s=>{if(!s.val())return;const r=me?db.ref('presence/'+me.uid):db.ref('presence').push();r.onDisconnect().remove();r.set(me?{name:dn(me.uid,uname),time:TS}:TS)});
let onlData={};
db.ref('presence').on('value',s=>{onlData=s.val()||{};const n=s.numChildren();$('#onl').textContent=n;$('#sOn').textContent=n;paintOnl()});
function paintOnl(){const box=$('#onlpop');if(box.hidden)return;box.textContent='';const names=Object.values(onlData).filter(v=>v&&v.name).map(v=>v.name);
 if(!names.length)box.append(h('div','',(Object.keys(onlData).length)+' guest(s) online'));
 names.forEach(n=>box.append(h('div','',n)))}
$('#onlbtn').onclick=()=>{$('#onlpop').hidden=!$('#onlpop').hidden;paintOnl()};
document.addEventListener('click',e=>{if(!$('#onlbtn').contains(e.target)&&!$('#onlpop').contains(e.target))$('#onlpop').hidden=true});

/* ---------- typing indicator ---------- */
function setTyping(on){if(!me)return;const r=db.ref('typing/'+me.uid);if(on){r.onDisconnect().remove();r.set({name:dn(me.uid,uname),time:TS})}else r.remove()}
db.ref('typing').on('value',s=>{const t=$('#typing'),others=[];s.forEach(c=>{if(!me||c.key!==me.uid)if(Date.now()-(c.val().time||0)<6000)others.push(c.val().name)});
 if(others.length){t.hidden=false;t.textContent=(others.length===1?others[0]+' is typing…':others.length+' people are typing…')}else t.hidden=true});

/* ---------- chat ---------- */
const dl=d=>{const t=new Date(),y=new Date(Date.now()-864e5);return d.toDateString()===t.toDateString()?'Today':d.toDateString()===y.toDateString()?'Yesterday':d.toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})};
db.ref('globalChat').orderByChild('time').limitToLast(100).on('value',s=>{msgs=[];s.forEach(c=>{msgs.push({id:c.key,...c.val()})});render();notify()});
function media(m,b){if(!m.mid)return;
 if(m.kind==='sticker'){const im=h('img','mimg stk-msg');im.draggable=false;im.onload=()=>{if(stuck)$('#msgs').scrollTop=1e9};ldSticker(m.mid,d=>im.src=d);b.append(im);b.classList.add('stickerbub');wireLongPress(im,m.mid,m.uid);return}
 if(m.kind==='img'){const wrap=h('div','mimgwrap');const sp=h('div','mimgload','Loading photo…');wrap.append(sp);
  const im=h('img','mimg');im.hidden=true;im.onclick=()=>{$('#lb img').src=im.src;$('#lb').hidden=false};
  im.onload=()=>{sp.remove();im.hidden=false;if(stuck)$('#msgs').scrollTop=1e9};
  im.onerror=()=>{sp.textContent='Photo failed to load — tap to retry';sp.onclick=()=>{sp.textContent='Loading photo…';M[m.mid]=null;ld(m.mid,d=>im.src=d,()=>sp.textContent='Photo unavailable')}};
  wrap.append(im);
  ld(m.mid,d=>im.src=d,()=>{sp.textContent='Photo unavailable';sp.onclick=null});
  b.append(wrap)}
 else{const a=h('a','fchip');a.append(fico(),h('span','',(m.fname||'file')+' · '+Math.max(1,Math.ceil((m.fsize||0)/1024))+' KB'));ld(m.mid,d=>{a.href=d;a.download=m.fname||'file'});b.append(a)}}
function reactBtn(m){const likes=m.likes||{},keys=Object.keys(likes),mine=me&&likes[me.uid];
 const r=h('span','react'+(mine?' on':''));r.innerHTML=svg('heart')+(keys.length?'<b>'+keys.length+'</b>':'');
 r.onclick=e=>{e.stopPropagation();toggleLike(m)};return r}
function toggleLike(m){if(!me)return openAuth();const mine=!!(m.likes&&m.likes[me.uid]);db.ref('globalChat/'+m.id+'/likes/'+me.uid).set(mine?null:true)}
function render(){const box=$('#msgs');stuck=box.scrollHeight-box.scrollTop-box.clientHeight<90;box.textContent='';let pd='',pu=null;
 if(!msgs.length)box.append(h('div','empty','No messages yet. Say hi.'));
 msgs.forEach(m=>{const d=new Date(m.time),k=d.toDateString();if(k!==pd){pd=k;pu=null;box.append(h('div','sep',dl(d)))}
  const mine=me&&m.uid===me.uid,first=pu!==m.uid;pu=m.uid;
  const row=h('div','row'+(mine?' mine':'')+(first?' first':''));row.dataset.id=m.id;
  if(!mine){const av=h('div','av'+(first?'':' ghost'));paint(av,m.uid,m.name);row.append(av)}
  const t=(m.text||'').toLowerCase(),ment=me&&!mine&&uname&&(t.includes('@'+uname.toLowerCase())||t.includes('@'+dn(me.uid,uname).toLowerCase()));
  const b=h('div','bub'+(ment?' ment':''));
  if(first&&!mine){const n=h('div','nm',dn(m.uid,m.name));n.style.color=col(m.name);n.append(badges(m.uid,m.uid===devUid));if(m.uid===devUid)n.append(h('span','dtag','DEV'));b.append(n)}
  if(m.replyTo){const q=h('div','quote');q.append(h('b','',m.replyTo.name),h('span','',m.replyTo.text));
   q.onclick=()=>{const tgt=document.querySelector('[data-id="'+m.replyTo.id+'"]');if(!tgt)return toast('Original message is older');tgt.scrollIntoView({block:'center',behavior:'smooth'});tgt.classList.add('flash');setTimeout(()=>tgt.classList.remove('flash'),1400)};b.append(q)}
  media(m,b);if(m.text){const tx=h('div','tx');tx.append(lnk(m.text));b.append(tx)}
  const mt=h('div','meta');mt.append(h('span','',d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})));if(m.edited)mt.append(h('span','','edited'));mt.append(reactBtn(m));b.append(mt);
  b.ondblclick=()=>toggleLike(m);
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
   await db.ref('globalChat').push(o);bump('messages')}
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
 $('#lname').style.display=protect?'':'none';
 $('#gen').textContent=protect?(editLoader?'Save changes':'Generate loader'):m==='obf'?'Obfuscate':'Deobfuscate';
 $('#out').hidden=true;$('#outact').hidden=true;document.querySelectorAll('#v-loader h3,#lq,#mine').forEach(e=>e.style.display=protect?'':'none');setStep(1)}
document.querySelectorAll('#lmode button').forEach(b=>b.onclick=()=>setLmode(b.dataset.m));

/* ---------- loader ---------- */
const setStep=n=>[1,2,3].forEach(i=>$('#s'+i).classList.toggle('on',i<=n));
function resetForm(){editLoader=null;$('#lname').value='';$('#lname').readOnly=false;$('#lcode').value='';$('#gen').textContent='Generate loader';setStep(1)}
function showOutput(text,fname){$('#out').textContent=text;$('#out').hidden=false;$('#outact').hidden=false;
 $('#outcopy').onclick=()=>copy(text);
 $('#outdl').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}}
$('#gen').onclick=async()=>{
 if(lmode==='obf'){const code=$('#lcode').value;if(!code.trim())return toast('Paste code to obfuscate');showOutput(obfLua(code),'obfuscated.lua');return}
 if(lmode==='deobf'){const code=$('#lcode').value;const out=deobfLua(code);if(!out)return toast('Not recognized as an Aether X obfuscated script');showOutput(out,'deobfuscated.lua');return}
 if(!me)return openAuth();const name=$('#lname').value.trim(),code=$('#lcode').value,slug=slugify(name);
 if(!slug||!code.trim())return toast('Enter a name and code');setStep(2);const r=db.ref('loaders/'+slug);
 try{if(editLoader)await r.update({code,updated:Date.now()});
  else{if((await r.get()).exists()){setStep(1);return toast('Name already taken')}await r.set({code,name,ownerUid:me.uid,created:Date.now(),updated:Date.now()});bump('loaders')}
  const sn=snip(slug);showOutput(sn,'loadstring.txt');await copy(sn);setStep(3);editLoader=null;$('#lname').readOnly=false;$('#gen').textContent='Generate loader'}
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
async function findUid(id){const s=await db.ref('axids/'+id.trim()).get();return s.exists()?s.val():null}
async function toggleBadge(kind){if(!isDeveloper())return;const id=$('#bid').value.trim();if(!id)return toast('Enter an AX ID');
 const uid=await findUid(id);if(!uid)return $('#bres').textContent='No user found with that ID';
 const r=db.ref('users/'+uid+'/badges/'+kind);const cur=(await r.get()).val();await r.set(!cur);
 const nm=(await db.ref('users/'+uid+'/username').get()).val()||uid;$('#bres').textContent=nm+' — '+kind+': '+(!cur?'ON':'off')}
$('#bverif').onclick=()=>toggleBadge('verified');$('#bstaff').onclick=()=>toggleBadge('staff');
$('#clear').onclick=()=>{if(isDeveloper()&&confirm('Delete all loaded messages?')){const u={};msgs.forEach(m=>{u['globalChat/'+m.id]=null;if(m.mid)u['media/'+m.mid]=null});db.ref().update(u).then(()=>toast('Chat cleared')).catch(()=>toast('Denied'))}};
$('#mcopy').onclick=()=>copy(snip());

/* ---------- stickers ---------- */
let stkTab='mine',stkDraft=null;
const am2=$('#stkpanel');
$('#astk').onclick=e=>{e.stopPropagation();if(!me)return openAuth();am.hidden=true;am2.hidden=!am2.hidden;if(!am2.hidden)loadStickers()};
document.addEventListener('click',e=>{if(!am2.contains(e.target)&&e.target.id!=='astk')am2.hidden=true});
document.querySelectorAll('#stkTabs button').forEach(b=>b.onclick=()=>{stkTab=b.dataset.t;document.querySelectorAll('#stkTabs button').forEach(x=>x.classList.toggle('on',x===b));loadStickers()});
$('#stkAdd').onclick=()=>$('#fstk').click();
$('#fstk').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 try{const data=await shrinkPng(f,320);stkDraft=data;$('#stkPrev').src=data;$('#stkName').value='';document.querySelectorAll('#stkVis button').forEach((b,i)=>b.classList.toggle('on',i===0));$('#stkNew').hidden=false}catch(x){toast('Could not read image')}};
document.querySelectorAll('#stkVis button').forEach(b=>b.onclick=()=>document.querySelectorAll('#stkVis button').forEach(x=>x.classList.toggle('on',x===b)));
$('#stkCancel').onclick=()=>{$('#stkNew').hidden=true;stkDraft=null};
$('#stkSave').onclick=async()=>{if(!stkDraft||!me)return;const name=$('#stkName').value.trim()||'Sticker';const pub=document.querySelector('#stkVis button.on').dataset.v==='public';
 try{await db.ref('stickers').push({uid:me.uid,name,data:stkDraft,public:pub,created:TS});bump('stickers');$('#stkNew').hidden=true;stkDraft=null;toast('Sticker saved');stkTab='mine';document.querySelectorAll('#stkTabs button').forEach(x=>x.classList.toggle('on',x.dataset.t==='mine'));loadStickers()}catch(x){toast('Failed to save')}};
async function shrinkPng(f,max){const im=new Image();im.src=await rd(f);await im.decode();const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/png')}
async function loadStickers(){const grid=$('#stkGrid');grid.textContent='Loading…';
 try{let items=[];
  if(stkTab==='public'){const s=await db.ref('stickers').orderByChild('public').equalTo(true).limitToLast(60).get();s.forEach(c=>items.push({id:c.key,...c.val()}))}
  else{const own=await db.ref('stickers').orderByChild('uid').equalTo(me.uid).get();own.forEach(c=>items.push({id:c.key,...c.val()}));
   const saved=await db.ref('users/'+me.uid+'/savedStickers').get();const ids=saved.exists()?Object.keys(saved.val()):[];
   for(const id of ids){if(items.find(i=>i.id===id))continue;const s=await db.ref('stickers/'+id).get();if(s.exists())items.push({id,...s.val()})}}
  grid.textContent='';if(!items.length)grid.append(h('div','',stkTab==='mine'?'No stickers yet. Tap + to add one.':'No public stickers yet.'));
  items.reverse().forEach(it=>{const t=h('div','sticktile');const im=h('img');im.src=it.data;im.title=it.name||'';t.append(im);
   t.onclick=()=>sendSticker(it.id);grid.append(t)})}
 catch(x){console.error('loadStickers failed:',x);grid.textContent='Failed to load stickers ('+(x&&x.code||x&&x.message||'unknown error')+')'}}
async function sendSticker(id){if(!me)return;if(Date.now()-last<2000)return toast('Wait 2 seconds');last=Date.now();
 try{await db.ref('globalChat').push({uid:me.uid,name:uname,text:'',time:TS,replyTo:null,edited:false,kind:'sticker',mid:id});am2.hidden=true}catch(x){toast('Failed to send sticker')}}
const SC={};
function ldSticker(id,f){if(SC[id])return f(SC[id]);db.ref('stickers/'+id+'/data').get().then(s=>{if(s.exists()){SC[id]=s.val();f(SC[id])}})}
let pressT=null;
function wireLongPress(el,mid,ownerUid){let fired=false;
 const start=ev=>{fired=false;pressT=setTimeout(()=>{fired=true;showStkSave(el,mid,ownerUid)},2000)};
 const cancel=()=>clearTimeout(pressT);
 el.addEventListener('pointerdown',start);el.addEventListener('pointerup',cancel);el.addEventListener('pointerleave',cancel);el.addEventListener('pointercancel',cancel);
 el.addEventListener('click',e=>{if(fired)e.preventDefault()})}
function showStkSave(el,mid,ownerUid){if(me&&ownerUid===me.uid)return;const menu=$('#stkSaveMenu');const r=el.getBoundingClientRect();
 menu.style.left=Math.max(8,Math.min(r.left,window.innerWidth-160))+'px';menu.style.top=Math.max(8,r.top-46)+'px';menu.hidden=false;
 $('#stkSaveBtn').onclick=async()=>{if(!me)return openAuth();try{await db.ref('users/'+me.uid+'/savedStickers/'+mid).set(true);toast('Sticker saved to your collection')}catch(x){toast('Failed to save')}menu.hidden=true}}
document.addEventListener('click',e=>{if(!$('#stkSaveMenu').contains(e.target)&&!e.target.closest('.stk-msg'))$('#stkSaveMenu').hidden=true});

/* ---------- missions ---------- */
const MISSIONS=[
 {id:'m1',title:'First message',desc:'Send your first message in chat',reward:50,manual:false,check:s=>(s.messages||0)>=1},
 {id:'m2',title:'Chatterbox',desc:'Send 25 messages',reward:100,manual:false,check:s=>(s.messages||0)>=25},
 {id:'m3',title:'Social butterfly',desc:'Send 100 messages',reward:250,manual:false,check:s=>(s.messages||0)>=100},
 {id:'m4',title:'First loader',desc:'Create your first script loader',reward:100,manual:false,check:s=>(s.loaders||0)>=1},
 {id:'m5',title:'Loader factory',desc:'Create 5 script loaders',reward:300,manual:false,check:s=>(s.loaders||0)>=5},
 {id:'m6',title:'Sticker artist',desc:'Create your first sticker',reward:75,manual:false,check:s=>(s.stickers||0)>=1},
 {id:'m7',title:'Sticker pack',desc:'Create 5 stickers',reward:200,manual:false,check:s=>(s.stickers||0)>=5},
 {id:'m8',title:'Profile complete',desc:'Set a display name and a profile photo',reward:75,manual:false,check:(s,u)=>!!(u.displayName&&u.avatar)},
 {id:'m9',title:'Join the community',desc:'Join the Aether X Discord server',reward:50,manual:true},
];
function bump(stat){if(!me)return;db.ref('users/'+me.uid+'/stats/'+stat).transaction(v=>(v||0)+1).then(()=>{if(view==='missions')renderMissions()})}
async function renderMissions(){if(!me){$('#missionList').textContent='';$('#missionList').append(h('div','card','Log in to track missions and earn AX Points.'));$('#myPoints').textContent='0';return}
 const[uS,cS]=await Promise.all([db.ref('users/'+me.uid).get(),db.ref('users/'+me.uid+'/claimed').get()]);
 const u=uS.val()||{},stats=u.stats||{},claimed=cS.val()||{};
 $('#myPoints').textContent=u.points||0;
 const list=$('#missionList');list.textContent='';
 MISSIONS.forEach(m=>{const done=m.manual?true:!!m.check(stats,u);const got=!!claimed[m.id];
  const c=h('div','card mission'+(got?' done':''));
  const top=h('div','mtop');top.append(h('b','',m.title),h('span','mreward','+'+m.reward));c.append(top);
  c.append(h('p','',m.desc));
  const btnRow=h('div','two');
  if(got)btnRow.append(btn('Claimed',null,'ghost'));
  else if(m.manual)btnRow.append(btn('Claim reward',()=>claimMission(m),'grad'));
  else if(done)btnRow.append(btn('Claim reward',()=>claimMission(m),'grad'));
  else btnRow.append(btn(progressText(m,stats),null,'ghost'));
  c.append(btnRow);list.append(c)})}
function progressText(m,stats){
 if(m.id==='m2')return (stats.messages||0)+' / 25 messages';
 if(m.id==='m3')return (stats.messages||0)+' / 100 messages';
 if(m.id==='m5')return (stats.loaders||0)+' / 5 loaders';
 if(m.id==='m7')return (stats.stickers||0)+' / 5 stickers';
 return 'Not completed yet';}
async function claimMission(m){if(!me)return;
 try{const cRef=db.ref('users/'+me.uid+'/claimed/'+m.id);if((await cRef.get()).exists())return toast('Already claimed');
  if(!m.manual){const s=(await db.ref('users/'+me.uid+'/stats').get()).val()||{};const u=(await db.ref('users/'+me.uid).get()).val()||{};if(!m.check(s,u))return toast('Mission not completed yet')}
  await cRef.set(true);await db.ref('users/'+me.uid+'/points').transaction(v=>(v||0)+m.reward);
  toast('+'+m.reward+' AX Points!');renderMissions()}catch(e){toast('Failed to claim')}}
