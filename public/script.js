/* ══════════════════════════════════════════════════════════════════════════════
   JEONSCRAPER — Landing Page Interactions (Redesign)
   ══════════════════════════════════════════════════════════════════════════════ */

// ── NAVBAR SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
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

// ── NAV ACTIVE HIGHLIGHTING ──
const navLinkMap = {
  'features': document.getElementById('nav-link-features'),
  'showcase': document.getElementById('nav-link-showcase'),
  'pricing': document.getElementById('nav-link-pricing'),
  'faq': document.getElementById('nav-link-faq'),
};

const sectionIds = ['features', 'showcase', 'pricing', 'faq'];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = navLinkMap[id];
    if (link) {
      if (entry.isIntersecting) {
        Object.values(navLinkMap).forEach(l => { if (l) l.classList.remove('active'); });
        link.classList.add('active');
      }
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ── ROTATING WORD ──
const rwItems = document.querySelectorAll('.rw-item');
let rwCurrent = 0;

if (rwItems.length > 1) {
  setInterval(() => {
    const prev = rwCurrent;
    rwCurrent = (rwCurrent + 1) % rwItems.length;
    rwItems[prev].classList.remove('active');
    rwItems[prev].classList.add('exit-up');
    rwItems[rwCurrent].classList.add('active');
    setTimeout(() => {
      rwItems[prev].classList.remove('exit-up');
    }, 500);
  }, 2000);
}

// ── SCROLL ANIMATIONS (Intersection Observer) ──
const animElements = document.querySelectorAll('.anim-fade, .anim-slide-up, .anim-slide-left, .anim-slide-right, .anim-scale, .anim-pop');

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

// ── FAQ ACCORDION ──
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
};

// ── FORM SUBMIT ──
window.handleSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('cta-email').value;
  const url = document.getElementById('cta-url').value;
  console.log('Trial signup:', { email, url });
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

// ── SHOWCASE TABS ──
const showcaseDescs = [
  { title: 'Briefing Dashboard', desc: 'Your mission command center. See total products, average prices, stock rates, product overlap percentage, and opportunity count across all stores at a glance.' },
  { title: 'Product Matrix', desc: 'Every product mapped across every store. See who sells what, at what price, and with what action tags — ORDER OPPORTUNITY, PRICE ADVANTAGE, PRICE RISK, MY EXCLUSIVE, COMPETITOR EXCLUSIVE.' },
  { title: 'Price Intelligence', desc: 'Side-by-side pricing for all shared products. See the price gap percentage between you and competitors, margin calculations against suppliers.' },
  { title: 'Category Intelligence', desc: 'Category distribution breakdown per store. Instantly see which product categories competitors invest in that you are missing.' },
  { title: 'Brand Intelligence', desc: 'Brand overlap matrix showing which vendors/brands each store carries. Find exclusive brands, trending vendors, and sourcing gaps.' },
  { title: 'Actionable Opportunities', desc: 'Priority-ranked intelligence cards: ORDER opportunities, PRICE RISKS, ADVANTAGES, and UNTAPPED products.' }
];

window.switchShowcase = function(idx) {
  document.querySelectorAll('.sc-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
  document.querySelectorAll('.sc-anim').forEach((panel, i) => {
    if (i === idx) {
      panel.classList.add('active');
      restartAnimations(panel);
      animateSaCounters(panel);
    } else {
      panel.classList.remove('active');
    }
  });
  const data = showcaseDescs[idx];
  if (data) {
    const titleEl = document.getElementById('sc-info-title');
    const descEl = document.getElementById('sc-info-desc');
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
  }
};

function restartAnimations(panel) {
  panel.querySelectorAll('.sa-row-anim').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });
  panel.querySelectorAll('.sa-gap-fill, .sa-hbar-fill').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });
}

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

// Trigger showcase counters on first view
const showcaseSection = document.getElementById('showcase');
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
