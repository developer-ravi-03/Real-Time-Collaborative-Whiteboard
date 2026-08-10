// src/components/room/RoomBoardCard.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Infinity as InfinityIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { RoomBoard, RoomRole } from "@/types/room";

type RoomBoardCardProps = {
  board: RoomBoard;
  yourRole: RoomRole;
  isSessionActive: boolean;

  onEdit: (boardId: string) => void;
  onDelete: (boardId: string) => void;
};

export function RoomBoardCard({
  board,
  yourRole,
  isSessionActive,
  onEdit,
  onDelete,
}: RoomBoardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const canEdit =
    isSessionActive &&
    (yourRole === "OWNER" || yourRole === "ADMIN" || yourRole === "EDITOR");

  const canDelete = isSessionActive && yourRole === "OWNER";

  return (
    <div
      className="
        group
        relative
        rounded-2xl
        border
        border-border
        bg-card
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:shadow-md
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        {/* Board Icon + Type */}
        <Link
          href={`/board/${board.id}`}
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-muted
            "
          >
            {board.type === "INFINITE" ? (
              <InfinityIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <FileText className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {/* <span
            className="
              rounded-full
              bg-muted
              px-2.5
              py-1
              text-[10px]
              font-medium
              uppercase
              tracking-wide
              text-muted-foreground
            "
          >
            {board.type}
          </span> */}

          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {board.type === "INFINITE" ? "Infinite" : "Slides"}
          </span>
        </Link>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label="Board actions"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
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
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {menuOpen && (
              <>
                {/* Click outside */}
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />

                {/* Menu */}
                <div
                  className="
                    absolute
                    right-0
                    top-10
                    z-20
                    w-44
                    overflow-hidden
                    rounded-xl
                    border
                    border-border
                    bg-popover
                    p-1
                    shadow-xl
                  "
                >
                  {/* Open */}
                  <Link
                    href={`/board/${board.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2.5
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      transition
                      hover:bg-muted
                    "
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Open Board
                  </Link>

                  {/* Edit */}
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(board.id);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        transition
                        hover:bg-muted
                        cursor-pointer
                      "
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Board
                    </button>
                  )}

                  {/* Delete */}
                  {canDelete && (
                    <>
                      <div className="my-1 border-t border-border" />

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete(board.id);
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-2.5
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          text-destructive
                          transition
                          hover:bg-destructive/10
                          cursor-pointer
                        "
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Board
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Board Information */}
      <Link
        href={`/board/${board.id}`}
        onClick={() => setMenuOpen(false)}
        className="block"
      >
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold transition-colors group-hover:text-primary">
              {board.name}
            </h3>
          </div>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {board.description || "Collaborative whiteboard"}
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {board.pageCount} {board.pageCount === 1 ? "page" : "pages"}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{yourRole}</span>

            {!isSessionActive && (
              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                CLOSED
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
