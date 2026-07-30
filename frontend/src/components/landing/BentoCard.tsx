import { ReactNode } from "react";

type BentoCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function BentoCard({
  title,
  description,
  icon,
  children,
  className = "",
}: BentoCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl ${className}`}
    >
      {/* Glow */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <h3 className="text-xl font-semibold">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
