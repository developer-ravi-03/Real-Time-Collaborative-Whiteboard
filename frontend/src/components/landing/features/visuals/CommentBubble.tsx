interface CommentBubbleProps {
  text: string;
  className?: string;
}

export default function CommentBubble({
  text,
  className = "",
}: CommentBubbleProps) {
  return (
    <div
      className={`
        absolute
        rounded-2xl
        border
        border-border/60
        bg-background/80
        px-5
        py-3
        text-sm
        shadow-xl
        backdrop-blur-xl
        ${className}
      `}
    >
      💬 {text}
    </div>
  );
}
