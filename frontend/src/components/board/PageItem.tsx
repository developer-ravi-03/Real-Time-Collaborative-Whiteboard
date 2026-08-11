"use client";

import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { BoardPage } from "@/types/board";

type PageItemProps = {
  page: BoardPage;
  selected: boolean;
  canEdit: boolean;
  canDelete: boolean;

  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PageItem({
  page,
  selected,
  canEdit,
  canDelete,
  onSelect,
  onEdit,
  onDelete,
}: PageItemProps) {
  return (
    <div
      className={`
        group flex items-center gap-2 rounded-xl border p-2
        transition
        ${
          selected
            ? "border-primary/40 bg-primary/5"
            : "border-border hover:bg-muted/50"
        }
      `}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 p-1 text-left"
      >
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-lg
            ${
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          <FileText className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {page.title || `Page ${page.pageNumber}`}
          </p>

          <p className="text-[11px] text-muted-foreground">
            Page {page.pageNumber}
          </p>
        </div>
      </button>

      {(canEdit || canDelete) && (
        <div className="relative">
          <button
            type="button"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-muted-foreground
              opacity-0
              transition
              group-hover:opacity-100
              hover:bg-muted
            "
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
