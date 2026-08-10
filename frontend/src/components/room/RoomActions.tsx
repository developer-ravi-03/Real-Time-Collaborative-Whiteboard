"use client";

import { useEffect, useRef, useState } from "react";
import { Ellipsis, Pencil, LogOut, Trash2, Lock, LockOpen } from "lucide-react";

type RoomRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

type RoomActionsProps = {
  role: RoomRole;
  isSessionActive: boolean;

  onEdit: () => void;
  onCloseSession: () => void;
  onReopenSession: () => void;
  onLeave: () => void;
  onDelete: () => void;
};

export function RoomActions({
  role,
  isSessionActive,
  onEdit,
  onCloseSession,
  onReopenSession,
  onLeave,
  onDelete,
}: RoomActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = role === "OWNER";
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-xl border border-border
          bg-background
          transition
          hover:bg-muted
        "
        aria-label="Room actions"
      >
        <Ellipsis className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-14 z-40
            w-56
            overflow-hidden
            rounded-2xl
            border border-border
            bg-background
            p-1.5
            shadow-xl
          "
        >
          {/* Edit Room */}
          {(isOwner || isAdmin) && (
            <button
              type="button"
              onClick={() => handleAction(onEdit)}
              className="
                flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm
                transition
                hover:bg-muted
              "
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Room</span>
            </button>
          )}

          {/* Session */}
          {isOwner && (
            <>
              {isSessionActive ? (
                <button
                  type="button"
                  onClick={() => handleAction(onCloseSession)}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm
                    transition
                    hover:bg-muted
                  "
                >
                  <Lock className="h-4 w-4" />
                  <span>Close Session</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAction(onReopenSession)}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm
                    transition
                    hover:bg-muted
                  "
                >
                  <LockOpen className="h-4 w-4" />
                  <span>Reopen Session</span>
                </button>
              )}
            </>
          )}

          {/* Divider */}
          <div className="my-1.5 h-px bg-border" />

          {/* Leave */}
          {!isOwner && (
            <button
              type="button"
              onClick={() => handleAction(onLeave)}
              className="
                flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm
                transition
                hover:bg-muted
              "
            >
              <LogOut className="h-4 w-4" />
              <span>Leave Room</span>
            </button>
          )}

          {/* Delete */}
          {isOwner && (
            <button
              type="button"
              onClick={() => handleAction(onDelete)}
              className="
                flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm
                text-destructive
                transition
                hover:bg-destructive/10
              "
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Room</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
