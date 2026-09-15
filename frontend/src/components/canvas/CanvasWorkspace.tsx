"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";

import type { Board, CurrentPage } from "@/types/board";

import type { CanvasTool } from "./canvas.types";

import { InfiniteCanvas } from "./InfiniteCanvas";

import { SlideCanvas } from "./SlideCanvas";

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

type InfiniteHistoryActions = {
  undo: () => void;

  redo: () => void;

  addImage: (file: File) => Promise<void>;
};

type SlideHistoryActions = {
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
  if (status === "saved") {
    return (
      <div
        className="
          rounded-lg
          border
          border-border

          bg-background/95

          px-3
          py-2

          text-xs
          font-medium

          shadow-lg
        "
      >
        <span className="mr-1.5 text-emerald-500">✓</span>
        Saved just now
      </div>
    );
  }

  if (status === "saving") {
    return (
      <div
        className="
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
        "
      >
        Saving...
      </div>
    );
  }

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
        "
      >
        <span>⚠ Save failed</span>

        <button
          type="button"
          onClick={onRetry}
          className="
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

  if (status === "unsaved" || isDirty) {
    return (
      <div
        className="
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
        "
      >
        Unsaved changes
      </div>
    );
  }

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
   * TOOL
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

  /*
   * ========================================================
   * INFINITE ACTIONS
   * ========================================================
   */

  const [infiniteUndoAction, setInfiniteUndoAction] = useState<
    (() => void) | null
  >(null);

  const [infiniteRedoAction, setInfiniteRedoAction] = useState<
    (() => void) | null
  >(null);

  const [infiniteAddImageAction, setInfiniteAddImageAction] = useState<
    ((file: File) => Promise<void>) | null
  >(null);

  /*
   * ========================================================
   * SLIDE ACTIONS
   * ========================================================
   */

  const [slideUndoAction, setSlideUndoAction] = useState<(() => void) | null>(
    null,
  );

  const [slideRedoAction, setSlideRedoAction] = useState<(() => void) | null>(
    null,
  );

  const [slideAddImageAction, setSlideAddImageAction] = useState<
    ((file: File) => Promise<void>) | null
  >(null);

  /*
   * ========================================================
   * PERSISTENCE
   * ========================================================
   */

  const persistence = useCanvasPersistence({
    pageId: currentPage?.id ?? null,

    getToken,

    enabled: canEdit && isLoaded && Boolean(isSignedIn),
  });

  /*
   * ========================================================
   * INFINITE HISTORY BRIDGE
   * ========================================================
   */

  const handleInfiniteHistoryActions = useCallback(
    (actions: InfiniteHistoryActions) => {
      setInfiniteUndoAction(() => actions.undo);

      setInfiniteRedoAction(() => actions.redo);

      setInfiniteAddImageAction(() => actions.addImage);
    },
    [],
  );

  /*
   * ========================================================
   * SLIDE HISTORY BRIDGE
   * ========================================================
   */

  const handleSlideHistoryActions = useCallback(
    (actions: SlideHistoryActions) => {
      setSlideUndoAction(() => actions.undo);

      setSlideRedoAction(() => actions.redo);

      setSlideAddImageAction(() => actions.addImage);
    },
    [],
  );

  /*
   * ========================================================
   * CANVAS CHANGE
   * ========================================================
   */

  const handleCanvasChange = useCallback(
    (data: Record<string, unknown>) => {
      if (!canEdit || !isLoaded || !isSignedIn) {
        return;
      }

      persistence.markDirty(data);
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

      const action =
        board.type === "SLIDES" ? slideAddImageAction : infiniteAddImageAction;

      if (!action) {
        console.warn("Image action is not ready yet.");

        return;
      }

      try {
        await action(file);

        /*
         * Image is an insertion action,
         * not a persistent tool mode.
         */

        setActiveTool("select");
      } catch (error) {
        console.error("Failed to add image:", error);

        const message =
          error instanceof Error ? error.message : "Failed to add image.";

        window.alert(message);
      }
    },
    [board.type, canEdit, infiniteAddImageAction, slideAddImageAction],
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
   * Infinite:
   *
   * V = Select
   * H = Hand
   * P = Pen
   * E = Eraser
   * R = Rectangle
   * C = Circle
   * L = Line
   * T = Text
   *
   * Slide:
   *
   * V = Select
   * P = Pen
   * E = Eraser
   * R = Rectangle
   * C = Circle
   * L = Line
   * T = Text
   */

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      /*
       * Never change tool while
       * typing.
       */

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      /*
       * Do not handle
       * Ctrl/Cmd shortcuts.
       */

      if (event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.repeat) {
        return;
      }

      let nextTool: CanvasTool | null = null;

      switch (event.key.toLowerCase()) {
        case "v":
          nextTool = "select";

          break;

        case "h":
          /*
           * Hand belongs only
           * to Infinite Canvas.
           */

          if (board.type === "INFINITE") {
            nextTool = "hand";
          }

          break;

        case "p":
          nextTool = "pen";

          break;

        case "e":
          /*
           * Eraser is available
           * on BOTH canvases.
           */

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

      if (!nextTool) {
        return;
      }

      event.preventDefault();

      setActiveTool(nextTool);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [board.type, canEdit]);

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

          overflow-hidden

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
   * ACTIVE HISTORY ACTION
   * ========================================================
   */

  const activeUndoAction =
    board.type === "INFINITE" ? infiniteUndoAction : slideUndoAction;

  const activeRedoAction =
    board.type === "INFINITE" ? infiniteRedoAction : slideRedoAction;

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <div
      className="
        relative

        h-full
        w-full

        min-h-0
        min-w-0

        overflow-hidden

        overscroll-none
      "
    >
      {/* ==================================================
          INFINITE CANVAS
          ================================================== */}

      {board.type === "INFINITE" && (
        <InfiniteCanvas
          pageId={currentPage.id}
          canvasData={currentPage.canvasData}
          canEdit={canEdit}
          activeTool={activeTool}
          eraserSize={eraserSize}
          onHistoryChange={setHistoryState}
          onHistoryActions={handleInfiniteHistoryActions}
          onCanvasChange={handleCanvasChange}
        />
      )}

      {/* ==================================================
          SLIDE CANVAS
          ================================================== */}

      {board.type === "SLIDES" && (
        <SlideCanvas
          canvasData={currentPage.canvasData}
          canEdit={canEdit}
          activeTool={activeTool}
          onHistoryChange={setHistoryState}
          onHistoryActions={handleSlideHistoryActions}
          onCanvasChange={handleCanvasChange}
        />
      )}

      {/* ==================================================
          TOOLBAR
          ================================================== */}

      <CanvasToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        eraserSize={eraserSize}
        onEraserSizeChange={setEraserSize}
        canEdit={canEdit}
        canUndo={Boolean(activeUndoAction) && historyState.canUndo}
        canRedo={Boolean(activeRedoAction) && historyState.canRedo}
        onUndo={() => {
          if (!activeUndoAction) {
            return;
          }

          void activeUndoAction();
        }}
        onRedo={() => {
          if (!activeRedoAction) {
            return;
          }

          void activeRedoAction();
        }}
        onImageUpload={handleImageUpload}
        /*
         * Hand only exists on
         * Infinite Canvas.
         */

        showHand={board.type === "INFINITE"}
        /*
         * Eraser exists on
         * both canvases.
         */

        showEraser={true}
        /*
         * Slide eraser is
         * object-based, therefore
         * no size selector.
         */

        showEraserSize={board.type === "INFINITE"}
        /*
         * Image exists on both.
         */

        showImage={true}
      />

      {/* ==================================================
          SAVE STATUS
          ================================================== */}

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
