import FramePhrase from './FramePhrase';

interface ISmallType {
  imgUrl: string[];
  colorTheme?: {
    background: string;
    color: string;
  };
  filter?: string;
}

export default function SmallPhotoFrame({
  imgUrl = [],
  colorTheme = { background: '#ffffff', color: '#000000' },
  filter,
}: ISmallType) {
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
      className="w-[320px] h-[900px] px-[20px] pt-[30px] pb-[103px] flex justify-center"
      style={{ backgroundColor: background }}
    >
      <div className="flex flex-col gap-[34px] w-fit">
        <div
          className="text-[20px] font-bold w-fit"
          style={{ color: textColor }}
        >
          photoIt
        </div>
        <div className="flex w-full h-fit justify-around items-start">
          <FramePhrase color={colorTheme.color} />
          <div className="flex flex-col items-center gap-[13px] h-fit w-fit">
            {imgUrl[0] ? (
              <img
                className="w-[250px] h-[158px] bg-black"
                src={imgUrl[0]}
                style={{ filter: filters() }}
                alt="사진1"
              />
            ) : (
              <div className="w-[250px] h-[158px] bg-black"></div>
            )}
            {imgUrl[1] ? (
              <img
                className="w-[250px] h-[158px] bg-black"
                src={imgUrl[1]}
                style={{ filter: filters() }}
                alt="사진2"
              />
            ) : (
              <div className="w-[250px] h-[158px] bg-black"></div>
            )}
            {imgUrl[2] ? (
              <img
                className="w-[250px] h-[158px] bg-black"
                src={imgUrl[2]}
                style={{ filter: filters() }}
                alt="사진3"
              />
            ) : (
              <div className="w-[250px] h-[158px] bg-black"></div>
            )}
            {imgUrl[3] ? (
              <img
                className="w-[250px] h-[158px] bg-black"
                src={imgUrl[3]}
                style={{ filter: filters() }}
                alt="사진4"
              />
            ) : (
              <div className="w-[250px] h-[158px] bg-black"></div>
            )}
          </div>
          <FramePhrase color={colorTheme.color} />
        </div>
      </div>
    </div>
  );
}
