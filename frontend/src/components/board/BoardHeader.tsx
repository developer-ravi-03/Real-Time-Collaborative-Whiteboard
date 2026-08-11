"use client";

import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Check } from "lucide-react";

import type { Board } from "@/types/board";

type BoardHeaderProps = {
  board: Board;
};

export function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <header
      className="
        flex
        h-16
        shrink-0
        items-center
        justify-between
        border-b
        border-border
        bg-background
        px-4
        sm:px-6
      "
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Back to Room */}
        <Link
          href={`/room/${board.roomId}`}
          aria-label="Back to room"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
            cursor-pointer
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-border sm:block" />

        {/* Board Info */}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-sm font-semibold">{board.name}</h1>

            <span
              className="
                hidden
                rounded-full
                bg-muted
                px-2
                py-0.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-muted-foreground
                sm:inline-flex
              "
            >
              {board.type}
            </span>
          </div>

          <p className="truncate text-xs text-muted-foreground">
            {board.type === "INFINITE" ? "Infinite Whiteboard" : "Slides Board"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Save Status */}
        <div
          className="
            hidden
            items-center
            gap-2
            rounded-lg
            border
            border-border
            px-3
            py-2
            sm:flex
          "
        >
          <span className="flex h-4 w-4 items-center justify-center">
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          </span>

          <span className="text-xs font-medium text-muted-foreground">
            Saved
          </span>
        </div>

        {/* Mobile Save Status */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-border
            sm:hidden
          "
          title="Saved"
        >
          <Check className="h-4 w-4 text-emerald-500" />
        </div>

        {/* More Actions */}
        <button
          type="button"
          aria-label="Board actions"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
            cursor-pointer
          "
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
