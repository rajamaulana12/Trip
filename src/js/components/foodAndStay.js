import { isFav, state, toggleFav } from '../state/store.js';
import { esc, photoOf, rupiah, safeUrl } from '../utils/format.js';

export function renderFood() {
  const container = document.getElementById('foodCards');
  if (!container) return;

  container.innerHTML = state.data.kuliner
    .map((f) => {
      const photo = photoOf(f);
      const fav = isFav(f.id, 'kuliner');
      const isVerified = String(f.statusSertifikasiHalal || '')
        .toLowerCase()
        .includes('terverifikasi');

      return `
        <article class="simple-card">
          ${
            photo
              ? `<img class="catalog-photo" src="${esc(photo)}" alt="${esc(f.nama)}">`
              : '<div style="font-size: 30px; margin-bottom: 6px;" aria-hidden="true">🥘</div>'
          }
          <div class="meta">
            <span class="tag">${esc(f.kategori)}</span>
            <span>${esc(f.wilayah)}</span>
          </div>
          <h3>${esc(f.nama)}</h3>
          <p class="tabular">${rupiah(f.harga)} · harga simulasi</p>
          <span class="status ${isVerified ? 'good' : ''}">${esc(f.statusSertifikasiHalal)}</span>
          <p><b>Sumber:</b> ${esc(f.sumberVerifikasi)}</p>
          <p>Kontak simulasi: ${esc(f.kontak)}</p>
          <div class="card-actions" style="margin-top: 10px;">
            <button
              type="button"
              class="heart ${fav ? 'on' : ''}"
              aria-label="${fav ? 'Hapus dari favorit' : 'Simpan ke favorit'}"
              data-action="toggle-food-fav"
              data-id="${esc(f.id)}"
            >${fav ? '♥' : '♡'}</button>
            <a
              class="btn small"
              target="_blank"
              rel="noopener noreferrer"
              href="${esc(safeUrl(`https://wa.me/${f.kontak}?text=Halo%2C%20saya%20melihat%20informasi%20demo%20Aceh%20Trip.`))}"
            >WhatsApp demo</a>
          </div>
        </article>
      `;
    })
    .join('');
}

export function renderStays() {
  const container = document.getElementById('stayCards');
  if (!container) return;

  container.innerHTML = state.data.akomodasi
    .map((a) => {
      const photo = photoOf(a);
      return `
        <article class="simple-card">
          ${
            photo
              ? `<img class="catalog-photo" src="${esc(photo)}" alt="${esc(a.nama)}">`
              : '<div style="font-size: 30px; margin-bottom: 6px;" aria-hidden="true">🛏️</div>'
          }
          <div class="meta">
            <span class="tag">${esc(a.wilayah)}</span>
          </div>
          <h3>${esc(a.nama)}</h3>
          <p class="price tabular">${rupiah(a.hargaPerMalam)} / malam · simulasi</p>
          <p><b>Fasilitas:</b> ${a.fasilitas.map(esc).join(', ')}</p>
          <p><b>Ramah Muslim:</b> ${a.fasilitasRamahMuslim.map(esc).join(', ')}</p>
          <span class="status">Fasilitas perlu konfirmasi · bukan sertifikasi</span>
          <p>Kontak simulasi: ${esc(a.kontak)}</p>
          <div style="margin-top: 10px;">
            <a
              class="btn small"
              target="_blank"
              rel="noopener noreferrer"
              href="${esc(safeUrl(`https://wa.me/${a.kontak}?text=Halo%2C%20saya%20melihat%20akomodasi%20demo%20di%20Aceh%20Trip.`))}"
            >WhatsApp demo</a>
          </div>
        </article>
      `;
    })
    .join('');
}

export function initFoodAndStay() {
  document.getElementById('foodCards')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="toggle-food-fav"]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (id) toggleFav(id, 'kuliner');
  });
}
