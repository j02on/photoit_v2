'use client';

import Webcam from 'react-webcam';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  openLargeDB,
  saveLargeImageToDB,
  getStorageUsage,
} from '@/components/method/largeImageDB';

const videoConstraints = {
  width: 587,
  height: 780,
  facingMode: 'user',
  frameRate: { ideal: 30, max: 60 },
};

export default function LargeShot() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [timer, setTimer] = useState<number>(0);
  const [counter, setCounter] = useState<number>(0);
  const [completeOpen, setCompleteOpen] = useState<boolean>(false);
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [, setStorageInfo] = useState<{
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
    } catch {
      // 에러 무시
    }
  }, []);

  useEffect(() => {
    const initDB = async () => {
      try {
        await openLargeDB();
        setIsDBReady(true);
        setStorageInfo((prev) => ({
          ...prev,
          success: true,
          message: 'IndexedDB 초기화 완료',
        }));
      } catch {
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
    if (!webcamRef.current?.video) return;

    const video = webcamRef.current.video as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.filter = 'brightness(1.4) contrast(1) saturate(0.8)';
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = canvas.toDataURL('image/jpeg');

    try {
      if (isDBReady) {
        await saveLargeImageToDB(String(counter), img);
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
    } catch {
      try {
        localStorage.setItem(String(counter), img);
        setStorageInfo((prev) => ({
          ...prev,
          success: true,
          message: `이미지 ${counter} localStorage 폴백 저장 성공`,
        }));
        setCompleteOpen(true);
      } catch {
        setStorageInfo((prev) => ({
          ...prev,
          success: false,
          message: `이미지 ${counter} 저장 실패`,
        }));
      }
    }
  }, [counter, isDBReady, updateStorageInfo]);

  useEffect(() => {
    setTimer(10);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newTimer = 10 - (Math.floor(elapsed / 1000) % 10);
      setTimer((prev) => (prev !== newTimer ? newTimer : prev));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 1 && !hasCaptured) {
      setHasCaptured(true);
      void (async () => {
        await capture();
        setCounter((prev) => prev + 1);
      })();
    } else if (timer === 10) {
      setCompleteOpen(false);
      setHasCaptured(false);
    }
  }, [timer, hasCaptured, capture]);

  useEffect(() => {
    if (counter === 10) {
      setCounter(0);
      router.push('/select-large');
    }
  }, [counter, router]);

  const webcamStyle = useMemo(
    () => ({
      filter: 'brightness(1.4) contrast(1) saturate(0.8)',
    }),
    []
  );

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
        {completeOpen && counter > 0 && (
          <div className="bg-black bg-opacity-40 fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
            <div className="text-[56px] font-bold text-white absolute">
              {counter}/10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
