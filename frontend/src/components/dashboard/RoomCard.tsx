"use client";

import Link from "next/link";
import { Users } from "lucide-react";

import type { Room } from "@/types/room";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      href={`/room/${room.id}`}
      className="
        group
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        transition-all
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-lg
      "
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-lg font-semibold">
          {room.name.charAt(0).toUpperCase()}
        </div>

        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {room.yourRole}
        </span>
      </div>

      <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
        {room.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {room.description || "Collaborative workspace"}
      </p>

      <div className="mt-6 flex items-center gap-5 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-4 w-4" />
          {room.memberCount} members
        </div>

        <div
          className={`flex items-center gap-2 text-xs ${
            room.isSessionActive ? "text-emerald-500" : "text-muted-foreground"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              room.isSessionActive ? "bg-emerald-500" : "bg-muted-foreground"
            }`}
          />

          {room.isSessionActive ? "Active" : "Closed"}
        </div>
      </div>
    </Link>
  );
}
