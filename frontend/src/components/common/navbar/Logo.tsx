"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="SyncBoard Home"
      className="group flex items-center gap-3"
    >
      {/* Brand Mark */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
        <div className="grid grid-cols-2 gap-1">
          <span className="h-1.5 w-1.5 rounded-sm bg-white" />
          <span className="h-1.5 w-1.5 rounded-sm bg-white/80" />
          <span className="h-1.5 w-1.5 rounded-sm bg-white/80" />
          <span className="h-1.5 w-1.5 rounded-sm bg-white" />
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          SyncBoard
        </span>

        <span className="text-xs font-medium tracking-[0.18em] uppercase text-muted-foreground">
          Collaborative Workspace
        </span>
      </div>
    </Link>
  );
}
