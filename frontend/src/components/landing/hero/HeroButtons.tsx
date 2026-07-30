import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
      {/* Primary Button */}
      <Link
        href="/signup"
        className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-medium text-neutral-900 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-lg"
      >
        <span>Start Free</span>
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      {/* Secondary Button */}
      <Link
        href="#"
        className="group inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white/80 px-8 text-base font-medium text-neutral-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-md"
      >
        <Play className="mr-2 h-4 w-4 fill-current text-neutral-700" />
        <span>Watch Demo</span>
      </Link>
    </div>
  );
}
