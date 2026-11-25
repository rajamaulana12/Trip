# Security Specification — Aceh Trip Firebase Auth & Firestore

## 1. Data Invariants
1. User profile documents at `/users/{userId}` can only be read (`get`) and written (`create`/`update`) by the authenticated owner (`request.auth.uid == userId`) with a verified Google email (`request.auth.token.email_verified == true`). Listing `/users` is strictly denied (`allow list: if false`).
2. Subcollection documents under `/users/{userId}/favorites/{favId}` and `/users/{userId}/itineraries/{tripId}` require the parent `/users/{userId}` document to exist on writes and enforce `uid == request.auth.uid`.
3. All document IDs (`userId`, `favId`, `tripId`) must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters.
4. All strings, numbers, and arrays have strict type and boundary checks (`size()`, numeric range), and all timestamps (`createdAt`, `updatedAt`) must equal `request.time`.
5. No shadow/ghost fields are allowed (`hasOnly(...)` on create and `affectedKeys().hasOnly(...)` on update).

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated read**: `GET /users/uid1` with `auth = null`.
2. **Cross-user PII read**: `GET /users/uid2` authenticated as `uid1`.
3. **User directory scraping**: `LIST /users` authenticated as `uid1`.
4. **Unverified email write**: `CREATE /users/uid1` with `email_verified: false`.
5. **Identity spoofing**: `CREATE /users/uid1/favorites/fav1` with `uid: "uid2"` while authenticated as `uid1`.
6. **Shadow/privilege escalation field**: `CREATE /users/uid1` with extra field `isAdmin: true`.
7. **ID poisoning**: `CREATE /users/uid1/favorites/../../../etc/passwd` or 1.5KB ID string.
8. **Client timestamp forgery**: `CREATE /users/uid1/itineraries/t1` with `createdAt` in the past instead of `request.time`.
9. **Immutable owner mutation**: `UPDATE /users/uid1/itineraries/t1` attempting to change `uid` or `createdAt`.
10. **Unbounded array / DoW attack**: `CREATE /users/uid1/itineraries/t1` with 100 items in `daftarAktivitas` (> 50 max).
11. **Invalid enum value**: `CREATE /users/uid1/favorites/f1` with `tipeItem: "admin"`.
12. **Orphaned subcollection write**: `CREATE /users/uid1/favorites/f1` when `/users/uid1` does not exist.
