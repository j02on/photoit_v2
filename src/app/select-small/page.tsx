'use client';

import Image from 'next/image';
import { getSmallImageFromDB } from '@/components/method/smallImageDB';
import { useEffect, useState } from 'react';
import { Button, SmallPhotoFrame } from '@/components';
import { useRouter } from 'next/navigation';

export default function SelectSmall() {
  const router = useRouter();
  const [datas, setDatas] = useState<Record<string, string>>({
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
  });
  const [selectDatas, setSelectDatas] = useState<string[]>([]);

  const completeClick = () => {
    router.push('/templete-small');
  };

  useEffect(() => {
    localStorage.setItem('1', selectDatas[0]);
    localStorage.setItem('2', selectDatas[1]);
    localStorage.setItem('3', selectDatas[2]);
    localStorage.setItem('4', selectDatas[3]);
  }, [selectDatas]);

  useEffect(() => {
    async function fetchData() {
      const newDatas: Record<string, string> = {};
      for (let i = 0; i < 10; i++) {
        const image = await getSmallImageFromDB(String(i));
        if (image) {
          newDatas[String(i)] = image.imageData;
        }
      }
      setDatas((prev) => ({ ...prev, ...newDatas }));
    }
    fetchData();
  }, []);

  const onImageClick = (src: string) => {
    setSelectDatas((prev) => {
      //선택된 건 선택 x
      if (prev.includes(src)) return prev;
      if (prev.length < 4) {
        return [...prev, src];
      } else {
        return [...prev.slice(1), src];
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-end gap-[30px] px-[100px] pt-[72px]">
      <div className="flex w-full justify-around">
        <div className="flex flex-wrap gap-[32px] w-full">
          {Object.entries(datas).map(([key, src]) =>
            src ? (
              <Image
                onClick={() => onImageClick(src)}
                key={key}
                className="w-[250px] h-[158px] bg-black"
                src={src}
                alt={`Image ${key}`}
                width={200}
                height={266}
              />
            ) : (
              <div
                key={key}
                className="w-[250px] h-[158px] bg-black flex items-center justify-center text-white"
              >
                No Image
              </div>
            )
          )}
        </div>
        <div>
          <SmallPhotoFrame imgUrl={selectDatas} />
        </div>
      </div>
      <Button onClick={completeClick}>complete</Button>
    </div>
  );
}
