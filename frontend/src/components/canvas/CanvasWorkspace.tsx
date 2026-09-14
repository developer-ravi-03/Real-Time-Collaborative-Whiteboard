"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";

import type { Board, CurrentPage } from "@/types/board";

import type { CanvasTool } from "./canvas.types";

import { SlideCanvas } from "./SlideCanvas";

import { InfiniteCanvas } from "./InfiniteCanvas";

import { CanvasToolbar } from "./CanvasToolbar";

import { DEFAULT_ERASER_SIZE, type EraserSize } from "./CanvasEraser";

import {
  useCanvasPersistence,
  type CanvasSaveStatus,
} from "@/hooks/useCanvasPersistence";

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

type CanvasWorkspaceProps = {
  board: Board;

  currentPage: CurrentPage | null;

  canEdit: boolean;
};

type HistoryState = {
  canUndo: boolean;

  canRedo: boolean;
};

type HistoryActions = {
  undo: () => void;

  redo: () => void;

  addImage: (file: File) => Promise<void>;
};

/*
 * ==========================================================
 * SAVE STATUS
 * ==========================================================
 */

function SaveStatus({
  status,
  isDirty,
  onRetry,
}: {
  status: CanvasSaveStatus;

  isDirty: boolean;

  onRetry: () => void;
}) {
  /*
   * Saved
   */

  if (status === "saved") {
    return (
      <div
        className="
          pointer-events-none
          rounded-lg
          border
          border-border
          bg-background/95
          px-3
          py-2
          text-xs
          font-medium
          text-foreground
          shadow-lg
          backdrop-blur
        "
      >
        <span className="mr-1.5 text-emerald-500">✓</span>
        Saved just now
      </div>
    );
  }

  /*
   * Saving
   */

  if (status === "saving") {
    return (
      <div
        className="
          pointer-events-none
          rounded-lg
          border
          border-border
          bg-background/95
          px-3
          py-2
          text-xs
          font-medium
          text-muted-foreground
          shadow-lg
          backdrop-blur
        "
      >
        Saving...
      </div>
    );
  }

  /*
   * Error
   */

  if (status === "error") {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-destructive/30
          bg-background/95
          px-3
          py-2
          text-xs
          font-medium
          text-destructive
          shadow-lg
          backdrop-blur
        "
      >
        <span>⚠ Save failed</span>

        <button
          type="button"
          onClick={onRetry}
          className="
            pointer-events-auto
            rounded
            px-1.5
            py-0.5
            underline
            underline-offset-2
            hover:bg-muted
          "
        >
          Retry
        </button>
      </div>
    );
  }

  /*
   * Unsaved
   */

  if (status === "unsaved" || isDirty) {
    return (
      <div
        className="
          pointer-events-none
          rounded-lg
          border
          border-border
          bg-background/95
          px-3
          py-2
          text-xs
          font-medium
          text-muted-foreground
          shadow-lg
          backdrop-blur
        "
      >
        Unsaved changes
      </div>
    );
  }

  /*
   * Idle
   *
   * We intentionally render nothing here.
   *
   * This prevents a newly opened page from incorrectly
   * showing "Unsaved changes".
   */

  return null;
}

/*
 * ==========================================================
 * COMPONENT
 * ==========================================================
 */

export function CanvasWorkspace({
  board,
  currentPage,
  canEdit,
}: CanvasWorkspaceProps) {
  /*
   * ========================================================
   * AUTH
   * ========================================================
   */

  const { getToken, isLoaded, isSignedIn } = useAuth();

  /*
   * ========================================================
   * TOOL STATE
   * ========================================================
   */

  const [activeTool, setActiveTool] = useState<CanvasTool>("select");

  const [eraserSize, setEraserSize] = useState<EraserSize>(DEFAULT_ERASER_SIZE);

  /*
   * ========================================================
   * HISTORY STATE
   * ========================================================
   */

  const [historyState, setHistoryState] = useState<HistoryState>({
    canUndo: false,
    canRedo: false,
  });

  const [undoAction, setUndoAction] = useState<(() => void) | null>(null);

  const [redoAction, setRedoAction] = useState<(() => void) | null>(null);

  const [addImageAction, setAddImageAction] = useState<
    ((file: File) => Promise<void>) | null
  >(null);

  /*
   * ========================================================
   * CANVAS PERSISTENCE
   * ========================================================
   */

  const persistence = useCanvasPersistence({
    pageId: currentPage?.id ?? null,

    getToken,

    enabled: canEdit && isLoaded && Boolean(isSignedIn),
  });

  /*
   * ========================================================
   * HISTORY / CANVAS ACTION BRIDGE
   * ========================================================
   */

  const handleHistoryActions = useCallback((actions: HistoryActions) => {
    setUndoAction(() => actions.undo);

    setRedoAction(() => actions.redo);

    setAddImageAction(() => actions.addImage);
  }, []);

  /*
   * ========================================================
   * CANVAS CHANGE
   * ========================================================
   */

  const handleCanvasChange = useCallback(
    (canvasData: Record<string, unknown>) => {
      if (!canEdit) {
        return;
      }

      if (!isLoaded || !isSignedIn) {
        return;
      }

      persistence.markDirty(canvasData);
    },
    [canEdit, isLoaded, isSignedIn, persistence.markDirty],
  );

  /*
   * ========================================================
   * IMAGE UPLOAD
   * ========================================================
   */

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!canEdit) {
        return;
      }

      if (!addImageAction) {
        console.warn("Image action is not ready yet.");

        return;
      }

      try {
        await addImageAction(file);

        /*
         * Image insertion is an action, not
         * a persistent interaction mode.
         */

        setActiveTool("select");
      } catch (error) {
        console.error("Failed to add image:", error);

        const message =
          error instanceof Error ? error.message : "Failed to add image.";

        window.alert(message);
      }
    },
    [addImageAction, canEdit],
  );

  /*
   * ========================================================
   * PASTE IMAGE
   * ========================================================
   */

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;

      if (!items) {
        return;
      }

      for (const item of items) {
        if (!item.type.startsWith("image/")) {
          continue;
        }

        const file = item.getAsFile();

        if (!file) {
          return;
        }

        event.preventDefault();

        void handleImageUpload(file);

        return;
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [canEdit, handleImageUpload]);

  /*
   * ========================================================
   * KEYBOARD TOOL SHORTCUTS
   * ========================================================
   *
   * V = Select
   * H = Hand
   * P = Pen
   * E = Eraser
   * R = Rectangle
   * C = Circle
   * L = Line
   * T = Text
   * ========================================================
   */

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.repeat) {
        return;
      }

      /*
       * Ctrl/Cmd shortcuts are handled elsewhere.
       */

      if (event.ctrlKey || event.metaKey) {
        return;
      }

      let nextTool: CanvasTool | null = null;

      switch (event.key.toLowerCase()) {
        case "v":
          nextTool = "select";
          break;

        case "h":
          nextTool = "hand";
          break;

        case "p":
          nextTool = "pen";
          break;

        case "e":
          nextTool = "eraser";
          break;

        case "r":
          nextTool = "rectangle";
          break;

        case "c":
          nextTool = "circle";
          break;

        case "l":
          nextTool = "line";
          break;

        case "t":
          nextTool = "text";
          break;

        default:
          return;
      }

      event.preventDefault();

      setActiveTool(nextTool);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canEdit]);

  /*
   * ========================================================
   * NO PAGE
   * ========================================================
   */

  if (!currentPage) {
    return (
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-center
          bg-muted/20
        "
      >
        <div className="text-center">
          <p className="font-medium">No page selected</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a page from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ========================================================
   * SLIDES
   * ========================================================
   */

  if (board.type === "SLIDES") {
    return (
      <SlideCanvas canvasData={currentPage.canvasData} canEdit={canEdit} />
    );
  }

  /*
   * ========================================================
   * INFINITE CANVAS
   * ========================================================
   */

  return (
    <div className="relative h-full w-full">
      <InfiniteCanvas
        canvasData={currentPage.canvasData}
        canEdit={canEdit}
        activeTool={activeTool}
        eraserSize={eraserSize}
        onHistoryChange={setHistoryState}
        onHistoryActions={handleHistoryActions}
        onCanvasChange={handleCanvasChange}
      />

      <CanvasToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        eraserSize={eraserSize}
        onEraserSizeChange={setEraserSize}
        canEdit={canEdit}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
        onUndo={() => undoAction?.()}
        onRedo={() => redoAction?.()}
        onImageUpload={handleImageUpload}
      />

      {/* ====================================================
          SAVE STATUS
          ==================================================== */}

      <div
        className="
          absolute
          bottom-4
          left-4
          z-30
        "
      >
        <SaveStatus
          status={persistence.status}
          isDirty={persistence.isDirty}
          onRetry={() => void persistence.saveNow()}
        />
      </div>
    </div>
  );
}
