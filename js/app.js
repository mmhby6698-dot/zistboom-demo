(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]).replace(/(?<=[۰-۹])\.(?=[۰-۹])/g,'٫');
const nf=n=>fa(Math.round(n).toLocaleString('en-US').replace(/,/g,'٬'));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)};
const rnd=(i)=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};

/* ---------- procedural plant ---------- */
function setup(cv){const d=Math.min(devicePixelRatio||1,2),w=cv.clientWidth,h=cv.clientHeight;if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=w*d;cv.height=h*d}const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);return[c,w,h]}
function leaf(c,x,y,ang,len,col,dark){
  c.save();c.translate(x,y);c.rotate(ang);
  c.beginPath();c.moveTo(0,0);c.bezierCurveTo(len*.3,-len*.34,len*.8,-len*.3,len,0);c.bezierCurveTo(len*.8,len*.3,len*.3,len*.34,0,0);
  c.fillStyle=col;c.fill();c.strokeStyle=dark;c.lineWidth=.8;c.beginPath();c.moveTo(0,0);c.lineTo(len*.9,0);c.stroke();c.restore();
}
function drawPlant(cv,p,health,t){
  const[c,w,h]=setup(cv);c.clearRect(0,0,w,h);
  const cx=w/2,gy=h*.8,H=h*.66,sc=Math.min(w,h)/420;
  // tray with water
  const tw=Math.min(w*.8,360),th=h*.11;
  c.fillStyle='#0f2a1d';c.beginPath();c.roundRect(cx-tw/2,gy,tw,th,th/2);c.fill();
  c.fillStyle='rgba(120,210,220,.85)';c.beginPath();c.roundRect(cx-tw/2+6,gy+6,tw-12,th-12,th/2-5);c.fill();
  // bubbles
  c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<6;i++){const bx=cx-tw/2+20+rnd(i)*(tw-40),by=gy+th-10-((t*12+i*17)%(th-14));c.beginPath();c.arc(bx,by,2,0,7);c.fill()}
  // roots
  const rp=clamp(p*1.6);
  c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.2;
  for(let i=0;i<14;i++){const a=(rnd(i)-.5)*2.2,l=(th*.7)*(.4+rnd(i+9))*rp;c.beginPath();c.moveTo(cx+(rnd(i+3)-.5)*14,gy+6);c.quadraticCurveTo(cx+a*l*.5,gy+6+l*.6,cx+a*l*1.2,gy+6+l);c.stroke()}
  if(p<.03){ // seed
    c.fillStyle='#8a5a2b';c.beginPath();c.ellipse(cx,gy-4,8,5,.3,0,7);c.fill();return;
  }
  const g=clamp(health);const hue=70+g*50,sat=35+g*35,lig=52-g*14;
  const green=`hsl(${hue},${sat}%,${lig}%)`,greenD=`hsl(${hue},${sat}%,${lig-18}%)`;
  const sh=H*clamp(p*1.05);const droop=(1-g)*.9;
  const sway=reduce?0:Math.sin(t*1.1)*3*sc;
  const X=(f)=>cx+Math.sin(f*3.1)*10*sc+sway*f*f+droop*f*f*40*sc*(1);
  const Y=(f)=>gy-sh*f;
  // stem
  c.strokeStyle=greenD;c.lineWidth=Math.max(3,6*sc*(1-.35*p));c.lineCap='round';c.beginPath();
  for(let i=0;i<=24;i++){const f=i/24;const x=X(f),y=Y(f);i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
  // leaves
  const N=11;
  for(let k=0;k<N;k++){
    const f=(k+1)/(N+1),appear=clamp((p*1.15-f*.82)*5);if(appear<=0)continue;
    const side=k%2?1:-1,len=(46+34*Math.sin(f*Math.PI))*sc*appear*(.7+.3*g);
    const ang=side<0?Math.PI-(.55-.12*f)-droop*.5:(.55-.12*f)+droop*.5;
    // flip direction: angle 0 points right; y axis down => upward tilt negative
    const a=side>0?-0.45+droop*.9:Math.PI+0.45-droop*.9;
    leaf(c,X(f),Y(f),a+(reduce?0:Math.sin(t*1.3+k)*.03),len,green,greenD);
  }
  // flowers
  if(p>.55){const fp=clamp((p-.55)*4);for(let k=0;k<4;k++){const f=.55+k*.11;const x=X(f)+(k%2?14:-14)*sc,y=Y(f);c.fillStyle='#ffe066';c.beginPath();c.arc(x,y,4.5*sc*fp*(p>.85?.5:1),0,7);c.fill()}}
  // fruit
  if(p>.72){const fp=clamp((p-.72)*3.5);for(let k=0;k<5;k++){const f=.34+k*.09;const x=X(f)+(k%2?20:-20)*sc,y=Y(f)+16*sc;const r=(5+9*fp)*sc*(.6+.4*g);
    c.strokeStyle=greenD;c.lineWidth=1.4;c.beginPath();c.moveTo(X(f),Y(f));c.quadraticCurveTo(x,Y(f),x,y-r);c.stroke();
    const ripe=clamp((p-.88)*8);c.fillStyle=`hsl(${Math.round(100-100*ripe)},${60+20*ripe}%,${48+2*ripe}%)`;c.beginPath();c.arc(x,y,r,0,7);c.fill();
    c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(x-r*.3,y-r*.3,r*.25,0,7);c.fill()}}
}

/* ---------- story scroll ---------- */
const story=$('#story'),chs=$$('.ch'),plant=$('#plant');
const stops=chs.map(c=>+c.dataset.p);
let P=0,tgt=0;
function onScroll(){
  // pick progress by interpolating between chapter centres
  const vh=innerHeight,mid=vh*.55;
  const cs=chs.map(c=>{const r=c.getBoundingClientRect();return r.top+r.height/2});
  let p;
  if(mid<=cs[0])p=stops[0];else if(mid>=cs[cs.length-1])p=stops[stops.length-1];
  else{for(let i=0;i<cs.length-1;i++){if(mid>=cs[i]&&mid<=cs[i+1]){const u=(mid-cs[i])/(cs[i+1]-cs[i]);p=stops[i]+(stops[i+1]-stops[i])*u;break}}}
  tgt=p;
  let on=0;cs.forEach((y,i)=>{if(Math.abs(y-mid)<Math.abs(cs[on]-mid))on=i});
  chs.forEach((c,i)=>c.classList.toggle('on',i===on));
  $('#stageTag').textContent=chs[on].dataset.t;
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
let T=0;
function loop(){
  requestAnimationFrame(loop);T+=1/60;
  P+=(tgt-P)*(reduce?1:.1);
  drawPlant(plant,P,.9,T);
  $('#railFill').style.height=(P*100)+'%';$('#dayNum').textContent=fa(Math.round(P*90));
  drawLab();
}

/* ---------- lab ---------- */
const S={light:70,water:55,temp:23},ids={light:'#light',water:'#water',temp:'#temp'};
const lab=$('#plant2');let H2=.9,H2t=.9,tH=[],auto=false;
function target(){ // health from three inputs
  const f=(v,a,b,s)=>v<a?clamp(1-(a-v)/s):v>b?clamp(1-(v-b)/s):1;
  const l=f(S.light,55,85,45),w=f(S.water,40,70,40),t=f(S.temp,20,26,10);
  return{h:(l*w*t)**.6,l,w,t};
}
function readUI(){S.light=+$('#light').value;S.water=+$('#water').value;S.temp=+$('#temp').value;
  $('#vL').textContent=fa(S.light)+'٪';$('#vW').textContent=fa(S.water)+'٪';$('#vT').textContent=fa(S.temp)+'°'}
['light','water','temp'].forEach(k=>$(ids[k]).addEventListener('input',()=>{readUI()}));
$('#auto').addEventListener('click',e=>{auto=!auto;e.currentTarget.setAttribute('aria-pressed',auto)});
let lastS=0;
function drawLab(){
  if(auto){const mv=(k,id,goal)=>{const el=$(id);const d=goal-S[k];if(Math.abs(d)>.4){el.value=S[k]+Math.sign(d)*Math.min(Math.abs(d),.8);readUI()}};mv('light','#light',70);mv('water','#water',55);mv('temp','#temp',23)}
  const q=target();H2t=q.h;H2+=(H2t-H2)*.05;
  drawPlant(lab,.82,H2,T);
  const st=$('#status');
  let msg,cls='';
  if(q.h>.85){msg='✅ شرایط عالی؛ گیاه سالم است.';cls='good'}
  else{const worst=Object.entries({light:q.l,water:q.w,temp:q.t}).sort((a,b)=>a[1]-b[1])[0][0];
    msg={light:S.light<55?'⚠️ نور کم است؛ رشد کند می‌شود.':'⚠️ نور بیش از حد؛ برگ‌ها تنش می‌بینند.',water:S.water<40?'⚠️ آبیاری کم؛ برگ‌ها آویزان می‌شوند.':'⚠️ آب زیاد؛ خطر ضعف ریشه.',temp:S.temp<20?'⚠️ هوا سرد است؛ سیستم گرمایش لازم است.':'⚠️ هوا گرم است؛ تهویه روشن شد.'}[worst];cls='bad'}
  if(st.textContent!==msg){st.textContent=msg;st.className='status '+cls}
  const fan=$('.fan');fan.classList.toggle('on',S.temp>26);$('#fanTxt').textContent=S.temp>26?'تهویه روشن':S.temp<20?'گرمایش لازم':'تهویه خاموش';
  // telemetry: derived + gentle noise
  if(T-lastS>.8){lastS=T;
    const temp=S.temp+Math.sin(T)*.4,hum=clamp(.82-(S.temp-18)*.012-(S.light-50)*.001+S.water*.001,.35,.95)*100,ec=1.2+S.water*.012+Math.sin(T*.7)*.05,ph=5.9+Math.sin(T*.3)*.1;
    $('#gT').textContent=fa(temp.toFixed(1))+'°C';$('#gH').textContent=fa(Math.round(hum))+'٪';$('#gE').textContent=fa(ec.toFixed(1))+' mS';$('#gP').textContent=fa(ph.toFixed(1));
    $('#barH').style.width=hum+'%';$('#barE').style.width=clamp(ec/3)*100+'%';$('#barP').style.width=clamp((ph-4)/4)*100+'%';
    tH.push(temp);if(tH.length>40)tH.shift();
  }
  // sparkline
  const sp=$('#spark'),[c,w,h]=setup(sp);c.clearRect(0,0,w,h);c.strokeStyle='#1f6b3f';c.lineWidth=2;c.beginPath();
  tH.forEach((v,i)=>{const x=w*i/39,y=h-(clamp((v-8)/34))*h;i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();
}
readUI();
if(reduce){drawPlant(plant,.6,.9,0);}else requestAnimationFrame(loop);
if(reduce){setInterval(drawLab,500)}

/* ---------- systems ---------- */
const SYS=[
 {k:'nft',n:'NFT',use:'کاهو، سبزیجات برگی، گیاهان سبک',pro:'مصرف آب پایین و کنترل خوب تغذیه',con:'وابستگی زیاد به پمپ و جریان مداوم',
  svg:`<rect x="30" y="70" width="340" height="14" rx="7" fill="#6ec7d6" transform="rotate(4 200 77)"/><path class="flow" d="M40 82L360 94" stroke="#fff" stroke-width="2" fill="none"/><g stroke="#fff" fill="none" stroke-width="1.4">${[70,130,190,250,310].map((x,i)=>`<path d="M${x} ${78+i*1.4}c-6 18 4 30 -2 44M${x+5} ${78+i*1.4}c4 14-4 24 3 36"/>`).join('')}</g>${[70,130,190,250,310].map((x,i)=>`<g transform="translate(${x} ${70+i*1.4})"><path d="M0 0C-24-6-26-32 0-44 26-32 24-6 0 0z" fill="#8fd14f"/><path d="M0 0C20-4 30-20 22-30 8-26 2-14 0 0z" fill="#6fb53a"/></g>`).join('')}<rect x="40" y="170" width="70" height="40" rx="8" fill="#134d33" stroke="#b6f04a"/><text x="75" y="195" fill="#b6f04a" font-size="11" text-anchor="middle" font-family="Vazirmatn">مخزن</text><path class="flow" d="M110 190H20V86" stroke="#6ec7d6" stroke-width="2" fill="none"/>`},
 {k:'dwc',n:'DWC',use:'کاهو، سبزیجات، برخی گیاهان دارویی',pro:'ساختار نسبتاً ساده و رشد مناسب ریشه',con:'کنترل دمای محلول اهمیت زیادی دارد',
  svg:`<rect x="60" y="110" width="280" height="100" rx="12" fill="#6ec7d6" opacity=".8"/><rect x="50" y="100" width="300" height="12" rx="6" fill="#134d33" stroke="#b6f04a"/>${[110,200,290].map(x=>`<g><path d="M${x} 108c-4 20 4 30-2 54M${x+6} 108c4 18-4 28 2 46M${x-6} 108c-6 14 2 24-4 36" stroke="#fff" fill="none" stroke-width="1.4"/><g transform="translate(${x} 102)"><path d="M0 0C-26-6-28-40 0-52 28-40 26-6 0 0z" fill="#8fd14f"/></g></g>`).join('')}${[90,150,230,300].map((x,i)=>`<circle class="bub" cx="${x}" cy="200" r="3.5" fill="#fff" style="animation-delay:${i*.5}s"/>`).join('')}`},
 {k:'drip',n:'بستر + قطره‌ای',use:'گوجه، خیار، فلفل، بادمجان',pro:'مناسب پروژه‌های تجاری صیفی‌جات',con:'مدیریت دقیق آبیاری و زهکشی لازم است',
  svg:`<path d="M20 60H380" stroke="#6ec7d6" stroke-width="3"/>${[100,200,300].map((x,i)=>`<g><rect x="${x-34}" y="140" width="68" height="62" rx="10" fill="#7a5a3a"/><rect x="${x-34}" y="140" width="68" height="14" rx="6" fill="#a98a62"/><path d="M${x} 140V90" stroke="#4e8f2f" stroke-width="5"/><g transform="translate(${x} 100)"><path d="M0 0C-24-4-26-34 0-44 24-34 22-4 0 0z" fill="#8fd14f"/></g><path d="M${x} 60V132" stroke="#6ec7d6" stroke-width="1.5"/><circle class="drip" cx="${x}" cy="76" r="3" fill="#6ec7d6" style="animation-delay:${i*.4}s"/></g>`).join('')}<path d="M40 210H360" stroke="#6ec7d6" stroke-width="3" class="flow" fill="none"/>`},
 {k:'aero',n:'ایروپونیک',use:'پروژه‌های تخصصی و محصولات با ارزش بالا',pro:'اکسیژن‌رسانی بالا به ریشه و کنترل دقیق',con:'هزینه و پیچیدگی فنی بیشتر',
  svg:`<rect x="50" y="110" width="300" height="100" rx="12" fill="#134d33" stroke="#b6f04a"/>${[110,200,290].map((x,i)=>`<g><g transform="translate(${x} 104)"><path d="M0 0C-26-6-28-40 0-52 28-40 26-6 0 0z" fill="#8fd14f"/></g><path d="M${x} 112c-10 20 8 34-6 56M${x+7} 112c6 22-6 30 4 50M${x-8} 112c-8 18 0 26-8 42" stroke="#fff" fill="none" stroke-width="1.4"/></g>`).join('')}${Array.from({length:18},(_,i)=>`<circle class="bub" cx="${70+i*15}" cy="${196-(i%3)*18}" r="2" fill="#bfeaf2" style="animation-delay:${(i%6)*.35}s"/>`).join('')}<rect x="60" y="200" width="280" height="6" fill="#6ec7d6"/>`}
];
const tabs=$('#sysTabs');let sysI=0;
SYS.forEach((s,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=s.n;b.addEventListener('click',()=>setSys(i));tabs.appendChild(b)});
function setSys(i){sysI=i;const s=SYS[i];$$('#sysTabs button').forEach((b,j)=>b.setAttribute('aria-selected',j===i));
  $('#sysArt').innerHTML=`<svg viewBox="0 0 400 240" role="img" aria-label="نمای برش ${s.n}">${s.svg}</svg>`;
  $('#sysInfo').innerHTML=`<div><dt>مناسب برای</dt><dd>${s.use}</dd></div><div><dt>مزیت اصلی</dt><dd>${s.pro}</dd></div><div><dt>محدودیت مهم</dt><dd>${s.con}</dd></div><div><dt>نکته</dt><dd>انتخاب نهایی بعد از بررسی محصول، آب و بودجه‌ی واقعی پروژه انجام می‌شود.</dd></div>`}
setSys(0);

/* ---------- yield calculator ---------- */
const CROPS=[['گوجه‌فرنگی',45],['خیار',55],['فلفل دلمه‌ای',30],['کاهو',60],['توت‌فرنگی',12]]; // kg/m²/yr demo assumptions
const AUTOS=[['ساده',.8],['استاندارد',1],['پیشرفته',1.15]];
let crop=0,aut=1;
function seg(el,list,get,set){list.forEach((x,i)=>{const b=document.createElement('button');b.type='button';b.textContent=x[0];b.setAttribute('aria-pressed',i===get());b.addEventListener('click',()=>{set(i);$$('button',el).forEach((q,j)=>q.setAttribute('aria-pressed',j===i));calc()});el.appendChild(b)})}
seg($('#cropSeg'),CROPS,()=>crop,i=>crop=i);seg($('#autoSeg'),AUTOS,()=>aut,i=>aut=i);
function calc(){
  const a=+$('#area').value;$('#areaV').textContent=nf(a)+' مترمربع';
  const kg=a*CROPS[crop][1]*AUTOS[aut][1],t=kg/1000;
  $('#yv').textContent=fa(t.toFixed(t<10?1:0));
  $('#rtxt').textContent=`بازه‌ی نمایشی: ${fa((t*.85).toFixed(t<10?1:0))} تا ${fa((t*1.15).toFixed(t<10?1:0))} تن`;
  const max=10000*60*1.15/1000;$('#rb').style.insetInlineStart=(t*.85/max*100)+'%';$('#rb').style.width=(t*.3/max*100+1)+'%';
}
$('#area').addEventListener('input',calc);calc();

$('#cform').addEventListener('submit',e=>{e.preventDefault();const n=e.target.n.value.trim();if(!n){e.target.n.focus();toast('نام را وارد کن (دمو)');return}$('#cnote').textContent='دمو: درخواست «'+n+'» ثبت نشد.';toast('نمونه دمو — چیزی ارسال نشد')});
})();
