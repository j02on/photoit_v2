import FramePhrase from './FramePhrase';

interface ILargeType {
  imgUrl: string[];
  colorTheme?: {
    background: string;
    color: string;
  };
  filter?: string;
}

export default function LargePhotoFrame({
  imgUrl = [],
  colorTheme = { background: '#ffffff', color: '#000000' },
  filter,
}: ILargeType) {
  const { background = 'white', color: textColor = 'black' } = colorTheme;

  const filters = () => {
    if (filter === 'c') {
      return 'brightness(1.2) contrast(1) saturate(0.6)';
    } else if (filter === 'w') {
      return 'brightness(1.2) contrast(1) saturate(0.8)';
    } else if (filter === 'n') {
      return 'brightness(1.2) contrast(1) saturate(1.1)';
    } else {
      return 'none';
    }
  };

  return (
    <div
      className="w-[500px] h-[750px] px-[20px] pt-[30px] pb-[103px] flex justify-center"
      style={{ backgroundColor: background }}
    >
      <div className="flex flex-col gap-[34px] w-full">
        <div
          className="text-[24px] font-bold w-fit"
          style={{ color: textColor }}
        >
          photoIt
        </div>
        <div className="flex w-full h-fit justify-around items-start">
          <FramePhrase color={colorTheme.color} />
          <div className="flex flex-col items-center gap-[13px] h-fit w-fit">
            <div className="flex items-center gap-[13px]">
              {imgUrl[0] ? (
                <img
                  className="w-[200px] h-[266px] bg-black"
                  src={imgUrl[0]}
                  alt="사진1"
                  style={{ filter: filters() }}
                />
              ) : (
                <div className="w-[200px] h-[266px] bg-black"></div>
              )}
              {imgUrl[1] ? (
                <img
                  className="w-[200px] h-[266px] bg-black"
                  src={imgUrl[1]}
                  alt="사진2"
                  style={{ filter: filters() }}
                />
              ) : (
                <div className="w-[200px] h-[266px] bg-black"></div>
              )}
            </div>
            <div className="flex items-center gap-[13px]">
              {imgUrl[2] ? (
                <img
                  className="w-[200px] h-[266px] bg-black"
                  src={imgUrl[2]}
                  alt="사진3"
                  style={{ filter: filters() }}
                />
              ) : (
                <div className="w-[200px] h-[266px] bg-black"></div>
              )}
              {imgUrl[3] ? (
                <img
                  className="w-[200px] h-[266px] bg-black"
                  src={imgUrl[3]}
                  alt="사진4"
                  style={{ filter: filters() }}
                />
              ) : (
                <div className="w-[200px] h-[266px] bg-black"></div>
              )}
            </div>
          </div>
          <FramePhrase color={colorTheme.color} />
        </div>
      </div>
    </div>
  );
}
