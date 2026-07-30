"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-11 w-11 rounded-full border border-transparent" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle Theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        group
        relative
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        border
        border-border/70
        bg-background/70
        backdrop-blur-xl
        shadow-sm

        /* Smooth Transitions */
        transition-all
        duration-300

        /* Hover Effects */
        hover:border-primary/40
        hover:bg-muted/80
        hover:shadow-md

        /* Click Feedback */
        active:scale-95
      "
    >
      {/* Sun Icon */}
      <Sun
        className={`h-5 w-5 text-amber-500 transition-all duration-300 ${
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "absolute scale-0 -rotate-90 opacity-0"
        }`}
      />

      {/* Moon Icon */}
      <Moon
        className={`h-5 w-5 text-indigo-400 transition-all duration-300 ${
          isDark
            ? "absolute scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
      />
    </Button>
  );
}
