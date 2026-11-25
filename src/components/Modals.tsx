import { useEffect, useState, type FormEvent } from 'react';
import { isValidGmail, rupiah, safeUrl } from '../data/seed';
import type { Destination } from '../types/aceh';

interface DetailModalProps {
  destination: Destination | null;
  isFav: boolean;
  onClose: () => void;
  onToggleFav: () => void;
}

export function DetailModal({
  destination,
  isFav,
  onClose,
  onToggleFav,
}: DetailModalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [destination?.id]);

  useEffect(() => {
    if (!destination) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [destination, onClose]);

  if (!destination) return null;

  const photo = destination.imageData || destination.imageUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detailTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#102d26]/65 p-4 backdrop-blur-xs"
    >
      <div className="max-h-[90vh] w-full max-w-[600px] overflow-auto rounded-[14px] bg-white p-6">
        <div className="mb-4 flex items-center justify-between border-b border-[#e4ecef] pb-3">
          <h3
            id="detailTitle"
            className="text-2xl font-extrabold text-[#123b52]"
          >
            {destination.nama}
          </h3>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[#dce7eb] bg-white text-lg text-[#087f8c]"
          >
            ×
          </button>
        </div>

        {photo && !imgFailed && (
          <img
            src={photo}
            alt={destination.nama}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="mb-4 block max-h-[340px] w-full rounded-xl object-cover"
          />
        )}

        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#6a7b74]">
          <span className="rounded-md bg-[#e2f2f1] px-2 py-0.5 font-bold text-[#08737c]">
            {destination.kategori}
          </span>
          <span>{destination.wilayah}</span>
        </div>

        <p className="text-sm leading-relaxed text-[#183342]">
          {destination.deskripsi}
        </p>

        <div className="my-3.5 rounded-xl border border-[#f1dfb8] bg-[#fff7e7] p-3 text-[11px] text-[#76531b]">
          Data lokasi, fasilitas, dan estimasi biaya merupakan contoh yang perlu
          diverifikasi sebelum perjalanan.
        </div>

        <div className="space-y-1.5 text-sm text-[#183342]">
          <p>
            <b>Alamat:</b> {destination.alamat}
          </p>
          <p className="tabular-nums">
            <b>Estimasi biaya:</b> {rupiah(destination.estimasiBiaya)} (simulasi)
          </p>
          <p>
            <b>Fasilitas:</b> {destination.fasilitas.join(', ')}
          </p>
          <p>
            <b>Fasilitas ibadah:</b> {destination.fasilitasIbadah.join(', ')}
          </p>
          <p>
            <b>Unggulan:</b> {destination.unggulan ? 'Ya' : 'Tidak'}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={safeUrl(destination.mapsUrl)}
            className="rounded-xl bg-[#087f8c] px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_14px_#087f8c20] hover:bg-[#066c78]"
          >
            Buka Google Maps ↗
          </a>
          <button
            type="button"
            onClick={onToggleFav}
            className="cursor-pointer rounded-xl bg-[#e1f1f1] px-4 py-2.5 text-xs font-bold text-[#086c76] hover:bg-[#d2eaea]"
          >
            {isFav ? 'Hapus favorit' : 'Simpan favorit'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserLoginModalProps {
  open: boolean;
  initialEmail: string | null;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function UserLoginModal({
  open,
  initialEmail,
  onClose,
  onSuccess,
}: UserLoginModalProps) {
  const [email, setEmail] = useState(initialEmail || '');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (open) {
      setEmail(initialEmail || '');
      setMsg('');
    }
  }, [initialEmail, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) {
      setMsg('Alamat Gmail belum diisi.');
      return;
    }
    if (!isValidGmail(cleaned)) {
      setMsg('Gunakan alamat Gmail yang valid, contoh nama@gmail.com.');
      return;
    }
    onSuccess(cleaned);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="userLoginTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-60 grid place-items-center overflow-auto bg-[#102f43]/80 p-5 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-[420px] rounded-2xl border border-[#dce7eb] bg-white p-8 shadow-[0_30px_70px_#071a2599]">
        <button
          type="button"
          aria-label="Tutup halaman masuk"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[#dce7eb] bg-white text-lg text-[#087f8c]"
        >
          ×
        </button>

        <div className="mb-3 flex items-center gap-2.5 text-base font-extrabold text-[#123b52]">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#087f8c] text-lg text-white">
            ✺
          </span>
          Aceh Trip
        </div>

        <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
          AKUN PENGUNJUNG
        </p>
        <h2
          id="userLoginTitle"
          className="mt-2 mb-1.5 text-[26px] font-extrabold tracking-[-0.8px] text-[#123b52]"
        >
          Masuk dengan Gmail
        </h2>
        <p className="mb-4 text-[13px] text-[#687e89]">
          Masuk untuk menyimpan rencana perjalanan atas nama akunmu di browser
          ini.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="userEmail"
              className="text-[11px] font-bold text-[#61736c]"
            >
              Alamat Gmail
            </label>
            <input
              id="userEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-[9px] border border-[#d7e4e8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#35a9ad]"
            />
          </div>
          <div
            role="status"
            aria-live="polite"
            className="my-2.5 min-h-[18px] text-xs font-medium text-[#a6444b]"
          >
            {msg}
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-[#087f8c] px-4 py-2.5 text-sm font-bold text-white shadow-[0_5px_14px_#087f8c20] hover:bg-[#066c78]"
          >
            Masuk
          </button>
        </form>

        <p className="mt-3.5 text-[11px] text-[#687e89]">
          Demo lokal: alamat hanya disimpan di browser ini. Tidak ada verifikasi
          kata sandi maupun koneksi ke Google.
        </p>
      </div>
    </div>
  );
}
