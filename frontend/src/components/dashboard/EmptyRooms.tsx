"use client";

import { LayoutDashboard, LogIn, Plus } from "lucide-react";

type Props = {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
};

export function EmptyRooms({ onCreateRoom, onJoinRoom }: Props) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold">No rooms yet</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Create a new collaborative room or join an existing room to get started.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onCreateRoom}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Room
        </button>

        <button
          onClick={onJoinRoom}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold hover:bg-muted cursor-pointer"
        >
          <LogIn className="h-4 w-4" />
          Join Room
        </button>
      </div>
    </div>
  );
}
