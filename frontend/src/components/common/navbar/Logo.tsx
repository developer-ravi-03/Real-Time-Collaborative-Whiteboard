"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-foreground">
          SyncBoard
        </span>

        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Collaborative Workspace
        </span>
      </div>
    </Link>
  );
}
