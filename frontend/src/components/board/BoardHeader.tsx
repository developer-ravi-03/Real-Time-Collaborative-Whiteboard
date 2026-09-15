"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Loader2,
  MoreHorizontal,
  WifiOff,
} from "lucide-react";

import type { Board } from "@/types/board";

type BoardRealtimeStatus =
  | "connecting"
  | "connected"
  | "joined"
  | "error"
  | "disconnected";

type BoardHeaderProps = {
  board: Board;
  realtimeStatus?: BoardRealtimeStatus;
};

export function BoardHeader({
  board,
  realtimeStatus = "disconnected",
}: BoardHeaderProps) {
  const realtime = getRealtimeStatus(realtimeStatus);

  return (
    <header
      className="
        flex
        h-16
        shrink-0
        items-center
        justify-between
        border-b
        border-border
        bg-background
        px-4
        sm:px-6
      "
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Back to Room */}
        <Link
          href={`/room/${board.roomId}`}
          aria-label="Back to room"
          className="
            flex
            h-9
            w-9
            shrink-0
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-border sm:block" />

        {/* Board Info */}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-sm font-semibold">{board.name}</h1>

            <span
              className="
                hidden
                rounded-full
                bg-muted
                px-2
                py-0.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-muted-foreground
                sm:inline-flex
              "
            >
              {board.type}
            </span>
          </div>

          <p className="truncate text-xs text-muted-foreground">
            {board.type === "INFINITE" ? "Infinite Whiteboard" : "Slides Board"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Realtime Status */}
        <div
          title={realtime.description}
          className="
            hidden
            items-center
            gap-1.5
            rounded-full
            border
            border-border
            bg-muted/40
            px-2.5
            py-1.5
            text-xs
            font-medium
            sm:flex
          "
        >
          {realtime.icon}

          <span className="text-muted-foreground">{realtime.label}</span>
        </div>

        {/* More Actions */}
        <button
          type="button"
          aria-label="Board actions"
          className="
            flex
            h-9
            w-9
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
          "
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function getRealtimeStatus(status: BoardRealtimeStatus) {
  switch (status) {
    case "joined":
      return {
        label: "Live",
        description: "Connected to the collaboration room.",
        icon: (
          <CheckCircle2
            className="h-3.5 w-3.5 text-emerald-500"
            aria-hidden="true"
          />
        ),
      };

    case "connected":
      return {
        label: "Connecting",
        description: "Connected to server. Joining room...",
        icon: (
          <Loader2
            className="h-3.5 w-3.5 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ),
      };

    case "connecting":
      return {
        label: "Connecting",
        description: "Connecting to collaboration server...",
        icon: (
          <Loader2
            className="h-3.5 w-3.5 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ),
      };

    case "error":
      return {
        label: "Offline",
        description: "Realtime collaboration is currently unavailable.",
        icon: (
          <CircleAlert
            className="h-3.5 w-3.5 text-destructive"
            aria-hidden="true"
          />
        ),
      };

    case "disconnected":
    default:
      return {
        label: "Offline",
        description: "Not connected to realtime collaboration.",
        icon: (
          <WifiOff
            className="h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        ),
      };
  }
}
