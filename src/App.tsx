import { useEffect, useState } from 'react';
import { DashboardSection } from './components/DashboardSection';
import { DestinationsSection } from './components/DestinationsSection';
import { FoodAndStaySections } from './components/FoodAndStaySections';
import { Hero } from './components/Hero';
import { DetailModal, UserLoginModal } from './components/Modals';
import { Navbar } from './components/Navbar';
import { PlannerAndPackages } from './components/PlannerAndPackages';
import { RegionMapSection } from './components/RegionMapSection';
import {
  readStorage,
  seedDestinations,
  seedFood,
  seedPackages,
  seedStays,
} from './data/seed';
import type {
  DashboardTab,
  Destination,
  FavoriteItem,
  FoodItem,
  ItineraryTrip,
  Language,
  PackageItem,
  StayItem,
} from './types/aceh';

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const stored = readStorage('he_dest', seedDestinations);
    return stored.map((d) => {
      const seed = seedDestinations.find((s) => s.id === d.id);
      if (!seed) return d;
      const isCustomExternalUrl =
        Boolean(d.imageUrl) &&
        (d.imageUrl.startsWith('http://') ||
          d.imageUrl.startsWith('https://') ||
          d.imageUrl.startsWith('data:'));
      return !isCustomExternalUrl && seed.imageUrl
        ? { ...d, imageUrl: seed.imageUrl }
        : d;
    });
  });
  const [foods, setFoods] = useState<FoodItem[]>(() =>
    readStorage('he_food', seedFood),
  );
  const [stays, setStays] = useState<StayItem[]>(() =>
    readStorage('he_stay', seedStays),
  );
  const [packages, setPackages] = useState<PackageItem[]>(() =>
    readStorage('he_pack', seedPackages),
  );
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    readStorage('he_favs', []),
  );
  const [itineraries, setItineraries] = useState<ItineraryTrip[]>(() =>
    readStorage('he_trips', []),
  );
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    readStorage<string | null>('he_user', null),
  );

  const [lang, setLang] = useState<Language>('id');
  const [detailDest, setDetailDest] = useState<Destination | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('he_dest', JSON.stringify(destinations));
      localStorage.setItem('he_food', JSON.stringify(foods));
      localStorage.setItem('he_stay', JSON.stringify(stays));
      localStorage.setItem('he_pack', JSON.stringify(packages));
      localStorage.setItem('he_favs', JSON.stringify(favorites));
      localStorage.setItem('he_trips', JSON.stringify(itineraries));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [destinations, favorites, foods, itineraries, packages, stays]);

  const isFav = (id: string, type: 'destinasi' | 'kuliner' = 'destinasi') =>
    favorites.some((f) => f.itemId === id && f.tipeItem === type);

  const toggleFav = (
    id: string,
    type: 'destinasi' | 'kuliner' = 'destinasi',
  ) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.itemId === id && f.tipeItem === type)) {
        return prev.filter((f) => !(f.itemId === id && f.tipeItem === type));
      }
      return [
        ...prev,
        {
          id: `fav${Date.now()}`,
          itemId: id,
          tipeItem: type,
          tanggalDitambahkan: new Date().toISOString(),
        },
      ];
    });
  };

  const handleUserAction = () => {
    if (currentUser) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('he_user');
      } catch {
        // ignore
      }
      return;
    }
    setLoginOpen(true);
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    try {
      localStorage.setItem('he_user', JSON.stringify(email));
    } catch {
      // ignore
    }
  };

  const handleDeleteRecord = (type: DashboardTab, id: string) => {
    if (type === 'destinasi') {
      setDestinations((prev) => prev.filter((item) => item.id !== id));
    } else if (type === 'kuliner') {
      setFoods((prev) => prev.filter((item) => item.id !== id));
    } else if (type === 'akomodasi') {
      setStays((prev) => prev.filter((item) => item.id !== id));
    } else {
      setPackages((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleResetAll = () => {
    setDestinations(structuredClone(seedDestinations));
    setFoods(structuredClone(seedFood));
    setStays(structuredClone(seedStays));
    setPackages(structuredClone(seedPackages));
    setFavorites([]);
    setItineraries([]);
  };

  return (
    <div className="min-h-screen bg-[#f3f7f8] text-[#183342]">
      <Navbar
        lang={lang}
        currentUser={currentUser}
        onToggleLang={() => setLang((l) => (l === 'id' ? 'en' : 'id'))}
        onUserAction={handleUserAction}
      />

      <main>
        <Hero />

        <DestinationsSection
          destinations={destinations}
          isFav={isFav}
          onToggleFav={toggleFav}
          onShowDetail={(d) => setDetailDest(d)}
        />

        <RegionMapSection />

        <FoodAndStaySections
          foods={foods}
          stays={stays}
          isFav={isFav}
          onToggleFav={toggleFav}
        />

        <PlannerAndPackages
          destinations={destinations}
          foods={foods}
          packages={packages}
          favorites={favorites}
          onSaveTrip={(trip) => setItineraries((prev) => [...prev, trip])}
          onToggleFav={toggleFav}
          onClearFav={() => setFavorites([])}
          onShowDetail={(d) => setDetailDest(d)}
        />

        <DashboardSection
          destinations={destinations}
          foods={foods}
          stays={stays}
          packages={packages}
          onSaveDestination={(item, isEdit) =>
            setDestinations((prev) =>
              isEdit
                ? prev.map((d) => (d.id === item.id ? item : d))
                : [...prev, item],
            )
          }
          onSaveFood={(item, isEdit) =>
            setFoods((prev) =>
              isEdit
                ? prev.map((f) => (f.id === item.id ? item : f))
                : [...prev, item],
            )
          }
          onSaveStay={(item, isEdit) =>
            setStays((prev) =>
              isEdit
                ? prev.map((s) => (s.id === item.id ? item : s))
                : [...prev, item],
            )
          }
          onSavePackage={(item, isEdit) =>
            setPackages((prev) =>
              isEdit
                ? prev.map((p) => (p.id === item.id ? item : p))
                : [...prev, item],
            )
          }
          onDeleteRecord={handleDeleteRecord}
          onResetAll={handleResetAll}
        />
      </main>

      <footer className="bg-[#102f43] py-10 text-[#d8e9e2]">
        <div className="mx-auto flex w-[min(1160px,calc(100%-32px))] flex-wrap justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-lg font-extrabold text-white">
              <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#e5a85b] text-xl text-[#173e33]">
                ✺
              </span>
              Aceh Trip
            </div>
            <p className="mt-2 max-w-[360px] text-xs leading-relaxed">
              Panduan digital untuk menjelajahi keindahan alam, budaya, dan
              keramahan Aceh.
            </p>
          </div>
          <div>
            <b className="text-sm text-white">Informasi demo</b>
            <p className="mt-1 max-w-xs text-xs text-[#a9c4b9]">
              Data destinasi perlu verifikasi. Harga dan kontak simulasi. Tidak
              ada klaim sertifikasi halal tanpa sumber resmi.
            </p>
          </div>
          <div>
            <small className="text-xs text-[#a9c4b9]">
              © 2026 Aceh Trip · Prototype MVP
            </small>
          </div>
        </div>
      </footer>

      <DetailModal
        destination={detailDest}
        isFav={detailDest ? isFav(detailDest.id, 'destinasi') : false}
        onClose={() => setDetailDest(null)}
        onToggleFav={() => {
          if (detailDest) toggleFav(detailDest.id, 'destinasi');
        }}
      />

      <UserLoginModal
        open={loginOpen}
        initialEmail={currentUser}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
