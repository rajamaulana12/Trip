import { clone } from '../utils/format.js';

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return clone(fallback);
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : clone(fallback);
    }
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
  const clean = storedList
    .filter((item) => item && typeof item === 'object' && item.id)
    .map((item) => {
      const seed = seedList.find((s) => s.id === item.id);
      if (!seed) return item;
      return {
        ...seed,
        ...item,
        imageUrl: seed.imageUrl,
        imageData:
          typeof item.imageData === 'string' &&
          item.imageData.startsWith('data:image/')
            ? item.imageData
            : undefined,
        fasilitas: Array.isArray(item.fasilitas) ? item.fasilitas : seed.fasilitas,
        fasilitasIbadah: Array.isArray(item.fasilitasIbadah)
          ? item.fasilitasIbadah
          : seed.fasilitasIbadah,
      };
    });
  return clean.length ? clean : clone(seedList);
}
