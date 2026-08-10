"use client";

import { AlertTriangle, X } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  loading?: boolean;
  destructive?: boolean;

  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  loading = false,
  destructive = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
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
      <div
        className="
          w-full max-w-md
          rounded-2xl
          border border-border
          bg-background
          p-6
          shadow-2xl
        "
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl
                ${
                  destructive
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-foreground"
                }
              `}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">{title}</h2>

              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full
              text-muted-foreground
              hover:bg-muted
              disabled:opacity-50
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

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
              transition
              hover:bg-muted
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`
              h-11 flex-1
              rounded-xl
              text-sm font-semibold
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                destructive
                  ? "bg-destructive text-destructive-foreground hover:opacity-90"
                  : "bg-primary text-primary-foreground hover:-translate-y-0.5"
              }
            `}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
