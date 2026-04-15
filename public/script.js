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
//  AURORA — Canvas Fluid Smoke with Curl Noise
//  Creates vivid, wispy rainbow smoke tendrils that react to the mouse
// ══════════════════════════════════════════════════════════════════════════════
(function() {
  const container = document.getElementById('aurora');
  if (!container) return;

  // Replace div children with a canvas
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

  // ── Simplex-like noise (fast 2D) ──
  // Permutation table
  const perm = new Uint8Array(512);
  const grad = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  function noise2D(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
    const g = (h, dx, dy) => { const g2 = grad[h & 7]; return g2[0] * dx + g2[1] * dy; };
    const x1 = g(aa, xf, yf) + u * (g(ba, xf - 1, yf) - g(aa, xf, yf));
    const x2 = g(ab, xf, yf - 1) + u * (g(bb, xf - 1, yf - 1) - g(ab, xf, yf - 1));
    return x1 + v * (x2 - x1);
  }

  // Curl noise for fluid-like motion
  function curl(x, y, t) {
    const eps = 0.01;
    const n1 = noise2D(x, y + eps + t);
    const n2 = noise2D(x, y - eps + t);
    const n3 = noise2D(x + eps, y + t);
    const n4 = noise2D(x - eps, y + t);
    return { x: (n1 - n2) / (2 * eps), y: -(n3 - n4) / (2 * eps) };
  }

  // ── Smoke Particles ──
  const MAX_PARTICLES = 300;
  const particles = [];
  let mx = W / 2, my = H / 2, pmx = mx, pmy = my;
  let mouseSpeed = 0;
  let mouseActive = false;
  let time = 0;
  let hueOffset = 0;

  class SmokeParticle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.life = 1.0;
      this.decay = 0.003 + Math.random() * 0.004;
      this.size = 30 + Math.random() * 80;
      this.hue = hue;
      this.sat = 70 + Math.random() * 30;
      this.light = 50 + Math.random() * 20;
      this.noiseScale = 0.003 + Math.random() * 0.002;
      this.noiseSpeed = 0.3 + Math.random() * 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.02;
    }

    update() {
      // Curl noise for organic swirl motion
      const c = curl(
        this.x * this.noiseScale,
        this.y * this.noiseScale,
        time * this.noiseSpeed
      );
      this.vx += c.x * 0.8;
      this.vy += c.y * 0.8;

      // Gentle upward drift (smoke rises)
      this.vy -= 0.03;

      // Damping
      this.vx *= 0.96;
      this.vy *= 0.96;

      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.spin;
      this.life -= this.decay;
      this.size += 0.3; // slowly expand
    }

    draw() {
      if (this.life <= 0) return;
      const alpha = this.life * this.life * 0.4; // quadratic falloff for smoke
      const s = this.size;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = 'screen';

      // Multi-layer gradient for wispy look
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
      g.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.light}%, 0.6)`);
      g.addColorStop(0.3, `hsla(${this.hue + 20}, ${this.sat}%, ${this.light - 10}%, 0.3)`);
      g.addColorStop(0.6, `hsla(${this.hue + 40}, ${this.sat - 20}%, ${this.light - 20}%, 0.1)`);
      g.addColorStop(1, 'transparent');

      ctx.fillStyle = g;

      // Draw stretched ellipse for wispy tendrils
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Emit particles near mouse
  function emitParticles() {
    const count = Math.min(Math.floor(mouseSpeed * 0.5 + 1), 6);
    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) {
        // Recycle oldest dead particle
        const idx = particles.findIndex(p => p.life <= 0);
        if (idx >= 0) {
          particles[idx] = new SmokeParticle(
            mx + (Math.random() - 0.5) * 40,
            my + (Math.random() - 0.5) * 40,
            hueOffset + Math.random() * 60
          );
        }
      } else {
        particles.push(new SmokeParticle(
          mx + (Math.random() - 0.5) * 40,
          my + (Math.random() - 0.5) * 40,
          hueOffset + Math.random() * 60
        ));
      }
    }
  }

  // Also emit ambient particles when idle
  function emitAmbient() {
    if (particles.length >= MAX_PARTICLES) return;
    particles.push(new SmokeParticle(
      Math.random() * W,
      Math.random() * H,
      hueOffset + Math.random() * 120
    ));
  }

  // ── Mouse tracking ──
  let fadeTimer = null;
  window.addEventListener('mousemove', (e) => {
    pmx = mx; pmy = my;
    mx = e.clientX; my = e.clientY;
    mouseSpeed = Math.hypot(mx - pmx, my - pmy);
    mouseActive = true;
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => { mouseActive = false; }, 2000);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    pmx = mx; pmy = my;
    mx = t.clientX; my = t.clientY;
    mouseSpeed = Math.hypot(mx - pmx, my - pmy);
    mouseActive = true;
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => { mouseActive = false; }, 2000);
  }, { passive: true });

  // ── Render Loop ──
  let frameCount = 0;
  function render() {
    time += 0.01;
    hueOffset += 0.4; // slowly cycle rainbow
    frameCount++;

    // Fade the canvas (creates trail effect)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(7, 9, 13, 0.06)';
    ctx.fillRect(0, 0, W, H);

    // Emit
    if (mouseActive && mouseSpeed > 1) {
      emitParticles();
    }
    // Ambient emission every ~20 frames
    if (frameCount % 20 === 0) emitAmbient();

    // Update and draw
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Clean up dead particles periodically
    if (frameCount % 120 === 0) {
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  // Initial ambient particles
  for (let i = 0; i < 15; i++) emitAmbient();
  render();
})();
