"use client";

import { X } from "lucide-react";

type EditRoomModalProps = {
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

export function EditRoomModal({
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
}: EditRoomModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Edit Room</h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Update your collaborative room settings.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-muted-foreground
              hover:bg-muted
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Room Name</label>

          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className="
              h-12 w-full
              rounded-xl
              border border-border
              bg-background
              px-4
              text-sm
              outline-none
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
            "
            placeholder="Room name"
          />
        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={3}
            className="
              w-full resize-none
              rounded-xl
              border border-border
              bg-background
              px-4 py-3
              text-sm
              outline-none
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
            "
            placeholder="Room description"
          />
        </div>

        {/* Visibility */}
        <div className="mt-5">
          <label className="mb-3 block text-sm font-medium">Visibility</label>

          <div className="grid grid-cols-2 gap-3">
            {(["PRIVATE", "PUBLIC"] as const).map((value) => {
              const selected = visibility === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onVisibilityChange(value)}
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }
                  `}
                >
                  <p className="text-sm font-semibold">
                    {value === "PRIVATE" ? "Private" : "Public"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {value === "PRIVATE"
                      ? "Only invited members can access."
                      : "Room can be discovered publicly."}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              h-11 flex-1
              rounded-xl
              border border-border
              text-sm font-medium
              hover:bg-muted
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || !name.trim()}
            onClick={onSubmit}
            className="
              h-11 flex-1
              rounded-xl
              bg-primary
              text-sm font-semibold
              text-primary-foreground
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
