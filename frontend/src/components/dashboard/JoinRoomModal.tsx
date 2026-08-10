"use client";

import { LogIn, X } from "lucide-react";

type JoinRoomModalProps = {
  open: boolean;
  roomCode: string;
  joining: boolean;
  error: string | null;

  onRoomCodeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function JoinRoomModal({
  open,
  roomCode,
  joining,
  error,
  onRoomCodeChange,
  onClose,
  onSubmit,
}: JoinRoomModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-border
          bg-background
          p-6
          shadow-2xl
          sm:p-7
        "
      >
        {/* Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <div
              className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >
              <LogIn className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight">
              Join a Room
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter the room code shared with you.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
            "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Room Code */}
        <div>
          <label htmlFor="room-code" className="mb-2 block text-sm font-medium">
            Room Code
          </label>

          <input
            id="room-code"
            type="text"
            value={roomCode}
            onChange={(event) => {
              onRoomCodeChange(
                event.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 6),
              );
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && roomCode.length === 6) {
                onSubmit();
              }
            }}
            placeholder="A7K92P"
            maxLength={6}
            autoFocus
            className="
              h-12
              w-full
              rounded-xl
              border
              border-border
              bg-background
              px-4
              text-center
              text-lg
              font-semibold
              uppercase
              tracking-[0.25em]
              outline-none
              transition
              placeholder:text-sm
              placeholder:font-normal
              placeholder:tracking-normal
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
            "
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Enter the 6-character room code.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-destructive/20
              bg-destructive/5
              px-4
              py-3
            "
          >
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={joining}
            className="
              h-11
              flex-1
              rounded-xl
              border
              border-border
              px-4
              text-sm
              font-medium
              transition
              hover:bg-muted
              disabled:cursor-not-allowed
              disabled:opacity-50
              cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={joining || roomCode.length !== 6}
            className="
              h-11
              flex-1
              rounded-xl
              bg-primary
              px-4
              text-sm
              font-semibold
              text-primary-foreground
              transition
              hover:-translate-y-0.5
              hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-50
              cursor-pointer
            "
          >
            {joining ? "Joining..." : "Join Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
