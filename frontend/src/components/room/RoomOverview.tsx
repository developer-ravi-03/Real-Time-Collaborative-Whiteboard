// src/components/room/RoomOverview.tsx

import { Clock3, Lock, Globe2, Users } from "lucide-react";

import type { RoomDetails } from "@/types/room";

type RoomOverviewProps = {
  room: RoomDetails;
};

export function RoomOverview({ room }: RoomOverviewProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{room.name}</h2>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {room.visibility === "PRIVATE" ? (
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Private
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Globe2 className="h-3 w-3" />
                  Public
                </span>
              )}
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {room.description || "Collaborative workspace for your team."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-4 w-4" />
              Members
            </div>

            <p className="mt-1 text-lg font-semibold">{room.memberCount}</p>
          </div>

          <div className="rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Session
            </div>

            <p className="mt-1 text-lg font-semibold">
              {room.isSessionActive ? "Active" : "Closed"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
