import { state } from '../state/store.js';
import { esc, photoOf } from '../utils/format.js';

const SLIDE_INTERVAL_MS = 4000;

let slideTimer = null;
let currentIndex = 0;
let slides = [];

function getDestinationSlides() {
  const withPhotos = state.data.destinasi.filter((d) => Boolean(photoOf(d)));
  return [...withPhotos].sort(
    (a, b) => Number(Boolean(b.unggulan)) - Number(Boolean(a.unggulan)),
  );
}

function stopTimer() {
  if (slideTimer) {
    window.clearInterval(slideTimer);
    slideTimer = null;
  }
}

function updateActiveSlide(nextIndex) {
  const slidesWrap = document.getElementById('heroSlides');
  const captionEl = document.getElementById('heroSlideName');
  const dotsWrap = document.getElementById('heroDots');
  if (!slidesWrap || !slides.length) return;

  const imgs = slidesWrap.querySelectorAll('.hero-slide');
  const dots = dotsWrap ? dotsWrap.querySelectorAll('.hero-dot') : [];
  const prevIndex = currentIndex;
  currentIndex = ((nextIndex % slides.length) + slides.length) % slides.length;

  imgs.forEach((img, idx) => {
    img.classList.toggle('is-active', idx === currentIndex);
    img.classList.toggle('is-prev', idx === prevIndex && idx !== currentIndex);
  });

  dots.forEach((dot, idx) => {
    const active = idx === currentIndex;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-current', active ? 'true' : 'false');
  });

  if (captionEl) {
    const current = slides[currentIndex];
    captionEl.textContent = current
      ? `${current.nama} · ${current.wilayah}`
      : '';
  }
}

function startTimer() {
  stopTimer();
  if (slides.length <= 1) return;
  slideTimer = window.setInterval(() => {
    updateActiveSlide(currentIndex + 1);
  }, SLIDE_INTERVAL_MS);
}

export function renderHeroSlideshow() {
  const slidesWrap = document.getElementById('heroSlides');
  const dotsWrap = document.getElementById('heroDots');
  const captionEl = document.getElementById('heroSlideName');
  if (!slidesWrap) return;

  slides = getDestinationSlides();
  if (!slides.length) {
    stopTimer();
    slidesWrap.innerHTML = '';
    if (dotsWrap) dotsWrap.innerHTML = '';
    if (captionEl) captionEl.textContent = '';
    return;
  }

  if (currentIndex >= slides.length) {
    currentIndex = 0;
  }

  slidesWrap.innerHTML = slides
    .map((d, idx) => {
      const src = photoOf(d);
      const panClass = idx % 2 === 0 ? 'pan-a' : 'pan-b';
      const activeClass = idx === currentIndex ? 'is-active' : '';
      return `
        <img
          class="hero-slide ${panClass} ${activeClass}"
          src="${esc(src)}"
          alt="${esc(d.nama)} — ${esc(d.wilayah)}"
          data-fallback-src="${esc(`assets/destinasi/${d.id}.jpg?v=2`)}"
        />
      `;
    })
    .join('');

  slidesWrap.querySelectorAll('img.hero-slide').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.getAttribute('data-fallback-src');
      if (fallback && !img.dataset.triedFallback) {
        img.dataset.triedFallback = '1';
        img.src = fallback;
        return;
      }
      img.style.display = 'none';
    });
  });

  if (dotsWrap) {
    dotsWrap.innerHTML = slides
      .map(
        (d, idx) => `
          <button
            type="button"
            class="hero-dot ${idx === currentIndex ? 'is-active' : ''}"
            data-slide="${idx}"
            aria-label="${esc(d.nama)}"
            aria-current="${idx === currentIndex ? 'true' : 'false'}"
          ></button>
        `,
      )
      .join('');
  }

  updateActiveSlide(currentIndex);
  startTimer();
}

export function initHeroSlideshow() {
  const dotsWrap = document.getElementById('heroDots');
  dotsWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-slide]');
    if (!btn) return;
    const idx = Number(btn.getAttribute('data-slide'));
    if (Number.isNaN(idx)) return;
    updateActiveSlide(idx);
    startTimer();
  });
}
