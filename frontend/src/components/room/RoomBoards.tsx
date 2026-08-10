// src/components/room/RoomBoards.tsx

import { Plus, LayoutDashboard } from "lucide-react";

import type { RoomBoard, RoomRole } from "@/types/room";

import { RoomBoardCard } from "./RoomBoardCard";

type RoomBoardsProps = {
  boards: RoomBoard[];
  yourRole: RoomRole;
  isSessionActive: boolean;
};

export function RoomBoards({
  boards,
  yourRole,
  isSessionActive,
}: RoomBoardsProps) {
  const canCreateBoard =
    (yourRole === "OWNER" || yourRole === "ADMIN" || yourRole === "EDITOR") &&
    isSessionActive;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Boards</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a board to start collaborating.
          </p>
        </div>

        {canCreateBoard && (
          <button
            type="button"
            className="
              inline-flex
              h-10
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
            "
          >
            <Plus className="h-4 w-4" />
            New Board
          </button>
        )}
      </div>

      {boards.length === 0 ? (
        <div
          className="
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
              className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Create your first board
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <RoomBoardCard key={board.id} board={board} yourRole={yourRole} />
          ))}
        </div>
      )}
    </section>
  );
}
