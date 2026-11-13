
// ================= PERSONNAGES (Avataaars · Pablo Stanley) =================
function av(name,exprs,w){const h=w*280/264;const d=document.createElement('div');d.style.cssText=`position:absolute;left:0;top:0;width:${w}px;height:${h}px;transform-origin:50% 100%;opacity:0`;
 d.innerHTML=exprs.map(e=>`<img data-e="${e}" src="av/${name}_${e}.svg" style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0">`).join('');d.w=w;d.h=h;d.ex=[...d.querySelectorAll('img')];return d}
function expr(d,e){d.ex.forEach(i=>i.style.opacity=i.dataset.e===e?1:0)}
function putA(d,x,yb,{s=1,r=0,op=1}={}){d.style.opacity=op;d.style.transform=`translate(${x-d.w/2}px,${yb-d.h}px) rotate(${r}deg) scale(${s})`}
const seq=(t,arr)=>{let e=arr[0][1];for(const [a,x] of arr)if(t>=a)e=x;return e};
const blinkE=(t,base,off=0)=>(((t+off)%3.3)<.13)?'clin':base;

// ---- S1 : la soirée ----
const S1=scene(ROOM(true));
const papa=av('papa',['sourire','neutre','perdu','panique','gene','clin'],640),kid=av('kid',['oh','neutre','reflechit','sourire','clin'],430);
S1.appendChild(kid);S1.appendChild(papa);S1.insertAdjacentHTML('beforeend',TABLE);
const sweat=document.createElement('div');sweat.style.cssText='position:absolute;left:69%;top:25%;width:30px;height:44px;border-radius:50% 50% 50% 50%/68% 68% 32% 32%;background:linear-gradient(#DDF6FF,#7FD4F0);opacity:0';papa.appendChild(sweat);
const note=document.createElement('div');note.style.cssText='position:absolute;left:0;top:0';note.innerHTML=NOTE;S1.appendChild(note);
const qm=['?','?','?'].map(q=>{const d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;font:800 130px Sora;color:#FFD23F;opacity:0;text-shadow:0 8px 24px rgba(0,0,0,.45)';d.textContent=q;S1.appendChild(d);return d});
const bK=document.createElement('div');bK.className='bb l';bK.textContent='« Papa, aide-moi. »';S1.appendChild(bK);
const bP=document.createElement('div');bP.className='bb r y';bP.textContent='« Euh… va demander à ta mère. »';S1.appendChild(bP);
const h20=document.createElement('div');h20.style.cssText='position:absolute;left:0;top:0;padding:18px 40px;border-radius:999px;background:#0B1B33;color:#FFD23F;font:800 76px/1 Sora;opacity:0;box-shadow:0 14px 40px rgba(0,0,0,.4)';h20.textContent='20 h';S1.appendChild(h20);

// ---- S2 : maman ----
const S2=scene(ROOM(true));const maman=av('maman2',['sourire','neutre','clin','joie'],900);S2.appendChild(maman);
const mph=document.createElement('div');mph.style.cssText='position:absolute;left:0;top:0;width:230px;height:430px;border-radius:38px;background:#0B1220;padding:10px;box-shadow:0 30px 60px rgba(0,0,0,.45)';
mph.innerHTML=`<div style="width:100%;height:100%;border-radius:30px;background:#FBF6EC;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><div style="font:800 46px/1 Sora;color:#0B1B33">Klas</div><div style="font:800 40px/1 Sora;color:#E0393E;border:5px solid #E0393E;border-radius:50%;padding:6px 14px;transform:rotate(-4deg)">237</div></div>`;S2.appendChild(mph);

// ---- S5 : la classe ----
const S5=scene(`<div style="position:absolute;inset:0;background:linear-gradient(#F4E8CF,#EBD7AE)"></div><svg width="1080" height="1920">
 <rect x="90" y="520" width="900" height="470" rx="14" fill="#1F5B45" stroke="#7A5230" stroke-width="22"/>
 <text x="150" y="620" font-family="Caveat" font-weight="700" font-size="74" fill="#fff">Leçon du jour</text><path d="M150 650 H520" stroke="#fff" stroke-width="5" stroke-dasharray="14 10"/>
 <text x="150" y="770" font-family="Caveat" font-weight="700" font-size="96" fill="#FFD23F">3/4 = 0,75</text>
 <circle cx="800" cy="760" r="110" fill="none" stroke="#fff" stroke-width="7"/><path d="M800 760 L800 650 A110 110 0 1 1 690 760Z" fill="#FFD23F" opacity=".85"/><path d="M690 760 H910 M800 650 V870" stroke="#fff" stroke-width="5"/>
 <rect x="-20" y="1330" width="1120" height="620" fill="#C99A62"/><rect x="-20" y="1330" width="1120" height="26" fill="#DDB07A"/></svg>`);
const prof=av('prof',['sourire','joie','clin'],560);S5.appendChild(prof);

// ---- S6 : le grand frère ----
const S6=scene(`<div style="position:absolute;inset:0;background:linear-gradient(#DCE9F7,#C7DBF0)"></div><svg width="1080" height="1920">
 <rect x="110" y="520" width="300" height="380" rx="12" fill="#fff" stroke="#0B1B33" stroke-width="12"/><text x="150" y="610" font-family="Sora" font-weight="800" font-size="52" fill="#E0393E">BAC</text><text x="150" y="680" font-family="Manrope" font-weight="700" font-size="34" fill="#0B1B33">Objectif</text><path d="M150 720 H370 M150 760 H330 M150 800 H370" stroke="#C3CEDD" stroke-width="10" stroke-linecap="round"/>
</svg>`+TABLE);
const frere=av('frere',['reflechit','joie','neutre','clin'],620);S6.insertBefore(frere,S6.lastElementChild);
const bF=document.createElement('div');bF.className='bb l';bF.style.maxWidth='640px';bF.innerHTML='<span style="font:700 26px/1 Sora;letter-spacing:.14em;color:#E0393E;display:block;margin-bottom:10px">💡 UN INDICE</span>Que te demande-t-on de calculer <span style="color:#0E8A5F">en premier</span> ?';S6.appendChild(bF);

// ---- S8 : la famille, le jour ----
const S8=scene(ROOM(false)+'<div style="position:absolute;left:0;top:0;width:1080px;height:620px;background:linear-gradient(rgba(251,246,236,.97) 62%,rgba(251,246,236,0))"></div>');
const maman8=av('maman2',['sourire','clin'],470),papa8=av('papa',['sourire','clin'],640),kid8=av('kid',['sourire','clin'],430);
S8.appendChild(maman8);S8.appendChild(kid8);S8.appendChild(papa8);S8.insertAdjacentHTML('beforeend',TABLE);
const note8=document.createElement('div');note8.style.cssText='position:absolute;left:0;top:0';note8.innerHTML=NOTE.replace('3/4 ?','3/4 ✓').replace('#E0393E','#0E8A5F');S8.appendChild(note8);
const stars=['✨','⭐','✨','💪'].map(c=>{const d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;font-size:96px;opacity:0';d.textContent=c;S8.appendChild(d);return d});

// ================= APPLICATION =================
const mk=(s,bg='#fff',fg='#0B1B33')=>el(`<div class="chip" style="background:${bg};color:${fg}">${s}</div>`);
const lbl=s=>el(`<div class="chip" style="background:#0B1B33;color:#fff;font:800 40px/1 Sora;padding:24px 36px">${s}</div>`);
function crop(src,y0,y1,W=940,x0=20,x1=1055){const k=W/(x1-x0),h=Math.round((y1-y0)*k);
 return el(`<div class="card" style="width:${W}px;height:${h}px;background:#FBF6EC url(kl/${src}.png) no-repeat;background-size:${1075*k}px auto;background-position:${-x0*k}px ${-y0*k}px;outline:10px solid #fff;border-radius:34px"></div>`)}
const ring=(w,h)=>el(`<div class="abs" style="width:${w}px;height:${h}px;border:9px solid #E0393E;border-radius:40px;opacity:0;box-shadow:0 0 0 12px rgba(224,57,62,.18)"></div>`);
const logo=el(`<div id="logo"><span class="k">Klas</span><span class="n">237</span></div>`);
const lv=['SIL','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e','2nde','1re','Tle'].map(s=>el(`<div class="chip" style="background:#fff;color:#0B1B33;padding:14px 22px;font-size:32px">${s}</div>`));
const phone=el(`<div id="phone"><div id="notch"></div><div id="scr"><img id="i1" src="kl/soir_0.png"><img id="i2" src="kl/assistant_0.png"></div></div>`);
const I=['#i1','#i2'].map(s=>phone.querySelector(s));
// parents
const cRit=crop('soir_1',1130,1960),cSer=crop('soir_0',1335,1905),cStat=crop('parent_Progres_0',1120,1500),cMat=crop('parent_Progres_1',255,725);
const rRit=ring(260,250),lRit=lbl('⏱ 10 minutes, pas plus'),lSer=lbl('🔥 La série des soirs'),lMat=lbl('📊 Ses progrès, matière par matière');
const ask=['🎙 Dicter','📷 Photo du cahier','✍️ À la main'].map(s=>mk(s,'#0B1B33','#fff'));
const tomC=el(`<div class="card" style="width:900px;height:430px;background:#0B1B33;color:#fff"><div style="position:absolute;left:44px;top:34px;font:700 26px/1 Sora;letter-spacing:.14em;color:#FFD23F">✦ UNE AUTRE FAÇON · AU MARCHÉ</div><div id="tm"></div>
 <div id="p1" style="position:absolute;left:44px;bottom:36px;font:800 50px/1 Sora">8 tomates · <span style="color:#FFD23F">400 FCFA</span></div><div id="p2" style="position:absolute;left:44px;bottom:36px;font:800 50px/1 Sora;opacity:0">La moitié : 4 tomates · <span style="color:#FFD23F">200 FCFA</span></div></div>`);
const TM=[...Array(8)].map(()=>{const d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;width:84px;height:78px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FF7A6B,#D7263D 70%)';d.innerHTML='<div style="position:absolute;left:30px;top:-10px;width:24px;height:20px;background:#0E8A5F;border-radius:50% 50% 0 0"></div>';tomC.querySelector('#tm').appendChild(d);return d});
const papaPop=av('papa',['sourire','panique'],380);Lr.appendChild(papaPop);const bulb=el(`<div class="abs" style="font-size:130px;opacity:0">💡</div>`);
// enseignant
const cApp=crop('prof_appel2_1',95,1210,800),cNot=crop('prof_Notes_0',915,1260),cAnn=crop('prof_Annee_0',915,1500),cRel=crop('prof_relais_1',1470,1965);
const lApp=lbl('✅ 16/18 présents · en 30 secondes'),lNot=lbl('📝 Les notes et les moyennes'),lAnn=lbl('📚 Le programme, toujours à jour');
// élève
const cRev=crop('eleve_Reviser_1',0,1250,720),cObj=crop('eleve_Progres_1',1235,1905),rObj=ring(270,84);
const lRev=lbl('⏱ Il révise seul, 25 minutes'),lObj=lbl('🎯 Son objectif de moyenne');
const exams=['BEPC','Probatoire','Bac'].map(s=>mk(s,'#FFD23F'));
// présentateurs (coin)
const pM=av('maman2',['sourire','clin'],250),pP=av('prof',['sourire','clin'],250),pF=av('frere',['joie','clin'],250);[pM,pP,pF].forEach(e=>Lr.appendChild(e));
// prix + fin
const payc=el(`<div class="card" style="width:860px;padding:34px 30px;background:#fff;color:#0B1B33;text-align:center;border-radius:40px;font:800 46px/1.25 Sora">Orange Money <span style="color:#9AA8BF">ou</span> MTN MoMo</div>`);
const cta=el(`<div class="card" style="width:880px;padding:38px 30px;background:#FFD23F;color:#0B1B33;text-align:center;border-radius:999px;font:800 56px/1 Sora">klas237.jengu-ai.com</div>`);
const by=el(`<div class="t" style="font:700 34px/1 Sora;letter-spacing:.2em;color:#0B1B33">PAR <span style="color:#B8860B">JENGUAI</span> · DOUALA</div>`);
const veil=el(`<div class="abs" style="width:1080px;height:1920px;background:#FBF6EC;opacity:0"></div>`);
[logo,cta,by].forEach(e=>Lr.appendChild(e));

function place(e,x,y,w,h,{s=1,r=0,op=1}={}){e.style.opacity=op;e.style.transform=`translate(${x-w/2}px,${y-h/2}px) rotate(${r}deg) scale(${s})`}
function pop(e,t,a,b,x,y,r=0){const on=t>=a&&t<=b;if(!on){e.style.opacity=0;return}const k=back(P(t,a,a+.5)),o=ei(P(t,b-.3,b));
 const w=e.offsetWidth,h=e.offsetHeight;place(e,x,y+(1-k)*60-o*40+Math.sin(t*1.6+x)*4,w,h,{s:(.6+.4*k)*(1-o*.1),r,op:C(P(t,a,a+.2))*(1-o)})}
// carte « gros plan » : arrive par le bas, léger zoom continu, repart par le haut
function show(e,t,a,b,y,r=0,x=540){const on=t>=a&&t<=b;if(!on){e.style.opacity=0;return}const k=eo(P(t,a,a+.7)),o=ei(P(t,b-.35,b));
 const w=e.offsetWidth,h=e.offsetHeight;place(e,x,y+(1-k)*260-o*160,w,h,{s:(.9+.1*k)*(1+.035*P(t,a,b)),r:r*(2-k),op:C(P(t,a,a+.18))*(1-o)})}
function bubble(e,t,a,b,x,y){const on=t>=a&&t<=b;if(!on){e.style.opacity=0;return}const k=back(P(t,a,a+.45)),o=ei(P(t,b-.25,b));e.style.opacity=C(P(t,a,a+.15))*(1-o);e.style.transform=`translate(${x}px,${y+(1-k)*40}px) scale(${.6+.4*k})`;e.style.transformOrigin='30% 100%'}
function sc(e,t,a,b,z=0){const on=t>=a-.05&&t<=b+.05;e.style.opacity=on?eio(P(t,a,a+.5))*(1-eio(P(t,b-.5,b))):0;if(on)e.style.transform=`scale(${1+z*P(t,a,b)})`;return on}
function presenter(d,t,a,b,base='sourire'){const on=t>=a&&t<=b;if(!on){d.style.opacity=0;return}const k=back(P(t,a,a+.6)),o=ei(P(t,b-.3,b));expr(d,blinkE(t,base));
 putA(d,925,1470+(1-k)*300+o*300+Math.sin(t*1.4)*5,{r:-5+Math.sin(t*1.1)*1.5,op:1});d.style.filter='drop-shadow(0 16px 30px rgba(11,27,51,.3))'}

// ================= TITRES =================
const HY=300;
tx('L’école et la maison<br><em>avancent ensemble.</em>','h dk',14.6,18.8,1230,{style:'font-size:66px'});
tx('Ce soir, <em>10 minutes.</em>','h dk',19.2,22.5,HY,{style:'font-size:78px'});
tx('Un petit exercice,<br><em>on fait ça ensemble.</em>','h dk',22.6,25.5,HY,{style:'font-size:68px'});
tx('Un soir après l’autre,<br><em>la régularité.</em>','h dk',25.6,28.1,HY,{style:'font-size:68px'});
tx('Les progrès se voient,<br><em>matière par matière.</em>','h dk',28.2,30.9,HY,{style:'font-size:66px'});
tx('La leçon bloque ?<br><em>Il explique autrement.</em>','h dk',31.1,40.3,HY,{style:'font-size:66px'});
tx('À l’école,<br><em>l’enseignant suit tout.</em>','h dk',40.6,50.9,270,{style:'font-size:70px'});
tx('Le grand frère<br><em>révise seul.</em>','h dk',51.1,56.1,270,{style:'font-size:74px'});
tx('Des indices…<br><em class="r">pas les réponses.</em>','h dk',56.2,58.9,270,{style:'font-size:74px'});
tx('<em>7 jours</em><br>gratuits','h',59.2,64.8,520,{style:'font-size:150px'});
tx('puis dès 2 000 FCFA par mois','s',60.4,64.8,890,{style:'font-size:52px;color:#fff'});
tx('Maintenant, c’est <em>papa</em><br>qui explique.','h dk',65.3,69.3,280,{style:'font-size:72px'});
tx('De petits pas…','h dk',69.9,73,760,{style:'font-size:96px'});
tx('<em>de grandes réussites.</em>','h dk',70.6,73,880,{style:'font-size:84px'});
TX.forEach(o=>Lr.appendChild(o.e));Lr.appendChild(logo);

const VO=[[0.4,7.8,'Vingt heures.|Le petit tend son cahier : « Papa, aide-moi. »|Papa regarde… regarde encore…'],[8.0,10.5,'« Euh… va demander à ta mère. »'],
[10.7,18.8,'Maman sourit… et ouvre Klas 237.|Du SIL à la Terminale,|l’école et la maison avancent ensemble.'],
[19.2,30.9,'Ce soir, dix minutes,|un petit exercice, on fait ça ensemble…|et les progrès se voient,|matière par matière.'],
[31.1,40.3,'La leçon bloque encore ?|L’assistant l’explique autrement :|au marché, huit tomates, quatre cents francs…|Même papa a compris !'],
[40.6,50.9,'À l’école, l’enseignant suit tout :|l’appel en trente secondes,|les notes,|et le programme toujours à jour.'],
[51.1,58.9,'Et le grand frère, au lycée, révise seul :|des indices… pas les réponses.'],
[59.2,64.8,'Sept jours gratuits,|puis dès deux mille francs CFA par mois,|par Orange Money ou MTN MoMo.'],
[65.2,72.6,'Klas 237 : maintenant, c’est papa qui explique.|De petits pas… de grandes réussites.']];
const CAP=[];VO.forEach(([a,b,s])=>{const ps=s.split('|'),tot=ps.reduce((n,p)=>n+p.length,0);let c=a;ps.forEach(p=>{const d=(b-a)*p.length/tot;CAP.push([c,c+d-.05,p]);c+=d})});
const capS=$('#cap span');
const gc=$('#grain').getContext('2d'),G=[];for(let k=0;k<5;k++){const im=gc.createImageData(540,960);for(let i=0;i<im.data.length;i+=4){const v=128+(rnd()-.5)*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}G.push(im)}

window.DUR=73;
window.render=function(t){
 const day=eio(P(t,13.6,14.4))*(1-eio(P(t,58.8,59.4)));$('#day').style.opacity=day;$('#dots').style.transform=`translate(${-t*6%36}px,${-t*4%36}px)`;
 const b=$('#b1');b.style.transform=`translate(${200+120*Math.sin(t*.4)}px,${300+200*Math.cos(t*.3)}px)`;b.style.opacity=.25*(1-day);
 TX.forEach(o=>drawTx(o,t));

 // ---------- S1 0–10.7 ----------
 if(sc(S1,t,0,10.75,.05)){
  const pe=seq(t,[[0,'sourire'],[3.2,'neutre'],[4.6,'perdu'],[6.2,'panique'],[8.0,'gene']]);expr(papa,pe==='sourire'||pe==='neutre'?blinkE(t,pe):pe);
  expr(kid,seq(t,[[0,'oh'],[3.0,'neutre'],[8.4,'reflechit']]));
  const lean=eio(P(t,3.2,4.6))*(1-P(t,8,8.4));
  putA(kid,285,1335,{r:Math.sin(t*1.3)*1.2+P(t,8.4,9)*-3});
  putA(papa,745,1335,{r:-5*lean+Math.sin(t*1.1)*.8+(t>6.2&&t<8?Math.sin(t*22)*.7:0)+P(t,8,8.4)*4,s:1+.03*lean});
  const g=eio(P(t,1.4,2.8));note.style.transform=`translate(${lerp(310,540,g)}px,${lerp(1175,1120,g)+Math.sin(t*2)*4}px) rotate(${lerp(-10,5,g)}deg)`;
  qm.forEach((q,k)=>{const a=4.8+k*.45;const p=back(P(t,a,a+.4));q.style.opacity=t>a&&t<8?C(p):0;q.style.transform=`translate(${[560,900,730][k]}px,${[560,590,430][k]-p*30+Math.sin(t*3+k)*8}px) rotate(${[-14,12,0][k]}deg) scale(${.5+.5*p})`});
  const sw=(t-6.3)%1.1/1.1;sweat.style.opacity=t>6.3&&t<8?1-sw*sw:0;sweat.style.transform=`translateY(${sw*70}px) scale(${.7+.3*sw})`;
  bubble(bK,t,1.7,4.5,120,640);bubble(bP,t,8.1,10.6,330,440);
  const h=back(P(t,.3,.9));h20.style.opacity=C(P(t,.3,.5))*(1-P(t,10.2,10.6));h20.style.transform=`translate(70px,${130+(1-h)*-60}px) rotate(-4deg) scale(${.6+.4*h})`;
 }
 // ---------- S2 10.3–14.6 ----------
 if(sc(S2,t,10.3,14.7,.06)){
  const k=eo(P(t,10.7,11.7));expr(maman,seq(t,[[0,'sourire'],[11.9,'clin'],[12.2,'sourire'],[12.6,'joie']]));putA(maman,lerp(1500,540,k),1560,{r:Math.sin(t*1.2)*.8});
  const pk=eo(P(t,12.1,13.0)),z=eio(P(t,13.5,14.5));place(mph,lerp(820,540,z),lerp(1950,1210,pk)-z*300,230,430,{s:1+z*5,r:lerp(12,-6,pk)*(1-z)})}
 {let op=0,y=640,s=1;
  if(t>=14.6&&t<18.9){const k=back(P(t,14.6,15.2)),o=ei(P(t,18.5,18.9));op=C(P(t,14.6,14.8))*(1-o);s=.5+.5*k;y=640-o*80}
  else if(t>=69.6){const k=back(P(t,69.6,70.3));op=C(P(t,69.6,69.8));s=(.5+.5*k)*.8;y=480}
  logo.style.opacity=op;logo.style.transform=`translateY(${y-90}px) scale(${s})`}
 lv.forEach((e,k)=>{const col=k%7,row=k<7?0:1;pop(e,t,15.4+k*.08,18.7,170+col*124+(row?62:0),930+row*86,k%2?2:-2)});

 // ---------- PARENTS 19–31 ----------
 {const A=t>=19.0&&t<=22.7,B=t>=31.0&&t<=35.2;if(!A&&!B)phone.style.opacity=0;else{const a=A?19.0:31.0,e=A?22.7:35.2;const k=eo(P(t,a,a+.9)),o=ei(P(t,e-.4,e));
   place(phone,B?lerp(540,330,eio(P(t,31.7,32.4))):540,1010+(1-k)*900-o*300+Math.sin(t*1.2)*6,500,1000,{s:.92,r:lerp(8,-2,k)+Math.sin(t*.8)*.6,op:1-o});
   I[0].style.opacity=A?1:0;I[1].style.opacity=B?1:0;I[0].style.transform=`translateY(${-lerp(0,620,eio(P(t,19.8,22.3)))}px)`}}
 show(cRit,t,22.6,25.6,960,-1);{const on=t>23.4&&t<25.3;rRit.style.opacity=on?(.6+.4*Math.sin(t*8)):0;rRit.style.transform=`translate(${117}px,${862}px)`}
 pop(lRit,t,23.5,25.4,430,1395,-2);
 show(cSer,t,25.6,28.2,900,1);pop(lSer,t,26.2,28.0,430,1260,-2);
 show(cStat,t,28.2,31.0,690,-1);show(cMat,t,28.5,31.0,1130,1);pop(lMat,t,29.1,30.8,440,1400,-1);
 presenter(pM,t,22.9,30.9);

 // ---------- ASSISTANT 31–40.5 ----------
 ask.forEach((e,k)=>pop(e,t,32.4+k*.25,35.0,830,700+k*110,k%2?-2:2));
 show(tomC,t,35.0,40.3,960,-1);{const sp=eio(P(t,37.0,37.8));TM.forEach((d,k)=>{const i=back(P(t,35.5+k*.1,35.9+k*.1));const right=k>=4;const x=70+k*98+(right?sp*50:-sp*10),y=120+(right?sp*26:0);d.style.transform=`translate(${x}px,${y+(1-i)*-60}px) scale(${i>0?(.4+.6*i):0})`;d.style.opacity=right?1-sp*.72:1});
  tomC.querySelector('#p2').style.opacity=eo(P(t,37.6,38.2));tomC.querySelector('#p1').style.opacity=1-P(t,37.4,37.7)}
 {const on=t>=38.4&&t<=40.4;const k=back(P(t,38.4,39.0)),o=ei(P(t,40.0,40.4));if(on){expr(papaPop,t<38.9?'panique':'sourire');putA(papaPop,900,lerp(2200,1475,k)+o*700,{r:-4+Math.sin(t*6)*2,s:.8})}else papaPop.style.opacity=0;
  const bk=back(P(t,38.9,39.4));bulb.style.opacity=on?C(P(t,38.9,39.1))*(1-o):0;bulb.style.transform=`translate(${760}px,${1215-bk*20+Math.sin(t*4)*6}px) scale(${.4+.6*bk}) rotate(10deg)`}

 // ---------- ENSEIGNANT 40.5–51 ----------
 if(sc(S5,t,40.5,43.6,.04)){expr(prof,blinkE(t,t>42?'joie':'sourire'));putA(prof,300,1420,{r:Math.sin(t*1.2)*.8})}
 show(cApp,t,43.4,46.3,985,0);pop(lApp,t,44.2,46.1,540,560,-2);
 show(cNot,t,46.3,48.5,820,-1);pop(lNot,t,46.8,48.3,430,1110,2);
 show(cAnn,t,48.5,51.0,880,1);pop(lAnn,t,49.1,50.8,430,1300,-2);
 presenter(pP,t,43.6,50.9);

 // ---------- ÉLÈVE 51–59 ----------
 if(sc(S6,t,51.0,54.0,.04)){expr(frere,t>53?'joie':blinkE(t,'reflechit'));putA(frere,560,1340,{r:Math.sin(t*1.1)*.8});bubble(bF,t,51.9,53.8,300,470)}
 show(cRev,t,53.8,56.3,985,0);pop(lRev,t,54.4,56.1,540,560,-2);
 show(cObj,t,56.3,59.0,880,-1);{const on=t>57.0&&t<58.7;rObj.style.opacity=on?(.6+.4*Math.sin(t*8)):0;rObj.style.transform=`translate(${316}px,${1011}px)`}
 pop(lObj,t,56.9,58.8,540,560,2);exams.forEach((e,k)=>pop(e,t,57.3+k*.2,58.8,[250,520,810][k],1300,k%2?2:-2));
 presenter(pF,t,54.1,58.9,'joie');

 // ---------- PRIX ----------
 pop(payc,t,62.0,64.8,540,1080,0);
 // ---------- S8 65–73 ----------
 if(sc(S8,t,64.9,73.5,.05)){
  expr(papa8,blinkE(t,'sourire'));expr(kid8,blinkE(t,'sourire',1.2));expr(maman8,blinkE(t,'sourire',.5));
  putA(maman8,940,1150,{r:4+Math.sin(t)*.6});putA(kid8,285,1335,{r:4+Math.sin(t*1.5)*1.5});putA(papa8,700,1335,{r:-6+Math.sin(t*1.2)*1});
  note8.style.transform=`translate(400px,${1130+Math.sin(t*2)*3}px) rotate(-4deg)`;
  stars.forEach((s,k)=>{const a=66.6+k*.3;const p=back(P(t,a,a+.5));s.style.opacity=t>a?C(p):0;s.style.transform=`translate(${[110,330,480,940][k]}px,${[700,620,760,640][k]+Math.sin(t*3+k)*10}px) scale(${.4+.6*p})`})}
 veil.style.opacity=.94*eio(P(t,69.4,70.0));
 {const on=t>=71.0;if(!on)cta.style.opacity=0;else{const k=back(P(t,71.0,71.6));place(cta,540,1110,880,132,{s:(.6+.4*k)*(1+.02*Math.sin(t*5)),op:C(P(t,71.0,71.2))})}
  const p2=eo(P(t,71.5,72.1));by.style.opacity=p2;by.style.transform=`translateY(${1260+(1-p2)*20}px)`}

 const c=CAP.find(c=>t>=c[0]&&t<=c[1]);$('#cap').style.transform='translateY(1480px)';$('#cap').style.opacity=c&&t<69.5?C(P(t,c[0],c[0]+.15))*(1-P(t,c[1]-.1,c[1])):0;if(c)capS.textContent=c[2];
 gc.putImageData(G[Math.floor(t*30)%5],0,0);
 $('#fade').style.opacity=(1-C(P(t,0,.3)))+ei(P(t,72.5,73));
};
window.ready=Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>{}))]);
if(location.hash==='#play'){const t0=performance.now();(function L(){render(((performance.now()-t0)/1000)%DUR);requestAnimationFrame(L)})()}else render(0);
