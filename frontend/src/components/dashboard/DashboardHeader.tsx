"use client";

import { LogIn, Plus } from "lucide-react";

type Props = {
  firstName?: string;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
};

export function DashboardHeader({
  firstName,
  onCreateRoom,
  onJoinRoom,
}: Props) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Collaborative Workspace
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back
          {firstName ? `, ${firstName}` : ""}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Select a room to continue collaborating.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onJoinRoom}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition hover:bg-muted cursor-pointer"
        >
          <LogIn className="h-4 w-4" />
          Join Room
        </button>

        <button
          type="button"
          onClick={onCreateRoom}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Room
        </button>
      </div>
    </div>
  );
}
