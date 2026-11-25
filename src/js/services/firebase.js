import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const ADMIN_EMAIL = 'rajagaming199@gmail.com';

const CATALOG_COLLECTION_MAP = {
  destinasi: 'destinations',
  kuliner: 'foods',
  akomodasi: 'stays',
  paket: 'packages',
};

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

export function isAdminUser(user) {
  return Boolean(
    user &&
      user.emailVerified &&
      String(user.email || '').toLowerCase() === ADMIN_EMAIL,
  );
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOutGoogle() {
  return signOut(auth);
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

function sanitizeId(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 128);
}

function sanitizeStringList(list, maxLen = 30, itemMax = 120) {
  if (!Array.isArray(list)) return [];
  return list
    .map((x) => String(x || '').trim().slice(0, itemMax))
    .filter(Boolean)
    .slice(0, maxLen);
}

function buildCatalogPayload(type, item) {
  const id = sanitizeId(item.id);
  if (type === 'destinasi') {
    const payload = {
      id,
      nama: String(item.nama || '').trim().slice(0, 120) || 'Destinasi',
      kategori: String(item.kategori || 'Alam').trim().slice(0, 60) || 'Alam',
      wilayah: String(item.wilayah || 'Banda Aceh').trim().slice(0, 80) || 'Banda Aceh',
      deskripsi: String(item.deskripsi || '').trim().slice(0, 2000),
      imageUrl: String(item.imageUrl || '').trim().slice(0, 512),
      alamat: String(item.alamat || '').trim().slice(0, 300),
      mapsUrl: String(item.mapsUrl || '').trim().slice(0, 512),
      estimasiBiaya: Math.min(1000000000, Math.max(0, Number(item.estimasiBiaya) || 0)),
      fasilitas: sanitizeStringList(item.fasilitas, 30, 120),
      fasilitasIbadah: sanitizeStringList(item.fasilitasIbadah, 30, 120),
      unggulan: Boolean(item.unggulan),
    };
    if (typeof item.imageData === 'string' && item.imageData.length > 0) {
      payload.imageData = item.imageData.slice(0, 750000);
    }
    return payload;
  }

  if (type === 'kuliner') {
    const payload = {
      id,
      nama: String(item.nama || '').trim().slice(0, 120) || 'Kuliner',
      kategori: String(item.kategori || 'Kuliner').trim().slice(0, 60) || 'Kuliner',
      wilayah: String(item.wilayah || 'Banda Aceh').trim().slice(0, 80) || 'Banda Aceh',
      harga: Math.min(1000000000, Math.max(0, Number(item.harga) || 0)),
      imageUrl: String(item.imageUrl || '').trim().slice(0, 512),
      statusSertifikasiHalal: String(item.statusSertifikasiHalal || 'Belum diverifikasi')
        .trim()
        .slice(0, 120),
      sumberVerifikasi: String(item.sumberVerifikasi || '').trim().slice(0, 250),
      kontak: String(item.kontak || '').trim().slice(0, 40),
    };
    if (typeof item.imageData === 'string' && item.imageData.length > 0) {
      payload.imageData = item.imageData.slice(0, 750000);
    }
    return payload;
  }

  if (type === 'akomodasi') {
    const payload = {
      id,
      nama: String(item.nama || '').trim().slice(0, 120) || 'Akomodasi',
      wilayah: String(item.wilayah || 'Banda Aceh').trim().slice(0, 80) || 'Banda Aceh',
      hargaPerMalam: Math.min(1000000000, Math.max(0, Number(item.hargaPerMalam) || 0)),
      fasilitas: sanitizeStringList(item.fasilitas, 30, 120),
      fasilitasRamahMuslim: sanitizeStringList(item.fasilitasRamahMuslim, 30, 120),
      imageUrl: String(item.imageUrl || '').trim().slice(0, 512),
      kontak: String(item.kontak || '').trim().slice(0, 40),
    };
    if (typeof item.imageData === 'string' && item.imageData.length > 0) {
      payload.imageData = item.imageData.slice(0, 750000);
    }
    return payload;
  }

  return {
    id,
    nama: String(item.nama || '').trim().slice(0, 120) || 'Paket wisata',
    durasi: Math.min(30, Math.max(1, Number(item.durasi) || 1)),
    daftarDestinasi: sanitizeStringList(item.daftarDestinasi, 30, 128),
    estimasiBiaya: Math.min(1000000000, Math.max(0, Number(item.estimasiBiaya) || 0)),
    deskripsi: String(item.deskripsi || '').trim().slice(0, 2000),
  };
}

export function subscribePublicCatalog(onCatalogSlice) {
  let isSeededInCloud = false;
  const latestSlices = {
    destinasi: null,
    kuliner: null,
    akomodasi: null,
    paket: null,
  };

  const emitIfReady = (type) => {
    const items = latestSlices[type];
    if (!items) return;
    if (isSeededInCloud || items.length > 0) {
      onCatalogSlice(type, items);
    }
  };

  const unsubMeta = onSnapshot(
    doc(db, 'catalogMeta', 'seedStatus'),
    (snap) => {
      isSeededInCloud = Boolean(snap.exists() && snap.data()?.seeded);
      if (isSeededInCloud) {
        Object.keys(CATALOG_COLLECTION_MAP).forEach(emitIfReady);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'catalogMeta/seedStatus');
    },
  );

  const unsubs = Object.entries(CATALOG_COLLECTION_MAP).map(([type, colName]) =>
    onSnapshot(
      collection(db, colName),
      (snapshot) => {
        const items = snapshot.docs.map((d) => {
          const data = d.data();
          const item = { ...data, id: data.id || d.id };
          delete item.createdAt;
          delete item.updatedAt;
          return item;
        });
        latestSlices[type] = items;
        emitIfReady(type);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colName);
      },
    ),
  );

  return () => {
    unsubMeta();
    unsubs.forEach((unsub) => unsub());
  };
}

export async function ensureCatalogSeeded(adminEmail, seedData) {
  const metaRef = doc(db, 'catalogMeta', 'seedStatus');
  let metaSnap;
  try {
    metaSnap = await getDocFromServer(metaRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'catalogMeta/seedStatus');
  }

  if (metaSnap?.exists() && metaSnap.data()?.seeded) {
    return false;
  }

  const batch = writeBatch(db);
  for (const [type, colName] of Object.entries(CATALOG_COLLECTION_MAP)) {
    let existingSnap;
    try {
      existingSnap = await getDocs(collection(db, colName));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colName);
    }
    if (existingSnap?.empty) {
      const list = seedData[type] || [];
      list.forEach((item) => {
        const payload = buildCatalogPayload(type, item);
        batch.set(doc(db, colName, payload.id), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    }
  }

  batch.set(metaRef, {
    seeded: true,
    updatedBy: String(adminEmail || ADMIN_EMAIL).slice(0, 254),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'catalogMeta/seedStatus');
  }
  return false;
}

export async function resetCatalogInFirestore(adminEmail, seedData) {
  const batch = writeBatch(db);
  try {
    for (const [type, colName] of Object.entries(CATALOG_COLLECTION_MAP)) {
      const existingSnap = await getDocs(collection(db, colName));
      existingSnap.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      const list = seedData[type] || [];
      list.forEach((item) => {
        const payload = buildCatalogPayload(type, item);
        batch.set(doc(db, colName, payload.id), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    }

    batch.set(doc(db, 'catalogMeta', 'seedStatus'), {
      seeded: true,
      updatedBy: String(adminEmail || ADMIN_EMAIL).slice(0, 254),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'catalogMeta/seedStatus');
  }
}

export async function saveCatalogItemToFirestore(type, item, isNew) {
  const colName = CATALOG_COLLECTION_MAP[type];
  if (!colName) return;

  const payload = buildCatalogPayload(type, item);
  const path = `${colName}/${payload.id}`;
  const ref = doc(db, colName, payload.id);

  if (isNew) {
    try {
      await setDoc(ref, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  const updatePayload = { ...payload };
  delete updatePayload.id;
  updatePayload.updatedAt = serverTimestamp();

  try {
    await updateDoc(ref, updatePayload);
  } catch (error) {
    if (error?.code === 'not-found') {
      try {
        await setDoc(ref, {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return;
      } catch (createErr) {
        handleFirestoreError(createErr, OperationType.CREATE, path);
      }
    }
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCatalogItemFromFirestore(type, itemId) {
  const colName = CATALOG_COLLECTION_MAP[type];
  if (!colName) return;
  const safeId = sanitizeId(itemId);
  const path = `${colName}/${safeId}`;
  try {
    await deleteDoc(doc(db, colName, safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncUserProfile(user) {
  if (!user?.uid || !user?.email) return;
  const path = `users/${user.uid}`;
  const payload = {
    uid: String(user.uid).slice(0, 128),
    email: String(user.email).slice(0, 254),
    displayName: String(user.displayName || '').slice(0, 120),
    updatedAt: serverTimestamp(),
  };
  if (user.photoURL && typeof user.photoURL === 'string') {
    payload.photoURL = user.photoURL.slice(0, 512);
  }
  try {
    await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserFavorites(uid, onData, onErr) {
  const path = `users/${uid}/favorites`;
  const q = query(collection(db, 'users', uid, 'favorites'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          itemId: data.itemId,
          tipeItem: data.tipeItem,
          tanggalDitambahkan: data.tanggalDitambahkan,
        };
      });
      onData(items);
    },
    (error) => {
      if (onErr) onErr(error);
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function addUserFavorite(uid, itemId, tipeItem) {
  const safeItemId = sanitizeId(itemId);
  const safeType = tipeItem === 'kuliner' ? 'kuliner' : 'destinasi';
  const favId = sanitizeId(`${safeType}_${safeItemId}`);
  const path = `users/${uid}/favorites/${favId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'favorites', favId), {
      uid: String(uid).slice(0, 128),
      itemId: safeItemId,
      tipeItem: safeType,
      tanggalDitambahkan: new Date().toISOString().slice(0, 40),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeUserFavorite(uid, itemId, tipeItem) {
  const safeItemId = sanitizeId(itemId);
  const safeType = tipeItem === 'kuliner' ? 'kuliner' : 'destinasi';
  const favId = sanitizeId(`${safeType}_${safeItemId}`);
  const path = `users/${uid}/favorites/${favId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'favorites', favId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearUserFavorites(uid, favorites) {
  const path = `users/${uid}/favorites`;
  try {
    const batch = writeBatch(db);
    favorites.forEach((f) => {
      const favId = sanitizeId(f.id || `${f.tipeItem}_${f.itemId}`);
      batch.delete(doc(db, 'users', uid, 'favorites', favId));
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserItineraries(uid, onData, onErr) {
  const path = `users/${uid}/itineraries`;
  const q = query(collection(db, 'users', uid, 'itineraries'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          namaPerjalanan: data.namaPerjalanan,
          tanggalMulai: data.tanggalMulai,
          jumlahHari: data.jumlahHari,
          jumlahWisatawan: data.jumlahWisatawan,
          daftarAktivitas: Array.isArray(data.daftarAktivitas)
            ? data.daftarAktivitas
            : [],
          totalAnggaran: data.totalAnggaran,
          createdBy: data.createdBy,
        };
      });
      onData(items);
    },
    (error) => {
      if (onErr) onErr(error);
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function saveUserItinerary(uid, trip) {
  const tripId = sanitizeId(trip.id || `trip-${Date.now()}`);
  const path = `users/${uid}/itineraries/${tripId}`;
  const activities = Array.isArray(trip.daftarAktivitas)
    ? trip.daftarAktivitas.slice(0, 50).map((a) => ({
        key: String(a.key || '').slice(0, 64),
        hari: Math.min(5, Math.max(1, Number(a.hari) || 1)),
        destinasiId: String(a.destinasiId || '').slice(0, 128),
        catatan: String(a.catatan || '').slice(0, 200),
      }))
    : [];

  try {
    await setDoc(doc(db, 'users', uid, 'itineraries', tripId), {
      uid: String(uid).slice(0, 128),
      namaPerjalanan: String(trip.namaPerjalanan || 'Perjalanan Aceh').slice(0, 120),
      tanggalMulai: String(trip.tanggalMulai || '').slice(0, 20),
      jumlahHari: Math.min(5, Math.max(1, Number(trip.jumlahHari) || 1)),
      jumlahWisatawan: Math.min(100, Math.max(1, Number(trip.jumlahWisatawan) || 1)),
      daftarAktivitas: activities,
      totalAnggaran: Math.min(1000000000, Math.max(0, Number(trip.totalAnggaran) || 0)),
      createdBy: String(trip.createdBy || '').slice(0, 254),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteUserItinerary(uid, tripId) {
  const safeTripId = sanitizeId(tripId);
  const path = `users/${uid}/itineraries/${safeTripId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'itineraries', safeTripId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
