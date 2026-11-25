export type Language = 'id' | 'en';

export type DashboardTab = 'destinasi' | 'kuliner' | 'akomodasi' | 'paket';

export interface Destination {
  id: string;
  nama: string;
  kategori: string;
  wilayah: string;
  deskripsi: string;
  imageUrl: string;
  imageData?: string;
  alamat: string;
  mapsUrl: string;
  estimasiBiaya: number;
  fasilitas: string[];
  fasilitasIbadah: string[];
  unggulan: boolean;
}

export interface FoodItem {
  id: string;
  nama: string;
  kategori: string;
  wilayah: string;
  harga: number;
  imageUrl: string;
  imageData?: string;
  statusSertifikasiHalal: string;
  sumberVerifikasi: string;
  kontak: string;
}

export interface StayItem {
  id: string;
  nama: string;
  wilayah: string;
  hargaPerMalam: number;
  fasilitas: string[];
  fasilitasRamahMuslim: string[];
  imageUrl: string;
  imageData?: string;
  kontak: string;
}

export interface PackageItem {
  id: string;
  nama: string;
  durasi: number;
  daftarDestinasi: string[];
  estimasiBiaya: number;
  deskripsi: string;
}

export interface FavoriteItem {
  id: string;
  itemId: string;
  tipeItem: 'destinasi' | 'kuliner';
  tanggalDitambahkan: string;
}

export interface TripActivity {
  key: string;
  hari: number;
  destinasiId: string;
  catatan: string;
}

export interface ItineraryTrip {
  id: string;
  namaPerjalanan: string;
  tanggalMulai: string;
  jumlahHari: number;
  jumlahWisatawan: number;
  daftarAktivitas: TripActivity[];
  totalAnggaran: number;
}
