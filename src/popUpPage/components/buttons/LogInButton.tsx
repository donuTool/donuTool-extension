type LoginButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  extraClassName?: string;
};

export default function LoginButton({
  onClick,
  icon,
  label,
  extraClassName,
}: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`dark:bg-donutool-button dark:text-donutool-text relative flex w-40 cursor-pointer items-center rounded-full bg-gray-100 py-2 pr-3 pl-8 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md ${extraClassName || ""}`}
    >
      {icon}
      <span className="flex-1 text-center">{label}</span>
    </button>
  );
}
