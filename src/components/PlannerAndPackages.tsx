import { useMemo, useState } from 'react';
import { rupiah } from '../data/seed';
import type {
  Destination,
  FavoriteItem,
  FoodItem,
  ItineraryTrip,
  PackageItem,
  TripActivity,
} from '../types/aceh';

interface PlannerAndPackagesProps {
  destinations: Destination[];
  foods: FoodItem[];
  packages: PackageItem[];
  favorites: FavoriteItem[];
  onSaveTrip: (trip: ItineraryTrip) => void;
  onToggleFav: (id: string, type?: 'destinasi' | 'kuliner') => void;
  onClearFav: () => void;
  onShowDetail: (dest: Destination) => void;
}

export function PlannerAndPackages({
  destinations,
  foods,
  packages,
  favorites,
  onSaveTrip,
  onToggleFav,
  onClearFav,
  onShowDetail,
}: PlannerAndPackagesProps) {
  const [tripName, setTripName] = useState('Jelajah Aceh');
  const [tripDate, setTripDate] = useState('');
  const [tripDays, setTripDays] = useState(3);
  const [travellers, setTravellers] = useState(2);
  const [selectedDestId, setSelectedDestId] = useState(
    destinations[0]?.id || '',
  );
  const [selectedDay, setSelectedDay] = useState(1);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [savedNotice, setSavedNotice] = useState('');

  const [mealCost, setMealCost] = useState(100000);
  const [stayCost, setStayCost] = useState(350000);
  const [transportCost, setTransportCost] = useState(500000);
  const [extraCost, setExtraCost] = useState(150000);

  const [interest, setInterest] = useState('');
  const [packageDays, setPackageDays] = useState(3);
  const [packageBudget, setPackageBudget] = useState(2500000);
  const [hasSearchedPackages, setHasSearchedPackages] = useState(false);
  const [matchedPackages, setMatchedPackages] = useState<PackageItem[]>([]);
  const [confirmClearFav, setConfirmClearFav] = useState(false);

  const destMap = useMemo(
    () => new Map(destinations.map((d) => [d.id, d])),
    [destinations],
  );

  const activeDestId =
    selectedDestId && destMap.has(selectedDestId)
      ? selectedDestId
      : destinations[0]?.id || '';
  const activeDay = Math.min(selectedDay, tripDays);

  const budgetBreakdown = useMemo(() => {
    const people = Math.max(1, travellers || 1);
    const activitySum =
      activities.reduce(
        (sum, a) => sum + (destMap.get(a.destinasiId)?.estimasiBiaya || 0),
        0,
      ) * people;

    const parts: Array<[string, number]> = [
      ['Makan', Math.max(0, mealCost) * people * tripDays],
      ['Akomodasi', Math.max(0, stayCost) * Math.max(0, tripDays - 1)],
      ['Transportasi', Math.max(0, transportCost)],
      ['Aktivitas destinasi', activitySum],
      ['Biaya tambahan', Math.max(0, extraCost)],
    ];
    const total = parts.reduce((acc, [, v]) => acc + v, 0);
    return { parts, total };
  }, [
    activities,
    destMap,
    extraCost,
    mealCost,
    stayCost,
    transportCost,
    travellers,
    tripDays,
  ]);

  const handleAddActivity = () => {
    if (!activeDestId) return;
    setActivities((prev) => [
      ...prev,
      {
        key: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        hari: activeDay,
        destinasiId: activeDestId,
        catatan: '',
      },
    ]);
  };

  const handleSaveTrip = () => {
    onSaveTrip({
      id: `trip-${Date.now()}`,
      namaPerjalanan: tripName.trim() || 'Perjalanan Aceh',
      tanggalMulai: tripDate,
      jumlahHari: tripDays,
      jumlahWisatawan: Math.max(1, travellers || 1),
      daftarAktivitas: activities,
      totalAnggaran: budgetBreakdown.total,
    });
    setSavedNotice('Tersimpan di browser ✓');
    window.setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleFindPackages = () => {
    const filtered = packages.filter(
      (p) =>
        p.durasi <= packageDays &&
        p.estimasiBiaya <= (packageBudget || 0) &&
        (!interest ||
          p.daftarDestinasi.some(
            (id) => destMap.get(id)?.kategori === interest,
          )),
    );
    setMatchedPackages(filtered);
    setHasSearchedPackages(true);
  };

  const resolvedFavorites = useMemo(
    () =>
      favorites
        .map((f) => ({
          fav: f,
          dest:
            f.tipeItem === 'destinasi' ? destMap.get(f.itemId) : undefined,
          food:
            f.tipeItem === 'kuliner'
              ? foods.find((item) => item.id === f.itemId)
              : undefined,
        }))
        .filter((x) => Boolean(x.dest || x.food)),
    [destMap, favorites, foods],
  );

  return (
    <>
      <section id="planner" className="scroll-mt-20 py-14 md:py-[76px]">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-6">
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              PLAN YOUR JOURNEY
            </p>
            <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
              Rancang perjalananmu
            </h2>
            <p className="max-w-[500px] text-[13px] text-[#687e89]">
              Atur aktivitas per hari dan hitung anggaran awal. Semua nilai
              biaya adalah simulasi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[#dce7eb] bg-white p-5 shadow-[0_8px_25px_#123b5208]">
              <h3 className="mb-4 text-[22px] font-extrabold text-[#123b52]">
                ✦ Itinerary planner
              </h3>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="tripName"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Nama perjalanan
                  </label>
                  <input
                    id="tripName"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="tripDate"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Tanggal mulai
                  </label>
                  <input
                    id="tripDate"
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="tripDays"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Jumlah hari (1–5)
                  </label>
                  <select
                    id="tripDays"
                    value={tripDays}
                    onChange={(e) => setTripDays(Number(e.target.value))}
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="travellers"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Jumlah wisatawan
                  </label>
                  <input
                    id="travellers"
                    type="number"
                    min={1}
                    value={travellers}
                    onChange={(e) =>
                      setTravellers(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <label
                  htmlFor="activityDest"
                  className="text-[11px] font-bold text-[#61736c]"
                >
                  Tambahkan destinasi ke hari
                </label>
                <div className="flex gap-2">
                  <select
                    id="activityDest"
                    value={activeDestId}
                    onChange={(e) => setSelectedDestId(e.target.value)}
                    className="min-w-0 flex-1 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Pilih hari"
                    value={activeDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-24 rounded-[9px] border border-[#d7e4e8] bg-white px-2.5 py-2 text-sm outline-none focus:border-[#35a9ad]"
                  >
                    {Array.from({ length: tripDays }, (_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        Hari {idx + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    className="cursor-pointer rounded-xl bg-[#087f8c] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#066c78]"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-2.5">
                {Array.from({ length: tripDays }, (_, idx) => {
                  const day = idx + 1;
                  const dayActs = activities.filter((a) => a.hari === day);
                  return (
                    <div
                      key={day}
                      className="rounded-[9px] border border-[#dce7eb] bg-[#f3f8f8] p-3"
                    >
                      <h4 className="mb-1.5 text-[13px] font-bold text-[#123b52]">
                        Hari {day}
                      </h4>
                      {dayActs.length > 0 ? (
                        dayActs.map((act) => (
                          <div
                            key={act.key}
                            className="flex items-center justify-between gap-2 border-b border-[#dce7eb] py-2 text-xs last:border-0"
                          >
                            <span>
                              {destMap.get(act.destinasiId)?.nama || 'Destinasi'}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setActivities((prev) =>
                                  prev.filter((item) => item.key !== act.key),
                                )
                              }
                              className="cursor-pointer rounded-lg border border-[#d5e2e7] bg-white px-2.5 py-1 text-[11px] font-bold text-[#123b52] hover:border-[#087f8c]"
                            >
                              Hapus
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-[11px] text-[#687e89]">
                          Belum ada aktivitas.
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveTrip}
                  className="cursor-pointer rounded-xl bg-[#e1f1f1] px-4 py-2.5 text-xs font-bold text-[#086c76] transition hover:bg-[#d2eaea]"
                >
                  Simpan itinerary
                </button>
                {savedNotice && (
                  <span className="text-xs font-semibold text-[#176b50]">
                    {savedNotice}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#dce7eb] bg-white p-5 shadow-[0_8px_25px_#123b5208]">
              <h3 className="mb-4 text-[22px] font-extrabold text-[#123b52]">
                ◈ Kalkulator anggaran
              </h3>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="mealCost"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Biaya makan / orang / hari (Rp)
                  </label>
                  <input
                    id="mealCost"
                    type="number"
                    min={0}
                    value={mealCost}
                    onChange={(e) =>
                      setMealCost(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm tabular-nums outline-none focus:border-[#35a9ad]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="stayCost"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Akomodasi / malam (Rp)
                  </label>
                  <input
                    id="stayCost"
                    type="number"
                    min={0}
                    value={stayCost}
                    onChange={(e) =>
                      setStayCost(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm tabular-nums outline-none focus:border-[#35a9ad]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="transportCost"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Transportasi total (Rp)
                  </label>
                  <input
                    id="transportCost"
                    type="number"
                    min={0}
                    value={transportCost}
                    onChange={(e) =>
                      setTransportCost(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm tabular-nums outline-none focus:border-[#35a9ad]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="extraCost"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Biaya aktivitas tambahan (Rp)
                  </label>
                  <input
                    id="extraCost"
                    type="number"
                    min={0}
                    value={extraCost}
                    onChange={(e) =>
                      setExtraCost(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm tabular-nums outline-none focus:border-[#35a9ad]"
                  />
                </div>
              </div>

              <div className="my-3.5 rounded-xl border border-[#f1dfb8] bg-[#fff7e7] p-3 text-[11px] text-[#76531b]">
                Estimasi kasar untuk perencanaan. Harga aktual, tiket,
                transportasi, dan ketersediaan harus dikonfirmasi langsung.
              </div>

              <div className="text-[11px] font-semibold text-[#687e89]">
                TOTAL ESTIMASI PERJALANAN
              </div>
              <div className="my-1.5 text-[34px] font-extrabold text-[#087f8c] tabular-nums">
                {rupiah(budgetBreakdown.total)}
              </div>

              <div>
                {budgetBreakdown.parts.map(([label, amount]) => (
                  <div
                    key={label}
                    className="flex justify-between border-b border-[#dce7eb] py-2 text-xs last:border-0"
                  >
                    <span>{label}</span>
                    <b className="tabular-nums">{rupiah(amount)}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="paket" className="bg-white py-14 md:py-[76px]">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-6">
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              CURATED IDEAS
            </p>
            <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
              Rekomendasi paket wisata
            </h2>
            <p className="max-w-[500px] text-[13px] text-[#687e89]">
              Pilih minat, durasi, dan batas anggaran untuk menemukan paket yang
              sesuai aturan sederhana.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#dce7eb] bg-white p-5 shadow-[0_8px_25px_#123b5208]">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="interest"
                  className="text-[11px] font-bold text-[#61736c]"
                >
                  Minat perjalanan
                </label>
                <select
                  id="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                >
                  <option value="">Semua minat</option>
                  <option>Alam</option>
                  <option>Bahari</option>
                  <option>Sejarah</option>
                  <option>Religi</option>
                  <option>Budaya</option>
                </select>
              </div>

              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="packageDays"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Durasi maksimal (hari)
                  </label>
                  <select
                    id="packageDays"
                    value={packageDays}
                    onChange={(e) => setPackageDays(Number(e.target.value))}
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="packageBudget"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Anggaran maksimal (Rp)
                  </label>
                  <input
                    id="packageBudget"
                    type="number"
                    min={0}
                    value={packageBudget}
                    onChange={(e) =>
                      setPackageBudget(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2 text-sm tabular-nums outline-none focus:border-[#35a9ad]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleFindPackages}
                className="mt-4 cursor-pointer rounded-xl bg-[#087f8c] px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_14px_#087f8c20] transition hover:bg-[#066c78]"
              >
                Temukan paket
              </button>
            </div>

            <div className="rounded-xl border border-[#dce7eb] bg-white p-5 shadow-[0_8px_25px_#123b5208]">
              {!hasSearchedPackages ? (
                <p className="text-sm text-[#687e89]">
                  Pilih kriteria lalu tekan “Temukan paket”.
                </p>
              ) : matchedPackages.length > 0 ? (
                matchedPackages.map((p) => (
                  <div
                    key={p.id}
                    className="border-b border-[#dce7eb] py-3 first:pt-0 last:border-0 last:pb-0"
                  >
                    <span className="rounded-md bg-[#e2f2f1] px-2 py-0.5 text-[11px] font-bold text-[#08737c]">
                      {p.durasi} hari
                    </span>
                    <h3 className="my-2 text-xl font-extrabold text-[#123b52]">
                      {p.nama}
                    </h3>
                    <p className="mb-1 text-xs text-[#687e89]">{p.deskripsi}</p>
                    <b className="block text-sm text-[#087f8c] tabular-nums">
                      {rupiah(p.estimasiBiaya)} · simulasi
                    </b>
                    <p className="mt-1 text-[11px] text-[#687e89]">
                      Destinasi:{' '}
                      {p.daftarDestinasi
                        .map((id) => destMap.get(id)?.nama || id)
                        .join(', ')}
                    </p>
                    <small className="text-[11px] text-[#687e89]">
                      Cocok: durasi dan anggaran memenuhi batas
                      {interest ? `; minat ${interest}` : ''}.
                    </small>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#cbd9d0] p-6 text-center text-xs text-[#687e89]">
                  Belum ada paket yang cocok. Coba tambah anggaran, durasi, atau
                  pilih semua minat.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="favorit" className="scroll-mt-20 py-14 md:py-[76px]">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
                YOUR SHORTLIST
              </p>
              <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
                Destinasi favorit
              </h2>
              <p className="max-w-[500px] text-[13px] text-[#687e89]">
                Daftar favorit tersimpan di browser ini.
              </p>
            </div>

            {favorites.length > 0 &&
              (confirmClearFav ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearFav();
                      setConfirmClearFav(false);
                    }}
                    className="cursor-pointer rounded-xl bg-[#a6444b] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Ya, hapus semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearFav(false)}
                    className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-3 py-1.5 text-xs font-bold text-[#123b52]"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearFav(true)}
                  className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-3 py-1.5 text-xs font-bold text-[#123b52] hover:border-[#087f8c]"
                >
                  Hapus semua
                </button>
              ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resolvedFavorites.length > 0 ? (
              resolvedFavorites.map(({ fav, dest, food }) => {
                const item = dest || food;
                if (!item) return null;
                return (
                  <div
                    key={fav.id}
                    className="rounded-xl border border-[#dce7eb] bg-white p-[18px] shadow-[0_8px_25px_#123b5208]"
                  >
                    <span className="rounded-md bg-[#e2f2f1] px-2 py-0.5 text-[11px] font-bold text-[#08737c]">
                      {fav.tipeItem}
                    </span>
                    <h3 className="my-2 text-xl font-extrabold text-[#183342]">
                      {item.nama}
                    </h3>
                    <p className="mb-3 text-xs text-[#687e89]">
                      {item.wilayah}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleFav(item.id, fav.tipeItem)}
                        className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-3 py-1.5 text-xs font-bold text-[#123b52] hover:border-[#087f8c]"
                      >
                        Hapus favorit
                      </button>
                      {dest && (
                        <button
                          type="button"
                          onClick={() => onShowDetail(dest)}
                          className="cursor-pointer rounded-xl bg-[#087f8c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#066c78]"
                        >
                          Detail
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-[#cbd9d0] bg-white p-9 text-center text-sm text-[#687e89]">
                Belum ada favorit. Tekan ikon ♡ pada destinasi atau kuliner.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
