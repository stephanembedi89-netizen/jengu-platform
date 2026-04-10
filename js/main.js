/* =============================================
   JENGU.AI — MAIN JAVASCRIPT
   ============================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- CANVAS PULSE RINGS ----
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Gold color stops for rings
const RING_COLORS = ['#C9A84C', '#EAC96A', '#A07828'];
const rings = [];
let lastRingTime = 0;
const RING_INTERVAL = 1800; // ms between new rings

class PulseRing {
  constructor(delay = 0) {
    this.cx    = canvas.width / 2;
    this.cy    = canvas.height / 2;
    this.r     = 0;
    this.maxR  = Math.hypot(canvas.width, canvas.height) * 0.55;
    this.speed = 1.2;
    this.color = RING_COLORS[Math.floor(Math.random() * RING_COLORS.length)];
    this.age   = -delay;
  }
  update() {
    if (this.age < 0) { this.age += 1; return; }
    this.r += this.speed;
    this.cx = canvas.width  / 2;
    this.cy = canvas.height / 2;
  }
  draw() {
    if (this.age < 0 || this.r <= 0) return;
    const progress = this.r / this.maxR;
    const alpha    = (1 - progress) * 0.28;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth   = 1.2;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.restore();
  }
  isDone() { return this.r > this.maxR; }
}

// Seed initial rings at staggered positions
for (let i = 0; i < 4; i++) {
  const r = new PulseRing();
  r.r = (i / 4) * r.maxR;
  rings.push(r);
}

function animatePulse(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!prefersReducedMotion.matches) {
    if (timestamp - lastRingTime > RING_INTERVAL) {
      rings.push(new PulseRing());
      lastRingTime = timestamp;
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].update();
      rings[i].draw();
      if (rings[i].isDone()) rings.splice(i, 1);
    }
  }
  requestAnimationFrame(animatePulse);
}
requestAnimationFrame(animatePulse);

// ---- CURSOR GLOW ----
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step     = Math.ceil(target / (duration / 16));
  let current    = 0;

  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current < target) requestAnimationFrame(tick);
  };
  tick();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

// ---- ACTIVE NAV LINK ----
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeLinkObserver.observe(s));

// ---- CONTACT FORM ----
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
  const input = document.getElementById(id.replace('Error', ''));
  if (input) input.classList.toggle('error', !!msg);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  showError('nameError', '');
  showError('emailError', '');
  showError('messageError', '');

  if (!name) { showError('nameError', 'Veuillez entrer votre nom.'); valid = false; }
  if (!email) { showError('emailError', 'Veuillez entrer votre email.'); valid = false; }
  else if (!validateEmail(email)) { showError('emailError', 'Email invalide.'); valid = false; }
  if (!message) { showError('messageError', 'Veuillez entrer un message.'); valid = false; }

  if (valid) {
    const btn = form.querySelector('button[type="submit"] span');
    btn.textContent = 'Envoi en cours...';
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Envoyer le message';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  }
});

// ---- SMOOTH SCROLL for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- NAV ACTIVE STYLE ----
const styleTag = document.createElement('style');
styleTag.textContent = `.nav-link.active { color: var(--cyan) !important; }`;
document.head.appendChild(styleTag);

// ---- BILLING TOGGLE (mensuel / annuel) ----
const billingToggle   = document.getElementById('billingToggle');
const labelMonthly    = document.getElementById('label-monthly');
const labelAnnual     = document.getElementById('label-annual');
const priceAmounts    = document.querySelectorAll('.price-amount[data-monthly]');
const annualNoteEls   = document.querySelectorAll('.price-annual-note');
const annualTotals    = ['960\u202f000', '1\u202f920\u202f000']; // totaux annuels par carte

function updatePricing(isAnnual) {
  billingToggle.setAttribute('aria-checked', String(isAnnual));
  labelMonthly.classList.toggle('active', !isAnnual);
  labelAnnual.classList.toggle('active', isAnnual);

  priceAmounts.forEach(el => {
    el.innerHTML = isAnnual ? el.dataset.annual : el.dataset.monthly;
  });

  annualNoteEls.forEach((el, i) => {
    el.textContent = isAnnual && annualTotals[i]
      ? `Facturé ${annualTotals[i]} FCFA/an`
      : '';
  });
}

if (billingToggle) {
  billingToggle.addEventListener('click', () => {
    const isAnnual = billingToggle.getAttribute('aria-checked') !== 'true';
    updatePricing(isAnnual);
  });
  updatePricing(false);
}
