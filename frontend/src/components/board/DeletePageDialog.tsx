"use client";

import { AlertTriangle } from "lucide-react";

type DeletePageDialogProps = {
  open: boolean;
  loading: boolean;

  onClose: () => void;
  onConfirm: () => void;
};

export function DeletePageDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: DeletePageDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">Delete this page?</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This action cannot be undone. All content on this page will be
          removed.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 flex-1 rounded-xl border border-border text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-11 flex-1 rounded-xl bg-destructive text-sm font-semibold text-destructive-foreground disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Page"}
          </button>
        </div>
      </div>
    </div>
  );
}
