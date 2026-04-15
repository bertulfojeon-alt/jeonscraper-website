/* ══════════════════════════════════════════════════════════════════════════════
   JEONSCRAPER — Landing Page Interactions
   ══════════════════════════════════════════════════════════════════════════════ */

// ── NAVBAR SCROLL ──
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);
  lastScroll = y;
}, { passive: true });

// ── MOBILE MENU ──
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('active');
    });
  });
}

// ── SCROLL ANIMATIONS (Intersection Observer) ──
const animElements = document.querySelectorAll('.anim-fade, .anim-slide-up, .anim-slide-left, .anim-slide-right, .anim-scale');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

animElements.forEach(el => observer.observe(el));

// ── ANIMATED COUNTERS ──
// Animate any [data-count] element when it scrolls into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target._counted) {
      entry.target._counted = true;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();
  // Detect suffix based on context
  const isHeroStat = !!el.closest('.hero-stat');
  const isSvcCard = !!el.closest('.svc-card');
  const heroLabel = el.closest('.hero-stat')?.querySelector('.hero-stat-label')?.textContent || '';
  const suffix = heroLabel.includes('%') ? '%' : '+';

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    if (isSvcCard) {
      el.textContent = current + (progress >= 1 ? '+' : '');
    } else if (target >= 1000) {
      el.textContent = current.toLocaleString() + (progress >= 1 ? '+' : '');
    } else if (suffix === '%') {
      el.textContent = current + '%';
    } else {
      el.textContent = current.toLocaleString() + (progress >= 1 ? '+' : '');
    }

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── HERO PARTICLES ──
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 8 : 15;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 5}s;
      animation-duration: ${5 + Math.random() * 6}s;
    `;
    container.appendChild(particle);
  }
}
createParticles();

// ── FAQ ACCORDION ──
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

  // Toggle clicked
  if (!wasOpen) item.classList.add('open');
};

// ── FORM SUBMIT ──
window.handleSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('cta-email').value;
  const url = document.getElementById('cta-url').value;

  // In production, send to backend/API
  console.log('Trial signup:', { email, url });

  // Show success
  document.getElementById('cta-form').style.display = 'none';
  document.getElementById('cta-success').style.display = 'block';
};

// ── SMOOTH SCROLL for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ── PARALLAX on hero gradient ──
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-gradient');
  if (hero) {
    const y = window.scrollY;
    hero.style.transform = `translateX(-50%) translateY(${y * 0.3}px)`;
  }
}, { passive: true });

// ── HERO CAROUSEL ──
let heroSlide = 0;
const heroLabels = [
  'War Room — Briefing Dashboard',
  'War Room — Product Matrix',
  'War Room — Price Intelligence',
  'War Room — Opportunities',
  'Scrape Page — Enter Any Store URL'
];
const heroTotal = heroLabels.length;
let heroAutoTimer = null;

function heroGoTo(idx) {
  heroSlide = ((idx % heroTotal) + heroTotal) % heroTotal;
  const track = document.getElementById('hc-track');
  if (track) track.style.transform = `translateX(-${heroSlide * 100}%)`;
  document.querySelectorAll('.hc-dot').forEach((d, i) => d.classList.toggle('active', i === heroSlide));
  const label = document.getElementById('hc-label');
  if (label) label.textContent = heroLabels[heroSlide];
  resetHeroAuto();
}

window.heroGoTo = heroGoTo;
window.heroCarousel = function(dir) { heroGoTo(heroSlide + dir); };

function resetHeroAuto() {
  if (heroAutoTimer) clearInterval(heroAutoTimer);
  heroAutoTimer = setInterval(() => heroGoTo(heroSlide + 1), 5000);
}
resetHeroAuto();

// Touch swipe for carousel
const hcWindow = document.querySelector('.hc-window');
if (hcWindow) {
  let touchStartX = 0;
  hcWindow.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  hcWindow.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) heroGoTo(heroSlide + (diff > 0 ? 1 : -1));
  }, { passive: true });
}

// ── SHOWCASE TABS (animated dashboards) ──
const showcaseDescs = [
  { title: 'Briefing Dashboard', desc: 'Your mission command center. See total products, average prices, stock rates, product overlap percentage, and opportunity count across all stores at a glance. Instantly spot order opportunities and price risks.' },
  { title: 'Product Matrix', desc: 'Every product mapped across every store. See who sells what, at what price, and with what action tags — ORDER OPPORTUNITY, PRICE ADVANTAGE, PRICE RISK, MY EXCLUSIVE, COMPETITOR EXCLUSIVE.' },
  { title: 'Price Intelligence', desc: 'Side-by-side pricing for all shared products. See the price gap percentage between you and competitors, margin calculations against suppliers, and identify where you are overpriced or underpriced.' },
  { title: 'Category Intelligence', desc: 'Category distribution breakdown per store. Instantly see which product categories competitors invest in that you are missing, and which categories you dominate.' },
  { title: 'Brand Intelligence', desc: 'Brand overlap matrix showing which vendors/brands each store carries. Find exclusive brands, trending vendors, and identify sourcing gaps in your catalog.' },
  { title: 'Actionable Opportunities', desc: 'Priority-ranked intelligence cards: ORDER opportunities (competitors sell it, suppliers have it, you don\'t), PRICE RISKS (competitors undercut you), ADVANTAGES (you are cheaper), and UNTAPPED products.' }
];

window.switchShowcase = function(idx) {
  // Update tab buttons
  document.querySelectorAll('.sc-tab').forEach((t, i) => t.classList.toggle('active', i === idx));

  // Switch animated panels
  document.querySelectorAll('.sc-anim').forEach((panel, i) => {
    if (i === idx) {
      panel.classList.add('active');
      // Re-trigger row animations by removing & re-adding class
      restartAnimations(panel);
      // Animate counters inside this panel
      animateSaCounters(panel);
    } else {
      panel.classList.remove('active');
    }
  });

  // Update info bar
  const data = showcaseDescs[idx];
  if (data) {
    const titleEl = document.getElementById('sc-info-title');
    const descEl = document.getElementById('sc-info-desc');
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
  }
};

// Re-trigger CSS animations by cloning nodes in-place
function restartAnimations(panel) {
  panel.querySelectorAll('.sa-row-anim').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // force reflow
    el.style.animation = '';
  });
  panel.querySelectorAll('.sa-gap-fill, .sa-hbar-fill').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });
}

// Animate .sa-count elements (counter up)
function animateSaCounters(panel) {
  panel.querySelectorAll('.sa-count').forEach(el => {
    const target = parseInt(el.dataset.v);
    if (isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();
    const prefix = el.closest('.sa-stat')?.querySelector('.sa-stat-prefix') ? '$' : '';
    const lbl = el.closest('.sa-stat')?.querySelector('.sa-stat-lbl')?.textContent || '';
    const suffix = lbl.includes('%') ? '%' : '';

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ── FEATURE CARD VISIBILITY (trigger mini-animations) ──
const featureCards = document.querySelectorAll('.feature-card');
const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate fm-wr-val counters
      entry.target.querySelectorAll('.fm-wr-val[data-v]').forEach(el => {
        const target = parseInt(el.dataset.v);
        if (isNaN(target)) return;
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      featureObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
featureCards.forEach(el => featureObserver.observe(el));

// Trigger showcase counters on first view
const showcaseSection = document.querySelector('.section-showcase');
if (showcaseSection) {
  const scObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activePanel = document.querySelector('.sc-anim.active');
        if (activePanel) {
          restartAnimations(activePanel);
          animateSaCounters(activePanel);
        }
        scObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  scObserver.observe(showcaseSection);
}

// ── PRICING CARD HOVER GLOW ──
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(124,58,237,0.06), var(--surface) 70%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  AURORA — Liquid Vape Smoke
//  Soft, billowy smoke blobs emitted ONLY on mouse movement.
//  When mouse stops, smoke lingers and slowly fades. No idle animation.
// ══════════════════════════════════════════════════════════════════════════════
(function() {
  const container = document.getElementById('aurora');
  if (!container) return;

  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:100%;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Noise (for organic drift) ──
  const P = new Uint8Array(512);
  const G = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  for (let i = 0; i < 256; i++) P[i] = i;
  for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [P[i], P[j]] = [P[j], P[i]]; }
  for (let i = 0; i < 256; i++) P[i + 256] = P[i];

  function noise(x, y) {
    const X = x | 0, Y = y | 0;
    const xf = x - X, yf = y - Y;
    const Xi = X & 255, Yi = Y & 255;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const dot = (h, dx, dy) => { const g = G[h & 7]; return g[0] * dx + g[1] * dy; };
    const aa = P[P[Xi] + Yi], ab = P[P[Xi] + Yi + 1];
    const ba = P[P[Xi + 1] + Yi], bb = P[P[Xi + 1] + Yi + 1];
    return (dot(aa, xf, yf) + u * (dot(ba, xf - 1, yf) - dot(aa, xf, yf))) +
      v * ((dot(ab, xf, yf - 1) + u * (dot(bb, xf - 1, yf - 1) - dot(ab, xf, yf - 1))) -
           (dot(aa, xf, yf) + u * (dot(ba, xf - 1, yf) - dot(aa, xf, yf))));
  }

  // ── Mouse tracking ──
  let mx = -9999, my = -9999, pmx = -9999, pmy = -9999;
  let mouseSpeed = 0;
  let isMoving = false;
  let time = 0;
  let hueOffset = 0;

  function onMove(x, y) {
    pmx = mx; pmy = my;
    mx = x; my = y;
    if (pmx === -9999) { pmx = mx; pmy = my; }
    mouseSpeed = Math.hypot(mx - pmx, my - pmy);
    isMoving = mouseSpeed > 1.5;
  }
  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }, { passive: true });

  // ── Smoke Puffs ──
  // Each puff is a large, soft, blurred circle that expands and fades
  const puffs = [];
  const MAX_PUFFS = 60;

  class Puff {
    constructor(x, y, vx, vy, hue) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = 20 + Math.random() * 30;
      this.maxRadius = 100 + Math.random() * 120;
      this.life = 1.0;
      this.decay = 0.004 + Math.random() * 0.003; // slow fade
      this.hue = hue;
      this.sat = 70 + Math.random() * 30;
      this.light = 40 + Math.random() * 25;
      this.noiseSeed = Math.random() * 100;
    }

    update() {
      // Gentle noise-driven drift (organic, not straight)
      const nx = noise(this.x * 0.002 + this.noiseSeed, time * 0.15);
      const ny = noise(this.y * 0.002 + this.noiseSeed + 50, time * 0.15);
      this.vx += nx * 0.15;
      this.vy += ny * 0.15;

      // Slow upward drift (smoke rises)
      this.vy -= 0.08;

      // Damping
      this.vx *= 0.985;
      this.vy *= 0.985;

      this.x += this.vx;
      this.y += this.vy;

      // Expand
      const growRate = (this.maxRadius - this.radius) * 0.015;
      this.radius += growRate;

      // Fade
      this.life -= this.decay;
    }

    draw() {
      if (this.life <= 0) return;

      // Soft alpha — cubic falloff for smooth fade
      const alpha = this.life * this.life * this.life * 0.35;
      if (alpha < 0.005) return;

      const r = this.radius;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = alpha;

      // Main soft blob
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
      grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.light}%, 0.8)`);
      grad.addColorStop(0.25, `hsla(${this.hue + 15}, ${this.sat}%, ${this.light}%, 0.5)`);
      grad.addColorStop(0.5, `hsla(${this.hue + 30}, ${this.sat - 10}%, ${this.light}%, 0.2)`);
      grad.addColorStop(0.75, `hsla(${this.hue + 40}, ${this.sat - 20}%, ${this.light - 5}%, 0.05)`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core (smaller, brighter)
      const coreR = r * 0.3;
      const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, coreR);
      core.addColorStop(0, `hsla(${this.hue}, 100%, ${this.light + 20}%, 0.6)`);
      core.addColorStop(0.5, `hsla(${this.hue + 10}, ${this.sat}%, ${this.light + 10}%, 0.2)`);
      core.addColorStop(1, 'transparent');

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(this.x, this.y, coreR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Emit smoke puffs at mouse position during movement
  function emit() {
    if (!isMoving) return;

    // Direction of mouse movement
    const dx = mx - pmx;
    const dy = my - pmy;

    // Emit 2-4 puffs per frame while moving
    const count = Math.min(Math.floor(mouseSpeed * 0.15) + 1, 4);

    for (let i = 0; i < count; i++) {
      // Spawn along the path between prev and current mouse
      const t = Math.random();
      const spawnX = pmx + dx * t + (Math.random() - 0.5) * 20;
      const spawnY = pmy + dy * t + (Math.random() - 0.5) * 20;

      // Initial velocity — slight spread perpendicular to movement + some forward momentum
      const spread = (Math.random() - 0.5) * 2;
      const vx = dx * 0.05 + spread * (-dy / (mouseSpeed + 1)) * 2;
      const vy = dy * 0.05 + spread * (dx / (mouseSpeed + 1)) * 2;

      const hue = hueOffset + Math.random() * 80;

      if (puffs.length < MAX_PUFFS) {
        puffs.push(new Puff(spawnX, spawnY, vx, vy, hue));
      } else {
        // Recycle dead puff
        const idx = puffs.findIndex(p => p.life <= 0);
        if (idx >= 0) {
          puffs[idx] = new Puff(spawnX, spawnY, vx, vy, hue);
        }
      }
    }
  }

  // ── Render ──
  function render() {
    time += 0.01;
    hueOffset += 0.5;

    // Clear canvas fully each frame (no trail persistence — puffs handle their own fade)
    ctx.clearRect(0, 0, W, H);

    // Emit new puffs if mouse is moving
    emit();

    // Reset moving flag (will be set true again on next mousemove)
    isMoving = false;

    // Update and draw all puffs
    for (let i = 0; i < puffs.length; i++) {
      puffs[i].update();
      puffs[i].draw();
    }

    // Periodic cleanup
    if (puffs.length > 20 && time % 2 < 0.02) {
      for (let i = puffs.length - 1; i >= 0; i--) {
        if (puffs[i].life <= 0) puffs.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
})();
