import type {
  Destination,
  FoodItem,
  Language,
  PackageItem,
  StayItem,
} from '../types/aceh';

export const REGIONS = [
  'Banda Aceh',
  'Sabang',
  'Aceh Besar',
  'Aceh Tengah',
  'Bener Meriah',
] as const;

export const CATEGORIES = [
  'Religi',
  'Alam',
  'Bahari',
  'Sejarah',
  'Budaya',
  'Kuliner',
] as const;

export const DASH_PIN = '1234';
export const SAFE_URL_FALLBACK = 'https://www.google.com/maps';

export const seedDestinations: Destination[] = [
  {
    id: 'd1',
    nama: 'Masjid Raya Baiturrahman',
    kategori: 'Religi',
    wilayah: 'Banda Aceh',
    deskripsi:
      'Ikon kota Banda Aceh dengan arsitektur megah dan nilai sejarah yang kuat. Periksa ketentuan kunjungan dan waktu ibadah.',
    imageUrl: '',
    alamat: 'Kota Banda Aceh, Aceh (alamat rinci perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Masjid+Raya+Baiturrahman',
    estimasiBiaya: 0,
    fasilitas: ['Area kunjungan', 'Area parkir (perlu verifikasi)'],
    fasilitasIbadah: ['Masjid'],
    unggulan: true,
  },
  {
    id: 'd2',
    nama: 'Museum Tsunami Aceh',
    kategori: 'Sejarah',
    wilayah: 'Banda Aceh',
    deskripsi:
      'Ruang edukasi dan memorial untuk mengenang peristiwa tsunami 2004. Jam operasional dan tiket perlu diperiksa.',
    imageUrl: '',
    alamat: 'Banda Aceh, Aceh (alamat rinci perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Tsunami+Aceh',
    estimasiBiaya: 20000,
    fasilitas: ['Ruang pamer', 'Area edukasi'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: true,
  },
  {
    id: 'd3',
    nama: 'Kapal PLTD Apung',
    kategori: 'Sejarah',
    wilayah: 'Banda Aceh',
    deskripsi:
      'Situs memorial kapal pembangkit listrik yang terseret tsunami. Informasi kunjungan dapat berubah.',
    imageUrl: '',
    alamat: 'Banda Aceh, Aceh (alamat rinci perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kapal+PLTD+Apung',
    estimasiBiaya: 10000,
    fasilitas: ['Situs memorial'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: false,
  },
  {
    id: 'd4',
    nama: 'Pantai Iboih',
    kategori: 'Bahari',
    wilayah: 'Sabang',
    deskripsi:
      'Kawasan pantai dan laut yang dikenal dengan panorama bawah laut Pulau Weh. Kondisi laut dan layanan perlu dicek.',
    imageUrl: '',
    alamat: 'Iboih, Sukakarya, Sabang (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pantai+Iboih+Sabang',
    estimasiBiaya: 15000,
    fasilitas: ['Pantai', 'Aktivitas bahari (operator perlu verifikasi)'],
    fasilitasIbadah: ['Tempat ibadah terdekat perlu dikonfirmasi'],
    unggulan: true,
  },
  {
    id: 'd5',
    nama: 'Tugu Nol Kilometer',
    kategori: 'Alam',
    wilayah: 'Sabang',
    deskripsi:
      'Titik penanda geografis di Pulau Weh dengan pemandangan alam. Akses dan kondisi fasilitas dapat berubah.',
    imageUrl: '',
    alamat: 'Iboih, Sabang, Aceh (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tugu+Nol+Kilometer+Sabang',
    estimasiBiaya: 10000,
    fasilitas: ['Area pandang'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: true,
  },
  {
    id: 'd6',
    nama: 'Pantai Lampuuk',
    kategori: 'Bahari',
    wilayah: 'Aceh Besar',
    deskripsi:
      'Kawasan pesisir dengan bentang pantai yang menarik untuk menikmati suasana laut. Perhatikan keselamatan dan aturan setempat.',
    imageUrl: '',
    alamat: 'Lhoknga, Aceh Besar (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pantai+Lampuuk+Aceh+Besar',
    estimasiBiaya: 10000,
    fasilitas: ['Area pantai', 'Warung sekitar (perlu verifikasi)'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: true,
  },
  {
    id: 'd7',
    nama: 'Pantai Lhoknga',
    kategori: 'Bahari',
    wilayah: 'Aceh Besar',
    deskripsi:
      'Pantai yang populer untuk menikmati pemandangan pesisir. Aktivitas air bergantung cuaca dan kondisi ombak.',
    imageUrl: '',
    alamat: 'Lhoknga, Aceh Besar (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pantai+Lhoknga',
    estimasiBiaya: 10000,
    fasilitas: ['Area pantai'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: false,
  },
  {
    id: 'd8',
    nama: 'Air Terjun Suhom',
    kategori: 'Alam',
    wilayah: 'Aceh Besar',
    deskripsi:
      'Destinasi alam berupa air terjun di kawasan Lhoong. Periksa kondisi jalur dan keselamatan sebelum berkunjung.',
    imageUrl: '',
    alamat: 'Lhoong, Aceh Besar (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Air+Terjun+Suhom',
    estimasiBiaya: 10000,
    fasilitas: ['Area alam', 'Jalur akses perlu verifikasi'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: false,
  },
  {
    id: 'd9',
    nama: 'Danau Laut Tawar',
    kategori: 'Alam',
    wilayah: 'Aceh Tengah',
    deskripsi:
      'Danau di dataran tinggi Gayo yang dikelilingi perbukitan. Cuaca dan akses lokasi wisata di sekitar danau perlu diperiksa.',
    imageUrl: '',
    alamat: 'Takengon, Aceh Tengah (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Danau+Laut+Tawar',
    estimasiBiaya: 10000,
    fasilitas: ['Pemandangan danau', 'Area singgah (perlu verifikasi)'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: true,
  },
  {
    id: 'd10',
    nama: 'Kampung Wisata Toweren',
    kategori: 'Budaya',
    wilayah: 'Aceh Tengah',
    deskripsi:
      'Kawasan permukiman di sekitar Danau Laut Tawar yang dapat menjadi pintu mengenal budaya Gayo. Program kunjungan perlu dikonfirmasi.',
    imageUrl: '',
    alamat: 'Toweren, Aceh Tengah (perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kampung+Toweren+Aceh+Tengah',
    estimasiBiaya: 25000,
    fasilitas: ['Pengalaman budaya (perlu konfirmasi)'],
    fasilitasIbadah: ['Fasilitas ibadah setempat perlu dikonfirmasi'],
    unggulan: false,
  },
  {
    id: 'd11',
    nama: 'Air Terjun Tansaran Bidin',
    kategori: 'Alam',
    wilayah: 'Bener Meriah',
    deskripsi:
      'Tujuan wisata alam di kawasan Bener Meriah. Kondisi jalan, jalur trekking, dan fasilitas perlu diverifikasi sebelum berangkat.',
    imageUrl: '',
    alamat: 'Bener Meriah, Aceh (lokasi rinci perlu verifikasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Air+Terjun+Tansaran+Bidin',
    estimasiBiaya: 15000,
    fasilitas: ['Area alam', 'Jalur trekking perlu verifikasi'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: true,
  },
  {
    id: 'd12',
    nama: 'Kawasan Kebun Kopi Gayo',
    kategori: 'Budaya',
    wilayah: 'Bener Meriah',
    deskripsi:
      'Pengalaman mengenal lanskap perkebunan kopi Gayo dan budaya kopi dataran tinggi. Kunjungan kebun harus dengan izin pengelola.',
    imageUrl: '',
    alamat: 'Bener Meriah, Aceh (lokasi kebun perlu konfirmasi)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kebun+Kopi+Gayo+Bener+Meriah',
    estimasiBiaya: 30000,
    fasilitas: ['Edukasi kopi (mitra perlu verifikasi)'],
    fasilitasIbadah: ['Fasilitas ibadah sekitar perlu dikonfirmasi'],
    unggulan: false,
  },
];

export const seedFood: FoodItem[] = [
  {
    id: 'f1',
    nama: 'Mie Aceh',
    kategori: 'Kuliner',
    wilayah: 'Banda Aceh',
    harga: 25000,
    imageUrl: '',
    statusSertifikasiHalal: 'Belum diverifikasi',
    sumberVerifikasi: 'Belum ada sumber resmi pada data demo',
    kontak: '6281230000000',
  },
  {
    id: 'f2',
    nama: 'Kopi Gayo',
    kategori: 'Produk UMKM',
    wilayah: 'Aceh Tengah',
    harga: 65000,
    imageUrl: '',
    statusSertifikasiHalal: 'Belum diverifikasi',
    sumberVerifikasi: 'Belum ada sumber resmi pada data demo',
    kontak: '6281230000000',
  },
  {
    id: 'f3',
    nama: 'Kue Timphan',
    kategori: 'Kuliner',
    wilayah: 'Aceh Besar',
    harga: 18000,
    imageUrl: '',
    statusSertifikasiHalal: 'Belum diverifikasi',
    sumberVerifikasi: 'Belum ada sumber resmi pada data demo',
    kontak: '6281230000000',
  },
  {
    id: 'f4',
    nama: 'Keripik Pisang Aceh',
    kategori: 'Produk UMKM',
    wilayah: 'Sabang',
    harga: 20000,
    imageUrl: '',
    statusSertifikasiHalal: 'Belum diverifikasi',
    sumberVerifikasi: 'Belum ada sumber resmi pada data demo',
    kontak: '6281230000000',
  },
];

export const seedStays: StayItem[] = [
  {
    id: 'a1',
    nama: 'Penginapan Kota Banda Aceh (Demo)',
    wilayah: 'Banda Aceh',
    hargaPerMalam: 350000,
    fasilitas: ['Wi-Fi (simulasi)', 'Parkir (simulasi)'],
    fasilitasRamahMuslim: ['Arah kiblat berdasarkan permintaan (simulasi)'],
    imageUrl: '',
    kontak: '6281230000000',
  },
  {
    id: 'a2',
    nama: 'Guesthouse Pulau Weh (Demo)',
    wilayah: 'Sabang',
    hargaPerMalam: 400000,
    fasilitas: ['Area santai (simulasi)'],
    fasilitasRamahMuslim: ['Informasi masjid sekitar perlu konfirmasi'],
    imageUrl: '',
    kontak: '6281230000000',
  },
  {
    id: 'a3',
    nama: 'Homestay Dataran Tinggi (Demo)',
    wilayah: 'Aceh Tengah',
    hargaPerMalam: 300000,
    fasilitas: ['Area parkir (simulasi)'],
    fasilitasRamahMuslim: ['Tempat ibadah sekitar perlu konfirmasi'],
    imageUrl: '',
    kontak: '6281230000000',
  },
];

export const seedPackages: PackageItem[] = [
  {
    id: 'p1',
    nama: 'Jejak Sejarah Banda Aceh',
    durasi: 2,
    daftarDestinasi: ['d1', 'd2', 'd3'],
    estimasiBiaya: 850000,
    deskripsi: 'Rangkaian kunjungan religi dan sejarah di Banda Aceh.',
  },
  {
    id: 'p2',
    nama: 'Bahari Pulau Weh',
    durasi: 3,
    daftarDestinasi: ['d4', 'd5'],
    estimasiBiaya: 2200000,
    deskripsi: 'Inspirasi perjalanan pantai dan panorama laut Sabang.',
  },
  {
    id: 'p3',
    nama: 'Sejuknya Dataran Tinggi Gayo',
    durasi: 3,
    daftarDestinasi: ['d9', 'd10', 'd12'],
    estimasiBiaya: 1800000,
    deskripsi: 'Danau, budaya Gayo, dan pengalaman kopi.',
  },
  {
    id: 'p4',
    nama: 'Alam dan Pesisir Aceh Besar',
    durasi: 2,
    daftarDestinasi: ['d6', 'd7', 'd8'],
    estimasiBiaya: 950000,
    deskripsi: 'Jelajahi pantai dan air terjun di Aceh Besar.',
  },
];

export const TRANSLATIONS: Record<
  Language,
  {
    topLeft: string;
    topNote: string;
    navDest: string;
    navFood: string;
    navStay: string;
    navPlan: string;
    navDash: string;
    explore: string;
    signIn: string;
    signOut: string;
  }
> = {
  id: {
    topLeft: 'Jelajahi Aceh dengan nyaman dan penuh makna',
    topNote: 'Data demo · Informasi perlu diverifikasi',
    navDest: 'Destinasi',
    navFood: 'Kuliner',
    navStay: 'Akomodasi',
    navPlan: 'Rencana',
    navDash: 'Dashboard',
    explore: 'Jelajahi ↗',
    signIn: 'Masuk',
    signOut: 'Keluar',
  },
  en: {
    topLeft: 'Explore Aceh with comfort and peace of mind',
    topNote: 'Demo data · Information requires verification',
    navDest: 'Destinations',
    navFood: 'Food',
    navStay: 'Stays',
    navPlan: 'Planner',
    navDash: 'Dashboard',
    explore: 'Explore ↗',
    signIn: 'Sign in',
    signOut: 'Sign out',
  },
};

export function rupiah(n: number | undefined): string {
  return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
}

export function safeUrl(url: string | undefined): string {
  try {
    const parsed = new URL(String(url ?? '').trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // ignore malformed URLs
  }
  return SAFE_URL_FALLBACK;
}

export function isValidGmail(value: string): boolean {
  return /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@gmail\.com$/i.test(value);
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    return (parsed ?? structuredClone(fallback)) as T;
  } catch {
    return structuredClone(fallback);
  }
}

export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        const maxW = 1200;
        const maxH = 900;
        const scale = Math.min(1, maxW / img.width, maxH / img.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}
