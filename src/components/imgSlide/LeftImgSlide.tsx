import { LeftSlideImg } from '@/assets';
import { AnimationBox } from '../method';

export default function LeftImgSlide() {
  return (
    <div className="h-screen overflow-hidden">
      <AnimationBox rotate="up">
        <div className="flex gap-4 flex-col">
          <LeftSlideImg />
        </div>
      </AnimationBox>
    </div>
  );
}
