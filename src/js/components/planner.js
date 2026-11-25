import {
  destById,
  notify,
  persistCatalog,
  state,
} from '../state/store.js';
import { clone, esc, rupiah } from '../utils/format.js';
import { showToast } from './toast.js';

export function calculateBudget(updateDom = true) {
  const days = Number(document.getElementById('tripDays')?.value || 3);
  const people = Math.max(
    1,
    Number(document.getElementById('travellers')?.value || 1),
  );
  const meal = Math.max(
    0,
    Number(document.getElementById('mealCost')?.value || 0),
  );
  const stay = Math.max(
    0,
    Number(document.getElementById('stayCost')?.value || 0),
  );
  const transport = Math.max(
    0,
    Number(document.getElementById('transportCost')?.value || 0),
  );
  const extra = Math.max(
    0,
    Number(document.getElementById('extraCost')?.value || 0),
  );

  const activity =
    state.tripActivities.reduce(
      (sum, a) => sum + (destById(a.destinasiId)?.estimasiBiaya || 0),
      0,
    ) * people;

  const parts = [
    ['Makan', meal * people * days],
    ['Akomodasi', stay * Math.max(0, days - 1)],
    ['Transportasi', transport],
    ['Aktivitas destinasi', activity],
    ['Biaya tambahan', extra],
  ];

  const total = parts.reduce((sum, [, value]) => sum + value, 0);

  if (updateDom) {
    const totalEl = document.getElementById('budgetTotal');
    const breakdownEl = document.getElementById('budgetBreakdown');
    if (totalEl) totalEl.textContent = rupiah(total);
    if (breakdownEl) {
      breakdownEl.innerHTML = parts
        .map(
          ([label, amount]) => `
            <div class="budget-line">
              <span>${esc(label)}</span>
              <b class="tabular">${rupiah(amount)}</b>
            </div>
          `,
        )
        .join('');
    }
  }

  return total;
}

export function renderItinerary() {
  const days = Number(document.getElementById('tripDays')?.value || 3);
  const container = document.getElementById('itineraryList');
  if (!container) return;

  let html = '';
  for (let day = 1; day <= days; day++) {
    const acts = state.tripActivities.filter((a) => a.hari === day);
    html += `
      <div class="day-block">
        <h4>Hari ${day}</h4>
        ${
          acts.length
            ? acts
                .map(
                  (a) => `
                    <div class="activity">
                      <span>${esc(destById(a.destinasiId)?.nama || 'Destinasi')}</span>
                      <button
                        type="button"
                        class="btn ghost small"
                        data-action="remove-activity"
                        data-key="${esc(a.key)}"
                      >Hapus</button>
                    </div>
                  `,
                )
                .join('')
            : '<span class="muted" style="font-size: 11px;">Belum ada aktivitas.</span>'
        }
      </div>
    `;
  }

  container.innerHTML = html;
  calculateBudget(true);
}

export function renderSavedTrips() {
  const container = document.getElementById('savedTripsList');
  if (!container) return;

  if (!state.itineraries.length) {
    container.innerHTML =
      '<p class="muted" style="font-size: 12px; margin: 4px 0 0;">Belum ada rencana perjalanan tersimpan.</p>';
    return;
  }

  container.innerHTML = state.itineraries
    .map(
      (trip) => `
        <div class="saved-trip-item">
          <div>
            <strong>${esc(trip.namaPerjalanan)}</strong>
            <div class="muted" style="font-size: 11px;">
              ${trip.jumlahHari} hari · ${trip.jumlahWisatawan} wisatawan · ${trip.daftarAktivitas.length} aktivitas ·
              <span class="tabular">${rupiah(trip.totalAnggaran)}</span>
              ${trip.createdBy ? ` · ${esc(trip.createdBy)}` : ''}
            </div>
          </div>
          <div class="card-actions">
            <button type="button" class="btn secondary small" data-action="load-trip" data-id="${esc(trip.id)}">Muat</button>
            <button type="button" class="btn ghost small" data-action="delete-trip" data-id="${esc(trip.id)}">Hapus</button>
          </div>
        </div>
      `,
    )
    .join('');
}

export function updateDayOptions() {
  const days = Number(document.getElementById('tripDays')?.value || 3);
  const daySel = document.getElementById('activityDay');
  if (daySel) {
    const prev = Number(daySel.value || 1);
    daySel.innerHTML = Array.from(
      { length: days },
      (_, i) => `<option value="${i + 1}">Hari ${i + 1}</option>`,
    ).join('');
    daySel.value = String(Math.min(prev, days));
  }
  renderItinerary();
}

export function initPlanner() {
  document.getElementById('addActivity')?.addEventListener('click', () => {
    const destId = document.getElementById('activityDest')?.value;
    const day = Number(document.getElementById('activityDay')?.value || 1);
    if (!destId) return;

    state.tripActivities.push({
      key: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      hari: day,
      destinasiId: destId,
      catatan: '',
    });
    renderItinerary();
  });

  document.getElementById('itineraryList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="remove-activity"]');
    if (!btn) return;
    const key = btn.getAttribute('data-key');
    state.tripActivities = state.tripActivities.filter((a) => a.key !== key);
    renderItinerary();
  });

  document.getElementById('tripDays')?.addEventListener('change', updateDayOptions);

  document.getElementById('saveTrip')?.addEventListener('click', () => {
    const nameInput = document.getElementById('tripName');
    const dateInput = document.getElementById('tripDate');
    const daysInput = document.getElementById('tripDays');
    const travellersInput = document.getElementById('travellers');

    const trip = {
      id: 'trip-' + Date.now(),
      namaPerjalanan: nameInput?.value.trim() || 'Perjalanan Aceh',
      tanggalMulai: dateInput?.value || '',
      jumlahHari: Number(daysInput?.value || 3),
      jumlahWisatawan: Math.max(1, Number(travellersInput?.value || 1)),
      daftarAktivitas: clone(state.tripActivities),
      totalAnggaran: calculateBudget(false),
      createdBy: state.currentUser || null,
    };

    state.itineraries.push(trip);
    persistCatalog();
    notify('itineraries');

    const savedNote = document.getElementById('tripSaved');
    if (savedNote) {
      savedNote.textContent = 'Tersimpan di browser ✓';
      window.setTimeout(() => {
        savedNote.textContent = '';
      }, 3000);
    }
    showToast('Rencana perjalanan berhasil disimpan.', 'success');
  });

  document.getElementById('savedTripsList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if (!id) return;

    if (action === 'delete-trip') {
      state.itineraries = state.itineraries.filter((t) => t.id !== id);
      persistCatalog();
      notify('itineraries');
      showToast('Rencana tersimpan dihapus.');
    } else if (action === 'load-trip') {
      const trip = state.itineraries.find((t) => t.id === id);
      if (!trip) return;
      const nameInput = document.getElementById('tripName');
      const dateInput = document.getElementById('tripDate');
      const daysInput = document.getElementById('tripDays');
      const travellersInput = document.getElementById('travellers');
      if (nameInput) nameInput.value = trip.namaPerjalanan;
      if (dateInput) dateInput.value = trip.tanggalMulai || '';
      if (daysInput) daysInput.value = String(trip.jumlahHari);
      if (travellersInput) travellersInput.value = String(trip.jumlahWisatawan);
      state.tripActivities = clone(trip.daftarAktivitas || []);
      updateDayOptions();
      showToast(`Rencana "${trip.namaPerjalanan}" dimuat.`, 'success');
    }
  });

  document
    .getElementById('recalc')
    ?.addEventListener('click', () => calculateBudget(true));

  ['travellers', 'mealCost', 'stayCost', 'transportCost', 'extraCost', 'tripDays'].forEach(
    (id) => {
      document
        .getElementById(id)
        ?.addEventListener('input', () => calculateBudget(true));
    },
  );
}
