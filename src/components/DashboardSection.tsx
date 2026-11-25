import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  CATEGORIES,
  DASH_PIN,
  REGIONS,
  compressImageFile,
  rupiah,
  safeUrl,
} from '../data/seed';
import type {
  DashboardTab,
  Destination,
  FoodItem,
  PackageItem,
  StayItem,
} from '../types/aceh';

interface DashboardSectionProps {
  destinations: Destination[];
  foods: FoodItem[];
  stays: StayItem[];
  packages: PackageItem[];
  onSaveDestination: (item: Destination, isEdit: boolean) => void;
  onSaveFood: (item: FoodItem, isEdit: boolean) => void;
  onSaveStay: (item: StayItem, isEdit: boolean) => void;
  onSavePackage: (item: PackageItem, isEdit: boolean) => void;
  onDeleteRecord: (type: DashboardTab, id: string) => void;
  onResetAll: () => void;
}

const TAB_LABELS: Record<DashboardTab, string> = {
  destinasi: 'Destinasi',
  kuliner: 'Kuliner',
  akomodasi: 'Akomodasi',
  paket: 'Paket wisata',
};

export function DashboardSection({
  destinations,
  foods,
  stays,
  packages,
  onSaveDestination,
  onSaveFood,
  onSaveStay,
  onSavePackage,
  onDeleteRecord,
  onResetAll,
}: DashboardSectionProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('destinasi');
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Modal edit/create state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageData, setImageData] = useState<string | undefined>(undefined);

  // Form fields (unified controlled fields)
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Religi');
  const [wilayah, setWilayah] = useState<string>(REGIONS[0]);
  const [deskripsi, setDeskripsi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [estimasiBiaya, setEstimasiBiaya] = useState(0);
  const [fasilitas, setFasilitas] = useState('');
  const [fasilitasIbadah, setFasilitasIbadah] = useState('');
  const [unggulan, setUnggulan] = useState(false);
  const [statusHalal, setStatusHalal] = useState('Belum diverifikasi');
  const [sumberVerifikasi, setSumberVerifikasi] = useState('');
  const [kontak, setKontak] = useState('');
  const [durasi, setDurasi] = useState(2);
  const [daftarDestinasi, setDaftarDestinasi] = useState('');

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = pinInput.trim();
    if (!trimmed) {
      setPinMsg('PIN belum diisi.');
      return;
    }
    if (trimmed !== DASH_PIN) {
      setPinMsg('PIN salah. Coba lagi.');
      setPinInput('');
      return;
    }
    setUnlocked(true);
    setPinMsg('');
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormError('');
    setNama('');
    setKategori(activeTab === 'kuliner' ? 'Kuliner' : CATEGORIES[0]);
    setWilayah(REGIONS[0]);
    setDeskripsi('');
    setAlamat('');
    setMapsUrl('');
    setEstimasiBiaya(0);
    setFasilitas('');
    setFasilitasIbadah('');
    setUnggulan(false);
    setStatusHalal('Belum diverifikasi');
    setSumberVerifikasi('');
    setKontak('6281230000000');
    setDurasi(2);
    setDaftarDestinasi('');
    setImageData(undefined);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (id: string) => {
    setEditingId(id);
    setFormError('');
    if (activeTab === 'destinasi') {
      const item = destinations.find((d) => d.id === id);
      if (!item) return;
      setNama(item.nama);
      setKategori(item.kategori);
      setWilayah(item.wilayah);
      setDeskripsi(item.deskripsi);
      setAlamat(item.alamat);
      setMapsUrl(item.mapsUrl);
      setEstimasiBiaya(item.estimasiBiaya);
      setFasilitas(item.fasilitas.join(', '));
      setFasilitasIbadah(item.fasilitasIbadah.join(', '));
      setUnggulan(item.unggulan);
      setImageData(item.imageData);
      setImagePreview(item.imageData || item.imageUrl || '');
    } else if (activeTab === 'kuliner') {
      const item = foods.find((f) => f.id === id);
      if (!item) return;
      setNama(item.nama);
      setKategori(item.kategori);
      setWilayah(item.wilayah);
      setEstimasiBiaya(item.harga);
      setStatusHalal(item.statusSertifikasiHalal);
      setSumberVerifikasi(item.sumberVerifikasi);
      setKontak(item.kontak);
      setImageData(item.imageData);
      setImagePreview(item.imageData || item.imageUrl || '');
    } else if (activeTab === 'akomodasi') {
      const item = stays.find((s) => s.id === id);
      if (!item) return;
      setNama(item.nama);
      setWilayah(item.wilayah);
      setEstimasiBiaya(item.hargaPerMalam);
      setFasilitas(item.fasilitas.join(', '));
      setFasilitasIbadah(item.fasilitasRamahMuslim.join(', '));
      setKontak(item.kontak);
      setImageData(item.imageData);
      setImagePreview(item.imageData || item.imageUrl || '');
    } else {
      const item = packages.find((p) => p.id === id);
      if (!item) return;
      setNama(item.nama);
      setDurasi(item.durasi);
      setDaftarDestinasi(item.daftarDestinasi.join(', '));
      setEstimasiBiaya(item.estimasiBiaya);
      setDeskripsi(item.deskripsi);
      setImageData(undefined);
      setImagePreview('');
    }
    setModalOpen(true);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }
    try {
      const compressed = await compressImageFile(file);
      setImageData(compressed);
      setImagePreview(compressed);
      setFormError('');
    } catch {
      setFormError('Gambar gagal diproses. Coba file gambar lain.');
    }
  };

  const handleSaveSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setFormError('Nama wajib diisi.');
      return;
    }
    const splitCsv = (val: string) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const isEdit = Boolean(editingId);
    const newId = editingId || `${activeTab.slice(0, 1)}${Date.now()}`;

    if (activeTab === 'destinasi') {
      const existing = destinations.find((d) => d.id === editingId);
      onSaveDestination(
        {
          id: newId,
          nama: nama.trim(),
          kategori,
          wilayah,
          deskripsi: deskripsi.trim(),
          alamat: alamat.trim(),
          mapsUrl: safeUrl(mapsUrl),
          estimasiBiaya: Math.max(0, estimasiBiaya || 0),
          fasilitas: splitCsv(fasilitas),
          fasilitasIbadah: splitCsv(fasilitasIbadah),
          unggulan,
          imageUrl: existing?.imageUrl || '',
          imageData,
        },
        isEdit,
      );
    } else if (activeTab === 'kuliner') {
      const existing = foods.find((f) => f.id === editingId);
      onSaveFood(
        {
          id: newId,
          nama: nama.trim(),
          kategori: kategori.trim() || 'Kuliner',
          wilayah,
          harga: Math.max(0, estimasiBiaya || 0),
          statusSertifikasiHalal: statusHalal,
          sumberVerifikasi: sumberVerifikasi.trim(),
          kontak: kontak.trim(),
          imageUrl: existing?.imageUrl || '',
          imageData,
        },
        isEdit,
      );
    } else if (activeTab === 'akomodasi') {
      const existing = stays.find((s) => s.id === editingId);
      onSaveStay(
        {
          id: newId,
          nama: nama.trim(),
          wilayah,
          hargaPerMalam: Math.max(0, estimasiBiaya || 0),
          fasilitas: splitCsv(fasilitas),
          fasilitasRamahMuslim: splitCsv(fasilitasIbadah),
          kontak: kontak.trim(),
          imageUrl: existing?.imageUrl || '',
          imageData,
        },
        isEdit,
      );
    } else {
      onSavePackage(
        {
          id: newId,
          nama: nama.trim(),
          durasi: Math.max(1, durasi || 1),
          daftarDestinasi: splitCsv(daftarDestinasi),
          estimasiBiaya: Math.max(0, estimasiBiaya || 0),
          deskripsi: deskripsi.trim(),
        },
        isEdit,
      );
    }

    setModalOpen(false);
  };

  return (
    <section
      id="dashboard"
      className="scroll-mt-20 bg-white py-14 md:py-[76px]"
    >
      <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              LOCAL DEMO CMS
            </p>
            <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
              Dashboard pengelola
            </h2>
            <p className="max-w-[500px] text-[13px] text-[#687e89]">
              Area pengelola dilindungi PIN demo. Data tersimpan lokal di
              browser ini.
            </p>
          </div>

          {unlocked && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUnlocked(false);
                  setPinInput('');
                }}
                className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-3 py-1.5 text-xs font-bold text-[#123b52] hover:border-[#087f8c]"
              >
                Kunci dashboard
              </button>
              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setConfirmReset(false);
                    }}
                    className="cursor-pointer rounded-xl bg-[#a6444b] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Ya, reset demo
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-3 py-1.5 text-xs font-bold text-[#123b52]"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-3 py-1.5 text-xs font-bold text-[#123b52] hover:border-[#087f8c]"
                >
                  Reset data demo
                </button>
              )}
            </div>
          )}
        </div>

        {!unlocked ? (
          <div className="mx-auto mt-2 max-w-[430px] rounded-[14px] border border-[#dce7eb] bg-white p-7 shadow-[0_18px_46px_#123b5218]">
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              AREA PENGELOLA
            </p>
            <h3 className="mt-2 mb-1.5 text-[26px] font-extrabold tracking-[-0.8px] text-[#123b52]">
              Masuk ke dashboard
            </h3>
            <p className="mb-4 text-[13px] text-[#687e89]">
              Masukkan PIN untuk mengelola destinasi, kuliner, akomodasi, dan
              paket wisata.
            </p>
            <form onSubmit={handlePinSubmit} noValidate>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="dashPin"
                  className="text-[11px] font-bold text-[#61736c]"
                >
                  PIN pengelola
                </label>
                <input
                  id="dashPin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  maxLength={12}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2.5 text-center text-lg tracking-[0.35em] outline-none focus:border-[#35a9ad]"
                />
              </div>
              <div
                role="status"
                aria-live="polite"
                className="my-2.5 min-h-[18px] text-xs font-medium text-[#a6444b]"
              >
                {pinMsg}
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-[#087f8c] px-4 py-2.5 text-sm font-bold text-white shadow-[0_5px_14px_#087f8c20] transition hover:bg-[#066c78]"
              >
                Buka dashboard
              </button>
            </form>
            <p className="mt-3.5 text-[11px] text-[#687e89]">
              PIN demo: 1234 · Proteksi ini hanya simulasi di browser, bukan
              keamanan sungguhan.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <aside className="flex gap-1.5 self-start overflow-auto rounded-xl bg-[#123b52] p-4 text-[#e7f5ef] md:flex-col">
              {(Object.keys(TAB_LABELS) as DashboardTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setPendingDeleteId(null);
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? 'bg-white/15 font-bold text-white'
                      : 'text-[#d8eae2] hover:bg-white/10'
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </aside>

            <div className="min-w-0 rounded-xl border border-[#dce7eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-extrabold text-[#123b52]">
                  Kelola {TAB_LABELS[activeTab]}
                </h3>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="cursor-pointer rounded-xl bg-[#087f8c] px-3 py-2 text-xs font-bold text-white hover:bg-[#066c78]"
                >
                  ＋ Tambah data
                </button>
              </div>

              <div className="overflow-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f7faf7] text-[#64766e]">
                      {activeTab === 'destinasi' && (
                        <>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Nama
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Wilayah
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Kategori
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Biaya
                          </th>
                        </>
                      )}
                      {activeTab === 'kuliner' && (
                        <>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Nama
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Wilayah
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Status halal
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Harga
                          </th>
                        </>
                      )}
                      {activeTab === 'akomodasi' && (
                        <>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Nama
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Wilayah
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Harga/malam
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Fasilitas
                          </th>
                        </>
                      )}
                      {activeTab === 'paket' && (
                        <>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Nama
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Durasi
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Estimasi
                          </th>
                          <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                            Destinasi
                          </th>
                        </>
                      )}
                      <th className="border-b border-[#dce7eb] p-2.5 text-left whitespace-nowrap">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'destinasi'
                      ? destinations.map((d) => ({
                          id: d.id,
                          cols: [
                            d.nama,
                            d.wilayah,
                            d.kategori,
                            rupiah(d.estimasiBiaya),
                          ],
                        }))
                      : activeTab === 'kuliner'
                        ? foods.map((f) => ({
                            id: f.id,
                            cols: [
                              f.nama,
                              f.wilayah,
                              f.statusSertifikasiHalal,
                              rupiah(f.harga),
                            ],
                          }))
                        : activeTab === 'akomodasi'
                          ? stays.map((s) => ({
                              id: s.id,
                              cols: [
                                s.nama,
                                s.wilayah,
                                rupiah(s.hargaPerMalam),
                                s.fasilitas.join(', '),
                              ],
                            }))
                          : packages.map((p) => ({
                              id: p.id,
                              cols: [
                                p.nama,
                                `${p.durasi} hari`,
                                rupiah(p.estimasiBiaya),
                                `${p.daftarDestinasi.length} tempat`,
                              ],
                            }))
                    ).map((row) => (
                      <tr key={row.id}>
                        {row.cols.map((val, i) => (
                          <td
                            key={i}
                            className="border-b border-[#dce7eb] p-2.5 whitespace-nowrap tabular-nums"
                          >
                            {val}
                          </td>
                        ))}
                        <td className="border-b border-[#dce7eb] p-2.5 whitespace-nowrap">
                          {pendingDeleteId === row.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteRecord(activeTab, row.id);
                                  setPendingDeleteId(null);
                                }}
                                className="cursor-pointer rounded-lg bg-[#a6444b] px-2.5 py-1 text-[11px] font-bold text-white"
                              >
                                Hapus
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(null)}
                                className="cursor-pointer rounded-lg border border-[#d5e2e7] bg-white px-2.5 py-1 text-[11px] font-bold text-[#123b52]"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(row.id)}
                                className="cursor-pointer rounded-lg border border-[#d5e2e7] bg-white px-2.5 py-1 text-[11px] font-bold text-[#123b52] hover:border-[#087f8c]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(row.id)}
                                className="cursor-pointer rounded-lg bg-[#a6444b] px-2.5 py-1 text-[11px] font-bold text-white"
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[11px] text-[#687e89]">
                Perubahan disimpan pada localStorage browser. Jangan masukkan
                data pribadi atau data usaha nyata tanpa izin.
              </p>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          className="fixed inset-0 z-50 grid place-items-center bg-[#102d26]/65 p-4 backdrop-blur-xs"
        >
          <div className="max-h-[90vh] w-full max-w-[600px] overflow-auto rounded-[14px] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#e4ecef] pb-3">
              <h3 className="text-2xl font-extrabold text-[#123b52]">
                {editingId ? 'Edit ' : 'Tambah '}
                {TAB_LABELS[activeTab]}
              </h3>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setModalOpen(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[#dce7eb] bg-white text-lg text-[#087f8c]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveSubmit}>
              <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#61736c]">
                    {activeTab === 'paket' ? 'Nama paket' : 'Nama'}
                  </label>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                  />
                </div>

                {activeTab === 'destinasi' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Kategori
                      </label>
                      <select
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Wilayah
                      </label>
                      <select
                        value={wilayah}
                        onChange={(e) => setWilayah(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      >
                        {REGIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Estimasi biaya (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={estimasiBiaya}
                        onChange={(e) =>
                          setEstimasiBiaya(Number(e.target.value) || 0)
                        }
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Deskripsi
                      </label>
                      <textarea
                        rows={3}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Alamat
                      </label>
                      <input
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Google Maps URL
                      </label>
                      <input
                        type="url"
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Fasilitas (pisahkan koma)
                      </label>
                      <input
                        value={fasilitas}
                        onChange={(e) => setFasilitas(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Fasilitas ibadah (pisahkan koma)
                      </label>
                      <input
                        value={fasilitasIbadah}
                        onChange={(e) => setFasilitasIbadah(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#183342] sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={unggulan}
                        onChange={(e) => setUnggulan(e.target.checked)}
                      />
                      Destinasi unggulan?
                    </label>
                  </>
                )}

                {activeTab === 'kuliner' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Kategori
                      </label>
                      <input
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Wilayah
                      </label>
                      <select
                        value={wilayah}
                        onChange={(e) => setWilayah(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      >
                        {REGIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={estimasiBiaya}
                        onChange={(e) =>
                          setEstimasiBiaya(Number(e.target.value) || 0)
                        }
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Status sertifikasi halal
                      </label>
                      <select
                        value={statusHalal}
                        onChange={(e) => setStatusHalal(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      >
                        <option>Belum diverifikasi</option>
                        <option>Tidak diketahui</option>
                        <option>Terverifikasi (sumber resmi dicantumkan)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Sumber verifikasi
                      </label>
                      <input
                        value={sumberVerifikasi}
                        onChange={(e) => setSumberVerifikasi(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Kontak demo
                      </label>
                      <input
                        value={kontak}
                        onChange={(e) => setKontak(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'akomodasi' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Wilayah
                      </label>
                      <select
                        value={wilayah}
                        onChange={(e) => setWilayah(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      >
                        {REGIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Harga per malam (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={estimasiBiaya}
                        onChange={(e) =>
                          setEstimasiBiaya(Number(e.target.value) || 0)
                        }
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Fasilitas (pisahkan koma)
                      </label>
                      <input
                        value={fasilitas}
                        onChange={(e) => setFasilitas(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Fasilitas ramah Muslim (pisahkan koma)
                      </label>
                      <input
                        value={fasilitasIbadah}
                        onChange={(e) => setFasilitasIbadah(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Kontak demo
                      </label>
                      <input
                        value={kontak}
                        onChange={(e) => setKontak(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'paket' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Durasi (hari)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={durasi}
                        onChange={(e) => setDurasi(Number(e.target.value) || 1)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        ID destinasi (pisahkan koma)
                      </label>
                      <input
                        value={daftarDestinasi}
                        onChange={(e) => setDaftarDestinasi(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Estimasi biaya (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={estimasiBiaya}
                        onChange={(e) =>
                          setEstimasiBiaya(Number(e.target.value) || 0)
                        }
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-[#61736c]">
                        Deskripsi
                      </label>
                      <textarea
                        rows={3}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        className="rounded-[9px] border border-[#d7e4e8] px-3 py-2 text-sm outline-none focus:border-[#35a9ad]"
                      />
                    </div>
                  </>
                )}
              </div>

              {activeTab !== 'paket' && (
                <div className="mb-4 flex flex-col gap-1.5">
                  <label
                    htmlFor="recordImage"
                    className="text-[11px] font-bold text-[#61736c]"
                  >
                    Foto destinasi, kuliner, atau akomodasi
                  </label>
                  <input
                    id="recordImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-[#687e89]"
                  />
                  <span className="text-[10px] leading-snug text-[#687e89]">
                    Pilih JPG, PNG, atau WEBP. Gambar akan diperkecil otomatis
                    dan disimpan di browser ini.
                  </span>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Pratinjau foto"
                      className="mt-2 max-h-[190px] w-full rounded-xl border border-[#dce7eb] object-cover"
                    />
                  )}
                </div>
              )}

              {formError && (
                <p className="mb-3 text-xs font-semibold text-[#a6444b]">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-[#d5e2e7] bg-white px-4 py-2 text-xs font-bold text-[#123b52]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-[#087f8c] px-4 py-2 text-xs font-bold text-white hover:bg-[#066c78]"
                >
                  Simpan data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
