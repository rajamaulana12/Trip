import { clearFavorites, destById, state, toggleFav } from '../state/store.js';
import { esc } from '../utils/format.js';
import { showDestinationDetail } from './destinations.js';
import { showToast } from './toast.js';

let confirmingClear = false;

export function renderFavorites() {
  const container = document.getElementById('favoriteCards');
  const clearBtn = document.getElementById('clearFav');
  const confirmWrap = document.getElementById('clearFavConfirm');
  if (!container) return;

  const items = state.favorites
    .map((f) => ({
      f,
      item:
        f.tipeItem === 'destinasi'
          ? destById(f.itemId)
          : state.data.kuliner.find((x) => x.id === f.itemId),
    }))
    .filter((x) => Boolean(x.item));

  if (clearBtn && confirmWrap) {
    clearBtn.classList.toggle('hidden', items.length === 0 || confirmingClear);
    confirmWrap.classList.toggle('hidden', !confirmingClear || items.length === 0);
  }

  if (!items.length) {
    container.innerHTML =
      '<div class="empty">Belum ada favorit. Tekan ikon ♡ pada destinasi atau kuliner.</div>';
    return;
  }

  container.innerHTML = items
    .map(
      ({ f, item }) => `
        <article class="simple-card">
          <div class="meta">
            <span class="tag">${esc(f.tipeItem)}</span>
          </div>
          <h3>${esc(item.nama)}</h3>
          <p>${esc(item.wilayah)}</p>
          <div class="card-actions" style="margin-top: 10px;">
            <button
              type="button"
              class="btn ghost small"
              data-action="remove-fav"
              data-id="${esc(item.id)}"
              data-type="${esc(f.tipeItem)}"
            >Hapus favorit</button>
            ${
              f.tipeItem === 'destinasi'
                ? `<button type="button" class="btn small" data-action="detail" data-id="${esc(item.id)}">Detail</button>`
                : ''
            }
          </div>
        </article>
      `,
    )
    .join('');
}

export function initFavorites() {
  document.getElementById('favoriteCards')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    const type = btn.getAttribute('data-type') || 'destinasi';
    if (!id) return;

    if (action === 'remove-fav') {
      toggleFav(id, type);
    } else if (action === 'detail') {
      showDestinationDetail(id);
    }
  });

  document.getElementById('clearFav')?.addEventListener('click', () => {
    confirmingClear = true;
    renderFavorites();
  });

  document.getElementById('clearFavYes')?.addEventListener('click', () => {
    confirmingClear = false;
    clearFavorites();
    showToast('Semua favorit telah dihapus.');
  });

  document.getElementById('clearFavCancel')?.addEventListener('click', () => {
    confirmingClear = false;
    renderFavorites();
  });
}
