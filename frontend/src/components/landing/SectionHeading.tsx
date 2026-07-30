import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, className }: { eyebrow: string; title: string; description: string; className?: string }) {
  return <div className={cn("mx-auto max-w-2xl text-center", className)}>
    <p className="mb-4 text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase dark:text-indigo-400">{eyebrow}</p>
    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">{title}</h2>
    <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
  </div>;
}
