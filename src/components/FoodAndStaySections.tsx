import { rupiah, safeUrl } from '../data/seed';
import type { FoodItem, StayItem } from '../types/aceh';

interface FoodAndStaySectionsProps {
  foods: FoodItem[];
  stays: StayItem[];
  isFav: (id: string, type?: 'destinasi' | 'kuliner') => boolean;
  onToggleFav: (id: string, type?: 'destinasi' | 'kuliner') => void;
}

export function FoodAndStaySections({
  foods,
  stays,
  isFav,
  onToggleFav,
}: FoodAndStaySectionsProps) {
  return (
    <>
      <section id="kuliner" className="scroll-mt-20 py-14 md:py-[76px]">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-6">
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              LOCAL FLAVOURS
            </p>
            <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
              Kuliner &amp; UMKM lokal
            </h2>
            <p className="max-w-[500px] text-[13px] text-[#687e89]">
              Kenali cita rasa Aceh dan produk lokal. Status sertifikasi pada
              data contoh belum diverifikasi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {foods.map((f) => {
              const fav = isFav(f.id, 'kuliner');
              const photo = f.imageData || f.imageUrl;
              const isVerified = f.statusSertifikasiHalal
                .toLowerCase()
                .includes('terverifikasi');

              return (
                <article
                  key={f.id}
                  className="rounded-xl border border-[#dce7eb] bg-white p-[18px] shadow-[0_8px_25px_#123b5208]"
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={f.nama}
                      className="mb-3 block h-[150px] w-full rounded-[11px] object-cover"
                    />
                  ) : (
                    <div className="mb-2 text-3xl" aria-hidden="true">
                      🥘
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6a7b74]">
                    <span className="rounded-md bg-[#e2f2f1] px-2 py-0.5 font-bold text-[#08737c]">
                      {f.kategori}
                    </span>
                    <span>{f.wilayah}</span>
                  </div>

                  <h3 className="my-2 text-xl font-extrabold text-[#183342]">
                    {f.nama}
                  </h3>
                  <p className="mb-2 text-xs text-[#687e89] tabular-nums">
                    {rupiah(f.harga)} · harga simulasi
                  </p>

                  <span
                    className={`inline-block rounded-md px-2 py-1 text-[10px] font-extrabold ${
                      isVerified
                        ? 'bg-[#e1f4ec] text-[#176b50]'
                        : 'bg-[#fff3df] text-[#8a5b14]'
                    }`}
                  >
                    {f.statusSertifikasiHalal}
                  </span>

                  <p className="mt-2.5 text-xs text-[#687e89]">
                    <strong className="text-[#183342]">Sumber:</strong>{' '}
                    {f.sumberVerifikasi}
                  </p>
                  <p className="mt-1 mb-3 text-xs text-[#687e89]">
                    Kontak simulasi: {f.kontak}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={
                        fav ? 'Hapus dari favorit' : 'Simpan ke favorit'
                      }
                      onClick={() => onToggleFav(f.id, 'kuliner')}
                      className={`cursor-pointer px-1.5 py-1 text-xl leading-none ${
                        fav ? 'text-[#e16c75]' : 'text-[#9aa9a2]'
                      }`}
                    >
                      {fav ? '♥' : '♡'}
                    </button>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={safeUrl(
                        `https://wa.me/${f.kontak}?text=Halo%2C%20saya%20melihat%20informasi%20demo%20Aceh%20Trip.`,
                      )}
                      className="rounded-xl bg-[#087f8c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#066c78]"
                    >
                      WhatsApp demo
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="akomodasi"
        className="scroll-mt-20 bg-white py-14 md:py-[76px]"
      >
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-6">
            <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
              STAY COMFORTABLY
            </p>
            <h2 className="my-1.5 text-[clamp(27px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#123b52]">
              Akomodasi ramah Muslim
            </h2>
            <p className="max-w-[500px] text-[13px] text-[#687e89]">
              Informasi fasilitas untuk membantu memilih tempat menginap.
              Fasilitas ramah Muslim bukan sertifikasi halal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((a) => {
              const photo = a.imageData || a.imageUrl;
              return (
                <article
                  key={a.id}
                  className="rounded-xl border border-[#dce7eb] bg-white p-[18px] shadow-[0_8px_25px_#123b5208]"
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={a.nama}
                      className="mb-3 block h-[150px] w-full rounded-[11px] object-cover"
                    />
                  ) : (
                    <div className="mb-2 text-3xl" aria-hidden="true">
                      🛏️
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6a7b74]">
                    <span className="rounded-md bg-[#e2f2f1] px-2 py-0.5 font-bold text-[#08737c]">
                      {a.wilayah}
                    </span>
                  </div>

                  <h3 className="my-2 text-xl font-extrabold text-[#183342]">
                    {a.nama}
                  </h3>
                  <p className="mb-2 text-xs font-extrabold text-[#087f8c] tabular-nums">
                    {rupiah(a.hargaPerMalam)} / malam · simulasi
                  </p>
                  <p className="text-xs text-[#687e89]">
                    <strong className="text-[#183342]">Fasilitas:</strong>{' '}
                    {a.fasilitas.join(', ')}
                  </p>
                  <p className="mt-1 mb-2.5 text-xs text-[#687e89]">
                    <strong className="text-[#183342]">Ramah Muslim:</strong>{' '}
                    {a.fasilitasRamahMuslim.join(', ')}
                  </p>

                  <span className="inline-block rounded-md bg-[#fff3df] px-2 py-1 text-[10px] font-extrabold text-[#8a5b14]">
                    Fasilitas perlu konfirmasi · bukan sertifikasi
                  </span>

                  <p className="mt-2.5 mb-3 text-xs text-[#687e89]">
                    Kontak simulasi: {a.kontak}
                  </p>

                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={safeUrl(
                      `https://wa.me/${a.kontak}?text=Halo%2C%20saya%20melihat%20akomodasi%20demo%20di%20Aceh%20Trip.`,
                    )}
                    className="inline-flex rounded-xl bg-[#087f8c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#066c78]"
                  >
                    WhatsApp demo
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
