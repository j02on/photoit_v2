interface IButtonType {
  children: string;
  onClick?: () => void;
}

export default function Button({ children, onClick }: IButtonType) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer font-bold py-[15px] px-[121px] rounded-full border bg-transparent flex justify-center items-center text-white text-[20px]"
    >
      {children}
    </button>
  );
}
