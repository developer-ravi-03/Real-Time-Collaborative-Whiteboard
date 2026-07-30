interface StickyNoteProps {
  title: string;
  className?: string;
}

export default function StickyNote({ title, className = "" }: StickyNoteProps) {
  return (
    <div
      className={`
        absolute
        rounded-xl
        px-5
        py-3
        font-semibold
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        ${className}
      `}
    >
      {title}
    </div>
  );
}
