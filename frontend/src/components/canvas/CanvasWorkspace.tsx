"use client";

import { useCallback, useEffect, useState } from "react";

import type { Board, CurrentPage } from "@/types/board";

import type { CanvasTool } from "./canvas.types";

import { SlideCanvas } from "./SlideCanvas";

import { InfiniteCanvas } from "./InfiniteCanvas";

import { CanvasToolbar } from "./CanvasToolbar";

import {
  DEFAULT_ERASER_SIZE,
  ERASER_SIZES,
  type EraserSize,
} from "./CanvasEraser";

type CanvasWorkspaceProps = {
  board: Board;

  currentPage: CurrentPage | null;

  canEdit: boolean;
};

type HistoryState = {
  canUndo: boolean;

  canRedo: boolean;
};

export function CanvasWorkspace({
  board,
  currentPage,
  canEdit,
}: CanvasWorkspaceProps) {
  /*
   * ==========================================================
   * TOOL
   * ==========================================================
   */

  const [activeTool, setActiveTool] = useState<CanvasTool>("select");

  /*
   * ==========================================================
   * ERASER SIZE
   * ==========================================================
   */

  const [eraserSize, setEraserSize] = useState<EraserSize>(DEFAULT_ERASER_SIZE);

  /*
   * ==========================================================
   * HISTORY
   * ==========================================================
   */

  const [historyState, setHistoryState] = useState<HistoryState>({
    canUndo: false,

    canRedo: false,
  });

  const [undoAction, setUndoAction] = useState<(() => void) | null>(null);

  const [redoAction, setRedoAction] = useState<(() => void) | null>(null);

  /*
   * ==========================================================
   * HISTORY ACTION BRIDGE
   * ==========================================================
   */

  const handleHistoryActions = useCallback(
    (actions: {
      undo: () => void;

      redo: () => void;
    }) => {
      setUndoAction(() => actions.undo);

      setRedoAction(() => actions.redo);
    },
    [],
  );

  /*
   * ==========================================================
   * KEYBOARD TOOL SHORTCUTS
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
   * [ = Smaller eraser
   * ] = Larger eraser
   * ==========================================================
   */

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      /*
       * Don't trigger shortcuts while typing.
       */

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      /*
       * Don't trigger repeatedly.
       */

      if (event.repeat) {
        return;
      }

      /*
       * Undo / redo belong to InfiniteCanvas.
       */

      if (event.ctrlKey || event.metaKey) {
        return;
      }

      /*
       * ======================================================
       * ERASER SIZE SHORTCUTS
       * ======================================================
       */

      if (activeTool === "eraser" && (event.key === "[" || event.key === "]")) {
        const currentIndex = ERASER_SIZES.indexOf(eraserSize);

        if (currentIndex === -1) {
          return;
        }

        const nextIndex =
          event.key === "["
            ? Math.max(0, currentIndex - 1)
            : Math.min(ERASER_SIZES.length - 1, currentIndex + 1);

        const nextSize = ERASER_SIZES[nextIndex];

        if (nextSize !== eraserSize) {
          setEraserSize(nextSize);
        }

        event.preventDefault();

        return;
      }

      /*
       * ======================================================
       * TOOL SHORTCUTS
       * ======================================================
       */

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
  }, [canEdit, activeTool, eraserSize]);

  /*
   * ==========================================================
   * NO PAGE
   * ==========================================================
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
   * ==========================================================
   * SLIDES
   * ==========================================================
   */

  if (board.type === "SLIDES") {
    return (
      <SlideCanvas canvasData={currentPage.canvasData} canEdit={canEdit} />
    );
  }

  /*
   * ==========================================================
   * INFINITE CANVAS
   * ==========================================================
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
      />
    </div>
  );
}
