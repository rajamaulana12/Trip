import { TRANSLATIONS } from '../data/seed';
import type { Language } from '../types/aceh';

interface NavbarProps {
  lang: Language;
  currentUser: string | null;
  onToggleLang: () => void;
  onUserAction: () => void;
}

export function Navbar({
  lang,
  currentUser,
  onToggleLang,
  onUserAction,
}: NavbarProps) {
  const t = TRANSLATIONS[lang];

  return (
    <>
      <div className="bg-[#102f43] py-2 text-xs text-[#d9edf0]">
        <div className="mx-auto flex w-[min(1160px,calc(100%-32px))] flex-wrap items-center justify-between gap-3">
          <span>✦ {t.topLeft}</span>
          <span>{t.topNote}</span>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-[#dce7eb] bg-[#f9fcfc]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-[min(1160px,calc(100%-32px))] items-center justify-between gap-6">
          <a
            href="#home"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-lg font-extrabold tracking-tight text-[#123b52]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#087f8c] text-xl text-white">
              ✺
            </span>
            Aceh Trip
          </a>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-[#45616d] md:flex">
            <a
              href="#destinasi"
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#087f8c]"
            >
              {t.navDest}
            </a>
            <a
              href="#kuliner"
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#087f8c]"
            >
              {t.navFood}
            </a>
            <a
              href="#akomodasi"
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#087f8c]"
            >
              {t.navStay}
            </a>
            <a
              href="#planner"
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#087f8c]"
            >
              {t.navPlan}
            </a>
            <a
              href="#dashboard"
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#087f8c]"
            >
              {t.navDash}
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {currentUser && (
              <span
                title={currentUser}
                className="hidden max-w-[160px] truncate text-[11px] font-semibold text-[#45616d] sm:inline"
              >
                {currentUser}
              </span>
            )}
            <button
              type="button"
              onClick={onUserAction}
              className="cursor-pointer whitespace-nowrap rounded-xl border border-[#d5e2e7] bg-white px-3 py-2 text-xs font-bold text-[#123b52] transition hover:-translate-y-0.5 hover:border-[#087f8c] focus-visible:outline-2 focus-visible:outline-[#087f8c]"
            >
              {currentUser ? t.signOut : t.signIn}
            </button>
            <button
              type="button"
              onClick={onToggleLang}
              aria-label="Toggle language"
              className="cursor-pointer whitespace-nowrap rounded-xl border border-[#d5e2e7] bg-white px-3 py-2 text-xs font-bold text-[#123b52] transition hover:-translate-y-0.5 hover:border-[#087f8c] focus-visible:outline-2 focus-visible:outline-[#087f8c]"
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
            <a
              href="#destinasi"
              className="whitespace-nowrap rounded-xl bg-[#087f8c] px-3.5 py-2 text-xs font-bold text-white shadow-[0_5px_14px_#087f8c20] transition hover:-translate-y-0.5 hover:bg-[#066c78]"
            >
              {t.explore}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
