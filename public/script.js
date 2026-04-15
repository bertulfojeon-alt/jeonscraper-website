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
//  AURORA — Flowing Rainbow Smoke Tendrils
//  Multiple ribbon trails with curl noise, drawn as thick flowing curves
//  with vivid saturated colors and glow — like the AutomatezAI reference
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

  // ── Noise ──
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

  function curl(x, y, t) {
    const e = 0.01;
    return {
      x: (noise(x, y + e + t) - noise(x, y - e + t)) / (2 * e),
      y: -(noise(x + e, y + t) - noise(x - e, y + t)) / (2 * e)
    };
  }

  // ── Mouse ──
  let mx = W / 2, my = H / 2, pmx = mx, pmy = my;
  let mouseSpeed = 0, mouseActive = false, fadeTimer = null;
  let time = 0;

  function onMove(x, y) {
    pmx = mx; pmy = my;
    mx = x; my = y;
    mouseSpeed = Math.hypot(mx - pmx, my - pmy);
    mouseActive = true;
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => { mouseActive = false; }, 3000);
  }
  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }, { passive: true });

  // ── Ribbon Tendril ──
  // Each tendril is a chain of points that trails the mouse with noise displacement
  const NUM_TENDRILS = 8;
  const TRAIL_LEN = 80;

  class Tendril {
    constructor(index) {
      this.index = index;
      this.points = [];
      for (let i = 0; i < TRAIL_LEN; i++) {
        this.points.push({ x: W / 2, y: H / 2 });
      }
      // Each tendril has its own speed, offset, color, noise params
      this.lag = 0.15 + index * 0.04; // how quickly head follows mouse
      this.offsetAngle = (index / NUM_TENDRILS) * Math.PI * 2;
      this.offsetRadius = 20 + index * 12;
      this.noiseScale = 0.0015 + index * 0.0003;
      this.noiseAmp = 60 + index * 15;
      this.noiseSpeed = 0.2 + index * 0.05;
      this.hue = (index / NUM_TENDRILS) * 360;
      this.maxWidth = 18 + Math.random() * 20;
      this.sat = 85 + Math.random() * 15;
      this.light = 55 + Math.random() * 15;
    }

    update() {
      // Head follows mouse with offset
      const angle = this.offsetAngle + time * 0.3;
      const tx = mx + Math.cos(angle) * this.offsetRadius;
      const ty = my + Math.sin(angle) * this.offsetRadius;

      const head = this.points[0];
      head.x += (tx - head.x) * this.lag;
      head.y += (ty - head.y) * this.lag;

      // Each subsequent point follows the one before it + curl noise
      for (let i = 1; i < TRAIL_LEN; i++) {
        const prev = this.points[i - 1];
        const pt = this.points[i];
        const followSpeed = 0.35 - (i / TRAIL_LEN) * 0.15;

        // Curl noise displacement
        const c = curl(
          pt.x * this.noiseScale,
          pt.y * this.noiseScale,
          time * this.noiseSpeed + this.index
        );

        pt.x += (prev.x - pt.x) * followSpeed + c.x * this.noiseAmp * 0.04;
        pt.y += (prev.y - pt.y) * followSpeed + c.y * this.noiseAmp * 0.04;

        // Slight upward drift
        pt.y -= 0.15;
      }
    }

    draw() {
      if (this.points.length < 4) return;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // Draw the tendril as a series of line segments with varying width and alpha
      for (let i = 1; i < this.points.length - 1; i++) {
        const t = i / this.points.length;
        const alpha = (1 - t) * (1 - t) * 0.7; // quadratic fade along tail
        if (alpha < 0.01) continue;

        const width = this.maxWidth * (1 - t * t) * (mouseActive ? 1 : 0.5);
        if (width < 0.5) continue;

        const prev = this.points[i - 1];
        const curr = this.points[i];
        const next = this.points[i + 1];

        // Hue shifts along the length for rainbow effect
        const hue = (this.hue + t * 80 + time * 20) % 360;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        // Smooth quadratic curve through points
        const cpx = curr.x;
        const cpy = curr.y;
        ctx.quadraticCurveTo(cpx, cpy, (curr.x + next.x) / 2, (curr.y + next.y) / 2);

        ctx.strokeStyle = `hsla(${hue}, ${this.sat}%, ${this.light}%, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Glow pass — draw again thicker and more transparent for the soft glow
      for (let i = 1; i < this.points.length - 1; i++) {
        const t = i / this.points.length;
        const alpha = (1 - t) * (1 - t) * 0.15;
        if (alpha < 0.005) continue;

        const width = this.maxWidth * 3 * (1 - t * t) * (mouseActive ? 1 : 0.4);
        if (width < 1) continue;

        const prev = this.points[i - 1];
        const curr = this.points[i];
        const next = this.points[i + 1];
        const hue = (this.hue + t * 80 + time * 20) % 360;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
        ctx.strokeStyle = `hsla(${hue}, ${this.sat}%, ${this.light + 10}%, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  const tendrils = [];
  for (let i = 0; i < NUM_TENDRILS; i++) tendrils.push(new Tendril(i));

  // ── Render ──
  function render() {
    time += 0.008;

    // Semi-transparent fade for trails
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(7, 9, 13, 0.08)';
    ctx.fillRect(0, 0, W, H);

    // Update and draw all tendrils
    for (const t of tendrils) {
      t.update();
      t.draw();
    }

    requestAnimationFrame(render);
  }

  render();
})();
