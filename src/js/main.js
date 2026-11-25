import { TRANSLATIONS } from './config/constants.js';
import { initAuth, syncUserUI } from './components/auth.js';
import { initDestinationsSection, renderDestinations } from './components/destinations.js';
import { initFavorites, renderFavorites } from './components/favorites.js';
import { initFoodAndStay, renderFood, renderStays } from './components/foodAndStay.js';
import { initHeroSlideshow, renderHeroSlideshow } from './components/heroSlideshow.js';
import { initModalHandlers } from './components/modals.js';
import { initPackages } from './components/packages.js';
import {
  calculateBudget,
  initPlanner,
  renderItinerary,
  renderSavedTrips,
  updateDayOptions,
} from './components/planner.js';
import {
  reloadFromStorage,
  state,
  subscribe,
  toggleLanguage,
} from './state/store.js';

function applyLanguage() {
  const t = TRANSLATIONS[state.lang];
  document.documentElement.lang = state.lang;

  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = state.lang === 'id' ? 'EN' : 'ID';
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && t[key]) {
      el.textContent = t[key];
    }
  });

  syncUserUI();
}

function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  const setOpen = (isOpen) => {
    drawer.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = !drawer.classList.contains('open');
    setOpen(isOpen);
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function safeRun(fn) {
  try {
    fn();
  } catch (err) {
    console.error(err);
  }
}

function renderAll() {
  safeRun(applyLanguage);
  safeRun(renderHeroSlideshow);
  safeRun(renderDestinations);
  safeRun(renderFood);
  safeRun(renderStays);
  safeRun(renderFavorites);
  safeRun(renderSavedTrips);
  safeRun(updateDayOptions);
  safeRun(() => calculateBudget(true));
  safeRun(renderItinerary);
}

function bootstrap() {
  initModalHandlers();
  initMobileNav();
  initHeroSlideshow();
  initAuth();
  initDestinationsSection();
  initFoodAndStay();
  initPlanner();
  initPackages();
  initFavorites();

  document.getElementById('langBtn')?.addEventListener('click', () => {
    toggleLanguage();
  });

  window.addEventListener('storage', () => {
    reloadFromStorage();
  });

  subscribe((topic) => {
    if (topic === 'lang') {
      applyLanguage();
    } else if (topic === 'auth') {
      syncUserUI();
    } else if (topic === 'favorites') {
      renderDestinations();
      renderFood();
      renderFavorites();
    } else if (topic === 'itineraries') {
      renderSavedTrips();
    } else {
      renderAll();
    }
  });

  renderAll();
}

bootstrap();
