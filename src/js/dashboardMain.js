import { TRANSLATIONS } from './config/constants.js';
import { initDashboard, renderDashboard } from './components/dashboard.js';
import { initModalHandlers } from './components/modals.js';
import { applyTheme, initTheme } from './components/theme.js';
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
}

function bootstrapDashboard() {
  initTheme();
  initModalHandlers();
  initDashboard();

  document.getElementById('langBtn')?.addEventListener('click', () => {
    toggleLanguage();
  });

  window.addEventListener('storage', () => {
    reloadFromStorage();
  });

  subscribe((topic) => {
    if (topic === 'lang') {
      applyLanguage();
      applyTheme();
    } else if (topic === 'theme') {
      applyTheme();
    } else {
      applyLanguage();
      applyTheme();
      renderDashboard();
    }
  });

  applyLanguage();
  renderDashboard();
}

bootstrapDashboard();
