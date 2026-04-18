/* ══════════════════════════════════════════════════════════════════════════════
   JEONSCRAPER — Landing Page Interactions (Redesign v2)
   ══════════════════════════════════════════════════════════════════════════════ */

// ── FORCE SCROLL TO TOP ON PAGE LOAD / REFRESH ──
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo({ top: 0, behavior: 'instant' });

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
  'problems': document.getElementById('nav-link-problems'),
  'features': document.getElementById('nav-link-features'),
  'showcase': document.getElementById('nav-link-showcase'),
  'compare': document.getElementById('nav-link-compare'),
  'how-it-works': document.getElementById('nav-link-how-it-works'),
  'pricing': document.getElementById('nav-link-pricing'),
  'faq': document.getElementById('nav-link-faq'),
};
const sectionIds = ['problems', 'features', 'showcase', 'compare', 'how-it-works', 'pricing', 'faq'];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = navLinkMap[entry.target.id];
    if (link) {
      if (entry.isIntersecting) {
        Object.values(navLinkMap).forEach(l => { if (l) l.classList.remove('active'); });
        link.classList.add('active');
      }
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });
sectionIds.forEach(id => { const el = document.getElementById(id); if (el) navObserver.observe(el); });

// ── ROTATING WORD (cycles every 2s) ──
const rwItems = document.querySelectorAll('.rw-item');
let rwCurrent = 0;
if (rwItems.length > 1) {
  setInterval(() => {
    const prev = rwCurrent;
    rwCurrent = (rwCurrent + 1) % rwItems.length;
    rwItems[prev].classList.remove('active');
    rwItems[prev].classList.add('exit-up');
    rwItems[rwCurrent].classList.add('active');
    setTimeout(() => { rwItems[prev].classList.remove('exit-up'); }, 500);
  }, 2000);
}

// ══════════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS — REPLAY every time a section scrolls into view
// ══════════════════════════════════════════════════════════════════════════════

const animSelectors = '.anim-fade, .anim-slide-up, .anim-slide-left, .anim-slide-right, .anim-scale, .anim-pop';

// Observe each snap-section. When it enters view → add visible to its children.
// When it leaves → remove visible so animations replay next time.
const allSections = document.querySelectorAll('.snap-section');

const sectionAnimObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const section = entry.target;
    const animEls = section.querySelectorAll(animSelectors);

    if (entry.isIntersecting) {
      animEls.forEach(el => {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => { el.classList.add('visible'); }, delay);
      });
      // Re-trigger counters in this section
      section.querySelectorAll('[data-count]').forEach(el => {
        el._counted = false;
        animateCounter(el);
      });
    } else {
      // Remove visible so animation replays on re-entry
      animEls.forEach(el => { el.classList.remove('visible'); });
    }
  });
}, { threshold: 0.15 });

allSections.forEach(s => sectionAnimObserver.observe(s));

// ── ANIMATED COUNTERS ──
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  if (isNaN(target)) return;
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

// ── FEAT-CARD POP-UP REPLAY ON HOVER ──
document.querySelectorAll('.feat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.remove('pop-replay');
    void card.offsetHeight;
    card.classList.add('pop-replay');
  });
  card.addEventListener('animationend', () => {
    card.classList.remove('pop-replay');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// COMPARE SECTION — SEQUENTIAL ANIMATION (replays on re-entry)
// ══════════════════════════════════════════════════════════════════════════════
const compareSection = document.getElementById('compare');
if (compareSection) {
  const cmpVa = compareSection.querySelector('.cmp-va');
  const cmpJeon = compareSection.querySelector('.cmp-jeon');
  const cmpVs = compareSection.querySelector('.cmp-vs');

  const cmpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reset first
        [cmpVa, cmpJeon, cmpVs].forEach(el => { if (el) el.classList.remove('visible'); });
        // Sequential reveal
        setTimeout(() => { if (cmpVa) cmpVa.classList.add('visible'); }, 200);
        setTimeout(() => { if (cmpJeon) cmpJeon.classList.add('visible'); }, 1200);
        setTimeout(() => { if (cmpVs) cmpVs.classList.add('visible'); }, 2200);
      } else {
        // Reset on leave so it replays
        [cmpVa, cmpJeon, cmpVs].forEach(el => { if (el) el.classList.remove('visible'); });
      }
    });
  }, { threshold: 0.25 });
  cmpObserver.observe(compareSection);
}

// ══════════════════════════════════════════════════════════════════════════════
// SHOWCASE — SCROLL-LOCKED TAB SWITCHING
// Page freezes while in showcase. Scroll only changes tabs.
// Exits to next/prev section only at last/first tab.
// ══════════════════════════════════════════════════════════════════════════════

const showcaseDescs = [
  { title: 'Briefing Dashboard', desc: 'Your mission command center. See total products, average prices, stock rates, product overlap percentage, and opportunity count across all stores at a glance.' },
  { title: 'Product Matrix', desc: 'Every product mapped across every store. See who sells what, at what price, and with what action tags — ORDER OPPORTUNITY, PRICE ADVANTAGE, PRICE RISK, MY EXCLUSIVE, COMPETITOR EXCLUSIVE.' },
  { title: 'Price Intelligence', desc: 'Side-by-side pricing for all shared products. See the price gap percentage between you and competitors, margin calculations against suppliers.' },
  { title: 'Category Intelligence', desc: 'Category distribution breakdown per store. Instantly see which product categories competitors invest in that you are missing.' },
  { title: 'Brand Intelligence', desc: 'Brand overlap matrix showing which vendors/brands each store carries. Find exclusive brands, trending vendors, and sourcing gaps.' },
  { title: 'Actionable Opportunities', desc: 'Priority-ranked intelligence cards: ORDER opportunities, PRICE RISKS, ADVANTAGES, and UNTAPPED products.' }
];

let showcaseCurrentTab = 0;
const showcaseTabCount = showcaseDescs.length;
let showcaseLocked = false;
let showcaseReleasePending = false;

window.switchShowcase = function(idx) {
  showcaseCurrentTab = idx;
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
    el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
  });
  panel.querySelectorAll('.sa-gap-fill, .sa-hbar-fill').forEach(el => {
    el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
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

const showcaseEl = document.getElementById('showcase');

if (showcaseEl) {
  let lastWheelTime = 0;
  let showcaseExiting = false;

  function lockPageScroll() {
    if (!showcaseLocked && !showcaseExiting) {
      showcaseLocked = true;
      lastWheelTime = Date.now(); // prime throttle so first post-lock wheel event is ignored
    }
  }
  function unlockPageScroll() {
    showcaseLocked = false;
  }
  function exitShowcaseScroll(direction) {
    if (showcaseExiting) return;
    showcaseExiting = true;
    unlockPageScroll();
    const target = direction > 0
      ? document.getElementById('compare')
      : document.getElementById('features');
    if (target) {
      document.documentElement.style.scrollSnapType = 'none';
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        window.scrollTo(0, target.offsetTop);
        setTimeout(() => {
          document.documentElement.style.overflow = '';
          document.documentElement.style.scrollSnapType = '';
          document.documentElement.style.scrollBehavior = '';
        }, 400);
      });
    }
  }

  const showcaseViewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        switchShowcase(0); // always reset to tab 0 regardless of exiting state
        if (!showcaseExiting) lockPageScroll();
        showcaseReleasePending = false;
      } else if (!entry.isIntersecting) {
        unlockPageScroll();
        setTimeout(() => { showcaseExiting = false; }, 300);
      }
    });
  }, { threshold: 0.6 });
  showcaseViewObserver.observe(showcaseEl);

  // Wheel handler — throttle applies to ALL events including boundary exits
  window.addEventListener('wheel', (e) => {
    if (!showcaseLocked) return;

    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (now - lastWheelTime < 600) return;
    lastWheelTime = now;

    const direction = e.deltaY > 0 ? 1 : -1;

    if (direction === 1) {
      if (showcaseCurrentTab < showcaseTabCount - 1) {
        switchShowcase(showcaseCurrentTab + 1);
      } else {
        exitShowcaseScroll(1);
      }
    } else {
      if (showcaseCurrentTab > 0) {
        switchShowcase(showcaseCurrentTab - 1);
      } else {
        exitShowcaseScroll(-1);
      }
    }
  }, { passive: false });

  // Touch support for mobile
  let touchStartY = 0;
  showcaseEl.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  showcaseEl.addEventListener('touchmove', (e) => {
    if (showcaseLocked) e.preventDefault();
  }, { passive: false });

  showcaseEl.addEventListener('touchend', (e) => {
    if (!showcaseLocked) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 40) return;

    const direction = diff > 0 ? 1 : -1;
    if (direction === 1) {
      if (showcaseCurrentTab < showcaseTabCount - 1) {
        switchShowcase(showcaseCurrentTab + 1);
      } else {
        exitShowcaseScroll(1);
      }
    } else {
      if (showcaseCurrentTab > 0) {
        switchShowcase(showcaseCurrentTab - 1);
      } else {
        exitShowcaseScroll(-1);
      }
    }
  }, { passive: true });
}

// ── FAQ ACCORDION ──
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
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

// ── PRICING CARD HOVER GLOW ──
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(124,58,237,0.06), var(--surface) 70%)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

// ── DEMO VIDEO MODAL ──
window.openDemoModal = function() {
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');
  iframe.src = 'https://www.youtube.com/embed/1FdZEFXxMY8?autoplay=1&rel=0';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeDemoModal = function(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('demo-modal-close')) return;
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');
  iframe.src = '';
  modal.classList.remove('active');
  if (!showcaseLocked) {
    document.body.style.overflow = '';
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDemoModal();
  // Block keyboard scrolling while a section is locked
  if (featLocked || showcaseLocked) {
    const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
    if (scrollKeys.includes(e.key)) e.preventDefault();
  }
});

// ── FEATURES SCROLL-LOCK (same pattern as Showcase) ──
let featCurrentTab = 0;
const featTabCount = 6;
let featLocked = false;
let lastFeatWheelTime = 0;

function animateFpStats(panel) {
  panel.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    el.textContent = prefix + '0' + suffix;
    setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 300);
  });
}

window.switchFeatTab = function(idx) {
  const tabs   = document.querySelectorAll('.feat-tab');
  const panels = document.querySelectorAll('.fp-item');
  if (!tabs.length || !panels.length) return;

  // Mark current as exit
  panels[featCurrentTab]?.classList.add('exit');
  setTimeout(() => panels[featCurrentTab]?.classList.remove('exit'), 400);

  // Update active tab — remove first, reflow, re-add to restart icon animations
  tabs.forEach((t, i) => t.classList.remove('active'));
  const newTab = tabs[idx];
  if (newTab) {
    const iconSvg = newTab.querySelector('.ft-icon-box svg');
    if (iconSvg) { void iconSvg.getBoundingClientRect(); } // force reflow → restart animation
    newTab.classList.add('active');
  }

  // Activate new panel — reset all animations so they replay from start
  panels.forEach((p, i) => {
    p.classList.remove('active');
  });

  // Force reflow so animation state fully resets before re-adding active
  void panels[idx].offsetWidth;

  // Reset every animated child: strip animation, reflow, restore
  const animEls = panels[idx].querySelectorAll('.fp-row-anim, .fp-stat-anim, .fp-pill-anim, .fp-bar-anim, .fp-modal-anim');
  animEls.forEach(el => { el.style.animation = 'none'; });
  // Also reset chart & dot animations
  panels[idx].querySelectorAll('.fp-price-chart path, .fp-price-chart circle, .fp-price-chart text').forEach(el => {
    el.style.animation = 'none';
  });
  void panels[idx].offsetWidth;
  animEls.forEach(el => { el.style.animation = ''; });
  panels[idx].querySelectorAll('.fp-price-chart path, .fp-price-chart circle, .fp-price-chart text').forEach(el => {
    el.style.animation = '';
  });

  panels[idx].classList.add('active');
  animateFpStats(panels[idx]);

  featCurrentTab = idx;
};

const featEl = document.getElementById('features');

if (featEl) {
  let featExiting = false;

  function lockFeatScroll() {
    if (!featLocked && !featExiting) {
      featLocked = true;
      lastFeatWheelTime = Date.now(); // prime throttle so first post-lock wheel event is ignored
    }
  }
  function unlockFeatScroll() {
    featLocked = false;
  }
  function exitFeatScroll(direction) {
    if (featExiting) return;
    featExiting = true;
    stopFeatAuto();
    unlockFeatScroll();
    const target = direction > 0
      ? document.getElementById('showcase')
      : document.getElementById('problems');
    if (target) {
      document.documentElement.style.scrollSnapType = 'none';
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        window.scrollTo(0, target.offsetTop);
        setTimeout(() => {
          document.documentElement.style.overflow = '';
          document.documentElement.style.scrollSnapType = '';
          document.documentElement.style.scrollBehavior = '';
        }, 400);
      });
    }
  }

  // Auto-advance timer
  let featAutoTimer = null;
  function startFeatAuto() {
    clearInterval(featAutoTimer);
    featAutoTimer = setInterval(() => {
      const next = (featCurrentTab + 1) % featTabCount;
      switchFeatTab(next);
    }, 3500);
  }
  function stopFeatAuto() { clearInterval(featAutoTimer); }

  // Lock on entry, unlock on leave
  const featViewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        switchFeatTab(0); // always reset to tab 0 regardless of exiting state
        startFeatAuto();
        if (!featExiting) lockFeatScroll();
      } else if (!entry.isIntersecting) {
        unlockFeatScroll();
        stopFeatAuto();
        setTimeout(() => { featExiting = false; }, 300);
      }
    });
  }, { threshold: 0.6 });
  featViewObserver.observe(featEl);

  // Wheel — always preventDefault while locked, throttle applies to ALL events including boundary
  window.addEventListener('wheel', (e) => {
    if (!featLocked) return;

    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (now - lastFeatWheelTime < 600) return; // throttle all — prevents instant double-exit
    lastFeatWheelTime = now;

    const direction = e.deltaY > 0 ? 1 : -1;

    if (direction === 1) {
      if (featCurrentTab < featTabCount - 1) {
        switchFeatTab(featCurrentTab + 1);
        startFeatAuto();
      } else {
        exitFeatScroll(1);
      }
    } else {
      if (featCurrentTab > 0) {
        switchFeatTab(featCurrentTab - 1);
        startFeatAuto();
      } else {
        exitFeatScroll(-1);
      }
    }
  }, { passive: false });

  // Touch support
  let featTouchStartY = 0;
  featEl.addEventListener('touchstart', (e) => {
    featTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  featEl.addEventListener('touchmove', (e) => {
    if (featLocked) e.preventDefault();
  }, { passive: false });

  featEl.addEventListener('touchend', (e) => {
    if (!featLocked) return;
    const diff = featTouchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 40) return;

    const direction = diff > 0 ? 1 : -1;
    if (direction === 1) {
      if (featCurrentTab < featTabCount - 1) {
        switchFeatTab(featCurrentTab + 1);
      } else {
        exitFeatScroll(1);
      }
    } else {
      if (featCurrentTab > 0) {
        switchFeatTab(featCurrentTab - 1);
      } else {
        exitFeatScroll(-1);
      }
    }
  }, { passive: true });

  // Tab clicks still work — reset auto timer on click
  document.querySelectorAll('.feat-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => { switchFeatTab(i); startFeatAuto(); });
  });
}

// ── SCROLL-TO-TOP BUTTON ──
const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > window.innerHeight);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
