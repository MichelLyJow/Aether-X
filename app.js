firebase.initializeApp({apiKey:"AIzaSyDRcucG7Qr9EKySpSPY2UglZ_WQTmhf6Uo",authDomain:"script-web-8d4a7.firebaseapp.com",databaseURL:"https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"script-web-8d4a7",storageBucket:"script-web-8d4a7.firebasestorage.app",messagingSenderId:"529307129610",appId:"1:529307129610:web:a3f2e4a3b6e0791cec8cf3"});
const auth=firebase.auth(),db=firebase.database(),$=s=>document.querySelector(s),DEV='michellyjow',DBURL='https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app';
let me=null,isDev=false,uname='',msgs=[],reply=null,editing=null,last=0,editLoader=null,view='chat';
const isDeveloper=()=>isDev;
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const btn=(t,f)=>{const b=h('button','',t);b.onclick=f;return b};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const copy=async t=>{try{await navigator.clipboard.writeText(t);toast('Tersalin')}catch(e){toast('Salin manual')}};
const PAL=['#2F6FED','#D9480F','#2B8A3E','#9C36B5','#C2255C','#0B7285'];
const col=n=>{let x=0;for(const c of String(n).toLowerCase())x=(x*31+c.charCodeAt(0))>>>0;return PAL[x%PAL.length]};
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
function go(v){if(v==='dev'&&!isDeveloper())v='chat';view=v;document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));if(v==='dev')devLoad()}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));
const openAuth=()=>{$('#mout').hidden=!me;$('#min').hidden=!!me;$('#who').textContent=me?'Masuk sebagai '+uname:'';$('#modal').hidden=false};
$('#acc').onclick=openAuth;$('#mx').onclick=()=>$('#modal').hidden=true;$('#logout').onclick=()=>{auth.signOut();$('#modal').hidden=true};
async function cred(reg){const u=$('#au').value.trim(),p=$('#ap').value;
 if(!/^[a-zA-Z0-9_]{3,20}$/.test(u))return toast('Username 3-20 huruf/angka/_');if(p.length<6)return toast('Password minimal 6');
 const k=u.toLowerCase(),email=k+'@aetherx.local';
 try{if(reg){if((await db.ref('usernames/'+k).get()).exists())return toast('Username sudah dipakai');
  const c=await auth.createUserWithEmailAndPassword(email,p);await db.ref('usernames/'+k).set(c.user.uid);await db.ref('users/'+c.user.uid).set({username:u})}
 else await auth.signInWithEmailAndPassword(email,p);
 $('#modal').hidden=true;$('#ap').value=''}catch(e){toast(e.code==='auth/email-already-in-use'?'Username sudah dipakai':'Gagal: username/password salah')}}
$('#login').onclick=()=>cred(false);$('#reg').onclick=()=>cred(true);
auth.onAuthStateChanged(async u=>{me=u;isDev=false;uname='';
 if(u){const[a,b]=await Promise.all([db.ref('users/'+u.uid+'/username').get(),db.ref('usernames/'+DEV).get()]);uname=a.val()||'';isDev=b.val()===u.uid}
 $('#navdev').hidden=!isDev;$('#inp').disabled=!me;$('#inp').placeholder=me?'Tulis pesan…':'Masuk untuk mengirim pesan';if(view==='dev'&&!isDev)go('chat');render();mineWatch()});
db.ref('config/links/discord').on('value',s=>{const a=$('#dc'),v=s.val();a.hidden=!v;if(v)a.href=v});
/* presence */
db.ref('.info/connected').on('value',s=>{if(s.val()){const r=db.ref('presence').push();r.onDisconnect().remove();r.set(firebase.database.ServerValue.TIMESTAMP)}});
db.ref('presence').on('value',s=>{$('#onl').textContent=s.numChildren();$('#sOn').textContent=s.numChildren()});
/* chat */
const dl=d=>{const t=new Date(),y=new Date(Date.now()-864e5);return d.toDateString()===t.toDateString()?'Hari ini':d.toDateString()===y.toDateString()?'Kemarin':d.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})};
db.ref('globalChat').orderByChild('time').limitToLast(100).on('value',s=>{msgs=[];s.forEach(c=>{msgs.push({id:c.key,...c.val()})});render()});
function render(){const box=$('#msgs'),stick=box.scrollHeight-box.scrollTop-box.clientHeight<90;box.textContent='';let pd='',pu=null;
 msgs.forEach(m=>{const d=new Date(m.time),k=d.toDateString();if(k!==pd){pd=k;pu=null;box.append(h('div','sep',dl(d)))}
  const mine=me&&m.uid===me.uid,first=pu!==m.uid;pu=m.uid;
  const row=h('div','row'+(mine?' mine':'')+(first?' first':''));
  if(!mine){const av=h('div','av'+(first?'':' ghost'),(m.name||'?')[0].toUpperCase());av.style.background=col(m.name);row.append(av)}
  const b=h('div','bub');
  if(first&&!mine){const n=h('div','nm',m.name);n.style.color=col(m.name);b.append(n)}
  if(m.replyTo){const q=h('div','quote');q.append(h('b','',m.replyTo.name),h('span','',m.replyTo.text));b.append(q)}
  b.append(h('div','tx',m.text));
  const mt=h('div','meta');mt.append(h('span','',d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})));if(m.edited)mt.append(h('span','','diedit'));b.append(mt);
  const ac=h('div','acts');
  if(me&&!mine)ac.append(btn('↩',()=>{reply={id:m.id,name:m.name,text:m.text.slice(0,80)};editing=null;bar('Membalas '+m.name+': '+reply.text)}));
  if(mine&&Date.now()-m.time<3e5)ac.append(btn('✎',()=>{editing=m.id;reply=null;bar('Mengedit pesan');$('#inp').value=m.text;$('#inp').focus()}));
  if(mine||isDeveloper())ac.append(btn('🗑',()=>confirm('Hapus pesan ini?')&&db.ref('globalChat/'+m.id).remove()));
  if(ac.children.length)b.append(ac);row.append(b);box.append(row)});
 if(stick)box.scrollTop=box.scrollHeight}
const bar=t=>{$('#bar').hidden=!t;$('#bart').textContent=t||''};
$('#barx').onclick=()=>{reply=null;editing=null;$('#inp').value='';bar()};
async function send(){if(!me)return openAuth();const t=$('#inp').value.trim().slice(0,300);if(!t)return;if(Date.now()-last<2000)return toast('Tunggu 2 detik');last=Date.now();$('#inp').value='';
 try{if(editing)await db.ref('globalChat/'+editing).update({text:t,edited:true});
  else await db.ref('globalChat').push({uid:me.uid,name:uname,text:t,time:firebase.database.ServerValue.TIMESTAMP,replyTo:reply,edited:false});
  reply=null;editing=null;bar()}catch(e){toast('Gagal mengirim')}}
$('#send').onclick=send;$('#inp').onkeydown=e=>{if(e.key==='Enter')send()};
/* loader */
const setStep=n=>[1,2,3].forEach(i=>$('#s'+i).classList.toggle('on',i<=n));
$('#lcode').oninput=()=>setStep($('#lcode').value.trim()?1:1);
function resetForm(){editLoader=null;$('#lname').value='';$('#lname').readOnly=false;$('#lcode').value='';$('#gen').textContent='Generate loader';setStep(1)}
$('#gen').onclick=async()=>{if(!me)return openAuth();const name=$('#lname').value.trim(),code=$('#lcode').value,slug=slugify(name);
 if(!slug||!code.trim())return toast('Isi nama dan kode');setStep(2);const r=db.ref('loaders/'+slug);
 try{if(editLoader)await r.update({code,updated:Date.now()});
  else{if((await r.get()).exists()){setStep(1);return toast('Nama sudah dipakai')}await r.set({code,name,ownerUid:me.uid,created:Date.now(),updated:Date.now()})}
  const sn='loadstring(game:HttpGet("'+location.origin+'/loaders/'+slug+'"))()';$('#out').textContent=sn;$('#out').hidden=false;await copy(sn);setStep(3);editLoader=null;$('#lname').readOnly=false;$('#gen').textContent='Generate loader'}
 catch(e){setStep(1);toast('Gagal: '+e.message)}};
let mineRef=null;
function mineWatch(){if(mineRef)mineRef.off();$('#mine').textContent='';if(!me)return $('#mine').append(h('div','card','Masuk untuk membuat loader.'));
 mineRef=db.ref('loaders').orderByChild('ownerUid').equalTo(me.uid);
 mineRef.on('value',s=>{const l=$('#mine');l.textContent='';if(!s.exists())return l.append(h('div','card','Belum ada loader.'));
  s.forEach(c=>{const v=c.val(),slug=c.key,sn='loadstring(game:HttpGet("'+location.origin+'/loaders/'+slug+'"))()';
   const it=h('div','card item'),i=h('div');i.append(h('b','',v.name||slug),h('small','','/loaders/'+slug));
   const a=h('div','two');a.append(btn('Copy',()=>copy(sn)),btn('Edit',()=>{editLoader=slug;$('#lname').value=v.name||slug;$('#lname').readOnly=true;$('#lcode').value=v.code;$('#gen').textContent='Simpan perubahan';setStep(1);scrollTo(0,0);$('#v-loader').scrollTop=0}),btn('Delete',()=>confirm('Hapus loader ini?')&&c.ref.remove()));
   it.append(i,a);l.append(it)})})}
/* developer */
async function devLoad(){if(!isDeveloper())return;
 $('#dcin').value=(await db.ref('config/links/discord').get()).val()||'';$('#mcode').value=(await db.ref('loaders/__main__/code').get()).val()||'';
 try{const j=await(await fetch(DBURL+'/loaders.json?shallow=true')).json();$('#sLd').textContent=j?Object.keys(j).filter(k=>k!=='__main__').length:0}catch(e){}}
$('#dcsave').onclick=async()=>{if(!isDeveloper())return;try{await db.ref('config/links/discord').set($('#dcin').value.trim());toast('Tersimpan')}catch(e){toast('Ditolak')}};
$('#msave').onclick=async()=>{if(!isDeveloper())return;try{await db.ref('loaders/__main__').update({code:$('#mcode').value,updated:Date.now()});toast('Tersimpan')}catch(e){toast('Ditolak')}};
$('#mcopy').onclick=()=>copy('loadstring(game:HttpGet("'+location.origin+'/loader"))()');
