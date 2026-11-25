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
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

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
