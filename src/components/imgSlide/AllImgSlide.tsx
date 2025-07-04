import LeftImgSlide from './LeftImgSlide';
import RightImgSlide from './RightImgSlide';

export default function AllImgSlide() {
  return (
    <div className="w-full px-[46px] fixed top-0 left-0 flex justify-between z-[-1]">
      <LeftImgSlide />
      <RightImgSlide />
    </div>
  );
}
