import { Sparkles } from "lucide-react";

export default function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 backdrop-blur-xl">
      <Sparkles className="h-4 w-4 text-blue-500" />

      <span className="text-sm font-medium text-muted-foreground">
        AI Powered Collaboration Platform
      </span>
    </div>
  );
}
