#!/usr/bin/env node
/* Cartographie de l'architecture d'une application web :
   pour chaque rôle, relève la navigation principale, le menu secondaire, la barre d'onglets mobile,
   puis visite chaque destination pour noter son titre, son nombre d'actions et son contenu.
   Usage : node carte.js <config.json> [dossier-de-sortie]  (voir ../references/klas237.json) */
'use strict';
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { console.error('Playwright introuvable.'); process.exit(2); }

const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = path.resolve(process.argv[3] || 'carte-out');
fs.mkdirSync(out, { recursive: true });
const S = Object.assign({ main: '#nav > button[data-route]', extra: '#nav details button[data-route]', tabs: '.kx-tabbar button', title: '#screen h1', screen: '#screen', go: "openRoute('{route}')", routeAttr: 'route' }, cfg.selectors || {});

const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const words = s => new Set(norm(s).split(' ').filter(w => w.length > 3));
function jaccard(a, b) { const A = words(a), B = words(b); if (!A.size || !B.size) return 0; let i = 0; A.forEach(w => B.has(w) && i++); return i / (A.size + B.size - i); }
function labelMatch(label, title) { const a = words(label), b = words(title); if (!a.size || !b.size) return false; let hit = 0; a.forEach(w => { for (const x of b) if (x.startsWith(w.slice(0, 5)) || w.startsWith(x.slice(0, 5))) { hit++; break; } }); return hit / a.size >= 0.5; }

(async () => {
  const browser = await chromium.launch();
  const roles = [];
  for (const r of cfg.roles) {
    const page = await browser.newPage({ viewport: { width: cfg.width || 1440, height: 900 } });
    for (const h of cfg.blockHosts || []) await page.route(new RegExp(h), x => x.abort());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(cfg.baseUrl, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    let clicks = 0;
    for (const s of r.steps) {
      try {
        if (s.click) { await page.click(s.click, { timeout: 5000 }); clicks++; }
        else if (s.fill) await page.fill(s.fill, s.value);
        else if (s.select) await page.selectOption(s.select, s.value);
        else if (s.eval) await page.evaluate(s.eval);
      } catch (e) { errors.push('Étape impossible : ' + JSON.stringify(s)); }
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(700);
    const nav = await page.evaluate(S => {
      const pick = sel => [...document.querySelectorAll(sel)].map(b => ({ route: b.dataset.route || '', label: (b.getAttribute('aria-label') || b.textContent || '').trim().replace(/\s+/g, ' ') }));
      const groups = [...document.querySelectorAll('#nav details p, #nav details .workspace-tool-group > p')].map(p => p.textContent.trim());
      return { main: pick(S.main), extra: pick(S.extra), tabs: pick(S.tabs), groups, start: document.querySelector(S.title)?.textContent.trim() || '' };
    }, S);
    const routes = [...new Map([...nav.main, ...nav.extra].filter(x => x.route).map(x => [x.route, x])).values()];
    const pages = [];
    for (const it of routes) {
      try { await page.evaluate(S.go.replace('{route}', it.route)); } catch (e) { errors.push('Destination impossible : ' + it.route); continue; }
      await page.waitForTimeout(450);
      const info = await page.evaluate(S => {
        const sc = document.querySelector(S.screen); const vis = el => el.offsetParent !== null;
        const h1s = [...document.querySelectorAll(S.title)].filter(vis).map(h => h.textContent.trim().replace(/\s+/g, ' '));
        const btns = sc ? [...sc.querySelectorAll('button, a[href]')].filter(vis) : [];
        const active = document.querySelector('#nav [aria-current=page], #nav .active');
        return { h1: h1s, actions: btns.length, text: sc ? sc.innerText.slice(0, 4000) : '', active: active ? active.dataset.route || '' : '', page: typeof page !== 'undefined' ? page : '' };
      }, S);
      pages.push({ ...it, ...info, level: nav.main.some(m => m.route === it.route) ? 1 : 2 });
    }
    roles.push({ name: r.name, clicks, nav, pages, errors });
    await page.close();
  }
  await browser.close();

  /* ---------- Constats ---------- */
  const F = [];
  const add = (sev, role, rule, msg, detail) => F.push({ sev, role, rule, msg, detail });
  for (const r of roles) {
    if (r.clicks > (cfg.maxEntryClicks || 4)) add('moyenne', r.name, 'parcours-entree', r.clicks + ' clics avant le premier écran utile', 'Raccourcir l’entrée (démo directe, rôle mémorisé).');
    if (r.nav.main.length > 5) add('moyenne', r.name, 'trop-d-entrees', r.nav.main.length + ' entrées principales (5 au plus recommandé)', r.nav.main.map(m => m.label).join(' · '));
    if (r.nav.extra.length > 8) add('moyenne', r.name, 'menu-secondaire-charge', r.nav.extra.length + ' outils cachés dans le menu secondaire', r.nav.extra.map(m => m.label).join(' · '));
    if (r.nav.tabs.length > 5) add('moyenne', r.name, 'trop-d-onglets', r.nav.tabs.length + ' onglets en bas d’écran (3 à 5 recommandés)', '');
    const seen = {};
    for (const p of r.pages) {
      if (p.h1.length !== 1) add('basse', r.name, 'titre-ecran', '« ' + p.label + ' » : ' + p.h1.length + ' titre(s) principal(aux)', p.h1.join(' / '));
      else if (!labelMatch(p.label, p.h1[0])) add('moyenne', r.name, 'libelle-titre', 'Le menu dit « ' + p.label + ' », l’écran s’appelle « ' + p.h1[0] + ' »', 'Aligner le libellé du menu et le titre de l’écran.');
      if (p.page && p.page !== p.route) add('haute', r.name, 'redirection', '« ' + p.label + ' » (' + p.route + ') ouvre en réalité « ' + p.page + ' »', 'Une entrée de menu qui mène ailleurs trompe l’utilisateur.');
      if (p.active && p.active !== p.route && p.page === p.route) add('basse', r.name, 'etat-actif', 'Sur « ' + p.label + ' », le menu met en avant « ' + p.active + ' »', '');
      if (p.actions > (cfg.maxActions || 30)) add('basse', r.name, 'ecran-charge', '« ' + p.label + ' » propose ' + p.actions + ' boutons et liens', 'Hiérarchiser : une action principale, le reste en second plan.');
      const key = norm(p.label); if (seen[key]) add('moyenne', r.name, 'libelle-double', 'Deux entrées s’appellent « ' + p.label + ' »', seen[key] + ' et ' + p.route); seen[key] = p.route;
    }
    for (let i = 0; i < r.pages.length; i++) for (let j = i + 1; j < r.pages.length; j++) {
      const a = r.pages[i], b = r.pages[j], sim = jaccard(a.text, b.text);
      if (sim > (cfg.dupThreshold || 0.72)) add(a.level === 1 || b.level === 1 ? 'haute' : 'moyenne', r.name, 'ecrans-doublons', '« ' + a.label + ' » et « ' + b.label + ' » se ressemblent à ' + Math.round(sim * 100) + ' %', a.route + ' / ' + b.route);
    }
    for (const e of [...new Set(r.errors)]) add('haute', r.name, 'erreur', e, '');
  }
  /* Vocabulaire entre rôles : un même concept doit porter le même nom */
  const vocab = {};
  for (const r of roles) for (const m of r.nav.main) (vocab[m.route] ||= []).push(r.name + ' : ' + m.label);
  const order = { haute: 0, moyenne: 1, basse: 2 };
  F.sort((a, b) => order[a.sev] - order[b.sev]);

  let md = '# Carte de l’architecture\n\n' + cfg.baseUrl + ' · ' + roles.length + ' rôles · ' + roles.reduce((n, r) => n + r.pages.length, 0) + ' destinations visitées\n\n';
  for (const r of roles) {
    md += '## ' + r.name + '\n\nEntrée : ' + r.clicks + ' clics · écran d’arrivée « ' + r.nav.start + ' »\n\n';
    md += '| Niveau | Menu | Titre de l’écran | Actions | Route |\n|---|---|---|---|---|\n';
    md += r.pages.map(p => '| ' + (p.level === 1 ? 'Principal' : 'Menu « plus »') + ' | ' + p.label + ' | ' + (p.h1[0] || '—') + ' | ' + p.actions + ' | `' + p.route + (p.page && p.page !== p.route ? ' → ' + p.page : '') + '` |').join('\n') + '\n\n';
    if (r.nav.tabs.length) md += 'Onglets mobiles : ' + r.nav.tabs.map(t => t.label).join(' · ') + '\n\n';
  }
  md += '## Vocabulaire des menus principaux par rôle\n\n' + Object.entries(vocab).map(([k, v]) => '- `' + k + '` : ' + v.join(' ; ')).join('\n') + '\n\n';
  md += '## Constats\n\n' + (F.length ? F.map(f => '- **[' + f.sev + ']** ' + f.role + ' · ' + f.rule + ' : ' + f.msg + (f.detail ? ' — ' + f.detail : '')).join('\n') : 'Aucun constat automatique.') + '\n';
  fs.writeFileSync(path.join(out, 'carte.md'), md);
  fs.writeFileSync(path.join(out, 'carte.json'), JSON.stringify({ roles: roles.map(r => ({ ...r, pages: r.pages.map(p => ({ ...p, text: undefined })) })), findings: F }, null, 2));
  console.log('Carte : ' + path.join(out, 'carte.md') + ' · ' + F.length + ' constats');
})().catch(e => { console.error(e); process.exit(1); });
