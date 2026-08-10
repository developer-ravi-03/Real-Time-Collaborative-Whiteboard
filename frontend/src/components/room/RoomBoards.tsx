// src/components/room/RoomBoards.tsx

"use client";

import { Plus, LayoutDashboard } from "lucide-react";

import type { RoomBoard, RoomRole } from "@/types/room";

import { RoomBoardCard } from "./RoomBoardCard";

type RoomBoardsProps = {
  boards: RoomBoard[];
  yourRole: RoomRole;
  isSessionActive: boolean;

  onCreateBoard: () => void;
  onEditBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
};

export function RoomBoards({
  boards,
  yourRole,
  isSessionActive,
  onCreateBoard,
  onEditBoard,
  onDeleteBoard,
}: RoomBoardsProps) {
  const canCreateBoard =
    (yourRole === "OWNER" || yourRole === "ADMIN" || yourRole === "EDITOR") &&
    isSessionActive;

  return (
    <section>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Boards</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a board to start collaborating.
          </p>
        </div>

        {canCreateBoard && (
          <button
            type="button"
            onClick={onCreateBoard}
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-xl
              bg-primary
              px-4
              text-sm
              font-semibold
              text-primary-foreground
              transition
              hover:-translate-y-0.5
              hover:shadow-md
              cursor-pointer
            "
          >
            <Plus className="h-4 w-4" />
            New Board
          </button>
        )}
      </div>

      {/* Boards */}
      {boards.length === 0 ? (
        <div
          className="
            mt-6
            flex
            min-h-64
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-border
            bg-card/50
            px-6
            text-center
          "
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-semibold">No boards yet</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a board to start working with your team.
          </p>

          {canCreateBoard && (
            <button
              type="button"
              onClick={onCreateBoard}
              className="
                mt-5
                rounded-xl
                bg-primary
                px-4
                py-2.5
                text-sm
                font-semibold
                text-primary-foreground
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                cursor-pointer
              "
            >
              Create your first board
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <RoomBoardCard
              key={board.id}
              board={board}
              yourRole={yourRole}
              isSessionActive={isSessionActive}
              onEdit={onEditBoard}
              onDelete={onDeleteBoard}
            />
          ))}
        </div>
      )}
    </section>
  );
}
