export function RegionMapSection() {
  return (
    <section
      id="peta"
      className="scroll-mt-20 bg-white py-14 md:py-[76px]"
    >
      <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
            EXPLORE THE REGION
          </p>
          <h2 className="my-2 text-3xl font-extrabold tracking-[-1px] text-[#123b52] md:text-[38px] md:leading-[1.12]">
            Lima wilayah,
            <br />
            beragam cerita.
          </h2>
          <p className="mb-4 text-[13px] leading-relaxed text-[#687e89]">
            Peta ini bersifat ilustratif, bukan peta navigasi. Pilih titik
            untuk membuka pencarian lokasi di Google Maps. Pastikan kembali
            alamat dan akses sebelum berangkat.
          </p>

          <div className="min-h-[300px] rounded-xl border border-[#d1e5e5] bg-[#e7f2f2] p-4">
            <svg
              viewBox="0 0 520 330"
              role="img"
              aria-label="Peta ilustratif wilayah Aceh"
              className="block h-auto w-full"
            >
              <path
                d="M94 25 L157 45 205 80 253 87 293 122 350 127 397 163 428 209 391 252 339 270 297 303 244 284 205 255 164 246 127 203 91 168 63 115Z"
                fill="#d4e7d7"
                stroke="#8ab49d"
                strokeWidth="3"
              />
              <path
                d="M98 33 Q160 70 192 126 T274 185 T385 244"
                fill="none"
                stroke="#9fc9c0"
                strokeWidth="12"
                strokeLinecap="round"
                opacity=".8"
              />
              <g fill="#0d8069" stroke="white" strokeWidth="3">
                <circle cx="143" cy="104" r="9" />
                <circle cx="101" cy="157" r="9" />
                <circle cx="205" cy="177" r="9" />
                <circle cx="300" cy="117" r="9" />
                <circle cx="350" cy="217" r="9" />
              </g>
              <g fill="#254d41" fontSize="12" fontWeight="700">
                <text x="157" y="99">
                  Banda Aceh
                </text>
                <text x="43" y="178">
                  Sabang
                </text>
                <text x="215" y="173">
                  Aceh Besar
                </text>
                <text x="310" y="110">
                  Bener Meriah
                </text>
                <text x="360" y="218">
                  Aceh Tengah
                </text>
              </g>
              <text x="18" y="315" fill="#648176" fontSize="10">
                ILUSTRASI — BUKAN SKALA GEOGRAFIS
              </text>
            </svg>
            <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-[#63766e]">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#087f8c]" />
                Wilayah katalog
              </span>
              <span>
                ↗ Titik dapat dibuka melalui Google Maps pada kartu destinasi
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#dce7eb] bg-white p-6 shadow-[0_8px_25px_#123b5208]">
          <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
            TRAVEL WITH CONFIDENCE
          </p>
          <h3 className="mt-1.5 mb-2.5 text-[26px] font-extrabold text-[#123b52]">
            Perjalanan yang lebih terencana.
          </h3>
          <p className="text-[13px] leading-relaxed text-[#687e89]">
            Temukan informasi fasilitas ibadah, estimasi biaya, dan layanan
            ramah Muslim. Keterangan fasilitas tidak sama dengan bukti
            sertifikasi halal resmi.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[9px] bg-[#edf6f5] p-3.5">
              <b className="block text-[13px] text-[#087f8c]">
                🕌 Fasilitas ibadah
              </b>
              <span className="text-[11px] text-[#687e89]">
                Informasi tempat ibadah pada destinasi
              </span>
            </div>
            <div className="rounded-[9px] bg-[#edf6f5] p-3.5">
              <b className="block text-[13px] text-[#087f8c]">
                🥘 Kuliner lokal
              </b>
              <span className="text-[11px] text-[#687e89]">
                Status verifikasi ditampilkan terpisah
              </span>
            </div>
            <div className="rounded-[9px] bg-[#edf6f5] p-3.5">
              <b className="block text-[13px] text-[#087f8c]">🛏️ Akomodasi</b>
              <span className="text-[11px] text-[#687e89]">
                Fasilitas ramah Muslim
              </span>
            </div>
            <div className="rounded-[9px] bg-[#edf6f5] p-3.5">
              <b className="block text-[13px] text-[#087f8c]">🧭 Itinerary</b>
              <span className="text-[11px] text-[#687e89]">
                Susun perjalanan 1–5 hari
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
