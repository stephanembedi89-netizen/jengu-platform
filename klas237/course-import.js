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
  window.klasImport={readFile,parse,clean};
})();
