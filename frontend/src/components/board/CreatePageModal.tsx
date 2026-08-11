"use client";

import { X } from "lucide-react";

type CreatePageModalProps = {
  open: boolean;
  title: string;
  loading: boolean;
  error: string | null;

  onTitleChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function CreatePageModal({
  open,
  title,
  loading,
  error,
  onTitleChange,
  onClose,
  onSubmit,
}: CreatePageModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Create Page</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a new page for this board.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              disabled:opacity-50
              cursor-pointer
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Page Name</label>

          <input
            autoFocus
            value={title}
            maxLength={100}
            onChange={(event) => onTitleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && title.trim() && !loading) {
                onSubmit();
              }
            }}
            placeholder="e.g. Architecture"
            disabled={loading}
            className="
              h-11 w-full rounded-xl
              border border-border
              bg-background
              px-4
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <p className="mt-1.5 text-xs text-muted-foreground">
            {title.length}/100
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-11 flex-1
              rounded-xl
              border border-border
              text-sm font-medium
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
            disabled={loading || !title.trim()}
            className="
              h-11 flex-1
              rounded-xl
              bg-primary
              text-sm font-semibold
              text-primary-foreground
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              cursor-pointer
            "
          >
            {loading ? "Creating..." : "Create Page"}
          </button>
        </div>
      </div>
    </div>
  );
}
