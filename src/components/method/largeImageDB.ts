export const openLargeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LargeShotDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    };
  });
};

export const saveLargeImageToDB = async (
  id: string,
  imageData: string
): Promise<void> => {
  const db = await openLargeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');

    const putRequest = store.put({
      id,
      imageData,
      timestamp: Date.now(),
      size: imageData.length,
    });

    putRequest.onsuccess = () => resolve();
    putRequest.onerror = () => reject(putRequest.error);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
};

export const getLargeImageFromDB = async (
  id: string
): Promise<
  { id: string; imageData: string; timestamp: number; size: number } | undefined
> => {
  const db = await openLargeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const getRequest = store.get(id);

    getRequest.onsuccess = () => resolve(getRequest.result);
    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const getStorageUsage = async (): Promise<{
  usage: number;
  quota: number;
}> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return { usage: 0, quota: 0 };
};
