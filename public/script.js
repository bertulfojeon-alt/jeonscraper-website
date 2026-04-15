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
const counterElements = document.querySelectorAll('[data-count]');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

function animateCounters() {
  counterElements.forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();
    const suffix = el.closest('.hero-stat')?.querySelector('.hero-stat-label')?.textContent.includes('%') ? '%' : '+';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (target >= 1000) {
        el.textContent = current.toLocaleString() + (progress >= 1 ? '+' : '');
      } else if (suffix === '%') {
        el.textContent = current + '%';
      } else {
        el.textContent = current.toLocaleString() + (progress >= 1 ? '+' : '');
      }

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
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

// ── SHOWCASE TABS ──
const showcaseData = [
  { img: 'img/warroom-briefing.png', title: 'Briefing Dashboard', desc: 'Your mission command center. See total products, average prices, stock rates, product overlap percentage, and opportunity count across all stores at a glance. Instantly spot order opportunities and price risks.' },
  { img: 'img/warroom-matrix.png', title: 'Product Matrix', desc: 'Every product mapped across every store. See who sells what, at what price, and with what action tags — ORDER OPPORTUNITY, PRICE ADVANTAGE, PRICE RISK, MY EXCLUSIVE, COMPETITOR EXCLUSIVE.' },
  { img: 'img/warroom-price.png', title: 'Price Intelligence', desc: 'Side-by-side pricing for all shared products. See the price gap percentage between you and competitors, margin calculations against suppliers, and identify where you are overpriced or underpriced.' },
  { img: 'img/warroom-category.png', title: 'Category Intelligence', desc: 'Category distribution breakdown per store. Instantly see which product categories competitors invest in that you are missing, and which categories you dominate.' },
  { img: 'img/warroom-brand.png', title: 'Brand Intelligence', desc: 'Brand overlap matrix showing which vendors/brands each store carries. Find exclusive brands, trending vendors, and identify sourcing gaps in your catalog.' },
  { img: 'img/warroom-opportunities.png', title: 'Actionable Opportunities', desc: 'Priority-ranked intelligence cards: ORDER opportunities (competitors sell it, suppliers have it, you don\'t), PRICE RISKS (competitors undercut you), ADVANTAGES (you are cheaper), and UNTAPPED products.' }
];

window.switchShowcase = function(idx) {
  const data = showcaseData[idx];
  document.querySelectorAll('.sc-tab').forEach((t, i) => t.classList.toggle('active', i === idx));

  const img = document.getElementById('sc-img');
  img.classList.add('switching');
  setTimeout(() => {
    img.src = data.img;
    img.alt = data.title;
    document.getElementById('sc-info-title').textContent = data.title;
    document.getElementById('sc-info-desc').textContent = data.desc;
    img.classList.remove('switching');
  }, 300);
};

// ── PRICING CARD HOVER GLOW ──
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(124,58,237,0.06), var(--surface) 70%)`;
  });
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('popular')) {
      card.style.background = '';
    } else {
      card.style.background = '';
    }
  });
});
