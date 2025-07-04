'use client';

import { Button, LargePhotoFrame } from '@/components';
import { useEffect, useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import { useRouter } from 'next/navigation';

// 이미지 압축 함수
const compressImage = (dataUrl: string, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 최대 크기 제한 (화질 유지를 위해 적당한 크기로 설정)
      const maxWidth = 1000;
      const maxHeight = 800;
      
      let { width, height } = img;
      
      // 비율 유지하면서 크기 조정
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        // 이미지 품질 향상을 위한 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // 품질 설정으로 압축 (0.8 = 80% 품질)
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
};

export default function TempleteLarge() {
  const router = useRouter();
  const [selectDatas, setSelectDatas] = useState<string[]>([]);
  const [compressedDatas, setCompressedDatas] = useState<string[]>([]);
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

    // 스케일을 조금 줄여서 파일 크기 최적화
    const scale = 2.5;
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
      quality: 0.85, // 품질 설정
    };

    try {
      const blob = await domtoimage.toBlob(photo, param);
      saveAs(blob, 'photoIt.png');
      router.push('/complete');
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      // 에러 시 더 낮은 품질로 재시도
      const fallbackParam = {
        ...param,
        quality: 0.7,
        width: photo.offsetWidth * 2,
        height: photo.offsetHeight * 2,
      };
      try {
        const blob = await domtoimage.toBlob(photo, fallbackParam);
        saveAs(blob, 'photoIt.png');
        router.push('/complete');
      } catch (fallbackError) {
        console.error('폴백 이미지 생성도 실패:', fallbackError);
      }
    }
  };

  useEffect(() => {
    const loadAndCompressImages = async () => {
      const images: string[] = [];
      const compressed: string[] = [];
      
      for (let i = 1; i <= 4; i++) {
        const value = localStorage.getItem(String(i));
        if (value) {
          images.push(value);
          // 이미지 압축 (80% 품질 유지)
          const compressedImage = await compressImage(value, 0.8);
          compressed.push(compressedImage);
        }
      }
      
      setSelectDatas(images);
      setCompressedDatas(compressed);
    };

    loadAndCompressImages();
  }, []);

  return (
    <div className="w-full flex flex-col items-end gap-[30px] px-[140px] pt-[40px]">
      <div className="flex w-full justify-between">
        <div className="w-fit h-fit" ref={frameRef}>
          <LargePhotoFrame
            filter={filter}
            colorTheme={frameColor}
            imgUrl={compressedDatas.length > 0 ? compressedDatas : selectDatas}
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