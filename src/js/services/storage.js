import { clone } from '../utils/format.js';

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return clone(fallback);
    const parsed = JSON.parse(raw);
    return parsed ?? clone(fallback);
  } catch {
    return clone(fallback);
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage removal errors
  }
}

export function hydrateDestinations(storedList, seedList) {
  if (!Array.isArray(storedList) || storedList.length === 0) {
    return clone(seedList);
  }
  return storedList.map((item) => {
    const seed = seedList.find((s) => s.id === item.id);
    if (!seed || !seed.imageUrl) return item;
    if (item.imageUrl !== seed.imageUrl) {
      return { ...item, imageUrl: seed.imageUrl };
    }
    return item;
  });
}
