"use client";

import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

import type { RoomDetails } from "@/types/room";

import { RoomActions } from "./RoomActions";

type RoomHeaderProps = {
  room: RoomDetails;

  onEdit: () => void;
  onCloseSession: () => void;
  onReopenSession: () => void;
  onLeave: () => void;
  onDelete: () => void;
};

export function RoomHeader({
  room,
  onEdit,
  onCloseSession,
  onReopenSession,
  onLeave,
  onDelete,
}: RoomHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/dashboard"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-border
              transition
              hover:bg-muted
            "
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold">{room.name}</h1>

              <span
                className="
                  hidden
                  rounded-full
                  bg-muted
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-muted-foreground
                  sm:inline-flex
                "
              >
                {room.yourRole}
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">{room.roomCode}</span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {room.memberCount}
              </span>

              <span>•</span>

              <span
                className={
                  room.isSessionActive
                    ? "text-emerald-600"
                    : "text-muted-foreground"
                }
              >
                {room.isSessionActive ? "Active" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <RoomActions
            role={room.yourRole}
            isSessionActive={room.isSessionActive}
            onEdit={onEdit}
            onCloseSession={onCloseSession}
            onReopenSession={onReopenSession}
            onLeave={onLeave}
            onDelete={onDelete}
          />
        </div>
      </div>
    </header>
  );
}
