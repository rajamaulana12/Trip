export function Hero() {
  return (
    <section
      id="home"
      className="overflow-hidden bg-[linear-gradient(120deg,#e2f1f1_0%,#f4f7f4_55%,#f8ead8_100%)] py-14 md:py-[72px]"
    >
      <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] items-center gap-9 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div>
          <p className="text-[11px] font-extrabold tracking-[2.5px] text-[#087f8c] uppercase">
            THE HALAL JOURNEY · SUMATRA, INDONESIA
          </p>
          <h1 className="my-4 max-w-xl text-balance text-[clamp(38px,5.2vw,62px)] leading-[1.04] font-extrabold tracking-[-2.2px] text-[#123b52]">
            Temukan pesona
            <br />
            <em className="not-italic text-[#087f8c]">Aceh</em> dengan tenang.
          </h1>
          <p className="max-w-[520px] text-base leading-relaxed text-[#58727e]">
            Jelajahi alam yang memukau, jejak sejarah, kuliner lokal, dan
            keramahan budaya Aceh dalam satu panduan perjalanan.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#destinasi"
              className="inline-flex items-center gap-2 rounded-xl bg-[#087f8c] px-5 py-3 text-sm font-bold text-white shadow-[0_5px_14px_#087f8c25] transition hover:-translate-y-0.5 hover:bg-[#066c78]"
            >
              Mulai menjelajah <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#planner"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e1f1f1] px-5 py-3 text-sm font-bold text-[#086c76] transition hover:-translate-y-0.5 hover:bg-[#d3eaea]"
            >
              Susun perjalanan
            </a>
          </div>

          <div className="mt-7 grid max-w-[520px] grid-cols-3 gap-3">
            <div className="border-l-[3px] border-[#e5a85b] pl-3">
              <b className="text-2xl font-extrabold text-[#123b52] tabular-nums">
                12+
              </b>
              <span className="block text-[11px] text-[#687e89]">
                Destinasi contoh
              </span>
            </div>
            <div className="border-l-[3px] border-[#e5a85b] pl-3">
              <b className="text-2xl font-extrabold text-[#123b52] tabular-nums">
                5
              </b>
              <span className="block text-[11px] text-[#687e89]">
                Wilayah eksplorasi
              </span>
            </div>
            <div className="border-l-[3px] border-[#e5a85b] pl-3">
              <b className="text-2xl font-extrabold text-[#123b52] tabular-nums">
                1–5
              </b>
              <span className="block text-[11px] text-[#687e89]">
                Hari perjalanan
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[#74827c]">
            *Konten, harga, dan kontak pada prototype merupakan data
            simulasi/perlu verifikasi.
          </p>
        </div>

        <div
          aria-label="Ilustrasi lanskap laut dan pegunungan Aceh"
          className="relative min-h-[300px] overflow-hidden rounded-[10px_46px_10px_46px] bg-[linear-gradient(145deg,#0b7280,#123b52_72%)] shadow-[0_24px_55px_#123b5230] md:min-h-[390px]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0d6d7733_0%,transparent_40%,#092b3ac9_100%)]" />
          <div className="absolute top-[13%] right-[18%] h-[92px] w-[92px] rounded-full bg-[#f3c77e] shadow-[0_0_80px_#f3c77e77]" />
          <div className="absolute bottom-0 -left-2.5 h-0 w-0 border-r-[240px] border-b-[230px] border-l-[240px] border-r-transparent border-b-[#14566a] border-l-transparent" />
          <div className="absolute bottom-0 left-[32%] h-0 w-0 border-r-[290px] border-b-[180px] border-l-[290px] border-r-transparent border-b-[#278b8c] border-l-transparent opacity-90" />
          <div className="absolute right-0 bottom-0 left-0 h-20 bg-[linear-gradient(180deg,#57c1ba,#087f8c)]" />
          <div className="absolute top-5 right-5 text-[54px] text-white/50 select-none">
            ۞
          </div>
          <div className="relative z-10 flex h-full min-h-[300px] items-end p-6 text-white md:min-h-[390px]">
            <div>
              <strong className="block text-[25px] font-extrabold">
                Serambi Mekkah
              </strong>
              <span className="text-[11px] opacity-85">
                Where nature, heritage &amp; hospitality meet
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
