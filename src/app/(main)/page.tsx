'use client';

import { useRouter } from 'next/navigation';

export default function Main() {
  const router = useRouter();
  const startClick = () => {
    router.push('/choice');
  };
  return (
    <div>
      <div className="flex w-full h-screen justify-center items-center">
        <h1 className="font-bold text-white text-7xl">photoIt</h1>
      </div>
      <div className="flex w-full justify-center">
        <button
          onClick={startClick}
          className="absolute bottom-60 font-medium text-3xl text-white bg-transparent cursor-pointer"
        >
          start
        </button>
      </div>
    </div>
  );
}
