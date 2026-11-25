import { destById, state } from '../state/store.js';
import { esc, rupiah } from '../utils/format.js';

export function renderPackageRecommendations() {
  const container = document.getElementById('packageResults');
  if (!container) return;

  const interest = document.getElementById('interest')?.value || '';
  const days = Number(document.getElementById('packageDays')?.value || 3);
  const budget = Number(document.getElementById('packageBudget')?.value || 0);

  const packs = state.data.paket.filter(
    (p) =>
      p.durasi <= days &&
      p.estimasiBiaya <= budget &&
      (!interest ||
        p.daftarDestinasi.some((id) => destById(id)?.kategori === interest)),
  );

  if (!packs.length) {
    container.innerHTML =
      '<div class="empty">Belum ada paket yang cocok. Coba tambah anggaran, durasi, atau pilih semua minat.</div>';
    return;
  }

  container.innerHTML = packs
    .map(
      (p) => `
        <div class="package-item">
          <span class="tag">${p.durasi} hari</span>
          <h3 style="font-size: 20px; margin: 8px 0;">${esc(p.nama)}</h3>
          <p class="muted" style="font-size: 12px; margin: 0 0 6px;">${esc(p.deskripsi)}</p>
          <b class="price tabular">${rupiah(p.estimasiBiaya)} · simulasi</b>
          <p class="muted" style="font-size: 11px; margin: 6px 0 2px;">
            Destinasi: ${p.daftarDestinasi.map((id) => esc(destById(id)?.nama || id)).join(', ')}
          </p>
          <small class="muted">
            Cocok: durasi dan anggaran memenuhi batas${interest ? `; minat ${esc(interest)}` : ''}.
          </small>
        </div>
      `,
    )
    .join('');
}

export function initPackages() {
  document
    .getElementById('getRecommendations')
    ?.addEventListener('click', renderPackageRecommendations);
}
