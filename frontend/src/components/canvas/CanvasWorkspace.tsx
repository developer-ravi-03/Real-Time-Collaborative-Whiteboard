"use client";

import { useCallback, useEffect, useState } from "react";

import type { Board, CurrentPage } from "@/types/board";
import type { CanvasTool } from "./canvas.types";

import { SlideCanvas } from "./SlideCanvas";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { CanvasToolbar } from "./CanvasToolbar";

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
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");

  const [historyState, setHistoryState] = useState<HistoryState>({
    canUndo: false,
    canRedo: false,
  });

  const [undoAction, setUndoAction] = useState<(() => void) | null>(null);

  const [redoAction, setRedoAction] = useState<(() => void) | null>(null);

  const handleHistoryActions = useCallback(
    (actions: { undo: () => void; redo: () => void }) => {
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
       * Undo / Redo are handled by InfiniteCanvas.
       * Therefore don't process Z/Y here.
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
        onHistoryChange={setHistoryState}
        onHistoryActions={handleHistoryActions}
      />

      <CanvasToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        canEdit={canEdit}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
        onUndo={() => undoAction?.()}
        onRedo={() => redoAction?.()}
      />
    </div>
  );
}
