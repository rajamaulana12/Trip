import {
  CATEGORIES,
  DASH_PIN,
  REGIONS,
  SAFE_URL_FALLBACK,
} from '../config/constants.js';
import {
  notify,
  persistCatalog,
  resetAllDemoData,
  state,
} from '../state/store.js';
import { compressImage, esc, rupiah, safeUrl } from '../utils/format.js';
import { closeModal, openModal } from './modals.js';
import { showToast } from './toast.js';

let pendingDeleteId = null;
let confirmingReset = false;
let activePreviewObjectUrl = null;
let dashSearchQuery = '';

function normalizeSearchText(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/mesjid/g, 'masjid')
    .trim();
}

function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const prev = Array.from({ length: n + 1 }, (_, j) => j);
  const curr = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost,
      );
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function matchesNameQuery(name, rawQuery) {
  const query = normalizeSearchText(rawQuery);
  if (!query) return true;
  const normName = normalizeSearchText(name);
  if (!normName) return false;
  if (normName.includes(query)) return true;

  const nameWords = normName.split(/\s+/).filter(Boolean);
  const tokens = query.split(/\s+/).filter(Boolean);

  return tokens.every((token) => {
    if (normName.includes(token)) return true;
    if (token.length <= 2) return false;
    const maxDist = token.length >= 6 ? 2 : 1;
    return nameWords.some((word) => {
      if (editDistance(token, word) <= maxDist) return true;
      if (word.length >= token.length) {
        return editDistance(token, word.slice(0, token.length)) <= maxDist;
      }
      return false;
    });
  });
}

function revokePreviewUrl() {
  if (activePreviewObjectUrl) {
    URL.revokeObjectURL(activePreviewObjectUrl);
    activePreviewObjectUrl = null;
  }
}

function fieldsFor(type) {
  if (type === 'destinasi') {
    return [
      ['nama', 'Nama', 'text'],
      ['kategori', 'Kategori', 'select', CATEGORIES],
      ['wilayah', 'Wilayah', 'select', REGIONS],
      ['deskripsi', 'Deskripsi', 'textarea'],
      ['alamat', 'Alamat', 'text'],
      ['mapsUrl', 'Google Maps URL', 'url'],
      ['estimasiBiaya', 'Estimasi biaya (Rp)', 'number'],
      ['fasilitas', 'Fasilitas (pisahkan koma)', 'text'],
      ['fasilitasIbadah', 'Fasilitas ibadah (pisahkan koma)', 'text'],
      ['unggulan', 'Destinasi unggulan?', 'checkbox'],
    ];
  }
  if (type === 'kuliner') {
    return [
      ['nama', 'Nama', 'text'],
      ['kategori', 'Kategori', 'text'],
      ['wilayah', 'Wilayah', 'select', REGIONS],
      ['harga', 'Harga (Rp)', 'number'],
      [
        'statusSertifikasiHalal',
        'Status sertifikasi halal',
        'select',
        [
          'Belum diverifikasi',
          'Tidak diketahui',
          'Terverifikasi (sumber resmi dicantumkan)',
        ],
      ],
      ['sumberVerifikasi', 'Sumber verifikasi', 'text'],
      ['kontak', 'Kontak demo', 'text'],
    ];
  }
  if (type === 'akomodasi') {
    return [
      ['nama', 'Nama', 'text'],
      ['wilayah', 'Wilayah', 'select', REGIONS],
      ['hargaPerMalam', 'Harga per malam (Rp)', 'number'],
      ['fasilitas', 'Fasilitas (pisahkan koma)', 'text'],
      ['fasilitasRamahMuslim', 'Fasilitas ramah Muslim (pisahkan koma)', 'text'],
      ['kontak', 'Kontak demo', 'text'],
    ];
  }
  return [
    ['nama', 'Nama paket', 'text'],
    ['durasi', 'Durasi (hari)', 'number'],
    ['daftarDestinasi', 'ID destinasi (pisahkan koma)', 'text'],
    ['estimasiBiaya', 'Estimasi biaya (Rp)', 'number'],
    ['deskripsi', 'Deskripsi', 'textarea'],
  ];
}

export function setDashLockUI() {
  const gate = document.getElementById('dashLogin');
  const content = document.getElementById('dashContent');
  const lockBtn = document.getElementById('lockDash');
  const resetBtn = document.getElementById('resetData');
  const resetConfirm = document.getElementById('resetDataConfirm');
  const msg = document.getElementById('dashPinMsg');
  const pinInput = document.getElementById('dashPin');

  if (gate) gate.hidden = state.dashUnlocked;
  if (content) content.hidden = !state.dashUnlocked;
  if (lockBtn) lockBtn.classList.toggle('hidden', !state.dashUnlocked);
  if (resetBtn) {
    resetBtn.classList.toggle(
      'hidden',
      !state.dashUnlocked || confirmingReset,
    );
  }
  if (resetConfirm) {
    resetConfirm.classList.toggle(
      'hidden',
      !state.dashUnlocked || !confirmingReset,
    );
  }
  if (msg) {
    msg.classList.remove('ok');
    msg.textContent = '';
  }
  if (!state.dashUnlocked && pinInput) {
    pinInput.value = '';
  }
}

export function renderDashboard() {
  const type = state.dashType;
  const allRows = state.data[type] || [];
  const query = dashSearchQuery.trim();
  const rows = query
    ? allRows.filter((x) => matchesNameQuery(x.nama, query))
    : allRows;

  const headers =
    type === 'destinasi'
      ? ['Nama', 'Wilayah', 'Kategori', 'Biaya']
      : type === 'kuliner'
        ? ['Nama', 'Wilayah', 'Status halal', 'Harga']
        : type === 'akomodasi'
          ? ['Nama', 'Wilayah', 'Harga/malam', 'Fasilitas']
          : ['Nama', 'Durasi', 'Estimasi', 'Destinasi'];

  const titleMap = {
    destinasi: 'Destinasi',
    kuliner: 'Kuliner',
    akomodasi: 'Akomodasi',
    paket: 'Paket wisata',
  };

  const dashTitleEl = document.getElementById('dashTitle');
  const headEl = document.getElementById('dashHead');
  const bodyEl = document.getElementById('dashBody');

  if (dashTitleEl) {
    dashTitleEl.textContent = 'Kelola ' + titleMap[type];
  }
  if (headEl) {
    headEl.innerHTML =
      '<tr>' +
      headers.map((h) => `<th>${esc(h)}</th>`).join('') +
      '<th>Aksi</th></tr>';
  }
  if (!bodyEl) return;

  if (rows.length === 0) {
    bodyEl.innerHTML = `
      <tr>
        <td class="dash-empty" colspan="${headers.length + 1}">
          ${query ? `Tidak ditemukan data dengan nama "${esc(dashSearchQuery.trim())}".` : 'Belum ada data.'}
        </td>
      </tr>
    `;
    return;
  }

  bodyEl.innerHTML = rows
    .map((x) => {
      const vals =
        type === 'destinasi'
          ? [x.nama, x.wilayah, x.kategori, rupiah(x.estimasiBiaya)]
          : type === 'kuliner'
            ? [x.nama, x.wilayah, x.statusSertifikasiHalal, rupiah(x.harga)]
            : type === 'akomodasi'
              ? [
                  x.nama,
                  x.wilayah,
                  rupiah(x.hargaPerMalam),
                  x.fasilitas.join(', '),
                ]
              : [
                  x.nama,
                  `${x.durasi} hari`,
                  rupiah(x.estimasiBiaya),
                  `${x.daftarDestinasi.length} tempat`,
                ];

      const isConfirming = pendingDeleteId === x.id;

      return `
        <tr>
          ${vals.map((v) => `<td class="tabular">${esc(v)}</td>`).join('')}
          <td>
            ${
              isConfirming
                ? `
                  <div class="card-actions">
                    <button type="button" class="btn danger small" data-action="confirm-delete" data-id="${esc(x.id)}">Hapus</button>
                    <button type="button" class="btn ghost small" data-action="cancel-delete">Batal</button>
                  </div>
                `
                : `
                  <div class="card-actions">
                    <button type="button" class="btn ghost small" data-action="edit" data-id="${esc(x.id)}">Edit</button>
                    <button type="button" class="btn danger small" data-action="ask-delete" data-id="${esc(x.id)}">Hapus</button>
                  </div>
                `
            }
          </td>
        </tr>
      `;
    })
    .join('');
}

function showEditModal(item) {
  state.editingId = item?.id || null;
  revokePreviewUrl();

  const titleEl = document.getElementById('editTitle');
  const fieldsEl = document.getElementById('editFields');
  const uploadArea = document.getElementById('imageUploadArea');
  const preview = document.getElementById('imagePreview');
  const fileInput = document.getElementById('recordImage');

  if (titleEl) {
    titleEl.textContent = (item ? 'Edit ' : 'Tambah ') + state.dashType;
  }

  const fields = fieldsFor(state.dashType);
  if (fieldsEl) {
    fieldsEl.innerHTML = fields
      .map(([key, label, type, opts]) => {
        let val = item?.[key];
        if (Array.isArray(val)) val = val.join(', ');

        if (type === 'checkbox') {
          return `
            <div class="field full">
              <label style="display: flex; align-items: center; gap: 8px; flex-direction: row;">
                <input name="${esc(key)}" type="checkbox" ${val ? 'checked' : ''}>
                <span>${esc(label)}</span>
              </label>
            </div>
          `;
        }
        if (type === 'select') {
          return `
            <div class="field">
              <label>${esc(label)}</label>
              <select name="${esc(key)}">
                ${opts.map((o) => `<option ${val === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}
              </select>
            </div>
          `;
        }
        if (type === 'textarea') {
          return `
            <div class="field full">
              <label>${esc(label)}</label>
              <textarea name="${esc(key)}" rows="3">${esc(val || '')}</textarea>
            </div>
          `;
        }
        return `
          <div class="field ${key === 'deskripsi' ? 'full' : ''}">
            <label>${esc(label)}</label>
            <input name="${esc(key)}" type="${esc(type)}" value="${esc(val ?? '')}">
          </div>
        `;
      })
      .join('');
  }

  if (uploadArea) {
    uploadArea.classList.toggle('hidden', state.dashType === 'paket');
  }
  if (fileInput) {
    fileInput.value = '';
  }
  if (preview) {
    const existingPhoto = item?.imageData || item?.imageUrl || '';
    if (existingPhoto) {
      preview.src = existingPhoto;
      preview.classList.remove('hidden');
    } else {
      preview.src = '';
      preview.classList.add('hidden');
    }
  }

  openModal('editModal');
}

export function initDashboard() {
  setDashLockUI();

  document.getElementById('dashLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('dashPin');
    const msg = document.getElementById('dashPinMsg');
    const pin = (input?.value || '').trim();

    if (!pin) {
      if (msg) {
        msg.classList.remove('ok');
        msg.textContent = 'PIN belum diisi.';
      }
      input?.focus();
      return;
    }

    if (pin !== DASH_PIN) {
      state.dashUnlocked = false;
      if (msg) {
        msg.classList.remove('ok');
        msg.textContent = 'PIN salah. Coba lagi.';
      }
      if (input) {
        input.value = '';
        input.focus();
      }
      return;
    }

    state.dashUnlocked = true;
    setDashLockUI();
    renderDashboard();
    showToast('Dashboard pengelola terbuka.', 'success');
  });

  document.getElementById('lockDash')?.addEventListener('click', () => {
    state.dashUnlocked = false;
    confirmingReset = false;
    pendingDeleteId = null;
    dashSearchQuery = '';
    const searchEl = document.getElementById('dashSearch');
    if (searchEl) searchEl.value = '';
    setDashLockUI();
    document.getElementById('dashPin')?.focus();
  });

  document.getElementById('resetData')?.addEventListener('click', () => {
    if (!state.dashUnlocked) return;
    confirmingReset = true;
    setDashLockUI();
  });

  document.getElementById('resetDataYes')?.addEventListener('click', () => {
    if (!state.dashUnlocked) return;
    confirmingReset = false;
    pendingDeleteId = null;
    dashSearchQuery = '';
    const searchEl = document.getElementById('dashSearch');
    if (searchEl) searchEl.value = '';
    resetAllDemoData();
    setDashLockUI();
    showToast('Semua data demo berhasil dikembalikan ke awal.', 'success');
  });

  document.getElementById('resetDataCancel')?.addEventListener('click', () => {
    confirmingReset = false;
    setDashLockUI();
  });

  document.getElementById('dashTabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-type]');
    if (!btn) return;
    state.dashType = btn.getAttribute('data-type');
    pendingDeleteId = null;
    dashSearchQuery = '';
    const searchEl = document.getElementById('dashSearch');
    if (searchEl) searchEl.value = '';
    document.querySelectorAll('#dashTabs button').forEach((b) => {
      b.classList.toggle('active', b === btn);
    });
    renderDashboard();
  });

  document.getElementById('dashSearch')?.addEventListener('input', (e) => {
    dashSearchQuery = e.target.value || '';
    pendingDeleteId = null;
    renderDashboard();
  });

  document.getElementById('addRecord')?.addEventListener('click', () => {
    if (!state.dashUnlocked) return;
    showEditModal(null);
  });

  document.getElementById('dashBody')?.addEventListener('click', (e) => {
    if (!state.dashUnlocked) return;
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');

    if (action === 'edit' && id) {
      const item = state.data[state.dashType].find((x) => x.id === id);
      if (item) showEditModal(item);
    } else if (action === 'ask-delete' && id) {
      pendingDeleteId = id;
      renderDashboard();
    } else if (action === 'cancel-delete') {
      pendingDeleteId = null;
      renderDashboard();
    } else if (action === 'confirm-delete' && id) {
      state.data[state.dashType] = state.data[state.dashType].filter(
        (x) => x.id !== id,
      );
      pendingDeleteId = null;
      persistCatalog();
      notify('all');
      showToast('Data berhasil dihapus.');
    }
  });

  document.getElementById('recordImage')?.addEventListener('change', (e) => {
    const fileInput = e.target;
    const preview = document.getElementById('imagePreview');
    const file = fileInput?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar (JPG, PNG, atau WEBP).', 'error');
      fileInput.value = '';
      return;
    }
    revokePreviewUrl();
    activePreviewObjectUrl = URL.createObjectURL(file);
    if (preview) {
      preview.src = activePreviewObjectUrl;
      preview.classList.remove('hidden');
    }
  });

  document
    .getElementById('editForm')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.dashUnlocked) return;

      const form = e.target;
      const fields = fieldsFor(state.dashType);
      const obj = {};

      for (const [key, , type] of fields) {
        const el = form.elements[key];
        if (!el) continue;
        if (type === 'checkbox') {
          obj[key] = el.checked;
        } else if (
          [
            'fasilitas',
            'fasilitasIbadah',
            'fasilitasRamahMuslim',
            'daftarDestinasi',
          ].includes(key)
        ) {
          obj[key] = el.value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (type === 'number') {
          obj[key] = Math.max(0, Number(el.value) || 0);
        } else {
          obj[key] = el.value.trim();
        }
      }

      if (!obj.nama) {
        showToast('Nama wajib diisi.', 'error');
        return;
      }

      if (state.dashType === 'destinasi') {
        obj.mapsUrl = safeUrl(obj.mapsUrl);
      }

      const current = state.editingId
        ? state.data[state.dashType].find((x) => x.id === state.editingId)
        : null;

      const imageFile = document.getElementById('recordImage')?.files?.[0];
      if (imageFile) {
        try {
          obj.imageData = await compressImage(imageFile);
        } catch {
          showToast('Gambar gagal diproses. Coba file gambar lain.', 'error');
          return;
        }
      } else if (current?.imageData) {
        obj.imageData = current.imageData;
      }

      if (state.editingId) {
        const idx = state.data[state.dashType].findIndex(
          (x) => x.id === state.editingId,
        );
        if (idx !== -1) {
          state.data[state.dashType][idx] = {
            ...state.data[state.dashType][idx],
            ...obj,
          };
        }
      } else {
        obj.id = state.dashType.slice(0, 1) + Date.now();
        if (state.dashType === 'destinasi') {
          obj.imageUrl = '';
          obj.unggulan = Boolean(obj.unggulan);
          obj.mapsUrl = obj.mapsUrl || SAFE_URL_FALLBACK;
        }
        state.data[state.dashType].push(obj);
      }

      try {
        persistCatalog();
      } catch {
        showToast(
          'Penyimpanan gagal. Ukuran gambar mungkin terlalu besar.',
          'error',
        );
        return;
      }

      revokePreviewUrl();
      closeModal('editModal');
      notify('all');
      showToast('Data berhasil disimpan.', 'success');
    });
}
