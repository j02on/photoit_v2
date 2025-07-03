'use client';

import Webcam from 'react-webcam';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const videoConstraints = {
  width: 587,
  height: 780,
  facingMode: 'user',
  frameRate: { ideal: 30, max: 60 },
};

const openDB = (): Promise<IDBDatabase> => {
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

const saveImageToDB = async (id: string, imageData: string): Promise<void> => {
  const db = await openDB();

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

const getStorageUsage = async (): Promise<{ usage: number; quota: number }> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return { usage: 0, quota: 0 };
};

const cleanupOldImages = async (keepCount: number = 5): Promise<number> => {
  const db = await openDB();
  const transaction = db.transaction(['images'], 'readwrite');
  const store = transaction.objectStore('images');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const images = request.result.sort((a, b) => b.timestamp - a.timestamp);
      const imagesToDelete = images.slice(keepCount);

      let deleteCount = 0;
      if (imagesToDelete.length === 0) return resolve(0);

      imagesToDelete.forEach((img) => {
        const deleteRequest = store.delete(img.id);
        deleteRequest.onsuccess = () => {
          deleteCount++;
          if (deleteCount === imagesToDelete.length) {
            resolve(deleteCount);
          }
        };
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });
    };
    request.onerror = () => reject(request.error);
  });
};

export default function LargeShot() {
  const webcamRef = useRef<Webcam>(null);
  const [timer, setTimer] = useState<number>(0);
  const [counter, setCounter] = useState<number>(0);
  const [completeOpen, setCompleteOpen] = useState<boolean>(false);
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    usage: number;
    quota: number;
    success: boolean;
    message: string;
  }>({ usage: 0, quota: 0, success: true, message: '' });

  const updateStorageInfo = useCallback(async () => {
    try {
      const { usage, quota } = await getStorageUsage();
      const usageMb = usage / (1024 * 1024);
      const quotaMb = quota / (1024 * 1024);
      setStorageInfo((prev) => {
        if (prev.usage === usageMb && prev.quota === quotaMb) return prev;
        return { ...prev, usage: usageMb, quota: quotaMb };
      });
    } catch (_) {}
  }, []);

  useEffect(() => {
    const initDB = async () => {
      try {
        await openDB();
        setIsDBReady(true);
        setStorageInfo((prev) => ({
          ...prev,
          success: true,
          message: 'IndexedDB 초기화 완료',
        }));
      } catch (_) {
        setIsDBReady(false);
        setStorageInfo((prev) => ({
          ...prev,
          success: false,
          message: 'IndexedDB 초기화 실패 - localStorage 폴백',
        }));
      }
    };
    initDB();
  }, []);

  useEffect(() => {
    if (isDBReady) updateStorageInfo();
  }, [isDBReady, updateStorageInfo]);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const img = webcamRef.current.getScreenshot();
    if (!img) return;

    try {
      if (isDBReady) {
        await saveImageToDB(String(counter), img);
        setStorageInfo((prev) => ({
          ...prev,
          success: true,
          message: `이미지 ${counter} IndexedDB 저장 성공`,
        }));
      } else {
        localStorage.setItem(String(counter), img);
        setStorageInfo((prev) => ({
          ...prev,
          success: true,
          message: `이미지 ${counter} localStorage 저장 성공`,
        }));
      }

      setCompleteOpen(true);
      setTimeout(() => updateStorageInfo(), 200);
    } catch (_) {
      try {
        localStorage.setItem(String(counter), img);
        setStorageInfo((prev) => ({
          ...prev,
          success: true,
          message: `이미지 ${counter} localStorage 폴백 저장 성공`,
        }));
        setCompleteOpen(true);
      } catch (_) {
        setStorageInfo((prev) => ({
          ...prev,
          success: false,
          message: `이미지 ${counter} 저장 실패`,
        }));
      }
    }
  }, [counter, isDBReady, updateStorageInfo]);

  useEffect(() => {
    setTimer(1);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newTimer = (Math.floor(elapsed / 1000) % 10) + 1;
      setTimer((prev) => (prev !== newTimer ? newTimer : prev));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 10 && !hasCaptured) {
      setHasCaptured(true);
      void (async () => {
        await capture();
        setCounter((prev) => prev + 1);
      })();
    } else if (timer === 1) {
      setCompleteOpen(false);
      setHasCaptured(false);
    }
  }, [timer, hasCaptured, capture]);

  useEffect(() => {
    if (counter === 10) setCounter(0);
  }, [counter]);

  const webcamStyle = useMemo(
    () => ({
      filter: 'brightness(1.4) contrast(1) saturate(0.8)',
    }),
    []
  );

  const handleCleanup = useCallback(async () => {
    try {
      if (isDBReady) {
        const deletedCount = await cleanupOldImages(0);
        setStorageInfo((prev) => ({
          ...prev,
          message: `${deletedCount}개 이미지 정리 완료`,
        }));
      } else {
        const keys = Object.keys(localStorage).filter(
          (key) => !isNaN(Number(key))
        );
        keys.forEach((key) => localStorage.removeItem(key));
        setStorageInfo((prev) => ({
          ...prev,
          message: `${keys.length}개 이미지 정리 완료`,
        }));
      }
      updateStorageInfo();
    } catch (_) {
      setStorageInfo((prev) => ({
        ...prev,
        success: false,
        message: '정리 실패',
      }));
    }
  }, [isDBReady, updateStorageInfo]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[587px] h-[780px] relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          width={587}
          height={780}
          videoConstraints={videoConstraints}
          screenshotFormat="image/jpeg"
          screenshotQuality={1.0}
          className="transform scale-x-[-1]"
          style={webcamStyle}
        />
        <div className="text-[40px] font-bold text-black absolute top-[32px] left-[42px]">
          {timer}
        </div>
        {completeOpen && (
          <div className="bg-black bg-opacity-40 fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
            <div className="text-[56px] font-bold text-white absolute ">
              {counter}/10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
