/* =========================================================
   Mobig_raphy — Chetan Sharma
   ========================================================= */
(function () {
  'use strict';

  const PHOTOS = {
    'child':                { file: 'Child.jpg',                title: 'Child',                category: 'Portrait',           description: 'A quiet moment noticed on the street — a child absorbed in their own world.', location: 'Bharatpur, Rajasthan', year: '2025', type: 'Street Photography' },
    'conversation':         { file: 'conversation.jpg',         title: 'Conversation',         category: 'Documentary',        description: 'An everyday exchange between people passing time together.',                   location: 'Bharatpur, Rajasthan', year: '2025', type: 'Documentary' },
    'cycle':                { file: 'Cycle.jpg',                title: 'Cycle',                category: 'Still Life / Street',description: 'A cycle at rest — part of the ordinary rhythm of the street.',                location: 'Bharatpur, Rajasthan', year: '2025', type: 'Street Photography' },
    'devotional':           { file: 'devotional.jpeg',          title: 'Devotional',           category: 'Documentary',        description: 'A moment of devotion, made in available light.',                             location: 'Bharatpur, Rajasthan', year: '2025', type: 'Documentary' },
    'frame-within-a-frame': { file: 'frame within a frame.jpg', title: 'Frame Within a Frame', category: 'Composition Study',  description: 'Light, structure and a frame nested inside another.',                         location: 'Bharatpur, Rajasthan', year: '2025', type: 'Street Photography' },
    'hero':                 { file: 'hero.jpeg',                title: 'Everyday Life',        category: 'Street',             description: 'Everyday life in Bharatpur, observed quietly.',                              location: 'Bharatpur, Rajasthan', year: '2025', type: 'Street Photography' },
    'horse-illusion':       { file: 'horse illution.jpg',       title: 'Horse Illusion',       category: 'Movement',           description: 'Movement and illusion in the middle of the street.',                         location: 'Bharatpur, Rajasthan', year: '2025', type: 'Street Photography' },
    'lighting-experiment':  { file: 'lighting experiment.jpg',  title: 'Lighting Experiment',  category: 'Light Study',        description: 'A study of light, shadow and contrast.',                                      location: 'Bharatpur, Rajasthan', year: '2025', type: 'Experimental' },
    'old-man-cinematic':    { file: 'old man cinematic.jpg',    title: 'Old Man',              category: 'Portrait',           description: 'A portrait made in soft, cinematic light.',                                   location: 'Bharatpur, Rajasthan', year: '2025', type: 'Portrait' },
    'sunset-reflection':    { file: 'Sunset Reflection.jpg',    title: 'Sunset Reflection',    category: 'Light & Reflection', description: 'The last light of the day, reflected back.',                                  location: 'Bharatpur, Rajasthan', year: '2025', type: 'Street Photography' },
    'two-adult-one-child':  { file: 'Two adult one child.jpg',  title: 'Two Adults, One Child',category: 'Documentary',        description: 'A family moment on an ordinary street.',                                      location: 'Bharatpur, Rajasthan', year: '2025', type: 'Documentary' }
  };

  const ORDER = ['child','conversation','cycle','devotional','frame-within-a-frame','hero','horse-illusion','lighting-experiment','old-man-cinematic','sunset-reflection','two-adult-one-child'];
  const FEATURED = ['hero','child','cycle','old-man-cinematic','sunset-reflection','conversation'];
  const imgPath = (file) => 'images/' + file;
  const pad2 = (n) => String(n).padStart(2, '0');

  /* ---------- NAV ---------- */
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- CAROUSEL ---------- */
  function initCarousel() {
    const root = document.getElementById('carousel');
    if (!root) return;

    const track = root.querySelector('.carousel-track');
    const viewport = root.querySelector('.carousel-viewport');
    const dotsWrap = root.querySelector('.carousel-dots');
    const prevBtn = root.querySelector('.carousel-btn--prev');
    const nextBtn = root.querySelector('.carousel-btn--next');
    const captionT = root.querySelector('.carousel-caption-title');
    const captionC = root.querySelector('.carousel-caption-cat');
    const counterCur = root.querySelector('.carousel-counter .cur');
    const counterTot = root.querySelector('.carousel-counter .total');
    if (!track || !viewport || !dotsWrap) return;

    /* Screen-reader live region — announces slide changes on manual nav only */
    const liveRegion = document.createElement('div');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    root.appendChild(liveRegion);

    FEATURED.forEach((key, i) => {
      const p = PHOTOS[key]; if (!p) return;
      const slide = document.createElement('a');
      slide.className = 'carousel-slide';
      slide.href = 'photo.html?id=' + encodeURIComponent(key);
      slide.setAttribute('aria-label', 'View ' + p.title);
      const img = document.createElement('img');
      img.src = imgPath(p.file);
      img.alt = p.title;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      slide.appendChild(img);
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ': ' + p.title);
      dot.addEventListener('click', () => { go(i, true); restart(); });
      dotsWrap.appendChild(dot);
    });

    const slides = Array.from(track.children);
    const dots = Array.from(dotsWrap.children);
    if (!slides.length) return;
    if (counterTot) counterTot.textContent = pad2(slides.length);

    let index = 0, timer = null;
    const DELAY = 5000;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function go(i, announce) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach((d, di) => {
        const active = di === index;
        d.classList.toggle('is-active', active);
        if (active) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      const key = FEATURED[index]; const p = PHOTOS[key];
      if (p) {
        if (captionT) captionT.textContent = p.title;
        if (captionC) captionC.textContent = p.category;
      }
      if (counterCur) counterCur.textContent = pad2(index + 1);
      if (announce && p) {
        liveRegion.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length + ': ' + p.title + ', ' + p.category;
      }
    }
    const next = (announce) => go(index + 1, announce);
    const prev = (announce) => go(index - 1, announce);
    function start() { if (reduce) return; stop(); timer = setInterval(() => next(false), DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    prevBtn && prevBtn.addEventListener('click', () => { prev(true); restart(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(true); restart(); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) start(); });

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { next(true); restart(); }
      if (e.key === 'ArrowLeft')  { prev(true); restart(); }
    });

    /* Touch / swipe */
    let sx = 0, sy = 0, tracking = false;
    viewport.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true; stop();
    }, { passive: true });
    viewport.addEventListener('touchend', e => {
      if (!tracking) return; tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next(true) : prev(true); }
      start();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

    go(0, false);
    start();
  }

  /* ---------- PHOTO DETAIL ---------- */
  function initPhotoDetail() {
    const root = document.getElementById('photoDetail');
    if (!root) return;
    const id = new URLSearchParams(window.location.search).get('id');
    const p = (id && PHOTOS[id]) ? PHOTOS[id] : null;

    if (!p) {
      root.innerHTML = '<div style="padding:80px 0;text-align:center"><p style="font-size:18px">Photograph not found.</p><p style="margin-top:16px"><a href="work.html" style="border-bottom:1px solid currentColor;padding-bottom:2px">Back to Work</a></p></div>';
      return;
    }
    document.title = p.title + ' — Mobig_raphy';
    const set = (s, v) => { const el = root.querySelector(s); if (el) el.textContent = v; };
    const img = root.querySelector('[data-photo-img]');
    if (img) { img.src = imgPath(p.file); img.alt = p.title; }
    set('[data-photo-category]', p.category);
    set('[data-photo-title]', p.title);
    set('[data-photo-desc]', p.description);
    set('[data-photo-location]', p.location);
    set('[data-photo-year]', p.year);
    set('[data-photo-type]', p.type);

    const idx = ORDER.indexOf(id);
    const prevKey = idx > 0 ? ORDER[idx - 1] : ORDER[ORDER.length - 1];
    const nextKey = idx < ORDER.length - 1 ? ORDER[idx + 1] : ORDER[0];
    const prevLink = document.getElementById('photoPrev');
    const nextLink = document.getElementById('photoNext');
    if (prevLink && PHOTOS[prevKey]) { prevLink.href = 'photo.html?id=' + prevKey; prevLink.textContent = '← ' + PHOTOS[prevKey].title; }
    if (nextLink && PHOTOS[nextKey]) { nextLink.href = 'photo.html?id=' + nextKey; nextLink.textContent = PHOTOS[nextKey].title + ' →'; }
  }

  /* ---------- REVEAL ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-visible')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav(); initCarousel(); initPhotoDetail(); initReveal();
  });
})();