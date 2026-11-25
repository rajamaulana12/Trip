import { SAFE_URL_FALLBACK } from '../config/constants.js';

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[ch];
  });
}

export function safeUrl(url) {
  try {
    const parsed = new URL(String(url ?? '').trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // Fallback to safe URL
  }
  return SAFE_URL_FALLBACK;
}

export function photoOf(item) {
  return item?.imageData || item?.imageUrl || '';
}

export function rupiah(amount) {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}

export function gmailValid(value) {
  return /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@gmail\.com$/i.test(value);
}

export function debounce(fn, delay = 160) {
  let timer = null;
  return (...args) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak dapat dibaca.'));
      img.onload = () => {
        const encode = (maxW, maxH, quality) => {
          const scale = Math.min(1, maxW / img.width, maxH / img.height);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL('image/jpeg', quality);
        };

        let dataUrl = encode(900, 675, 0.72);
        if (!dataUrl) {
          reject(new Error('Canvas tidak tersedia.'));
          return;
        }
        if (dataUrl.length > 650000) {
          dataUrl = encode(800, 600, 0.55) || dataUrl;
        }
        if (dataUrl.length > 650000) {
          dataUrl = encode(640, 480, 0.45) || dataUrl;
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}
