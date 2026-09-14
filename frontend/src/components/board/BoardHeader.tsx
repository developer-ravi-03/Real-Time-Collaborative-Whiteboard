"use client";

import Link from "next/link";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

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
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
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
        {/* More Actions */}
        <button
          type="button"
          aria-label="Board actions"
          className="
            flex
            h-9
            w-9
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
          "
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
