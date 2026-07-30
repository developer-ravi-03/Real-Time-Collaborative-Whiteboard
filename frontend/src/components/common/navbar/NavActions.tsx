"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function NavActions() {
  return (
    <div className="hidden items-center gap-8 pr-1 lg:flex">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Login */}
      <Button
        asChild
        variant="ghost"
        className=" h-11 rounded-full px-5 text-[15px] font-medium border border-transparent hover:border-border hover:bg-background hover:shadow-sm transition-all duration-300"
      >
        <Link href="/login">Login</Link>
      </Button>

      {/* Get Started */}
      <Button
        asChild
        variant="brand"
        className="group h-13 rounded-full mr-1 bg-[#172033] hover:bg-[#1d2942] border border-white/10 px-8 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)] active:scale-[0.98] "
      >
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-3"
        >
          <span>Get Started</span>

          <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
