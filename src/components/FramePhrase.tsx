import { Triangle } from '@/assets';

interface IFrameType {
  color?: string;
}

export default function FramePhrase({ color = 'black' }: IFrameType) {
  const originalHeight = 24;

  return (
    <div
      className="flex items-center gap-[200px] w-fit"
      style={{
        transform: 'rotate(90deg)',
        transformOrigin: 'center',
        width: originalHeight,
      }}
    >
      <div className="flex gap-[20px] items-center">
        <div style={{ color: color }}>MOMENT</div>
        <div className="flex gap-[4px] items-center">
          <Triangle color={color} />
          <div style={{ color: color }}>12</div>
        </div>
      </div>
      <div className="flex gap-[20px] items-center">
        <div style={{ color: color }}>MOMENT</div>
        <div className="flex gap-[4px] items-center">
          <Triangle />
          <div style={{ color: color }}>12</div>
        </div>
      </div>
    </div>
  );
}
