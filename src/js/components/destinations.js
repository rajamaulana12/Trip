import { CATEGORIES, REGIONS } from '../config/constants.js';
import { destById, isFav, state, toggleFav } from '../state/store.js';
import { debounce, esc, photoOf, rupiah, safeUrl } from '../utils/format.js';
import { openModal } from './modals.js';

function visualClass(cat) {
  const map = {
    Bahari: 'v-blue',
    Sejarah: 'v-gold',
    Religi: 'v-purple',
    Budaya: 'v-green',
  };
  return map[cat] || '';
}

function categoryEmoji(cat) {
  const map = {
    Religi: '🕌',
    Alam: '🌿',
    Bahari: '🌊',
    Sejarah: '🏛️',
    Budaya: '🎭',
    Kuliner: '🍜',
  };
  return map[cat] || '✦';
}

export function populateDestinationFilters() {
  const regionSel = document.getElementById('regionFilter');
  const categorySel = document.getElementById('categoryFilter');

  if (regionSel) {
    const current = regionSel.value;
    regionSel.innerHTML =
      '<option value="">Semua wilayah</option>' +
      REGIONS.map((r) => `<option value="${esc(r)}">${esc(r)}</option>`).join('');
    regionSel.value = current;
  }

  if (categorySel) {
    const current = categorySel.value;
    categorySel.innerHTML =
      '<option value="">Semua kategori</option>' +
      CATEGORIES.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    categorySel.value = current;
  }
}

export function syncActivityDestinationOptions() {
  const activityDest = document.getElementById('activityDest');
  if (!activityDest) return;
  const previous = activityDest.value;
  activityDest.innerHTML = state.data.destinasi
    .map((d) => `<option value="${esc(d.id)}">${esc(d.nama)}</option>`)
    .join('');
  if (previous && destById(previous)) {
    activityDest.value = previous;
  }
}

export function renderDestinations() {
  const container = document.getElementById('destinationCards');
  const countEl = document.getElementById('resultCount');
  if (!container || !countEl) return;

  const q = (document.getElementById('searchDest')?.value || '')
    .toLowerCase()
    .trim();
  const r = document.getElementById('regionFilter')?.value || '';
  const c = document.getElementById('categoryFilter')?.value || '';
  const s = document.getElementById('sortDest')?.value || 'featured';

  const list = state.data.destinasi.filter(
    (d) =>
      (!q ||
        `${d.nama} ${d.deskripsi} ${d.wilayah}`.toLowerCase().includes(q)) &&
      (!r || d.wilayah === r) &&
      (!c || d.kategori === c),
  );

  if (s === 'name') {
    list.sort((a, b) => a.nama.localeCompare(b.nama));
  } else if (s === 'region') {
    list.sort(
      (a, b) =>
        (a.wilayah || '').localeCompare(b.wilayah || '') ||
        a.nama.localeCompare(b.nama),
    );
  } else if (s === 'category') {
    list.sort(
      (a, b) =>
        (a.kategori || '').localeCompare(b.kategori || '') ||
        a.nama.localeCompare(b.nama),
    );
  } else if (s === 'cost') {
    list.sort((a, b) => a.estimasiBiaya - b.estimasiBiaya);
  } else {
    list.sort((a, b) => Number(b.unggulan) - Number(a.unggulan));
  }

  countEl.textContent = `${list.length} destinasi`;

  if (!list.length) {
    container.innerHTML =
      '<div class="empty">Tidak ada destinasi yang cocok. Coba ubah kata kunci atau filter.</div>';
    syncActivityDestinationOptions();
    return;
  }

  container.innerHTML = list
    .map((d) => {
      const photo = photoOf(d);
      const fav = isFav(d.id, 'destinasi');
      return `
        <article class="place-card">
          <div class="visual ${visualClass(d.kategori)}" data-cat="${esc(d.kategori)}">
            ${
              photo
                ? `<img src="${esc(photo)}" alt="${esc(d.nama)}" data-fallback-src="${esc(`assets/destinasi/${d.id}.jpg`)}" data-fallback-emoji="${categoryEmoji(d.kategori)}">`
                : `<span class="emoji" aria-hidden="true">${categoryEmoji(d.kategori)}</span>`
            }
            <span class="vlabel">${esc(d.wilayah)}</span>
          </div>
          <div class="card-body">
            <div class="meta">
              <span class="tag">${esc(d.kategori)}</span>
              <span>${esc(d.wilayah)}</span>
              ${d.unggulan ? '<span>✦ Pilihan</span>' : ''}
            </div>
            <h3>${esc(d.nama)}</h3>
            <p>${esc(d.deskripsi)}</p>
            <div class="card-foot">
              <span class="price tabular">${d.estimasiBiaya === 0 ? 'Gratis*' : `${rupiah(d.estimasiBiaya)}*`}</span>
              <div class="card-actions">
                <button
                  type="button"
                  class="heart ${fav ? 'on' : ''}"
                  aria-label="${fav ? 'Hapus dari favorit' : 'Simpan ke favorit'}"
                  data-action="toggle-fav"
                  data-id="${esc(d.id)}"
                >${fav ? '♥' : '♡'}</button>
                <button
                  type="button"
                  class="btn small"
                  data-action="detail"
                  data-id="${esc(d.id)}"
                >Detail</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  // Attach clean image error fallbacks without inline event handlers
  container.querySelectorAll('img[data-fallback-emoji]').forEach((img) => {
    img.addEventListener('error', () => {
      const secondarySrc = img.getAttribute('data-fallback-src');
      if (secondarySrc && !img.dataset.triedSecondary) {
        img.dataset.triedSecondary = '1';
        img.src = secondarySrc;
        return;
      }
      const emojiChar = img.getAttribute('data-fallback-emoji') || '✦';
      const fallback = document.createElement('span');
      fallback.className = 'emoji';
      fallback.setAttribute('aria-hidden', 'true');
      fallback.textContent = emojiChar;
      img.replaceWith(fallback);
    });
  });

  syncActivityDestinationOptions();
}

export function showDestinationDetail(id) {
  const d = destById(id);
  if (!d) return;

  const titleEl = document.getElementById('detailTitle');
  const contentEl = document.getElementById('detailContent');
  if (!titleEl || !contentEl) return;

  const photo = photoOf(d);
  const fav = isFav(d.id, 'destinasi');

  titleEl.textContent = d.nama;
  contentEl.innerHTML = `
    ${photo ? `<img class="detail-photo" src="${esc(photo)}" alt="${esc(d.nama)}">` : ''}
    <div class="meta">
      <span class="tag">${esc(d.kategori)}</span>
      <span>${esc(d.wilayah)}</span>
    </div>
    <p>${esc(d.deskripsi)}</p>
    <div class="notice">Data lokasi, fasilitas, dan estimasi biaya merupakan contoh yang perlu diverifikasi sebelum perjalanan.</div>
    <p><b>Alamat:</b> ${esc(d.alamat)}</p>
    <p class="tabular"><b>Estimasi biaya:</b> ${rupiah(d.estimasiBiaya)} (simulasi)</p>
    <p><b>Fasilitas:</b> ${d.fasilitas.map(esc).join(', ')}</p>
    <p><b>Fasilitas ibadah:</b> ${d.fasilitasIbadah.map(esc).join(', ')}</p>
    <p><b>Unggulan:</b> ${d.unggulan ? 'Ya' : 'Tidak'}</p>
    <div class="card-actions" style="margin-top: 16px; flex-wrap: wrap;">
      <a class="btn" target="_blank" rel="noopener noreferrer" href="${esc(safeUrl(d.mapsUrl))}">Buka Google Maps ↗</a>
      <button type="button" class="btn secondary" data-action="detail-fav" data-id="${esc(d.id)}">
        ${fav ? 'Hapus favorit' : 'Simpan favorit'}
      </button>
    </div>
  `;

  const img = contentEl.querySelector('img.detail-photo');
  if (img) {
    img.addEventListener('error', () => img.remove());
  }

  openModal('detailModal');
}

export function initDestinationsSection() {
  populateDestinationFilters();

  const searchInput = document.getElementById('searchDest');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(renderDestinations, 150));
  }

  ['regionFilter', 'categoryFilter', 'sortDest'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', renderDestinations);
  });

  document
    .getElementById('destinationCards')
    ?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      if (!id) return;

      if (action === 'toggle-fav') {
        toggleFav(id, 'destinasi');
      } else if (action === 'detail') {
        showDestinationDetail(id);
      }
    });

  document.getElementById('detailContent')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="detail-fav"]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!id) return;
    toggleFav(id, 'destinasi');
    const fav = isFav(id, 'destinasi');
    btn.textContent = fav ? 'Hapus favorit' : 'Simpan favorit';
  });
}
