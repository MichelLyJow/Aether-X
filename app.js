firebase.initializeApp({apiKey:"AIzaSyDRcucG7Qr9EKySpSPY2UglZ_WQTmhf6Uo",authDomain:"script-web-8d4a7.firebaseapp.com",databaseURL:"https://script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"script-web-8d4a7",storageBucket:"script-web-8d4a7.firebasestorage.app",messagingSenderId:"529307129610",appId:"1:529307129610:web:a3f2e4a3b6e0791cec8cf3"});
const db=firebase.database(),$=s=>document.querySelector(s);
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const btn=(t,f,c)=>{const b=h('button',c||'',t);b.onclick=f;return b};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const copy=async t=>{try{await navigator.clipboard.writeText(t);toast('Copied')}catch(e){toast('Copy manually')}};
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
const snip=slug=>'loadstring(game:HttpGet("'+location.origin+'/loaders/'+slug+'"))()';

/* ---------- theme ---------- */
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem('echo-theme',t)}catch(e){}};
try{setTheme(localStorage.getItem('echo-theme')||'light')}catch(e){}
$('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');

/* ---------- local history (kept on this device only) ---------- */
function getLocal(){try{return JSON.parse(localStorage.getItem('echo-links')||'[]')}catch(e){return[]}}
function setLocal(list){try{localStorage.setItem('echo-links',JSON.stringify(list))}catch(e){}}
function saveLocal(entry){const list=getLocal().filter(x=>x.slug!==entry.slug);list.unshift(entry);setLocal(list)}
function removeLocal(slug){setLocal(getLocal().filter(x=>x.slug!==slug))}

/* ---------- output panel ---------- */
function showOutput(text,fname){$('#out').textContent=text;$('#out').hidden=false;$('#outact').hidden=false;
 $('#outcopy').onclick=()=>copy(text);
 $('#outdl').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}}

/* ---------- generate / save ---------- */
const setStep=n=>[1,2,3].forEach(i=>$('#s'+i).classList.toggle('on',i<=n));
let editSlug=null;
function resetForm(){editSlug=null;$('#lname').value='';$('#lname').readOnly=false;$('#lcode').value='';$('#gen').textContent='Generate loader';$('#out').hidden=true;$('#outact').hidden=true;setStep(1)}
$('#gen').onclick=async()=>{
 const name=$('#lname').value.trim(),code=$('#lcode').value,slug=editSlug||slugify(name);
 if(!slug||!code.trim())return toast('Enter a name and code');
 setStep(2);const r=db.ref('loaders/'+slug);
 try{
  if(!editSlug){
   if((await r.get()).exists())return setStep(1),toast('Name already taken');
   await r.set({code,name,created:Date.now(),updated:Date.now()});
  }else{
   await r.set({code,name,created:Date.now(),updated:Date.now()});
  }
  saveLocal({slug,name,code,updated:Date.now()});
  const sn=snip(slug);showOutput(sn,'loadstring.txt');await copy(sn);setStep(3);
  editSlug=null;$('#lname').readOnly=false;$('#gen').textContent='Generate loader';
  renderMine();
 }catch(e){setStep(1);toast('Failed: '+(e&&e.message||'error'))}
};

/* ---------- upload file into the code box ---------- */
$('#imp').onclick=()=>$('#fimp').click();
$('#fimp').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;if(f.size>5e5)return toast('File too big (max 500 KB)');
 $('#lcode').value=await f.text();if(!$('#lname').value&&!editSlug)$('#lname').value=f.name.replace(/\.[^.]+$/,'');toast('Imported '+f.name)};

/* ---------- your links (from this device's local history) ---------- */
function filterMine(){const q=$('#lq').value.trim().toLowerCase();document.querySelectorAll('#mine .item').forEach(e=>e.hidden=!!q&&!e.dataset.n.includes(q))}
$('#lq').oninput=filterMine;
function renderMine(){const list=getLocal(),box=$('#mine');box.textContent='';
 if(!list.length)return box.append(h('div','card','No links yet. Create your first one above.'));
 list.forEach(v=>{const it=h('div','card item'),i=h('div');
  i.append(h('b','',v.name||v.slug),h('small','','/loaders/'+v.slug+' · '+(v.code||'').length+' chars'));
  const a=h('div','two');
  a.append(
   btn('Copy',()=>copy(snip(v.slug)),'ghost'),
   btn('Code',()=>copy(v.code||''),'ghost'),
   btn('Edit',()=>{editSlug=v.slug;$('#lname').value=v.name||v.slug;$('#lname').readOnly=true;$('#lcode').value=v.code;$('#gen').textContent='Save changes';$('#out').hidden=true;$('#outact').hidden=true;setStep(1);scrollTo(0,0)},'ghost'),
   btn('Delete',()=>{if(!confirm('Remove this from your device? The link itself will keep working unless you also clear it from the server.'))return;removeLocal(v.slug);renderMine();toast('Removed from this device')},'ghost danger')
  );
  it.dataset.n=((v.name||v.slug)+' '+v.slug).toLowerCase();it.append(i,a);box.append(it)});
 filterMine()}
renderMine();
