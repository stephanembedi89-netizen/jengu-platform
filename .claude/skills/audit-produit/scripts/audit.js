#!/usr/bin/env node
/* Audit produit automatisé : parcourt de vrais parcours utilisateur dans Chromium
   et mesure ce qu'un humain remarquerait (erreurs, accessibilité, tactile, débordements,
   poids, vitesse en 3G). Usage :
     node audit.js <config.json> [dossier-de-sortie]
   Le fichier de config décrit l'URL, les tailles d'écran et les parcours (voir ../references/config-exemple.json). */
'use strict';
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) {
  try { ({ chromium } = require(require.resolve('playwright', { paths: ['/usr/local/lib/node_modules', '/usr/lib/node_modules', process.cwd()] }))); }
  catch (e2) { console.error('Playwright introuvable. Installez-le ou lancez depuis un dossier où il est disponible.'); process.exit(2); }
}
let axePath;
try { axePath = require.resolve('axe-core/axe.min.js', { paths: [__dirname] }); }
catch (e) { console.error('axe-core manquant : lancez « npm i --prefix ' + __dirname + ' axe-core »'); process.exit(2); }

const cfgFile = process.argv[2];
if (!cfgFile) { console.error('Usage : node audit.js <config.json> [sortie]'); process.exit(2); }
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
const out = path.resolve(process.argv[3] || 'audit-out');
fs.mkdirSync(path.join(out, 'captures'), { recursive: true });

const viewports = cfg.viewports || [{ name: 'mobile', width: 390, height: 844 }, { name: 'ordinateur', width: 1440, height: 900 }];
const tags = cfg.axeTags || ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const minTarget = cfg.minTapTarget || 44;
const findings = [];
const states = [];
const perf = [];

function add(f) { findings.push(f); }

async function pageChecks(page, ctx) {
  await page.addScriptTag({ path: axePath });
  const axe = await page.evaluate(async (tags) => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, url: v.helpUrl, count: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
  }, tags);
  for (const v of axe) add({ type: 'accessibilite', rule: v.id, impact: v.impact || 'minor', message: v.help, count: v.count, targets: v.targets, doc: v.url, ...ctx });

  const dom = await page.evaluate((minTarget) => {
    const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
    const label = el => (el.getAttribute('aria-label') || el.textContent || el.value || el.name || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 60);
    const small = [];
    document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button]').forEach(el => {
      if (!vis(el)) return;
      const r = el.getBoundingClientRect();
      const inlineLink = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p,li,td,label,span,small');
      if (inlineLink || el.type === 'checkbox' || el.type === 'radio') return;
      if (r.width < minTarget || r.height < minTarget) small.push(label(el) + ' (' + Math.round(r.width) + '×' + Math.round(r.height) + ')');
    });
    const tiny = [];
    document.querySelectorAll('body *').forEach(el => {
      if (!vis(el) || el.closest('[aria-hidden="true"]') || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2)) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) tiny.push(label(el) + ' (' + fs + 'px)');
    });
    const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && vis(i)).map(i => i.getAttribute('src'));
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    const h1 = [...document.querySelectorAll('h1')].filter(vis).length;
    const fixed = [...document.querySelectorAll('body *')].filter(el => getComputedStyle(el).position === 'fixed' && vis(el)).map(el => { const r = el.getBoundingClientRect(); return { label: label(el), area: Math.round(r.width * r.height / (innerWidth * innerHeight) * 100) }; }).filter(x => x.area >= 8);
    return { small: [...new Set(small)], tiny: [...new Set(tiny)].slice(0, 20), broken, overflow, h1, fixed, title: document.title, words: (document.body.innerText || '').split(/\s+/).length };
  }, minTarget);
  if (dom.overflow > 1) add({ type: 'mise-en-page', rule: 'defilement-horizontal', impact: 'serious', message: 'La page déborde de ' + dom.overflow + ' px en largeur (défilement horizontal).', ...ctx });
  if (dom.small.length) add({ type: 'tactile', rule: 'cible-trop-petite', impact: dom.small.length > 5 ? 'serious' : 'moderate', message: dom.small.length + ' élément(s) cliquable(s) sous ' + minTarget + ' px', targets: dom.small.slice(0, 8), count: dom.small.length, ...ctx });
  if (dom.tiny.length) add({ type: 'lisibilite', rule: 'texte-trop-petit', impact: 'moderate', message: dom.tiny.length + ' texte(s) sous 12 px', targets: dom.tiny.slice(0, 6), count: dom.tiny.length, ...ctx });
  if (dom.broken.length) add({ type: 'contenu', rule: 'image-cassee', impact: 'serious', message: dom.broken.length + ' image(s) ne se charge(nt) pas', targets: dom.broken, ...ctx });
  if (dom.h1 !== 1) add({ type: 'structure', rule: 'titre-principal', impact: 'minor', message: dom.h1 + ' titre(s) H1 visible(s) (1 attendu par écran)', ...ctx });
  for (const f of dom.fixed) if (f.area >= 15) add({ type: 'mise-en-page', rule: 'element-fixe-envahissant', impact: 'moderate', message: '« ' + f.label + ' » reste fixé et couvre ' + f.area + ' % de l’écran', ...ctx });
  return dom;
}

async function measureLoad(browser, url, vp, throttle) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const h of cfg.blockHosts || []) await page.route(new RegExp(h), r => r.abort());
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  if (throttle) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  let bytes = 0, reqs = 0; const byType = {};
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; reqs++; });
  cdp.on('Network.responseReceived', e => { byType[e.type] = (byType[e.type] || 0) + 1; });
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  const loadMs = Date.now() - t0;
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const lcp = new Promise(res => { new PerformanceObserver(l => { const e = l.getEntries(); res(e[e.length - 1]?.startTime || 0); }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => res(0), 1500); }); return lcp.then(v => ({ dcl: n?.domContentLoadedEventEnd, lcp: v })); });
  await ctx.close();
  return { loadMs, dclMs: Math.round(nav.dcl || 0), lcpMs: Math.round(nav.lcp || 0), kb: Math.round(bytes / 1024), requests: reqs, byType };
}

async function runStep(page, s) {
  if (s.click) await page.click(s.click, { timeout: s.timeout || 5000 });
  else if (s.fill) await page.fill(s.fill, String(s.value ?? ''));
  else if (s.select) await page.selectOption(s.select, String(s.value));
  else if (s.eval) await page.evaluate(s.eval);
  else if (s.press) await page.keyboard.press(s.press);
  await page.waitForTimeout(s.wait ?? cfg.stepWait ?? 400);
}

(async () => {
  const browser = await chromium.launch(cfg.executablePath ? { executablePath: cfg.executablePath } : {});
  for (const vp of viewports) {
    for (const journey of cfg.journeys || [{ name: 'accueil', steps: [{ check: 'accueil' }] }]) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: cfg.reducedMotion ? 'reduce' : 'no-preference' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push('Erreur JS : ' + e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push('Console : ' + m.text().slice(0, 200)); });
      page.on('requestfailed', r => { const u = r.url(); if (!(cfg.blockHosts || []).some(h => new RegExp(h).test(u))) errors.push('Requête échouée : ' + u.slice(0, 160)); });
      page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ' : ' + r.url().slice(0, 160)); });
      for (const h of cfg.blockHosts || []) await page.route(new RegExp(h), r => r.abort());
      try {
        await page.goto(cfg.baseUrl, { waitUntil: 'load' });
        await page.waitForTimeout(cfg.firstWait ?? 600);
        for (const s of journey.steps) {
          if (s.check) {
            await page.waitForTimeout(s.wait ?? 900);
            const ctx = { journey: journey.name, state: s.check, viewport: vp.name };
            const shot = path.join('captures', (journey.name + '-' + s.check + '-' + vp.name).replace(/[^\w.-]+/g, '_') + '.png');
            await page.screenshot({ path: path.join(out, shot), fullPage: true });
            const dom = await pageChecks(page, ctx);
            states.push({ ...ctx, capture: shot, words: dom.words });
          } else {
            try { await runStep(page, s); }
            catch (e) { add({ type: 'parcours', rule: 'etape-impossible', impact: 'critical', message: 'Étape impossible : ' + JSON.stringify(s) + ' — ' + e.message.split('\n')[0], journey: journey.name, viewport: vp.name }); break; }
          }
        }
      } catch (e) { add({ type: 'parcours', rule: 'parcours-interrompu', impact: 'critical', message: e.message.split('\n')[0], journey: journey.name, viewport: vp.name }); }
      for (const m of [...new Set(errors)]) add({ type: 'erreur', rule: 'erreur-console', impact: /Erreur JS/.test(m) ? 'critical' : 'serious', message: m, journey: journey.name, viewport: vp.name });
      await context.close();
    }
  }
  if (cfg.measureLoad !== false) {
    const vp = viewports[0];
    perf.push({ reseau: 'normal', ...(await measureLoad(browser, cfg.baseUrl, vp, false)) });
    perf.push({ reseau: '3G lente (1,6 Mb/s, 300 ms)', ...(await measureLoad(browser, cfg.baseUrl, vp, true)) });
    const slow = perf[1];
    if (slow.loadMs > 8000) add({ type: 'performance', rule: 'chargement-3g', impact: 'serious', message: 'Chargement complet en 3G lente : ' + (slow.loadMs / 1000).toFixed(1) + ' s pour ' + slow.kb + ' Ko et ' + slow.requests + ' requêtes.', viewport: vp.name, journey: 'accueil' });
    if (slow.requests > 50) add({ type: 'performance', rule: 'trop-de-requetes', impact: 'moderate', message: slow.requests + ' requêtes au premier chargement (regrouper scripts et styles).', viewport: vp.name, journey: 'accueil' });
  }
  await browser.close();

  /* Regroupe les constats identiques vus dans plusieurs écrans */
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const grouped = {};
  for (const f of findings) {
    const key = f.type + '|' + f.rule + '|' + (f.rule === 'erreur-console' || f.rule === 'etape-impossible' || f.rule === 'parcours-interrompu' ? f.message : '');
    (grouped[key] ||= { ...f, where: [] }).where.push((f.journey || '') + (f.state ? ' › ' + f.state : '') + ' (' + f.viewport + ')');
    if (order[f.impact] < order[grouped[key].impact]) grouped[key].impact = f.impact;
  }
  const list = Object.values(grouped).sort((a, b) => order[a.impact] - order[b.impact] || b.where.length - a.where.length);
  const label = { critical: 'Critique', serious: 'Haute', moderate: 'Moyenne', minor: 'Basse' };
  const counts = list.reduce((m, f) => (m[f.impact] = (m[f.impact] || 0) + 1, m), {});
  let md = '# Mesures automatiques\n\n' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' · ' + cfg.baseUrl + '\n\n';
  md += '**' + states.length + ' écrans vérifiés** sur ' + viewports.map(v => v.name + ' ' + v.width + 'px').join(', ') + '. ';
  md += 'Constats : ' + ['critical', 'serious', 'moderate', 'minor'].map(k => (counts[k] || 0) + ' ' + label[k].toLowerCase()).join(', ') + '.\n\n';
  if (perf.length) md += '## Chargement de l’accueil\n\n| Réseau | Chargement | DOM prêt | Plus grand élément affiché | Poids | Requêtes |\n|---|---|---|---|---|---|\n' + perf.map(p => '| ' + p.reseau + ' | ' + (p.loadMs / 1000).toFixed(1) + ' s | ' + (p.dclMs / 1000).toFixed(1) + ' s | ' + (p.lcpMs ? (p.lcpMs / 1000).toFixed(1) + ' s' : 'n/d') + ' | ' + p.kb + ' Ko | ' + p.requests + ' |').join('\n') + '\n\n';
  md += '## Constats\n\n';
  for (const f of list) {
    md += '### [' + label[f.impact] + '] ' + f.type + ' · ' + f.rule + '\n' + f.message + (f.count ? ' (' + f.count + ' élément(s))' : '') + '\n';
    if (f.targets?.length) md += '- Exemples : ' + f.targets.map(t => '`' + String(t).replace(/`/g, "'") + '`').join(', ') + '\n';
    md += '- Vu dans : ' + [...new Set(f.where)].slice(0, 6).join(' ; ') + (f.where.length > 6 ? ' … (+' + (f.where.length - 6) + ')' : '') + '\n';
    if (f.doc) md += '- Règle : ' + f.doc + '\n';
    md += '\n';
  }
  md += '## Écrans capturés\n\n' + states.map(s => '- ' + s.journey + ' › ' + s.state + ' (' + s.viewport + ') : `' + s.capture + '`').join('\n') + '\n';
  fs.writeFileSync(path.join(out, 'mesures.md'), md);
  fs.writeFileSync(path.join(out, 'mesures.json'), JSON.stringify({ config: cfg.baseUrl, states, perf, findings: list }, null, 2));
  console.log('Rapport : ' + path.join(out, 'mesures.md') + ' · ' + list.length + ' constats · ' + states.length + ' écrans');
})().catch(e => { console.error(e); process.exit(1); });
