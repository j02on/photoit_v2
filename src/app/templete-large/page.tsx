'use client';

import { Button, LargePhotoFrame } from '@/components';
import { useEffect, useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import { useRouter } from 'next/navigation';
import { optimizeImage } from '@/utils/imageOptimization';

export default function TempleteLarge() {
  const router = useRouter();
  const [selectDatas, setSelectDatas] = useState<string[]>([]);
  const [frameColor, setFrameColor] = useState<{
    background: string;
    color: string;
  }>({
    background: '#FFFFFF',
    color: '#000000',
  });
  const frameRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>('');

  const printClick = async () => {
    const photo = frameRef.current;
    if (!photo) return;

    // 스케일을 낮춰서 파일 크기 최적화
    const scale = 1.5;
    const style = {
      transform: 'scale(' + scale + ')',
      transformOrigin: 'top left',
      width: photo.offsetWidth + 'px',
      height: photo.offsetHeight + 'px',
    };

    const param = {
      width: photo.offsetWidth * scale,
      height: photo.offsetHeight * scale,
      style,
      quality: 0.7, // 품질 낮춤
    };

    try {
      const blob = await domtoimage.toBlob(photo, param);
      saveAs(blob, 'photoIt.png');
      router.push('/complete');
    } catch (error) {
      console.error('이미지 생성 실패:', error);
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const images: string[] = [];

      for (let i = 1; i <= 4; i++) {
        const value = localStorage.getItem(String(i));
        if (value) {
          // 이미지 최적화 - 더 작은 크기와 낮은 품질로
          const optimized = await optimizeImage(value, 400, 300, 0.6);
          images.push(optimized);
        }
      }

      setSelectDatas(images);
    };

    loadImages();
  }, []);

  return (
    <div className="w-full flex flex-col items-end gap-[30px] px-[140px] pt-[40px]">
      <div className="flex w-full justify-between">
        <div className="w-fit h-fit" ref={frameRef}>
          <LargePhotoFrame
            filter={filter}
            colorTheme={frameColor}
            imgUrl={selectDatas}
          />
        </div>
        <div className="flex flex-col gap-[112px]">
          <div className="flex flex-col gap-[46px] items-end">
            <div className="font-bold text-white text-[40px]">colors</div>
            <div className="flex gap-[80px] items-center">
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-white"
                onClick={() =>
                  setFrameColor({ background: '#FFFFFF', color: '#000000' })
                }
              ></div>
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-black"
                onClick={() =>
                  setFrameColor({ background: '#000000', color: '#FFFFFF' })
                }
              ></div>
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-[#EFEFEF]"
                onClick={() =>
                  setFrameColor({ background: '#EFEFEF', color: '#000000' })
                }
              ></div>
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-[#FFEEF9]"
                onClick={() =>
                  setFrameColor({ background: '#FFEEF9', color: '#000000' })
                }
              ></div>
            </div>
          </div>
          <div className="flex flex-col gap-[46px] items-end">
            <div className="font-bold text-white text-[40px]">filters</div>
            <div className="flex gap-[80px] items-center">
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-black flex justify-center items-center font-bold text-white text-[20px]"
                onClick={() => setFilter('none')}
              >
                reset
              </div>
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-white opacity-50"
                onClick={() => setFilter('n')}
              ></div>
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-[#B2E0FF] opacity-50"
                onClick={() => setFilter('c')}
              ></div>
              <div
                className="cursor-pointer rounded-full w-[90px] h-[90px] bg-[#FFEDCA] opacity-30"
                onClick={() => setFilter('w')}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={printClick}>print</Button>
    </div>
  );
}
