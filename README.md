# Aceh Trip — Jelajahi dengan Tenang

Aplikasi panduan perjalanan wisata Aceh berbasis **Vite + Vanilla JavaScript (ES Modules) + HTML5 + CSS3 modular** yang ditransformasikan dari prototipe satu file menjadi arsitektur terstruktur dan siap produksi.

## Struktur Proyek

```text
├── index.html                  # Semantic HTML5 entry point
├── public/assets/destinasi/    # Foto destinasi d1.jpg – d12.jpg
├── src/
│   ├── styles/
│   │   ├── tokens.css          # Design tokens (Coastal Modern theme)
│   │   ├── base.css            # Reset, tipografi, focus-visible & aksesibilitas
│   │   ├── layout.css          # Header, mobile drawer, hero, section & footer
│   │   ├── components.css      # Kartu, filter, planner, dashboard CMS, modal, toast
│   │   └── main.css            # Aggregator stylesheet
│   └── js/
│       ├── config/constants.js # Wilayah, kategori, storage keys & kamus i18n
│       ├── data/seed.js        # Data awal destinasi, kuliner, akomodasi & paket
│       ├── services/storage.js # Wrapper localStorage + migrasi jalur aset
│       ├── state/store.js      # State management terpusat (pub/sub)
│       ├── utils/format.js     # Sanitasi XSS, safeUrl, rupiah, debounce & kompresi foto
│       ├── components/         # Modul UI (destinations, foodAndStay, planner, packages, favorites, dashboard, auth, modals, toast)
│       └── main.js             # Bootstrap & event wiring
└── vite.config.ts              # Konfigurasi build Vite (kompatibel dengan GitHub Pages)
```

## Perintah Pengembangan & Build

```bash
npm install
npm run dev       # Menjalankan dev server pada port 3000
npm run lint      # Memeriksa sintaks & modul dengan tsc --noEmit
npm run build     # Menghasilkan bundle produksi di dist/
npm run preview   # Pratinjau hasil build produksi
```
