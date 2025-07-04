interface ITriangleType {
  color?: string;
}

export default function Triangle({color = 'black'}: ITriangleType) {
  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 9 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.0800781 14.2084H8.33008L8.01953 0.42627" fill={color} />
    </svg>
  );
}
