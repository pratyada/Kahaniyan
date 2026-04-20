// IndexedDB audio cache — stores generated TTS blobs locally
// for instant replay without re-downloading from Firebase Storage.

const DB_NAME = 'mst-audio';
const STORE = 'audio';
const VERSION = 1;

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedAudio(storyId) {
  try {
    const db = await open();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(storyId);
      req.onsuccess = () => resolve(req.result?.blob || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedAudio(storyId, blob) {
  try {
    const db = await open();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ id: storyId, blob, cachedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

// Prune old entries (keep last 20)
export async function pruneAudioCache(keep = 20) {
  try {
    const db = await open();
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result || [];
      if (all.length <= keep) return;
      const sorted = all.sort((a, b) => (b.cachedAt || 0) - (a.cachedAt || 0));
      const toDelete = sorted.slice(keep);
      for (const item of toDelete) {
        store.delete(item.id);
      }
    };
  } catch {}
}
