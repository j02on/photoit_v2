'use client';

import { Button } from '@/components';
import { useRouter } from 'next/navigation';

export default function Complete() {
  const router = useRouter();
  const homeNavClick = () => {
    router.push('/');
  };
  return (
    <div className="bg-black w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-[40px] items-center">
        <div className="font-bold text-white text-[40px]">Complete</div>
        <Button onClick={homeNavClick}>Home</Button>
      </div>
    </div>
  );
}
