import { LargePhoto, SmallPhoto } from '@/assets';
import { Button } from '@/components';

export default function Choice() {
  return (
    <div className="px-[210px] bg-black flex  w-full h-screen justify-center items-center">
      <div className="flex flex-col gap-[48px] w-full">
        <div className="text-[50px] font-bold text-white">choice</div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col items-center gap-[64px] w-fit">
            <SmallPhoto />
            <Button>select</Button>
          </div>
          <div className="flex flex-col items-center gap-[64px] w-fit">
            <LargePhoto />
            <Button>select</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
