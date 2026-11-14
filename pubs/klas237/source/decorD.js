// ================= DÉCORS =================
const scene=(html)=>{const e=el(`<div class="sc">${html}</div>`);return e};
const ROOM=(night)=>`<div style="position:absolute;inset:0;background:${night?'linear-gradient(#3B2A4A,#6B3F3A 55%,#8A5536)':'linear-gradient(#F6E3BE,#F3D3A0 60%,#E9BE84)'}"></div>
 <svg width="1080" height="1920">
  <rect x="640" y="250" width="330" height="430" rx="18" fill="${night?'#16264F':'#BFE3F5'}" stroke="#5B3A22" stroke-width="18"/>
  <path d="M805 250 V680 M640 465 H970" stroke="#5B3A22" stroke-width="12"/>
  ${night?'<circle cx="890" cy="340" r="38" fill="#FFF3C4"/><circle cx="700" cy="320" r="4" fill="#fff"/><circle cx="745" cy="420" r="3" fill="#fff"/><circle cx="930" cy="560" r="4" fill="#fff"/>':'<circle cx="890" cy="350" r="46" fill="#FFD23F"/>'}
  <path d="M590 210 H1020 V250 H590Z" fill="#5B3A22"/>
  <g><path d="M600 250 Q570 480 620 720 L700 720 Q650 480 690 250Z" fill="#D7263D"/><path d="M612 300 Q600 420 628 520 L668 520 Q640 420 660 300Z" fill="#FFC72C"/><circle cx="640" cy="600" r="22" fill="#1E4FD8"/>
     <path d="M1010 250 Q1040 480 990 720 L910 720 Q960 480 920 250Z" fill="#D7263D"/><path d="M998 300 Q1010 420 982 520 L942 520 Q970 420 950 300Z" fill="#FFC72C"/><circle cx="970" cy="600" r="22" fill="#1E4FD8"/></g>
  <g><rect x="150" y="330" width="250" height="190" rx="10" fill="#fff" stroke="#5B3A22" stroke-width="14"/><path d="M170 480 L240 400 L290 450 L330 410 L380 480Z" fill="#0E8A5F"/><circle cx="330" cy="380" r="20" fill="#FFD23F"/></g>
  <path d="M250 0 V120" stroke="#3A2A1C" stroke-width="8"/><path d="M170 190 Q250 60 330 190Z" fill="#FFD23F"/>
  ${night?'<ellipse cx="250" cy="420" rx="330" ry="300" fill="#FFD98A" opacity=".16"/>':''}
 </svg>`;
const TABLE=T=>`<svg width="1080" height="1920"><path d="M-20 ${T} H1100 V${T+205} H-20Z" fill="#8A5A34"/><path d="M-20 ${T} H1100 V${T+36} H-20Z" fill="#A9713F"/><rect x="-20" y="${T+205}" width="1120" height="${1940-T-205}" fill="#5B3A22"/></svg>`;
const NOTE=`<svg width="230" height="170" viewBox="0 0 230 170" style="position:static;overflow:visible"><rect x="4" y="4" width="222" height="162" rx="10" fill="#fff" stroke="#1E4FD8" stroke-width="8"/><path d="M115 4 V166" stroke="#1E4FD8" stroke-width="5"/>
 <g stroke="#9AA8BF" stroke-width="5" stroke-linecap="round"><path d="M22 40 H98 M22 66 H90 M22 92 H98 M22 118 H76 M132 40 H208 M132 66 H196 M132 92 H208"/></g><text x="150" y="140" font-family="Sora" font-weight="800" font-size="34" fill="#E0393E">3/4 ?</text></svg>`;

