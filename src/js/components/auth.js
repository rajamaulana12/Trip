import { TRANSLATIONS } from '../config/constants.js';
import { setCurrentUser, state } from '../state/store.js';
import { gmailValid } from '../utils/format.js';
import { showToast } from './toast.js';

export function syncUserUI() {
  const chip = document.getElementById('userChip');
  const btn = document.getElementById('userBtn');
  const t = TRANSLATIONS[state.lang];

  if (!chip || !btn) return;
  if (state.currentUser) {
    chip.hidden = false;
    chip.textContent = state.currentUser;
    chip.title = state.currentUser;
    btn.textContent = t.signOut;
  } else {
    chip.hidden = true;
    chip.textContent = '';
    chip.title = '';
    btn.textContent = t.signIn;
  }
}

export function openUserLogin() {
  const modal = document.getElementById('userLogin');
  const input = document.getElementById('userEmail');
  const msg = document.getElementById('userLoginMsg');
  if (!modal) return;

  if (msg) {
    msg.textContent = '';
    msg.classList.remove('ok');
  }
  if (input) {
    input.value = state.currentUser || '';
  }
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  input?.focus();
}

export function closeUserLogin() {
  const modal = document.getElementById('userLogin');
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

export function initAuth() {
  syncUserUI();

  document.getElementById('userBtn')?.addEventListener('click', () => {
    if (state.currentUser) {
      setCurrentUser(null);
      showToast('Berhasil keluar dari akun demo.');
      return;
    }
    openUserLogin();
  });

  document
    .getElementById('authClose')
    ?.addEventListener('click', closeUserLogin);

  document.getElementById('userLogin')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeUserLogin();
  });

  document.getElementById('userLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('userEmail');
    const msg = document.getElementById('userLoginMsg');
    const email = (input?.value || '').trim().toLowerCase();

    if (!email) {
      if (msg) {
        msg.classList.remove('ok');
        msg.textContent = 'Alamat Gmail belum diisi.';
      }
      input?.focus();
      return;
    }

    if (!gmailValid(email)) {
      if (msg) {
        msg.classList.remove('ok');
        msg.textContent =
          'Gunakan alamat Gmail yang valid, contoh nama@gmail.com.';
      }
      input?.focus();
      return;
    }

    setCurrentUser(email);
    closeUserLogin();
    showToast(`Masuk sebagai ${email}`, 'success');
  });
}
