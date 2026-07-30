interface CursorTagProps {
  name: string;
  className?: string;
}

export default function CursorTag({ name, className = "" }: CursorTagProps) {
  return (
    <div
      className={`
        absolute
        rounded-full
        bg-blue-500
        px-3
        py-1
        text-xs
        font-semibold
        text-white
        shadow-lg
        ${className}
      `}
    >
      {name}
    </div>
  );
}
