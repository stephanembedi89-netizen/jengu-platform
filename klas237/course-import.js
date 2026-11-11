/* Klas 237 · Import d'un cours ou d'une progression de l'enseignant.
   Lit un fichier texte, Markdown, HTML ou Word (.docx) dans le navigateur, sans envoi au serveur,
   puis découpe le texte en chapitres ou leçons. Les photos et PDF passent par l'assistant IA. */
(function(){
  'use strict';
  const MAX_TEXT=200000;
  async function inflateRaw(bytes){
    const ds=new DecompressionStream('deflate-raw');
    const out=new Response(new Blob([bytes]).stream().pipeThrough(ds));
    return new Uint8Array(await out.arrayBuffer());
  }
  /* Lecture minimale d'une archive zip (Word, Excel) : renvoie le texte d'une entrée, ou la liste des noms. */
  async function zipEntries(buf){
    const u8=new Uint8Array(buf),dv=new DataView(buf);
    let eocd=-1;for(let i=u8.length-22;i>=Math.max(0,u8.length-66000);i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
    if(eocd<0)throw new Error('zip');
    const count=dv.getUint16(eocd+10,true);let p=dv.getUint32(eocd+16,true);const dec=new TextDecoder(),out={};
    for(let n=0;n<count;n++){
      if(dv.getUint32(p,true)!==0x02014b50)break;
      const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nlen=dv.getUint16(p+28,true),xlen=dv.getUint16(p+30,true),clen=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true);
      const name=dec.decode(u8.subarray(p+46,p+46+nlen));
      out[name]=async()=>{const start=off+30+dv.getUint16(off+26,true)+dv.getUint16(off+28,true),data=u8.subarray(start,start+csize);return dec.decode(method===0?data:await inflateRaw(data));};
      p+=46+nlen+xlen+clen;
    }
    return out;
  }
  const unxml=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(+n)).replace(/&amp;/g,'&');
  /* Excel (.xlsx) : première feuille → tableau de lignes */
  async function xlsxRows(buf){
    const z=await zipEntries(buf);
    const shared=[];if(z['xl/sharedStrings.xml']){const x=await z['xl/sharedStrings.xml']();(x.match(/<si>[\s\S]*?<\/si>/g)||[]).forEach(si=>shared.push(unxml((si.match(/<t[^>]*>([\s\S]*?)<\/t>/g)||[]).map(t=>t.replace(/<[^>]+>/g,'')).join(''))));}
    const sheet=Object.keys(z).filter(n=>/^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort((a,b)=>parseInt(a.match(/\d+/)[0])-parseInt(b.match(/\d+/)[0]))[0];
    if(!sheet)throw new Error('xlsx');
    const x=await z[sheet](),rows=[];
    const col=ref=>{const L=ref.replace(/\d+/g,'');let n=0;for(const ch of L)n=n*26+ch.charCodeAt(0)-64;return n-1;};
    (x.match(/<row[\s\S]*?<\/row>/g)||[]).forEach(r=>{const row=[];(r.match(/<c [\s\S]*?(?:\/>|<\/c>)/g)||[]).forEach(c=>{const ref=(c.match(/ r="([A-Z]+\d+)"/)||[])[1];const t=(c.match(/ t="(\w+)"/)||[])[1];let v=(c.match(/<v>([\s\S]*?)<\/v>/)||[])[1];if(t==='inlineStr')v=((c.match(/<t[^>]*>([\s\S]*?)<\/t>/)||[])[1]);if(v==null)return;v=t==='s'?shared[+v]:unxml(v);row[ref?col(ref):row.length]=String(v).trim();});rows.push(Array.from(row,v=>v||''));});
    return rows;
  }
  function csvRows(text){
    const first=text.split(/\r?\n/)[0]||'';const sep=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':first.includes('\t')?'\t':',';
    const rows=[];let row=[],cell='',q=false;
    for(let i=0;i<text.length;i++){const ch=text[i];
      if(q){if(ch==='"'){if(text[i+1]==='"'){cell+='"';i++;}else q=false;}else cell+=ch;}
      else if(ch==='"')q=true;else if(ch===sep){row.push(cell.trim());cell='';}else if(ch==='\n'){row.push(cell.trim());rows.push(row);row=[];cell='';}else if(ch!=='\r')cell+=ch;}
    if(cell||row.length){row.push(cell.trim());rows.push(row);}
    return rows.filter(r=>r.some(Boolean));
  }
  /* Tableau (Excel, CSV ou texte collé) → lignes */
  async function readTable(file){
    const name=(file.name||'').toLowerCase();
    if(/\.xlsx$/.test(name)){if(typeof DecompressionStream!=='function')throw new Error('browser');return xlsxRows(await file.arrayBuffer());}
    if(/\.(xls|ods|numbers)$/.test(name))throw new Error('format');
    return csvRows(await file.text());
  }
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  /* Liste de classe : repère les colonnes Nom / Prénom(s) / Noms et prénoms ; sinon la première colonne de texte */
  function namesFromRows(rows){
    rows=rows.filter(r=>r.some(c=>String(c).trim()));if(!rows.length)return [];
    const hi=rows.findIndex(r=>r.some(c=>/^(nom|noms|name|names|eleve|eleves|student|pupil|prenom|prenoms|first name|surname|last name|noms et prenoms|nom et prenom|nom prenom)/.test(norm(c))));
    let list=[];
    if(hi>=0&&hi<5){
      const h=rows[hi].map(norm);
      const full=h.findIndex(x=>/noms? (et )?prenoms?|nom prenom|full name|eleve|student|pupil/.test(x));
      const last=h.findIndex(x=>/^(nom|noms|surname|last name|name)$/.test(x));
      const first=h.findIndex(x=>/^(prenom|prenoms|first name|given name)/.test(x));
      list=rows.slice(hi+1).map(r=>full>=0?r[full]:[r[last],r[first]].filter(v=>v&&String(v).trim()).join(' '));
    }else{
      const width=Math.max(...rows.map(r=>r.length));let best=0,score=-1;
      for(let c=0;c<width;c++){const sc=rows.filter(r=>/[a-zA-ZÀ-ÿ]{2,}/.test(r[c]||'')&&!/^\d/.test(r[c]||'')).length;if(sc>score){score=sc;best=c;}}
      list=rows.map(r=>r[best]);
    }
    return list.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(x=>x&&/[a-zA-ZÀ-ÿ]/.test(x)&&x.length<=80).slice(0,250);
  }
  /* Notes : pour chaque élève de la classe, cherche sa ligne (nom) et la première valeur numérique de la ligne */
  function marksFromRows(rows,students){
    const hr=rows.findIndex(r=>r.some(c=>/^(note|notes|moyenne|moy|mark|marks|score|resultat|total)\b|\/ ?(10|20|40|100)$/.test(norm(c)+(String(c).match(/\/ ?\d+$/)?String(c).match(/\/ ?\d+$/)[0]:''))));
    const noteCol=hr>=0&&hr<6?rows[hr].findIndex(c=>/^(note|notes|moyenne|moy|mark|marks|score|resultat|total)\b/.test(norm(c))||/\/ ?(10|20|40|100)\s*$/.test(String(c))):-1;
    const out={},idx=rows.map(r=>({key:norm(r.filter(c=>!/^\s*\d+([.,]\d+)?\s*$/.test(c)).join(' ')),r}));
    students.forEach(s=>{const k=norm(s.name);if(!k)return;const tokens=k.split(' ').filter(t=>t.length>1);
      const hit=idx.find(x=>x.key&&(x.key===k||x.key.includes(k)||(tokens.length&&tokens.every(t=>x.key.includes(t)))));
      if(!hit)return;const isNum=c=>/^\s*\d+([.,]\d+)?\s*$/.test(c||'')||/^abs/i.test(c||'');
      let v=noteCol>=0?hit.r[noteCol]:[...hit.r].reverse().find(isNum);if(v==null||!isNum(v))return;out[s.id]=/^abs/i.test(v)?'abs':String(v).trim().replace('.',',');});
    return out;
  }
  /* Lecture minimale d'une archive zip : on cherche word/document.xml dans le répertoire central. */
  async function docxText(buf){
    const u8=new Uint8Array(buf),dv=new DataView(buf);
    let eocd=-1;for(let i=u8.length-22;i>=Math.max(0,u8.length-66000);i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
    if(eocd<0)throw new Error('zip');
    const count=dv.getUint16(eocd+10,true);let p=dv.getUint32(eocd+16,true);const dec=new TextDecoder();
    for(let n=0;n<count;n++){
      if(dv.getUint32(p,true)!==0x02014b50)break;
      const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nlen=dv.getUint16(p+28,true),xlen=dv.getUint16(p+30,true),clen=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true);
      const name=dec.decode(u8.subarray(p+46,p+46+nlen));
      if(name==='word/document.xml'){
        const start=off+30+dv.getUint16(off+26,true)+dv.getUint16(off+28,true),data=u8.subarray(start,start+csize);
        const raw=method===0?data:await inflateRaw(data);
        const xml=dec.decode(raw);
        return xml.replace(/<w:tab\/>/g,'\t').replace(/<w:br[^>]*\/>/g,'\n').replace(/<\/w:p>/g,'\n').replace(/<[^>]+>/g,'')
          .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
      }
      p+=46+nlen+xlen+clen;
    }
    throw new Error('docx');
  }
  function htmlText(s){const d=new DOMParser().parseFromString(s,'text/html');d.querySelectorAll('script,style').forEach(n=>n.remove());d.querySelectorAll('h1,h2,h3,h4,p,li,br,div,tr').forEach(n=>n.append('\n'));return d.body.textContent||'';}
  async function readFile(file){
    const name=(file.name||'').toLowerCase();
    if(/\.docx$/.test(name)){if(typeof DecompressionStream!=='function')throw new Error('browser');return clean(await docxText(await file.arrayBuffer()));}
    if(/\.(pdf|doc|odt|pptx?|jpe?g|png|webp|heic)$/.test(name)||/^image\//.test(file.type))throw new Error('ai');
    const text=await file.text();
    return clean(/\.html?$/.test(name)||/html/.test(file.type)?htmlText(text):text);
  }
  function clean(t){return String(t||'').replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim().slice(0,MAX_TEXT);}

  /* Découpage : d'abord les intitulés explicites (Chapitre, Leçon…), sinon la numérotation, sinon les titres Markdown,
     sinon chaque ligne courte devient une leçon (cas d'un sommaire collé). */
  const KEY=/^\s*(chapitre|chap\.|le(ç|c)on|unit(é|e)|th(è|e)me|module|partie|s(é|e)quence|lesson|chapter|unit|topic)\b/i;
  const NUM=/^\s*((\d{1,2})|([IVXLC]{1,6}))\s*[\.\)\-–:]\s*\S/;
  const MD=/^\s*#{1,3}\s+\S/;
  function title(line){
    let t=line.replace(/^\s*#{1,3}\s+/,'').replace(/\s+/g,' ').trim();
    const bare=t.replace(/^(chapitre|chap\.|le(ç|c)on|unit(é|e)|th(è|e)me|module|partie|s(é|e)quence|lesson|chapter|unit|topic)\s*([0-9]{1,2}|[IVXLC]{1,6})?\s*[:.)\-–]?\s*/i,'').replace(/^((\d{1,2})|([IVXLC]{1,6}))\s*[.)\-–:]\s*/,'');
    if(bare.length>=3)t=bare;
    return t.replace(/[:\-–\s]+$/,'').slice(0,120);
  }
  function parse(text){
    const lines=clean(text).split('\n');
    const tests=[l=>KEY.test(l)&&l.trim().length<=140,l=>NUM.test(l)&&l.trim().length<=110,l=>MD.test(l)];
    for(const test of tests){
      const heads=lines.map((l,i)=>test(l)?i:-1).filter(i=>i>=0);
      if(heads.length>=1&&!(heads.length===1&&lines.filter(Boolean).length<3)){
        const items=heads.map((h,j)=>{const body=lines.slice(h+1,j+1<heads.length?heads[j+1]:lines.length).join('\n').trim();return {title:title(lines[h]),content:body};});
        const intro=lines.slice(0,heads[0]).join('\n').trim();
        if(intro&&items.length===1&&!items[0].content)items[0].content=intro;
        return items.filter(x=>x.title).slice(0,80);
      }
    }
    const short=lines.map(l=>l.trim()).filter(Boolean);
    if(short.length&&short.every(l=>l.length<=110))return short.slice(0,80).map(l=>({title:title(l.replace(/^[-•*·]\s*/,'')),content:''}));
    if(short.length)return [{title:title(short[0]),content:short.slice(1).join('\n')}];
    return [];
  }
  window.klasImport={readFile,parse,clean,readTable,namesFromRows,marksFromRows,csvRows};
})();
