"use client";

import { X } from "lucide-react";

type EditBoardModalProps = {
  open: boolean;
  name: string;
  description: string;
  loading: boolean;
  error: string | null;

  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;

  onClose: () => void;
  onSubmit: () => void;
};

export function EditBoardModal({
  open,
  name,
  description,
  loading,
  error,
  onNameChange,
  onDescriptionChange,
  onClose,
  onSubmit,
}: EditBoardModalProps) {
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
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Edit Board</h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Update your board details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Board Name</label>

          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            autoFocus
            className="
              h-12
              w-full
              rounded-xl
              border
              border-border
              bg-background
              px-4
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
            "
          />
        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={3}
            placeholder="Describe this board..."
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-border
              bg-background
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
            "
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-11
              flex-1
              rounded-xl
              border
              border-border
              text-sm
              font-medium
              transition
              hover:bg-muted
              disabled:opacity-50
              cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !name.trim()}
            className="
              h-11
              flex-1
              rounded-xl
              bg-primary
              text-sm
              font-semibold
              text-primary-foreground
              transition
              hover:-translate-y-0.5
              hover:shadow-md
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
