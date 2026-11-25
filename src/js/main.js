import { TRANSLATIONS } from './config/constants.js';
import { initAuth, syncUserUI } from './components/auth.js';
import { initDashboard, renderDashboard } from './components/dashboard.js';
import { initDestinationsSection, renderDestinations } from './components/destinations.js';
import { initFavorites, renderFavorites } from './components/favorites.js';
import { initFoodAndStay, renderFood, renderStays } from './components/foodAndStay.js';
import { initModalHandlers } from './components/modals.js';
import { initPackages } from './components/packages.js';
import {
  calculateBudget,
  initPlanner,
  renderItinerary,
  renderSavedTrips,
  updateDayOptions,
} from './components/planner.js';
import { state, subscribe, toggleLanguage } from './state/store.js';

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

function renderAll() {
  applyLanguage();
  renderDestinations();
  renderFood();
  renderStays();
  renderFavorites();
  renderSavedTrips();
  renderDashboard();
  updateDayOptions();
  calculateBudget(true);
  renderItinerary();
}

function bootstrap() {
  initModalHandlers();
  initMobileNav();
  initAuth();
  initDestinationsSection();
  initFoodAndStay();
  initPlanner();
  initPackages();
  initFavorites();
  initDashboard();

  document.getElementById('langBtn')?.addEventListener('click', () => {
    toggleLanguage();
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
