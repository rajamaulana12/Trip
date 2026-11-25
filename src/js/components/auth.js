import { TRANSLATIONS } from '../config/constants.js';
import {
  signInWithGoogle,
  signOutGoogle,
  subscribeAuth,
  subscribeUserFavorites,
  subscribeUserItineraries,
  syncUserProfile,
} from '../services/firebase.js';
import {
  setAuthUser,
  setSyncedFavorites,
  setSyncedItineraries,
  state,
} from '../state/store.js';
import { esc } from '../utils/format.js';
import { showToast } from './toast.js';

let unsubFavorites = null;
let unsubItineraries = null;
let authReady = false;
let signingIn = false;

function stopFirestoreListeners() {
  if (unsubFavorites) {
    unsubFavorites();
    unsubFavorites = null;
  }
  if (unsubItineraries) {
    unsubItineraries();
    unsubItineraries = null;
  }
}

export function syncUserUI() {
  const chip = document.getElementById('userChip');
  const btn = document.getElementById('userBtn');
  const t = TRANSLATIONS[state.lang];

  if (!chip || !btn) return;

  if (state.authUser) {
    const label = state.authUser.displayName || state.authUser.email || state.currentUser;
    const title = state.authUser.email || label;
    chip.hidden = false;
    chip.title = title;
    if (state.authUser.photoURL) {
      chip.innerHTML = `<img class="user-chip-avatar" src="${esc(state.authUser.photoURL)}" alt="" referrerpolicy="no-referrer" /><span>${esc(label)}</span>`;
    } else {
      chip.textContent = label;
    }
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
  const msg = document.getElementById('userLoginMsg');
  const googleBtn = document.getElementById('googleSignInBtn');
  if (!modal) return;

  if (msg) {
    msg.textContent = '';
    msg.classList.remove('ok');
  }
  if (googleBtn) {
    googleBtn.disabled = false;
  }
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  googleBtn?.focus();
}

export function closeUserLogin() {
  const modal = document.getElementById('userLogin');
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

function formatGoogleAuthError(error) {
  const code = error?.code || '';
  const isEn = state.lang === 'en';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return isEn
      ? 'Google sign-in was cancelled before completing.'
      : 'Pemilihan akun Google dibatalkan sebelum selesai.';
  }
  if (code === 'auth/popup-blocked') {
    return isEn
      ? 'Sign-in popup was blocked by your browser. Please allow popups and try again.'
      : 'Popup login diblokir oleh browser. Izinkan popup lalu coba lagi.';
  }
  if (code === 'auth/unauthorized-domain') {
    return isEn
      ? 'This domain is not yet authorized in Firebase Authentication.'
      : 'Domain ini belum diotorisasi di Firebase Authentication.';
  }
  if (code === 'auth/network-request-failed') {
    return isEn
      ? 'Network error while connecting to Google. Please try again.'
      : 'Gangguan jaringan saat menghubungi Google. Coba lagi.';
  }
  return isEn
    ? 'Could not complete Google sign-in. Please try again.'
    : 'Gagal masuk dengan Google. Silakan coba lagi.';
}

async function handleGoogleLogin() {
  if (signingIn) return;
  const googleBtn = document.getElementById('googleSignInBtn');
  const msg = document.getElementById('userLoginMsg');

  signingIn = true;
  if (googleBtn) googleBtn.disabled = true;
  if (msg) {
    msg.classList.remove('ok');
    msg.textContent = '';
  }

  try {
    const result = await signInWithGoogle();
    const user = result?.user;
    closeUserLogin();
    if (user) {
      const label = user.email || user.displayName || 'Google';
      showToast(
        state.lang === 'en' ? `Signed in as ${label}` : `Masuk sebagai ${label}`,
        'success',
      );
    }
  } catch (error) {
    if (msg) {
      msg.classList.remove('ok');
      msg.textContent = formatGoogleAuthError(error);
    }
  } finally {
    signingIn = false;
    if (googleBtn) googleBtn.disabled = false;
  }
}

export function initAuth() {
  syncUserUI();

  subscribeAuth(async (user) => {
    stopFirestoreListeners();
    authReady = true;

    if (!user) {
      setAuthUser(null);
      syncUserUI();
      return;
    }

    setAuthUser({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
    });
    syncUserUI();

    try {
      await syncUserProfile(user);
      if (!authReady) return;

      unsubFavorites = subscribeUserFavorites(
        user.uid,
        (items) => setSyncedFavorites(items),
        (err) => console.error('Favorites listener error:', err),
      );

      unsubItineraries = subscribeUserItineraries(
        user.uid,
        (items) => setSyncedItineraries(items),
        (err) => console.error('Itineraries listener error:', err),
      );
    } catch (error) {
      console.error('Failed to sync Firebase user data:', error);
    }
  });

  document.getElementById('userBtn')?.addEventListener('click', async () => {
    if (state.authUser) {
      try {
        await signOutGoogle();
        showToast(
          state.lang === 'en' ? 'Signed out.' : 'Berhasil keluar dari akun Google.',
        );
      } catch (error) {
        console.error(error);
        showToast(
          state.lang === 'en' ? 'Failed to sign out.' : 'Gagal keluar dari akun.',
          'error',
        );
      }
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

  document
    .getElementById('googleSignInBtn')
    ?.addEventListener('click', handleGoogleLogin);
}
