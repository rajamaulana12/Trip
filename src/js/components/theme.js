import { state, toggleTheme } from '../state/store.js';

export function applyTheme() {
  const isDark = state.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

  const btn = document.getElementById('themeBtn');
  if (!btn) return;

  const label =
    state.lang === 'en'
      ? isDark
        ? 'Switch to light theme'
        : 'Switch to dark theme'
      : isDark
        ? 'Ganti ke tema terang'
        : 'Ganti ke tema gelap';

  btn.innerHTML = `<span aria-hidden="true">${isDark ? '☀' : '☾'}</span>`;
  btn.setAttribute('aria-pressed', String(isDark));
  btn.setAttribute('aria-label', label);
  btn.title = label;
}

export function initTheme() {
  applyTheme();
  document.getElementById('themeBtn')?.addEventListener('click', () => {
    toggleTheme();
  });
}
