import { STORAGE_KEYS } from '../config/constants.js';
import {
  seedDest,
  seedFood,
  seedPackages,
  seedStay,
} from '../data/seed.js';
import {
  hydrateDestinations,
  readStorage,
  removeStorage,
  writeStorage,
} from '../services/storage.js';
import { clone } from '../utils/format.js';

const listeners = new Set();

export const state = {
  data: {
    destinasi: hydrateDestinations(
      readStorage(STORAGE_KEYS.destinations, seedDest),
      seedDest,
    ),
    kuliner: readStorage(STORAGE_KEYS.foods, seedFood),
    akomodasi: readStorage(STORAGE_KEYS.stays, seedStay),
    paket: readStorage(STORAGE_KEYS.packages, seedPackages),
  },
  favorites: readStorage(STORAGE_KEYS.favorites, []),
  itineraries: readStorage(STORAGE_KEYS.itineraries, []),
  currentUser: readStorage(STORAGE_KEYS.user, null),
  lang: readStorage(STORAGE_KEYS.lang, 'id') === 'en' ? 'en' : 'id',
  dashType: 'destinasi',
  dashUnlocked: false,
  editingId: null,
  tripActivities: [],
};

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify(topic = 'all') {
  listeners.forEach((fn) => fn(topic, state));
}

export function persistCatalog() {
  writeStorage(STORAGE_KEYS.destinations, state.data.destinasi);
  writeStorage(STORAGE_KEYS.foods, state.data.kuliner);
  writeStorage(STORAGE_KEYS.stays, state.data.akomodasi);
  writeStorage(STORAGE_KEYS.packages, state.data.paket);
  writeStorage(STORAGE_KEYS.favorites, state.favorites);
  writeStorage(STORAGE_KEYS.itineraries, state.itineraries);
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
  if (isFav(id, type)) {
    state.favorites = state.favorites.filter(
      (f) => !(f.itemId === id && f.tipeItem === type),
    );
  } else {
    state.favorites.push({
      id: 'fav-' + Date.now(),
      itemId: id,
      tipeItem: type,
      tanggalDitambahkan: new Date().toISOString(),
    });
  }
  persistCatalog();
  notify('favorites');
}

export function clearFavorites() {
  state.favorites = [];
  persistCatalog();
  notify('favorites');
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
