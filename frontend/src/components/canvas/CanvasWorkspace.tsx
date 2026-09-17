"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";

import type { Board, CurrentPage } from "@/types/board";

import type { CanvasRealtimeUpdate } from "@/hooks/useBoardRealtime";

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

  /*
   * Latest canvas state received from another
   * connected collaborator.
   *
   * BoardClient owns the socket connection.
   * CanvasWorkspace only routes the update
   * to the active canvas.
   */
  remoteCanvasUpdate?: CanvasRealtimeUpdate | null;

  /*
   * Sends a local canvas mutation to Socket.IO.
   *
   * Persistence remains handled separately by
   * useCanvasPersistence.
   */
  onCanvasRealtimeUpdate?: (
    pageId: string,
    canvasData: Record<string, unknown>,
  ) => void;
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
  /*
   * ========================================================
   * SAVED
   * ========================================================
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
        <span
          className="
            mr-1.5
            text-emerald-500
          "
        >
          ✓
        </span>
        Saved just now
      </div>
    );
  }

  /*
   * ========================================================
   * SAVING
   * ========================================================
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
   * ========================================================
   * SAVE ERROR
   * ========================================================
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
   * ========================================================
   * UNSAVED
   * ========================================================
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
  remoteCanvasUpdate,
  onCanvasRealtimeUpdate,
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

  /*
   * ========================================================
   * INFINITE HISTORY ACTIONS
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
   * SLIDE HISTORY ACTIONS
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
   *
   * REST autosave remains responsible for
   * PostgreSQL persistence.
   *
   * Socket.IO is responsible for live
   * collaboration only.
   */

  const persistence = useCanvasPersistence({
    pageId: currentPage?.id ?? null,

    getToken,

    enabled: canEdit && isLoaded && Boolean(isSignedIn),
  });

  const { markDirty } = persistence;

  const currentPageId = currentPage?.id ?? null;

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
   * LOCAL CANVAS CHANGE
   * ========================================================
   *
   * One local mutation has TWO destinations:
   *
   *     1. REST autosave
   *     2. Socket.IO realtime
   *
   * They are intentionally kept separate.
   */

  const handleCanvasChange = useCallback(
    (data: Record<string, unknown>) => {
      /*
       * --------------------------------------------------
       * Viewer cannot modify canvas.
       * --------------------------------------------------
       */

      if (!canEdit) {
        return;
      }

      /*
       * --------------------------------------------------
       * Wait for authentication.
       * --------------------------------------------------
       */

      if (!isLoaded || !isSignedIn) {
        return;
      }

      /*
       * --------------------------------------------------
       * REST persistence
       * --------------------------------------------------
       */

      markDirty(data);

      /*
       * --------------------------------------------------
       * Realtime synchronization
       * --------------------------------------------------
       */

      if (currentPageId && onCanvasRealtimeUpdate) {
        onCanvasRealtimeUpdate(currentPageId, data);
      }
    },
    [
      canEdit,
      isLoaded,
      isSignedIn,
      markDirty,
      currentPageId,
      onCanvasRealtimeUpdate,
    ],
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

      /*
       * Choose the image insertion action
       * belonging to the active canvas.
       */

      const action =
        board.type === "SLIDES" ? slideAddImageAction : infiniteAddImageAction;

      if (!action) {
        console.warn("[CanvasWorkspace] Image action is not ready yet.");

        return;
      }

      try {
        await action(file);

        /*
         * Image insertion is an action,
         * not a persistent drawing tool.
         */

        setActiveTool("select");
      } catch (error) {
        console.error("[CanvasWorkspace] Failed to add image:", error);

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
   *
   * Supports:
   *
   *     Ctrl/Cmd + V
   *
   * when clipboard contains an image.
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
        /*
         * Ignore normal text.
         */

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
   * INFINITE:
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
   * SLIDES:
   *
   * V = Select
   * P = Pen
   * E = Eraser
   * R = Rectangle
   * C = Circle
   * L = Line
   * T = Text
   *
   * Hand is ignored on Slides.
   */

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      /*
       * Never change tools while
       * the user is typing.
       */

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      /*
       * Ctrl/Cmd combinations belong
       * to history/browser shortcuts.
       */

      if (event.ctrlKey || event.metaKey) {
        return;
      }

      /*
       * Ignore repeated key events.
       */

      if (event.repeat) {
        return;
      }

      let nextTool: CanvasTool | null = null;

      switch (event.key.toLowerCase()) {
        /*
         * ----------------------------------------------
         * SELECT
         * ----------------------------------------------
         */

        case "v":
          nextTool = "select";

          break;

        /*
         * ----------------------------------------------
         * HAND
         * ----------------------------------------------
         */

        case "h":
          if (board.type === "INFINITE") {
            nextTool = "hand";
          }

          break;

        /*
         * ----------------------------------------------
         * PEN
         * ----------------------------------------------
         */

        case "p":
          nextTool = "pen";

          break;

        /*
         * ----------------------------------------------
         * ERASER
         * ----------------------------------------------
         */

        case "e":
          /*
           * Both Infinite and Slide
           * support eraser.
           */

          nextTool = "eraser";

          break;

        /*
         * ----------------------------------------------
         * RECTANGLE
         * ----------------------------------------------
         */

        case "r":
          nextTool = "rectangle";

          break;

        /*
         * ----------------------------------------------
         * CIRCLE
         * ----------------------------------------------
         */

        case "c":
          nextTool = "circle";

          break;

        /*
         * ----------------------------------------------
         * LINE
         * ----------------------------------------------
         */

        case "l":
          nextTool = "line";

          break;

        /*
         * ----------------------------------------------
         * TEXT
         * ----------------------------------------------
         */

        case "t":
          nextTool = "text";

          break;

        default:
          return;
      }

      /*
       * Hand on Slides is ignored.
       */

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
   * RESET HISTORY BRIDGES WHEN PAGE CHANGES
   * ========================================================
   *
   * IMPORTANT:
   *
   * We do NOT clear these immediately on every page change
   * because the new canvas registers its actions during its
   * lifecycle.
   *
   * The active action is selected using board type and the
   * canvas callback.
   */

  /*
   * ========================================================
   * EFFECTIVE TOOL
   * ========================================================
   *
   * Keep activeTool as the user's selected preference.
   * Unsupported/forbidden tools are derived instead of
   * synchronously changing React state inside an effect.
   *
   * This avoids React 19's set-state-in-effect lint error
   * and prevents an unnecessary render cycle.
   */

  const effectiveActiveTool: CanvasTool = !canEdit
    ? "select"
    : board.type === "SLIDES" && activeTool === "hand"
      ? "select"
      : activeTool;

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
          <p
            className="
              font-medium
            "
          >
            No page selected
          </p>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            Select a page from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ========================================================
   * ACTIVE HISTORY ACTIONS
   * ========================================================
   */

  const activeUndoAction =
    board.type === "INFINITE" ? infiniteUndoAction : slideUndoAction;

  const activeRedoAction =
    board.type === "INFINITE" ? infiniteRedoAction : slideRedoAction;

  /*
   * ========================================================
   * REMOTE CANVAS UPDATE
   * ========================================================
   *
   * Only pass the remote update to InfiniteCanvas when:
   *
   *     1. update exists
   *     2. update belongs to current page
   *
   * This prevents a drawing made on Page 1 from being
   * accidentally applied to Page 2.
   */

  const currentRemoteCanvasUpdate =
    remoteCanvasUpdate && remoteCanvasUpdate.pageId === currentPage.id
      ? remoteCanvasUpdate
      : null;

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
          activeTool={effectiveActiveTool}
          eraserSize={eraserSize}
          onHistoryChange={setHistoryState}
          onHistoryActions={handleInfiniteHistoryActions}
          onCanvasChange={handleCanvasChange}
          /*
           * =================================================
           * REALTIME
           * =================================================
           */

          remoteCanvasUpdate={currentRemoteCanvasUpdate}
        />
      )}

      {/* ==================================================
          SLIDE CANVAS
          ================================================== */}

      {board.type === "SLIDES" && (
        <SlideCanvas
          canvasData={currentPage.canvasData}
          canEdit={canEdit}
          activeTool={effectiveActiveTool}
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
        onImageUpload={handleImageUpload}
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
        /*
         * --------------------------------------------------
         * Tool visibility
         * --------------------------------------------------
         *
         * Hand:
         * Infinite only
         *
         * Eraser:
         * Both
         *
         * Eraser size:
         * Infinite only
         *
         * Image:
         * Both
         */

        showHand={board.type === "INFINITE"}
        showEraser={true}
        showEraserSize={board.type === "INFINITE"}
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
