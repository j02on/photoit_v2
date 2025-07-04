'use client';

import { LargePhoto, SmallPhoto } from '@/assets';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';

export default function Choice() {
  const router = useRouter();

  const smallClick = () => {
    router.push('/small-shot');
  };

  const largeClick = () => {
    router.push('/large-shot');
  };

  return (
    <div className="px-[210px] bg-black flex  w-full h-screen justify-center items-center">
      <div className="flex flex-col gap-[48px] w-full">
        <div className="text-[50px] font-bold text-white">choice</div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col items-center gap-[64px] w-fit">
            <SmallPhoto />
            <Button onClick={smallClick}>select</Button>
          </div>
          <div className="flex flex-col items-center gap-[64px] w-fit">
            <LargePhoto />
            <Button onClick={largeClick}>select</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
