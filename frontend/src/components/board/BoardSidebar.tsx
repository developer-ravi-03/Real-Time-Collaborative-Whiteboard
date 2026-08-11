"use client";

import { useState } from "react";
import { FileText, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Board, BoardPage } from "@/types/board";

type BoardSidebarProps = {
  board: Board;
  pages: BoardPage[];
  selectedPageId: string | null;

  canCreatePage: boolean;
  canEditPage: boolean;
  canDeletePage: boolean;

  onSelectPage: (pageId: string) => void;
  onCreatePage: () => void;
  onEditPage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
};

export function BoardSidebar({
  board,
  pages,
  selectedPageId,
  canCreatePage,
  canEditPage,
  canDeletePage,
  onSelectPage,
  onCreatePage,
  onEditPage,
  onDeletePage,
}: BoardSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Pages</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {pages.length} {pages.length === 1 ? "page" : "pages"}
            </p>
          </div>

          {canCreatePage && (
            <button
              type="button"
              onClick={onCreatePage}
              aria-label="Create page"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                border border-border
                text-muted-foreground
                transition
                hover:bg-muted
                hover:text-foreground
                cursor-pointer
              "
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pages */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {pages.map((page) => {
            const selected = page.id === selectedPageId;

            const showActions = canEditPage || canDeletePage;

            return (
              <div
                key={page.id}
                className={`
                  group relative w-full rounded-xl border
                  transition
                  ${
                    selected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }
                `}
              >
                {selected && (
                  <div className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuId(null);
                    onSelectPage(page.id);
                  }}
                  className="w-full p-3 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-7">
                    {/* Icon */}
                    <div
                      className={`
                        flex h-9 w-9 shrink-0
                        items-center justify-center
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

                    {/* Page info */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {page.title || `Page ${page.pageNumber}`}
                      </p>

                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Page {page.pageNumber}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Page Actions */}
                {showActions && (
                  <div className="absolute right-2 top-2">
                    <button
                      type="button"
                      aria-label="Page actions"
                      aria-expanded={openMenuId === page.id}
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenMenuId((current) =>
                          current === page.id ? null : page.id,
                        );
                      }}
                      className="
                        flex h-7 w-7 items-center justify-center
                        rounded-md
                        text-muted-foreground
                        opacity-100
                        transition
                        sm:opacity-0
                        sm:group-hover:opacity-100
                        group-hover:opacity-100
                        hover:bg-muted
                        hover:text-foreground
                        cursor-pointer
                      "
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === page.id && (
                      <>
                        {/* Outside click layer */}
                        <button
                          type="button"
                          aria-label="Close page menu"
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() => setOpenMenuId(null)}
                        />

                        {/* Menu */}
                        <div
                          className="
                            absolute
                            right-0
                            top-8
                            z-20
                            w-40
                            overflow-hidden
                            rounded-xl
                            border
                            border-border
                            bg-popover
                            p-1
                            shadow-xl
                          "
                        >
                          {/* Rename */}
                          {canEditPage && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEditPage(page.id);
                              }}
                              className="
                                flex w-full items-center gap-2.5
                                rounded-lg
                                px-3 py-2.5
                                text-left text-sm
                                transition
                                hover:bg-muted
                                cursor-pointer
                              "
                            >
                              <Pencil className="h-4 w-4" />
                              Rename Page
                            </button>
                          )}

                          {/* Delete */}
                          {canDeletePage && (
                            <>
                              {canEditPage && (
                                <div className="my-1 border-t border-border" />
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onDeletePage(page.id);
                                }}
                                className="
                                  flex w-full items-center gap-2.5
                                  rounded-lg
                                  px-3 py-2.5
                                  text-left text-sm
                                  text-destructive
                                  transition
                                  hover:bg-destructive/10
                                  cursor-pointer
                                "
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Page
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
