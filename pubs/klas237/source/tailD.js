
// ================= PERSONNAGES (Avataaars · Pablo Stanley) =================
function av(name,exprs,w){const h=w*280/264;const d=document.createElement('div');d.style.cssText=`position:absolute;left:0;top:0;width:${w}px;height:${h}px;transform-origin:50% 100%;opacity:0`;
 d.innerHTML=exprs.map(e=>`<img data-e="${e}" src="av/${name}_${e}.svg" style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0">`).join('');d.w=w;d.h=h;d.ex=[...d.querySelectorAll('img')];return d}
function expr(d,e){d.ex.forEach(i=>i.style.opacity=i.dataset.e===e?1:0)}
function putA(d,x,yb,{s=1,r=0,op=1}={}){d.st={x,yb,s,r,op};d.style.opacity=op;d.style.transform=`translate(${x-d.w/2}px,${yb-d.h}px) rotate(${r}deg) scale(${s})`}
const seq=(t,arr)=>{let e=arr[0][1];for(const [a,x] of arr)if(t>=a)e=x;return e};
const blinkE=(t,base,off=0)=>(((t+off)%3.3)<.13)?'clin':base;


// ================= BRAS (cinématique inverse à 2 segments) =================
const NSV='http://www.w3.org/2000/svg',SKIN='#614335';
const svx=(par,tag,at={})=>{const e=document.createElementNS(NSV,tag);for(const k in at)e.setAttribute(k,at[k]);par.appendChild(e);return e};
const SLEEVE={papa:'#0e8a5f',kid:'#2f6fe0',maman2:'#EDECE3',frere:'#d7263d',prof:'#f2b53a'};
const KF=(t,k)=>{if(t<=k[0][0])return k[0][1];for(let i=0;i<k.length-1;i++){const [a,p]=k[i],[b,q]=k[i+1];if(t<=b){const u=eio(P(t,a,b));return [lerp(p[0],q[0],u),lerp(p[1],q[1],u)]}}return k[k.length-1][1]};
function ext(d,col){const e=document.createElement('div');e.style.cssText=`position:absolute;left:16%;width:68%;top:${d.h-.03*d.w-6}px;height:${d.h}px;background:${col}`;d.insertBefore(e,d.firstChild)}
function ARMS(scene,clipY){const d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;width:1080px;height:1920px';
 d.innerHTML=`<svg width="1080" height="1920" style="position:absolute;left:0;top:0">${clipY?`<defs><clipPath id="clp${clipY}"><rect x="-100" y="-100" width="1300" height="${clipY+100}"/></clipPath></defs><g clip-path="url(#clp${clipY})"></g>`:'<g></g>'}</svg>`;scene.appendChild(d);return d.querySelector('g')}
function limb(g,d,side,sleeve){
 const mkp=c=>svx(g,'path',{fill:'none',stroke:c,'stroke-linecap':'round','stroke-linejoin':'round'});
 const up=mkp(sleeve),fa=mkp(SKIN),el=svx(g,'circle',{fill:sleeve}),ln=svx(g,'line',{'stroke-linecap':'round'}),hd=svx(g,'ellipse',{fill:SKIN});
 const all=[up,fa,el,ln,hd];
 return {set(H,o={}){
  if(!H||!d.st||d.st.op<=0){all.forEach(e=>e.setAttribute('visibility','hidden'));return}
  all.forEach(e=>e.setAttribute('visibility','visible'));
  const st=d.st,K=st.s*d.w,L1=.36*K,L2=.34*K,c=Math.cos(st.r*Math.PI/180),sn=Math.sin(st.r*Math.PI/180);
  const px=side*.29*d.w*st.s,py=(.90-1)*d.h*st.s;const Sx=st.x+px*c-py*sn,Sy=st.yb+px*sn+py*c;
  let dx=H[0]-Sx,dy=H[1]-Sy,dd=Math.hypot(dx,dy);const m=Math.min(Math.max(dd,.3*(L1+L2)),.985*(L1+L2));const ux=dx/dd,uy=dy/dd;
  const Hx=Sx+ux*m,Hy=Sy+uy*m;dd=m;const a=(L1*L1-L2*L2+dd*dd)/(2*dd),hh=Math.sqrt(Math.max(0,L1*L1-a*a));
  const qx=-uy,qy=ux;let E1=[Sx+ux*a+qx*hh,Sy+uy*a+qy*hh],E2=[Sx+ux*a-qx*hh,Sy+uy*a-qy*hh];const E=(o.up?E1[1]<E2[1]:E1[1]>E2[1])?E1:E2;
  up.setAttribute('d',`M${Sx} ${Sy}L${E[0]} ${E[1]}`);up.setAttribute('stroke-width',.115*K);
  fa.setAttribute('d',`M${E[0]} ${E[1]}L${Hx} ${Hy}`);fa.setAttribute('stroke-width',.085*K);
  el.setAttribute('cx',E[0]);el.setAttribute('cy',E[1]);el.setAttribute('r',.0575*K);
  const ang=Math.atan2(Hy-E[1],Hx-E[0])*180/Math.PI;
  hd.setAttribute('rx',.07*K);hd.setAttribute('ry',.058*K);hd.setAttribute('cx',Hx+Math.cos(ang*Math.PI/180)*.03*K);hd.setAttribute('cy',Hy+Math.sin(ang*Math.PI/180)*.03*K);hd.setAttribute('transform',`rotate(${ang} ${Hx} ${Hy})`);
  if(o.line){ln.setAttribute('visibility','visible');ln.setAttribute('x1',Hx+(o.line[0]||0));ln.setAttribute('y1',Hy+(o.line[1]||0));ln.setAttribute('x2',o.line[2]);ln.setAttribute('y2',o.line[3]);ln.setAttribute('stroke',o.line[5]||'#F2B53A');ln.setAttribute('stroke-width',o.line[4]||9)}else ln.setAttribute('visibility','hidden')}}}

// ---- S1 : la soirée ----
const S1=scene(ROOM(true));
const papa=av('papa',['sourire','neutre','perdu','panique','gene','clin'],640),kid=av('kid',['oh','neutre','reflechit','sourire','clin'],430);
S1.appendChild(kid);S1.appendChild(papa);S1.insertAdjacentHTML('beforeend',TABLE(1215));
const sweat=document.createElement('div');sweat.style.cssText='position:absolute;left:69%;top:25%;width:30px;height:44px;border-radius:50% 50% 50% 50%/68% 68% 32% 32%;background:linear-gradient(#DDF6FF,#7FD4F0);opacity:0';papa.appendChild(sweat);
const note=document.createElement('div');note.style.cssText='position:absolute;left:0;top:0';note.innerHTML=NOTE;S1.appendChild(note);
const gA1=ARMS(S1,1252),LK=[limb(gA1,kid,-1,SLEEVE.kid),limb(gA1,kid,1,SLEEVE.kid)],LP=[limb(gA1,papa,-1,SLEEVE.papa),limb(gA1,papa,1,SLEEVE.papa)];
const qm=['?','?','?'].map(q=>{const d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;font:800 130px Sora;color:#FFD23F;opacity:0;text-shadow:0 8px 24px rgba(0,0,0,.45)';d.textContent=q;S1.appendChild(d);return d});
const bK=document.createElement('div');bK.className='bb l';bK.textContent='« Papa, aide-moi. »';S1.appendChild(bK);
const bP=document.createElement('div');bP.className='bb r y';bP.textContent='« Euh… va demander à ta mère. »';S1.appendChild(bP);
const h20=document.createElement('div');h20.style.cssText='position:absolute;left:0;top:0;padding:18px 40px;border-radius:999px;background:#0B1B33;color:#FFD23F;font:800 76px/1 Sora;opacity:0;box-shadow:0 14px 40px rgba(0,0,0,.4)';h20.textContent='20 h';S1.appendChild(h20);

// ---- S2 : maman ----
const S2=scene(ROOM(true));const maman=av('maman2',['sourire','neutre','clin','joie'],900);S2.appendChild(maman);ext(maman,SLEEVE.maman2);
const mph=document.createElement('div');mph.style.cssText='position:absolute;left:0;top:0;width:230px;height:430px;border-radius:38px;background:#0B1220;padding:10px;box-shadow:0 30px 60px rgba(0,0,0,.45)';
mph.innerHTML=`<div style="width:100%;height:100%;border-radius:30px;background:#FBF6EC;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><div style="font:800 46px/1 Sora;color:#0B1B33">Klas</div><div style="font:800 40px/1 Sora;color:#E0393E;border:5px solid #E0393E;border-radius:50%;padding:6px 14px;transform:rotate(-4deg)">237</div></div>`;S2.appendChild(mph);const gA2=ARMS(S2,0),LM=[limb(gA2,maman,-1,SLEEVE.maman2),limb(gA2,maman,1,SLEEVE.maman2)];

// ---- S5 : la classe ----
const S5=scene(`<div style="position:absolute;inset:0;background:linear-gradient(#F4E8CF,#EBD7AE)"></div><svg width="1080" height="1920">
 <rect x="90" y="520" width="900" height="470" rx="14" fill="#1F5B45" stroke="#7A5230" stroke-width="22"/>
 <text x="150" y="620" font-family="Caveat" font-weight="700" font-size="74" fill="#fff">Leçon du jour</text><path d="M150 650 H520" stroke="#fff" stroke-width="5" stroke-dasharray="14 10"/>
 <text x="150" y="770" font-family="Caveat" font-weight="700" font-size="96" fill="#FFD23F">3/4 = 0,75</text>
 <circle cx="800" cy="760" r="110" fill="none" stroke="#fff" stroke-width="7"/><path d="M800 760 L800 650 A110 110 0 1 1 690 760Z" fill="#FFD23F" opacity=".85"/><path d="M690 760 H910 M800 650 V870" stroke="#fff" stroke-width="5"/>
 </svg>`);
const prof=av('prof',['sourire','joie','clin'],560);S5.appendChild(prof);ext(prof,SLEEVE.prof);
S5.insertAdjacentHTML('beforeend','<svg width="1080" height="1920"><rect x="-20" y="1400" width="1120" height="560" fill="#C99A62"/><rect x="-20" y="1400" width="1120" height="30" fill="#DDB07A"/></svg>');
const gA5=ARMS(S5,0),LF=[limb(gA5,prof,-1,SLEEVE.prof),limb(gA5,prof,1,SLEEVE.prof)];

// ---- S6 : le grand frère ----
const S6=scene(`<div style="position:absolute;inset:0;background:linear-gradient(#DCE9F7,#C7DBF0)"></div><svg width="1080" height="1920">
 <rect x="110" y="520" width="300" height="380" rx="12" fill="#fff" stroke="#0B1B33" stroke-width="12"/><text x="150" y="610" font-family="Sora" font-weight="800" font-size="52" fill="#E0393E">BAC</text><text x="150" y="680" font-family="Manrope" font-weight="700" font-size="34" fill="#0B1B33">Objectif</text><path d="M150 720 H370 M150 760 H330 M150 800 H370" stroke="#C3CEDD" stroke-width="10" stroke-linecap="round"/>
</svg>`+TABLE(1215));
const frere=av('frere',['reflechit','joie','neutre','clin'],620);S6.insertBefore(frere,S6.lastElementChild);const gA6=ARMS(S6,1252),LR=[limb(gA6,frere,-1,SLEEVE.frere),limb(gA6,frere,1,SLEEVE.frere)];
const bF=document.createElement('div');bF.className='bb l';bF.style.maxWidth='640px';bF.innerHTML='<span style="font:700 26px/1 Sora;letter-spacing:.14em;color:#E0393E;display:block;margin-bottom:10px">💡 UN INDICE</span>Que te demande-t-on de calculer <span style="color:#0E8A5F">en premier</span> ?';S6.appendChild(bF);

// ---- S8 : la famille, le jour ----
const S8=scene(ROOM(false)+'<div style="position:absolute;left:0;top:0;width:1080px;height:620px;background:linear-gradient(rgba(251,246,236,.97) 62%,rgba(251,246,236,0))"></div>');
const maman8=av('maman2',['sourire','clin'],470),papa8=av('papa',['sourire','clin'],640),kid8=av('kid',['sourire','clin'],430);
S8.appendChild(maman8);S8.appendChild(kid8);S8.appendChild(papa8);S8.insertAdjacentHTML('beforeend',TABLE(1215));
const note8=document.createElement('div');note8.style.cssText='position:absolute;left:0;top:0';note8.innerHTML=NOTE.replace('3/4 ?','3/4 ✓').replace('#E0393E','#0E8A5F');S8.appendChild(note8);
const gA8=ARMS(S8,1252),L8k=[limb(gA8,kid8,-1,SLEEVE.kid),limb(gA8,kid8,1,SLEEVE.kid)],L8p=[limb(gA8,papa8,-1,SLEEVE.papa),limb(gA8,papa8,1,SLEEVE.papa)],L8m=[limb(gA8,maman8,-1,SLEEVE.maman2),limb(gA8,maman8,1,SLEEVE.maman2)];
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
const papaPop=av('papa',['sourire','panique'],380);Lr.appendChild(papaPop);const gPop=ARMS(Lr,0),LPP=[limb(gPop,papaPop,-1,SLEEVE.papa),limb(gPop,papaPop,1,SLEEVE.papa)];ext(papaPop,SLEEVE.papa);const bulb=el(`<div class="abs" style="font-size:130px;opacity:0">💡</div>`);
// enseignant
const cHome=crop('home_final_0',1000,1880,820),cApp=crop('prof_appel2_1',95,1210,800),cNot=crop('notes_resultats_1',40,445,860),cNot2=crop('notes_resultats_1',985,1900,760),cAnn=crop('annee_mid',100,1350,780);
const lHome=lbl('🏫 Toute la classe en un coup d’œil'),lApp=lbl('✅ L’appel · 30 secondes'),lNot=lbl('📝 Notes et moyennes de la classe'),lAnn=lbl('📚 Le programme, toujours à jour');
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
[10.7,18.8,'Maman sourit… et ouvre Klas 237.|De la SIL à la Terminale,|l’école et la maison avancent ensemble.'],
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
  const g=eio(P(t,1.4,2.8)),nx=lerp(310,540,g),ny=lerp(1175,1120,g)+Math.sin(t*2)*4;note.style.transform=`translate(${nx}px,${ny}px) rotate(${lerp(-10,5,g)}deg)`;
  {const w=Math.sin(t*16)*14,w2=Math.cos(t*13)*10;
   LK[1].set(KF(t,[[0,[340,1205]],[1.4,[340,1205]],[2.8,[565,1155]],[3.3,[565,1160]],[3.9,[405,1215]],[8.4,[405,1215]],[9.0,[338,1152]]]));
   LK[0].set(KF(t,[[0,[190,1215]],[10.8,[190,1215]]]),{});
   LP[0].set(KF(t,[[0,[640,1215]],[3.2,[640,1215]],[4.0,[755,1150]],[6.0,[755,1150]],[6.5,[470,1015]],[8.0,[470,1015]],[8.5,[440,1085]],[10.8,[440,1085]]]));
   const sc4=P(t,5.0,6.2)>0&&P(t,5.0,6.2)<1?1:0;
   LP[1].set(KF(t,[[0,[880,1215]],[4.6,[880,1215]],[5.2,[858,830]],[6.2,[858,830]],[6.7,[985,1020]],[8.0,[985,1020]],[8.6,[1040,930]],[10.8,[1040,930]]]).map((v,i)=>v+(t>5.2&&t<6.2?(i?w2:w):0)))}
  qm.forEach((q,k)=>{const a=4.8+k*.45;const p=back(P(t,a,a+.4));q.style.opacity=t>a&&t<8?C(p):0;q.style.transform=`translate(${[560,900,730][k]}px,${[560,590,430][k]-p*30+Math.sin(t*3+k)*8}px) rotate(${[-14,12,0][k]}deg) scale(${.5+.5*p})`});
  const sw=(t-6.3)%1.1/1.1;sweat.style.opacity=t>6.3&&t<8?1-sw*sw:0;sweat.style.transform=`translateY(${sw*70}px) scale(${.7+.3*sw})`;
  bubble(bK,t,1.7,4.5,120,640);bubble(bP,t,8.1,10.6,330,440);
  const h=back(P(t,.3,.9));h20.style.opacity=C(P(t,.3,.5))*(1-P(t,10.2,10.6));h20.style.transform=`translate(70px,${130+(1-h)*-60}px) rotate(-4deg) scale(${.6+.4*h})`;
 }
 // ---------- S2 10.3–14.6 ----------
 if(sc(S2,t,10.3,14.7,.06)){
  const k=eo(P(t,10.7,11.7));expr(maman,seq(t,[[0,'sourire'],[11.9,'clin'],[12.2,'sourire'],[12.6,'joie']]));putA(maman,lerp(1500,540,k),1560,{r:Math.sin(t*1.2)*.8});
  {const pk0=eo(P(t,12.1,13.0)),z0=eio(P(t,13.5,14.5)),px=lerp(820,540,z0),py=lerp(1950,1210,pk0)-z0*300,mx=maman.st.x,hide=z0>.02;
   const holding=P(t,12.1,13.0)>0;
   LM[0].set(hide?null:holding?[px-72,py+160]:[mx-190,1720]);LM[1].set(hide?null:holding?[px+78,py+185]:[mx+190,1720])}
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
 {const on=t>=38.4&&t<=40.4;const k=back(P(t,38.4,39.0)),o=ei(P(t,40.0,40.4));if(on){expr(papaPop,t<38.9?'panique':'sourire');const yb=lerp(2200,1475,k)+o*700;putA(papaPop,900,yb,{r:-4+Math.sin(t*6)*2,s:.8});
   LPP[0].set(t<38.9?[835,yb-250]:[735,1190],{});LPP[1].set(t<38.9?[965,yb-250]:[1010,yb-130])}else{papaPop.style.opacity=0;if(papaPop.st)papaPop.st.op=0;LPP[0].set(null);LPP[1].set(null)}
  const bk=back(P(t,38.9,39.4));bulb.style.opacity=on?C(P(t,38.9,39.1))*(1-o):0;bulb.style.transform=`translate(${700}px,${1215-bk*20+Math.sin(t*4)*6}px) scale(${.4+.6*bk}) rotate(10deg)`}

 // ---------- ENSEIGNANT 40.5–51 ----------
 if(sc(S5,t,40.5,43.6,.04)){expr(prof,blinkE(t,t>42?'joie':'sourire'));putA(prof,720,1440,{r:Math.sin(t*1.2)*.8});
  {const hx=640+Math.sin(t*3)*10,hy=1010+Math.sin(t*2.2)*6;LF[0].set([hx,hy],{line:[0,0,hx-70,hy-215,10,'#7A5230']});LF[1].set(KF(t,[[0,[900,1330]],[41.6,[900,1330]],[42.2,[965,1060+0]],[43.6,[965,1060]]]).map((v,i)=>i?v+Math.sin(t*7)*(t>42.2?28:0):v))}}
 show(cHome,t,43.4,45.0,985,0);pop(lHome,t,43.9,44.9,540,560,-2);
 show(cApp,t,44.9,46.9,985,0);pop(lApp,t,45.4,46.8,540,560,2);
 show(cNot,t,46.8,48.9,640,-1);show(cNot2,t,47.1,48.9,1240,1);pop(lNot,t,47.3,48.8,500,1020,-2);
 show(cAnn,t,48.8,51.0,900,1);pop(lAnn,t,49.3,50.8,430,1330,-2);
 presenter(pP,t,43.6,50.9);

 // ---------- ÉLÈVE 51–59 ----------
 if(sc(S6,t,51.0,54.0,.04)){expr(frere,t>53?'joie':blinkE(t,'reflechit'));putA(frere,560,1340,{r:Math.sin(t*1.1)*.8});
  {const wx=470+Math.sin(t*9)*9,wy=1200+Math.cos(t*7)*4;LR[1].set(t<53?[wx,wy]:KF(t,[[53,[470,1200]],[53.5,[815,1000]],[54.1,[815,960]]]).map((v,i)=>i?v+Math.sin(t*10)*14:v),t<53?{line:[0,0,wx+38,wy-56,9,'#F2B53A']}:{});
   LR[0].set(t<53?KF(t,[[51,[640,1185]],[52,[600,1075]]]):[520,1215])}bubble(bF,t,51.9,53.8,300,470)}
 show(cRev,t,53.8,56.3,985,0);pop(lRev,t,54.4,56.1,540,560,-2);
 show(cObj,t,56.3,59.0,880,-1);{const on=t>57.0&&t<58.7;rObj.style.opacity=on?(.6+.4*Math.sin(t*8)):0;rObj.style.transform=`translate(${316}px,${1011}px)`}
 pop(lObj,t,56.9,58.8,540,560,2);exams.forEach((e,k)=>pop(e,t,57.3+k*.2,58.8,[250,520,810][k],1300,k%2?2:-2));
 presenter(pF,t,54.1,58.9,'joie');

 // ---------- PRIX ----------
 pop(payc,t,62.0,64.8,540,1080,0);
 // ---------- S8 65–73 ----------
 if(sc(S8,t,64.9,73.5,.05)){
  expr(papa8,blinkE(t,'sourire'));expr(kid8,blinkE(t,'sourire',1.2));expr(maman8,blinkE(t,'sourire',.5));
  putA(maman8,940,1240,{r:4+Math.sin(t)*.6});putA(kid8,285,1335,{r:4+Math.sin(t*1.5)*1.5});putA(papa8,700,1335,{r:-6+Math.sin(t*1.2)*1});
  {const hf=eio(P(t,67.5,68.2))*(1-eio(P(t,69.2,69.8))),bump=P(t,68.1,68.5)>0&&P(t,68.1,68.5)<1?Math.sin(P(t,68.1,68.5)*Math.PI)*10:0;
   L8k[1].set([lerp(430,484+bump,hf),lerp(1170,1012,hf)]);L8k[0].set([190,1215]);
   L8p[0].set([lerp(610,512-bump,hf),lerp(1165,1008,hf)]);L8p[1].set([880,1215]);
   const cl=Math.abs(Math.sin((t-69.3)*8))*(t>69.3?1:0),cp=eio(P(t,68.8,69.4));
   L8m[0].set([lerp(850,920-26*cl,cp),lerp(1170,1075,cp)]);L8m[1].set([lerp(1020,960+26*cl,cp),lerp(1170,1080,cp)])}
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
