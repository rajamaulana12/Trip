import { STORAGE_KEYS } from '../config/constants.js';
import {
  seedDest,
  seedFood,
  seedPackages,
  seedStay,
} from '../data/seed.js';
import {
  addUserFavorite,
  clearUserFavorites,
  deleteCatalogItemFromFirestore,
  deleteUserItinerary,
  ensureCatalogSeeded,
  removeUserFavorite,
  resetCatalogInFirestore,
  saveCatalogItemToFirestore,
  saveUserItinerary,
  subscribePublicCatalog,
} from '../services/firebase.js';
import {
  hydrateDestinations,
  readStorage,
  removeStorage,
  writeStorage,
} from '../services/storage.js';
import { clone } from '../utils/format.js';

const listeners = new Set();
let catalogUnsub = null;

const initialDestinations = hydrateDestinations(
  readStorage(STORAGE_KEYS.destinations, seedDest),
  seedDest,
);

function resolveInitialTheme() {
  const stored = readStorage(STORAGE_KEYS.theme, null);
  if (stored === 'dark' || stored === 'light') return stored;
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

export const state = {
  data: {
    destinasi: initialDestinations,
    kuliner: readStorage(STORAGE_KEYS.foods, seedFood),
    akomodasi: readStorage(STORAGE_KEYS.stays, seedStay),
    paket: readStorage(STORAGE_KEYS.packages, seedPackages),
  },
  favorites: readStorage(STORAGE_KEYS.favorites, []),
  itineraries: readStorage(STORAGE_KEYS.itineraries, []),
  currentUser: readStorage(STORAGE_KEYS.user, null),
  authUser: null,
  lang: readStorage(STORAGE_KEYS.lang, 'id') === 'en' ? 'en' : 'id',
  theme: resolveInitialTheme(),
  dashType: 'destinasi',
  dashUnlocked: false,
  editingId: null,
  tripActivities: [],
};

try {
  if (localStorage.getItem(STORAGE_KEYS.destinations)) {
    writeStorage(STORAGE_KEYS.destinations, initialDestinations);
  }
} catch {
  // Ignore storage write errors on startup
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify(topic = 'all') {
  listeners.forEach((fn) => fn(topic, state));
}

export function persistCatalog() {
  try {
    writeStorage(STORAGE_KEYS.destinations, state.data.destinasi);
    writeStorage(STORAGE_KEYS.foods, state.data.kuliner);
    writeStorage(STORAGE_KEYS.stays, state.data.akomodasi);
    writeStorage(STORAGE_KEYS.packages, state.data.paket);
    if (!state.authUser) {
      writeStorage(STORAGE_KEYS.favorites, state.favorites);
      writeStorage(STORAGE_KEYS.itineraries, state.itineraries);
    }
  } catch {
    // Ignore localStorage quota errors when catalog is persisted in Firestore
  }
}

export function initCatalogSync() {
  if (catalogUnsub) return catalogUnsub;
  catalogUnsub = subscribePublicCatalog((type, items) => {
    state.data[type] =
      type === 'destinasi'
        ? hydrateDestinations(items, seedDest)
        : items;
    notify('all');
  });
  return catalogUnsub;
}

export async function ensureSeededCatalog(adminEmail) {
  return ensureCatalogSeeded(adminEmail, {
    destinasi: clone(seedDest),
    kuliner: clone(seedFood),
    akomodasi: clone(seedStay),
    paket: clone(seedPackages),
  });
}

export async function saveCatalogRecord(type, item, isNew) {
  await saveCatalogItemToFirestore(type, item, isNew);
  if (isNew) {
    state.data[type] = [...state.data[type], item];
  } else {
    const idx = state.data[type].findIndex((x) => x.id === item.id);
    if (idx !== -1) {
      state.data[type][idx] = { ...state.data[type][idx], ...item };
    }
  }
  persistCatalog();
  notify('all');
}

export async function removeCatalogRecord(type, id) {
  await deleteCatalogItemFromFirestore(type, id);
  state.data[type] = state.data[type].filter((x) => x.id !== id);
  persistCatalog();
  notify('all');
}

export async function resetAllCatalogData(adminEmail) {
  const fresh = {
    destinasi: clone(seedDest),
    kuliner: clone(seedFood),
    akomodasi: clone(seedStay),
    paket: clone(seedPackages),
  };
  await resetCatalogInFirestore(adminEmail, fresh);
  state.data = fresh;
  persistCatalog();
  notify('all');
}

export function destById(id) {
  return state.data.destinasi.find((item) => item.id === id) || null;
}

export function isFav(id, type = 'destinasi') {
  return state.favorites.some(
    (f) => f.itemId === id && f.tipeItem === type,
  );
}

export function toggleFav(id, type = 'destinasi') {
  const uid = state.authUser?.uid;
  const currentlyFav = isFav(id, type);

  if (currentlyFav) {
    state.favorites = state.favorites.filter(
      (f) => !(f.itemId === id && f.tipeItem === type),
    );
  } else {
    state.favorites.push({
      id: `${type}_${id}`,
      itemId: id,
      tipeItem: type,
      tanggalDitambahkan: new Date().toISOString(),
    });
  }

  if (uid) {
    notify('favorites');
    if (currentlyFav) {
      removeUserFavorite(uid, id, type).catch((err) => {
        console.error(err);
      });
    } else {
      addUserFavorite(uid, id, type).catch((err) => {
        console.error(err);
      });
    }
    return;
  }

  persistCatalog();
  notify('favorites');
}

export function clearFavorites() {
  const uid = state.authUser?.uid;
  const previous = [...state.favorites];
  state.favorites = [];

  if (uid) {
    notify('favorites');
    if (previous.length) {
      clearUserFavorites(uid, previous).catch((err) => {
        console.error(err);
      });
    }
    return;
  }

  persistCatalog();
  notify('favorites');
}

export function saveItinerary(trip) {
  const uid = state.authUser?.uid;
  if (uid) {
    const nextTrip = {
      ...trip,
      createdBy: state.authUser.email || state.currentUser || '',
    };
    state.itineraries = [...state.itineraries, nextTrip];
    notify('itineraries');
    return saveUserItinerary(uid, nextTrip);
  }

  state.itineraries.push(trip);
  persistCatalog();
  notify('itineraries');
  return Promise.resolve();
}

export function deleteItinerary(id) {
  const uid = state.authUser?.uid;
  state.itineraries = state.itineraries.filter((t) => t.id !== id);

  if (uid) {
    notify('itineraries');
    return deleteUserItinerary(uid, id);
  }

  persistCatalog();
  notify('itineraries');
  return Promise.resolve();
}

export function setSyncedFavorites(items) {
  state.favorites = items;
  notify('favorites');
}

export function setSyncedItineraries(items) {
  state.itineraries = items;
  notify('itineraries');
}

export function setAuthUser(user) {
  state.authUser = user;
  if (user) {
    const label = user.email || user.displayName || user.uid;
    state.currentUser = label;
    writeStorage(STORAGE_KEYS.user, label);
    notify('auth');
  } else {
    state.currentUser = null;
    removeStorage(STORAGE_KEYS.user);
    state.favorites = readStorage(STORAGE_KEYS.favorites, []);
    state.itineraries = readStorage(STORAGE_KEYS.itineraries, []);
    notify('all');
  }
}

export function setCurrentUser(email) {
  state.currentUser = email;
  if (email) {
    writeStorage(STORAGE_KEYS.user, email);
  } else {
    removeStorage(STORAGE_KEYS.user);
  }
  notify('auth');
}

export function toggleLanguage() {
  state.lang = state.lang === 'id' ? 'en' : 'id';
  writeStorage(STORAGE_KEYS.lang, state.lang);
  notify('lang');
}

export function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  writeStorage(STORAGE_KEYS.theme, state.theme);
  notify('theme');
}

export function resetAllDemoData() {
  state.data = {
    destinasi: clone(seedDest),
    kuliner: clone(seedFood),
    akomodasi: clone(seedStay),
    paket: clone(seedPackages),
  };
  state.favorites = [];
  state.itineraries = [];
  state.tripActivities = [];
  persistCatalog();
  notify('all');
}

export function reloadFromStorage() {
  state.data = {
    destinasi: hydrateDestinations(
      readStorage(STORAGE_KEYS.destinations, seedDest),
      seedDest,
    ),
    kuliner: readStorage(STORAGE_KEYS.foods, seedFood),
    akomodasi: readStorage(STORAGE_KEYS.stays, seedStay),
    paket: readStorage(STORAGE_KEYS.packages, seedPackages),
  };
  if (!state.authUser) {
    state.favorites = readStorage(STORAGE_KEYS.favorites, []);
    state.itineraries = readStorage(STORAGE_KEYS.itineraries, []);
    state.currentUser = readStorage(STORAGE_KEYS.user, null);
  }
  state.lang = readStorage(STORAGE_KEYS.lang, 'id') === 'en' ? 'en' : 'id';
  state.theme = resolveInitialTheme();
  notify('all');
}
