// IndexedDB storage for Video CVs (bypasses 5MB localStorage limit)
const DB_NAME = 'jobfit_video_cv_db';
const STORE_NAME = 'video_cv_store';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'profileId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const memoryFallback = new Map<string, Blob>();
const activeObjectUrls = new Map<string, string>();

export async function saveVideoCvBlob(profileId: string, file: File | Blob): Promise<string> {
  // Revoke any previous object URL for this profile
  if (activeObjectUrls.has(profileId)) {
    try {
      URL.revokeObjectURL(activeObjectUrls.get(profileId)!);
    } catch (e) {}
  }

  const url = URL.createObjectURL(file);
  activeObjectUrls.set(profileId, url);

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ profileId, blob: file, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB failed, using memory fallback for video CV:', err);
    memoryFallback.set(profileId, file);
  }

  return url;
}

export async function loadVideoCvUrl(profileId: string): Promise<string | null> {
  if (activeObjectUrls.has(profileId)) {
    return activeObjectUrls.get(profileId)!;
  }

  try {
    const db = await openDB();
    const result = await new Promise<{ profileId: string; blob: Blob } | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(profileId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (result && result.blob) {
      const url = URL.createObjectURL(result.blob);
      activeObjectUrls.set(profileId, url);
      return url;
    }
  } catch (err) {
    if (memoryFallback.has(profileId)) {
      const url = URL.createObjectURL(memoryFallback.get(profileId)!);
      activeObjectUrls.set(profileId, url);
      return url;
    }
  }

  return null;
}

export async function deleteVideoCvBlob(profileId: string): Promise<void> {
  if (activeObjectUrls.has(profileId)) {
    try {
      URL.revokeObjectURL(activeObjectUrls.get(profileId)!);
    } catch (e) {}
    activeObjectUrls.delete(profileId);
  }

  memoryFallback.delete(profileId);

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(profileId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete video CV from IndexedDB:', err);
  }
}
