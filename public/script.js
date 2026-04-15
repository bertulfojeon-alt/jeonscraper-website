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
//  AURORA — Rainbow Smoke Mouse Follower
// ══════════════════════════════════════════════════════════════════════════════
(function() {
  const aurora = document.getElementById('aurora');
  if (!aurora) return;

  const orbs = [
    document.getElementById('aurora-1'),
    document.getElementById('aurora-2'),
    document.getElementById('aurora-3'),
    document.getElementById('aurora-4')
  ];

  // Each orb trails at a different speed (lower = more lag = more smoke trail)
  const speeds = [0.06, 0.04, 0.025, 0.015];
  // Offset from cursor so orbs spread out like smoke
  const offsets = [
    { x: 0, y: 0 },
    { x: 60, y: -40 },
    { x: -50, y: 50 },
    { x: 40, y: 60 }
  ];

  // Current positions
  const pos = orbs.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));
  // Target position (mouse)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let mouseActive = false;
  let fadeTimer = null;

  // Rainbow hue rotation for each orb
  const hueBase = [270, 220, 330, 160]; // purple, blue, pink, green
  let hueShift = 0;

  // Activate aurora on first mouse move
  function onFirstMove() {
    aurora.classList.add('active');
  }

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (!mouseActive) {
      mouseActive = true;
      aurora.classList.add('tracking');
      onFirstMove();
    }

    // Reset idle timer — return to drift after 3s of no mouse
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      mouseActive = false;
      aurora.classList.remove('tracking');
    }, 3000);
  }, { passive: true });

  // Also track scroll offset for orb positions
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // Rainbow hue slowly cycles
  function tick() {
    hueShift += 0.3;

    for (let i = 0; i < orbs.length; i++) {
      if (!orbs[i]) continue;

      if (mouseActive) {
        // Lerp toward mouse + offset
        const tx = mx + offsets[i].x;
        const ty = my + offsets[i].y + scrollY;
        pos[i].x += (tx - pos[i].x) * speeds[i];
        pos[i].y += (ty - pos[i].y) * speeds[i];
      }

      // Update position — center the orb on its position
      const ox = pos[i].x - (orbs[i].offsetWidth / 2);
      const oy = pos[i].y - scrollY - (orbs[i].offsetHeight / 2);
      orbs[i].style.transform = `translate(${ox}px, ${oy}px)`;

      // Rainbow hue shift
      const hue = (hueBase[i] + hueShift) % 360;
      const alpha = [0.35, 0.3, 0.28, 0.25][i];
      orbs[i].style.background = `radial-gradient(circle, hsla(${hue},80%,60%,${alpha}) 0%, hsla(${hue},80%,60%,0) 70%)`;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // On touch devices, track touch instead
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mx = t.clientX;
    my = t.clientY;
    if (!mouseActive) {
      mouseActive = true;
      aurora.classList.add('tracking', 'active');
    }
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      mouseActive = false;
      aurora.classList.remove('tracking');
    }, 3000);
  }, { passive: true });
})();
