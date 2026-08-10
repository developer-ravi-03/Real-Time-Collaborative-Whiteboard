// src/components/room/RoomBoardCard.tsx

import Link from "next/link";
import { ArrowUpRight, FileText, Infinity } from "lucide-react";

import type { RoomBoard, RoomRole } from "@/types/room";

type RoomBoardCardProps = {
  board: RoomBoard;
  yourRole: RoomRole;
};

export function RoomBoardCard({ board, yourRole }: RoomBoardCardProps) {
  return (
    <div
      className="
    group
    rounded-2xl
    border
    border-border
    bg-card
    p-5
    transition-all
    hover:-translate-y-0.5
    hover:border-primary/40
    hover:shadow-lg
  "
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
          {board.type === "INFINITE" ? (
            <Infinity className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </div>

        <ArrowUpRight
          className="
            h-5
            w-5
            text-muted-foreground
            transition
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
            group-hover:text-foreground
          "
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{board.name}</h3>

          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
            {board.type}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {board.description || "Collaborative whiteboard"}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          {board.pageCount} {board.pageCount === 1 ? "page" : "pages"}
        </span>

        <span className="text-xs text-muted-foreground">{yourRole}</span>
      </div>
    </div>
  );
}
