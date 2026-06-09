/* ════════════════════════════════
   МАРШАЛ — main.js
════════════════════════════════ */

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('out'), 1800);
});

// ── CURSOR ──
;(function() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = document.querySelector('.cursor-label');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    if (label) { label.style.left = rx + 'px'; label.style.top = (ry + 36) + 'px'; }
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('a, button, .story-card, .p-item, .film-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovered');
      const lbl = el.dataset.cursor;
      if (lbl && label) { label.textContent = lbl; label.classList.add('show'); }
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered', 'play-hover');
      if (label) label.classList.remove('show');
    });
  });

  document.querySelectorAll('.film-overlay, .story-play-btn, [data-cursor-play]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.remove('hovered');
      ring.classList.add('play-hover');
      if (label) { label.textContent = 'PLAY'; label.classList.add('show'); }
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('play-hover');
      if (label) label.classList.remove('show');
    });
  });
})();

// ── NAV SCROLL ──
;(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── MOBILE MENU ──
;(function() {
  const burger = document.querySelector('.burger');
  const overlay = document.querySelector('.mobile-overlay');
  if (!burger || !overlay) return;
  burger.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    burger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      overlay.classList.remove('open');
      burger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

// ── SCROLL REVEAL ──
;(function() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

// ── SPLIT TEXT REVEAL ──
;(function() {
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    el.classList.add('split-title');
    // split by words, keep line breaks
    text.split(' ').forEach((word, wi) => {
      const wEl = document.createElement('span');
      wEl.className = 'word';
      word.split('').forEach((char, ci) => {
        const ch = document.createElement('span');
        ch.className = 'char';
        ch.textContent = char;
        ch.style.transitionDelay = (wi * 0.04 + ci * 0.015) + 's';
        wEl.appendChild(ch);
      });
      el.appendChild(wEl);
      el.appendChild(document.createTextNode(' '));
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  });
})();

// ── COUNTER ──
;(function() {
  function animCount(el, target, dur = 2000) {
    const start = performance.now();
    const step = ts => {
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        animCount(e.target, target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

// ── STORIES DRAG SCROLL ──
;(function() {
  const track = document.querySelector('.stories-track');
  if (!track) return;
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true; track.classList.add('grabbing');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
  // touch
  let touchStart;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].pageX; scrollLeft = track.scrollLeft; });
  track.addEventListener('touchmove', e => {
    const diff = touchStart - e.touches[0].pageX;
    track.scrollLeft = scrollLeft + diff;
  });
  // arrows
  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -300, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: 300, behavior: 'smooth' }));
})();

// ── FILM OVERLAY CLICK ──
;(function() {
  document.querySelectorAll('.film-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      const card = overlay.closest('.film-card');
      const iframe = card.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        if (!src.includes('autoplay=1')) iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
        overlay.style.display = 'none';
      }
    });
  });
})();

// ── ACTIVE NAV ──
;(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
})();

// ── MARQUEE DUPLICATE ──
;(function() {
  document.querySelectorAll('.clients-marquee').forEach(m => {
    m.innerHTML += m.innerHTML;
  });
})();

// ── PARALLAX HERO ──
;(function() {
  const heroBg = document.querySelector('.hero-video-bg');
  const heroYear = document.querySelector('.hero-year');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
    if (heroYear) heroYear.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();

// ── IMAGE ERRORS ──
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    const ph = document.createElement('div');
    ph.style.cssText = 'width:100%;height:100%;background:linear-gradient(135deg,#1a1713,#201c17);display:flex;align-items:center;justify-content:center;font-size:0.55rem;letter-spacing:0.2em;color:rgba(201,168,76,0.3);text-transform:uppercase;';
    ph.textContent = 'Photo';
    this.parentNode.appendChild(ph);
  });
});
