firebase.initializeApp({apiKey:"AIzaSyDRcucG7Qr9EKySpSPY2UglZ_WQTmhf6Uo",authDomain:"script-web-8d4a7.firebaseapp.com",databaseURL:"https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"script-web-8d4a7",storageBucket:"script-web-8d4a7.firebasestorage.app",messagingSenderId:"529307129610",appId:"1:529307129610:web:a3f2e4a3b6e0791cec8cf3"});
const auth=firebase.auth(),db=firebase.database(),$=s=>document.querySelector(s),DEV='michellyjow',DBURL='https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app';
let me=null,isDev=false,uname='',msgs=[],reply=null,editing=null,last=0,editLoader=null,view='chat';
const isDeveloper=()=>isDev;
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const btn=(t,f,c)=>{const b=h('button',c||'',t);b.onclick=f;return b};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const copy=async t=>{try{await navigator.clipboard.writeText(t);toast('Copied')}catch(e){toast('Copy manually')}};
const PAL=['#2F6FED','#D9480F','#2B8A3E','#9C36B5','#C2255C','#0B7285'];
const col=n=>{let x=0;for(const c of String(n).toLowerCase())x=(x*31+c.charCodeAt(0))>>>0;return PAL[x%PAL.length]};
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
const snip=slug=>'loadstring(game:HttpGet("'+location.origin+(slug?'/loaders/'+slug:'/loader')+'"))()';
/* theme */
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem('ax-theme',t)}catch(e){}};
try{setTheme(localStorage.getItem('ax-theme')||'light')}catch(e){}
$('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
/* nav */
function go(v){if(v==='dev'&&!isDeveloper())v='chat';view=v;document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));if(v==='dev')devLoad()}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));
/* auth */
const openAuth=()=>{$('#mout').hidden=!me;$('#min').hidden=!!me;$('#devbtn').hidden=!isDeveloper();if(me){$('#who').textContent=uname;$('#meav').textContent=(uname[0]||'?').toUpperCase();$('#meav').style.background=col(uname)}$('#modal').hidden=false};
$('#acc').onclick=openAuth;$('#mx').onclick=()=>$('#modal').hidden=true;
$('#logout').onclick=()=>{auth.signOut();$('#modal').hidden=true};
$('#devbtn').onclick=()=>{$('#modal').hidden=true;go('dev')};
async function cred(reg){const u=$('#au').value.trim(),p=$('#ap').value;
 if(!/^[a-zA-Z0-9_]{3,20}$/.test(u))return toast('Username: 3-20 letters, numbers or _');if(p.length<6)return toast('Password must be 6+ characters');
 const k=u.toLowerCase(),email=k+'@aetherx.local';
 try{if(reg){if((await db.ref('usernames/'+k).get()).exists())return toast('Username already taken');
  const c=await auth.createUserWithEmailAndPassword(email,p);await db.ref('usernames/'+k).set(c.user.uid);await db.ref('users/'+c.user.uid).set({username:u})}
 else await auth.signInWithEmailAndPassword(email,p);
 $('#modal').hidden=true;$('#ap').value=''}catch(e){toast(e.code==='auth/email-already-in-use'?'Username already taken':'Wrong username or password')}}
$('#login').onclick=()=>cred(false);$('#reg').onclick=()=>cred(true);
auth.onAuthStateChanged(async u=>{me=u;isDev=false;uname='';
 if(u){const[a,b]=await Promise.all([db.ref('users/'+u.uid+'/username').get(),db.ref('usernames/'+DEV).get()]);uname=a.val()||'';isDev=b.val()===u.uid}
 $('#inp').disabled=!me;$('#inp').placeholder=me?'Write a message…':'Log in to send messages';if(view==='dev'&&!isDev)go('chat');render();mineWatch()});
db.ref('config/links/discord').on('value',s=>{const a=$('#dc'),v=s.val();a.hidden=!v;if(v)a.href=v});
db.ref('config/announcement').on('value',s=>{const v=s.val(),a=$('#ann');a.hidden=!v;a.textContent=v?'📌 '+v:''});
/* presence */
db.ref('.info/connected').on('value',s=>{if(s.val()){const r=db.ref('presence').push();r.onDisconnect().remove();r.set(firebase.database.ServerValue.TIMESTAMP)}});
db.ref('presence').on('value',s=>{$('#onl').textContent=s.numChildren();$('#sOn').textContent=s.numChildren()});
/* chat */
const dl=d=>{const t=new Date(),y=new Date(Date.now()-864e5);return d.toDateString()===t.toDateString()?'Today':d.toDateString()===y.toDateString()?'Yesterday':d.toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})};
db.ref('globalChat').orderByChild('time').limitToLast(100).on('value',s=>{msgs=[];s.forEach(c=>{msgs.push({id:c.key,...c.val()})});render()});
function render(){const box=$('#msgs'),stick=box.scrollHeight-box.scrollTop-box.clientHeight<90;box.textContent='';let pd='',pu=null;
 if(!msgs.length)box.append(h('div','empty','No messages yet. Say hi 👋'));
 msgs.forEach(m=>{const d=new Date(m.time),k=d.toDateString();if(k!==pd){pd=k;pu=null;box.append(h('div','sep',dl(d)))}
  const mine=me&&m.uid===me.uid,first=pu!==m.uid;pu=m.uid;
  const row=h('div','row'+(mine?' mine':'')+(first?' first':''));
  if(!mine){const av=h('div','av'+(first?'':' ghost'),(m.name||'?')[0].toUpperCase());av.style.background=col(m.name);row.append(av)}
  const ment=me&&!mine&&uname&&m.text.toLowerCase().includes('@'+uname.toLowerCase());
  const b=h('div','bub'+(ment?' ment':''));
  if(first&&!mine){const n=h('div','nm',m.name);n.style.color=col(m.name);b.append(n)}
  if(m.replyTo){const q=h('div','quote');q.append(h('b','',m.replyTo.name),h('span','',m.replyTo.text));b.append(q)}
  b.append(h('div','tx',m.text));
  const mt=h('div','meta');mt.append(h('span','',d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})));if(m.edited)mt.append(h('span','','edited'));b.append(mt);
  const ac=h('div','acts');
  ac.append(btn('⧉',()=>copy(m.text)));
  if(me&&!mine)ac.append(btn('↩',()=>{reply={id:m.id,name:m.name,text:m.text.slice(0,80)};editing=null;bar('Replying to '+m.name+': '+reply.text);$('#inp').focus()}));
  if(mine&&Date.now()-m.time<3e5)ac.append(btn('✎',()=>{editing=m.id;reply=null;bar('Editing message');$('#inp').value=m.text;cnt();$('#inp').focus()}));
  if(mine||isDeveloper())ac.append(btn('🗑',()=>confirm('Delete this message?')&&db.ref('globalChat/'+m.id).remove()));
  b.append(ac);row.append(b);box.append(row)});
 if(stick)box.scrollTop=box.scrollHeight}
const bar=t=>{$('#bar').hidden=!t;$('#bart').textContent=t||''};
const cnt=()=>$('#cnt').textContent=$('#inp').value.length+'/300';
$('#inp').oninput=cnt;
$('#barx').onclick=()=>{reply=null;editing=null;$('#inp').value='';cnt();bar()};
async function send(){if(!me)return openAuth();const t=$('#inp').value.trim().slice(0,300);if(!t)return;if(Date.now()-last<2000)return toast('Wait 2 seconds');last=Date.now();$('#inp').value='';cnt();
 try{if(editing)await db.ref('globalChat/'+editing).update({text:t,edited:true});
  else await db.ref('globalChat').push({uid:me.uid,name:uname,text:t,time:firebase.database.ServerValue.TIMESTAMP,replyTo:reply,edited:false});
  reply=null;editing=null;bar()}catch(e){toast('Failed to send')}}
$('#send').onclick=send;$('#inp').onkeydown=e=>{if(e.key==='Enter')send()};
/* loader */
const setStep=n=>[1,2,3].forEach(i=>$('#s'+i).classList.toggle('on',i<=n));
function resetForm(){editLoader=null;$('#lname').value='';$('#lname').readOnly=false;$('#lcode').value='';$('#gen').textContent='Generate loader';setStep(1)}
$('#gen').onclick=async()=>{if(!me)return openAuth();const name=$('#lname').value.trim(),code=$('#lcode').value,slug=slugify(name);
 if(!slug||!code.trim())return toast('Enter a name and code');setStep(2);const r=db.ref('loaders/'+slug);
 try{if(editLoader)await r.update({code,updated:Date.now()});
  else{if((await r.get()).exists()){setStep(1);return toast('Name already taken')}await r.set({code,name,ownerUid:me.uid,created:Date.now(),updated:Date.now()})}
  const sn=snip(slug);$('#out').textContent=sn;$('#out').hidden=false;await copy(sn);setStep(3);editLoader=null;$('#lname').readOnly=false;$('#gen').textContent='Generate loader'}
 catch(e){setStep(1);toast('Failed: '+e.message)}};
let mineRef=null;
function mineWatch(){if(mineRef)mineRef.off();const l=$('#mine');l.textContent='';if(!me)return l.append(h('div','card','Log in to create loaders.'));
 mineRef=db.ref('loaders').orderByChild('ownerUid').equalTo(me.uid);
 mineRef.on('value',s=>{l.textContent='';if(!s.exists())return l.append(h('div','card','No loaders yet. Create your first one above.'));
  s.forEach(c=>{const v=c.val(),slug=c.key,it=h('div','card item'),i=h('div');
   i.append(h('b','',v.name||slug),h('small','','/loaders/'+slug+' · '+(v.code||'').length+' chars'));
   const a=h('div','two');a.append(btn('Copy',()=>copy(snip(slug)),'ghost'),btn('Edit',()=>{editLoader=slug;$('#lname').value=v.name||slug;$('#lname').readOnly=true;$('#lcode').value=v.code;$('#gen').textContent='Save changes';$('#out').hidden=true;setStep(1);$('#v-loader').scrollTop=0},'ghost'),btn('Delete',()=>confirm('Delete this loader?')&&c.ref.remove(),'ghost danger'));
   it.append(i,a);l.append(it)})})}
/* developer */
async function devLoad(){if(!isDeveloper())return;
 $('#dcin').value=(await db.ref('config/links/discord').get()).val()||'';$('#anin').value=(await db.ref('config/announcement').get()).val()||'';$('#mcode').value=(await db.ref('loaders/__main__/code').get()).val()||'';
 try{const j=await(await fetch(DBURL+'/loaders.json?shallow=true')).json();$('#sLd').textContent=j?Object.keys(j).filter(k=>k!=='__main__').length:0}catch(e){}}
const dev=(f,ok)=>async()=>{if(!isDeveloper())return;try{await f();toast(ok)}catch(e){toast('Denied')}};
$('#dcsave').onclick=dev(()=>db.ref('config/links/discord').set($('#dcin').value.trim()),'Saved');
$('#ansave').onclick=dev(()=>db.ref('config/announcement').set($('#anin').value.trim()),'Published');
$('#msave').onclick=dev(()=>db.ref('loaders/__main__').update({code:$('#mcode').value,updated:Date.now()}),'Saved');
$('#clear').onclick=()=>{if(isDeveloper()&&confirm('Delete all loaded messages?')){const u={};msgs.forEach(m=>u[m.id]=null);db.ref('globalChat').update(u).then(()=>toast('Chat cleared')).catch(()=>toast('Denied'))}};
$('#mcopy').onclick=()=>copy(snip());
