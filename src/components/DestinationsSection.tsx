import { useState } from 'react';
import { CATEGORIES, REGIONS, rupiah } from '../data/seed';
import type { Destination } from '../types/aceh';

interface DestinationsSectionProps {
  destinations: Destination[];
  isFav: (id: string, type?: 'destinasi' | 'kuliner') => boolean;
  onToggleFav: (id: string, type?: 'destinasi' | 'kuliner') => void;
  onShowDetail: (dest: Destination) => void;
}

function visualGradient(cat: string): string {
  switch (cat) {
    case 'Bahari':
      return 'bg-[linear-gradient(135deg,#9bd5d0,#167c8b)]';
    case 'Sejarah':
      return 'bg-[linear-gradient(135deg,#e6c985,#a66e34)]';
    case 'Religi':
      return 'bg-[linear-gradient(135deg,#b5a5d1,#574b81)]';
    case 'Budaya':
      return 'bg-[linear-gradient(135deg,#a9c99c,#2c6845)]';
    default:
      return 'bg-[linear-gradient(135deg,#63b7b1,#123b52)]';
  }
}

function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    Religi: '🕌',
    Alam: '🌿',
    Bahari: '🌊',
    Sejarah: '🏛️',
    Budaya: '🎭',
    Kuliner: '🍜',
  };
  return map[cat] || '✦';
}

export function DestinationsSection({
  destinations,
  isFav,
  onToggleFav,
  onShowDetail,
}: DestinationsSectionProps) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'cost'>('featured');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const q = search.toLowerCase().trim();
  const filtered = destinations
    .filter(
      (d) =>
        (!q ||
          `${d.nama} ${d.deskripsi} ${d.wilayah}`.toLowerCase().includes(q)) &&
        (!region || d.wilayah === region) &&
        (!category || d.kategori === category),
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.nama.localeCompare(b.nama);
      if (sortBy === 'cost') return a.estimasiBiaya - b.estimasiBiaya;
      return Number(b.unggulan) - Number(a.unggulan);
    });

  return (
    <section id="destinasi" className="scroll-mt-20 py-14 md:py-[76px]">
      <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              DISCOVER ACEH
            </p>
            <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
              Destinasi pilihan
            </h2>
            <p className="max-w-[500px] text-[13px] text-[#687e89]">
              Dari pesisir Sabang hingga dataran tinggi Gayo. Temukan tempat yang
              sesuai dengan cara perjalananmu.
            </p>
          </div>
          <span className="rounded-md bg-[#e2f2f1] px-2.5 py-1 text-[11px] font-bold text-[#08737c]">
            {filtered.length} destinasi
          </span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2.5 rounded-[14px] border border-[#dce7eb] bg-white p-3.5 shadow-[0_8px_24px_#123b5209] md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
            <label
              htmlFor="searchDest"
              className="text-[11px] font-bold text-[#61736c]"
            >
              Cari destinasi
            </label>
            <input
              id="searchDest"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kata kunci..."
              className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2.5 text-sm text-[#183342] outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="regionFilter"
              className="text-[11px] font-bold text-[#61736c]"
            >
              Wilayah
            </label>
            <select
              id="regionFilter"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2.5 text-sm text-[#183342] outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
            >
              <option value="">Semua wilayah</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="categoryFilter"
              className="text-[11px] font-bold text-[#61736c]"
            >
              Kategori
            </label>
            <select
              id="categoryFilter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2.5 text-sm text-[#183342] outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
            >
              <option value="">Semua kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sortDest"
              className="text-[11px] font-bold text-[#61736c]"
            >
              Urutkan
            </label>
            <select
              id="sortDest"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'featured' | 'name' | 'cost')
              }
              className="min-w-0 rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2.5 text-sm text-[#183342] outline-none focus:border-[#35a9ad] focus:ring-3 focus:ring-[#35a9ad]/15"
            >
              <option value="featured">Unggulan</option>
              <option value="name">Nama A–Z</option>
              <option value="cost">Biaya terendah</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((d) => {
              const photo = d.imageData || d.imageUrl;
              const showPhoto = Boolean(photo && !failedImages[d.id]);
              const fav = isFav(d.id, 'destinasi');

              return (
                <article
                  key={d.id}
                  className="overflow-hidden rounded-[10px] border border-[#dce7eb] bg-white shadow-[0_8px_25px_#123b520d] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_#123b5220]"
                >
                  <div
                    className={`relative flex h-[190px] items-end overflow-hidden p-4 text-white ${visualGradient(d.kategori)}`}
                  >
                    <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_30%,#102f43bb)]" />
                    {showPhoto ? (
                      <img
                        src={photo}
                        alt={d.nama}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [d.id]: true }))
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute top-4 right-5 text-[54px] drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]"
                      >
                        {categoryEmoji(d.kategori)}
                      </span>
                    )}
                    <span className="relative z-10 text-xl font-extrabold">
                      {d.wilayah}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6a7b74]">
                      <span className="rounded-md bg-[#e2f2f1] px-2 py-0.5 font-bold text-[#08737c]">
                        {d.kategori}
                      </span>
                      <span>{d.wilayah}</span>
                      {d.unggulan && <span>✦ Pilihan</span>}
                    </div>
                    <h3 className="mt-2.5 mb-1.5 text-xl font-extrabold tracking-[-0.4px] text-[#183b4d]">
                      {d.nama}
                    </h3>
                    <p className="mb-3.5 min-h-[38px] text-xs leading-relaxed text-[#687e89]">
                      {d.deskripsi}
                    </p>
                    <div className="flex items-center justify-between border-t border-[#eef1ed] pt-3 text-xs">
                      <span className="font-extrabold text-[#087f8c] tabular-nums">
                        {d.estimasiBiaya === 0
                          ? 'Gratis*'
                          : `${rupiah(d.estimasiBiaya)}*`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={
                            fav ? 'Hapus dari favorit' : 'Simpan ke favorit'
                          }
                          onClick={() => onToggleFav(d.id, 'destinasi')}
                          className={`cursor-pointer px-1.5 py-1 text-xl leading-none transition ${
                            fav ? 'text-[#e16c75]' : 'text-[#9aa9a2]'
                          }`}
                        >
                          {fav ? '♥' : '♡'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onShowDetail(d)}
                          className="cursor-pointer rounded-xl bg-[#087f8c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#066c78]"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[#cbd9d0] bg-white p-9 text-center text-sm text-[#687e89]">
              Tidak ada destinasi yang cocok. Coba ubah kata kunci atau filter.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
