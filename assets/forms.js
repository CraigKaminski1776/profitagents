// Globus forms: POST to /api/submit, on-page confirmation, mailto fallback.
(function(){
const EMAIL='Craig@globuscapitaladvisors.com';
async function send(type,data){
  const r=await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,lead_type:data.lead_type,page:location.pathname,...data})});
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||'Submission failed');
  if(!j.notified){try{const p={_subject:`New ${type} lead: ${data.name||data.email}`,_template:'table',_captcha:'false',_replyto:data.email,Type:type,Name:data.name,Email:data.email,Page:location.pathname,'Lead ID':j.id,...data.fields};
    if(type==='financing'||type==='feasibility-report')p._autoresponse=`Thank you${data.name?', '+data.name:''}. Globus Capital Advisors received your request and will reply within one business day. For anything urgent, email ${EMAIL}. This is an automatic acknowledgment, not a commitment to lend.`;
    await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(EMAIL),{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(p)});}catch(e){}}
  return j;
}
function collect(form){const fd=new FormData(form),fields={};let name='',email='',hp='';
  for(const [k,v] of fd.entries()){if(k==='_hp'){hp=v;continue}if(k==='email'||k==='Email'){email=String(v);continue}if(k==='name'||k==='Name'){name=String(v);continue}if(String(v).trim())fields[k]=String(v)}
  return {name,email,fields,_hp:hp};}
function mailto(type,d){const body=[`Name: ${d.name}`,`Email: ${d.email}`,...Object.entries(d.fields).map(([k,v])=>`${k}: ${v}`)].join('\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent('Globus '+type+' request')}&body=${encodeURIComponent(body+'\n\n(Submitted via ai.globuscapitaladvisors.com)')}`;}
window.GlobusForms={send,collect,mailto};
document.addEventListener('submit',async e=>{
  const form=e.target.closest('form[data-type]');if(!form)return;e.preventDefault();
  const type=form.dataset.type,btn=form.querySelector('button[type=submit],button:not([type])'),msg=form.querySelector('.form-msg')||form.appendChild(Object.assign(document.createElement('p'),{className:'form-msg'}));
  msg.setAttribute('role','status');const d=collect(form);d.lead_type=(form.querySelector('input[name=lead_type]')||{}).value||form.dataset.leadType||'';if(btn){btn.disabled=true;btn.dataset.t=btn.textContent;btn.textContent='Sending…';}
  try{await send(type,d);
    if(form.dataset.done){form.dispatchEvent(new CustomEvent('globus:sent',{detail:d}));}
    else{form.innerHTML=`<div class="ok"><h3>Thank you${d.name?', '+d.name.split(' ')[0]:''}.</h3><p>${form.dataset.thanks||'Your submission was received.'}</p></div>`;}
  }catch(err){msg.innerHTML=`We couldn't submit right now. Please check your connection and press the button again; your entries are still here.`;msg.className='form-msg err';}
  finally{if(btn&&btn.isConnected){btn.disabled=false;btn.textContent=btn.dataset.t;}}
});
})();
