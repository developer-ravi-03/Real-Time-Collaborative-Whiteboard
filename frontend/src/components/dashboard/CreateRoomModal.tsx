"use client";

import { X, Plus } from "lucide-react";

type CreateRoomModalProps = {
  open: boolean;
  name: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  loading: boolean;
  error: string | null;

  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onVisibilityChange: (value: "PUBLIC" | "PRIVATE") => void;

  onClose: () => void;
  onSubmit: () => void;
};

export function CreateRoomModal({
  open,
  name,
  description,
  visibility,
  loading,
  error,
  onNameChange,
  onDescriptionChange,
  onVisibilityChange,
  onClose,
  onSubmit,
}: CreateRoomModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl sm:p-7">
        <div className="mb-7 flex items-start justify-between">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-semibold">Create a Room</h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Create a collaborative workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Room Name</label>

          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Web Development Team"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="What will this room be used for?"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mt-5">
          <label className="mb-3 block text-sm font-medium">Visibility</label>

          <div className="grid grid-cols-2 gap-3">
            {(["PRIVATE", "PUBLIC"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onVisibilityChange(value)}
                className={`rounded-xl border p-4 text-left transition ${
                  visibility === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <p className="text-sm font-semibold cursor-pointer">
                  {value === "PRIVATE" ? "Private" : "Public"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground cursor-pointer">
                  {value === "PRIVATE"
                    ? "Invite users using room code."
                    : "Discoverable by users."}
                </p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 flex-1 rounded-xl border border-border text-sm font-medium hover:bg-muted cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !name.trim()}
            className="h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
