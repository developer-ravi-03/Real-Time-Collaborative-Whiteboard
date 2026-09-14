"use client";

import { useCallback, useEffect, useState } from "react";

import type { Board, CurrentPage } from "@/types/board";

import type { CanvasTool } from "./canvas.types";

import { SlideCanvas } from "./SlideCanvas";

import { InfiniteCanvas } from "./InfiniteCanvas";

import { CanvasToolbar } from "./CanvasToolbar";

import { DEFAULT_ERASER_SIZE, type EraserSize } from "./CanvasEraser";

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

export function CanvasWorkspace({
  board,
  currentPage,
  canEdit,
}: CanvasWorkspaceProps) {
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");

  const [eraserSize, setEraserSize] = useState<EraserSize>(DEFAULT_ERASER_SIZE);

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
   * ==========================================================
   * HISTORY / CANVAS ACTION BRIDGE
   * ==========================================================
   */

  const handleHistoryActions = useCallback((actions: HistoryActions) => {
    setUndoAction(() => actions.undo);

    setRedoAction(() => actions.redo);

    setAddImageAction(() => actions.addImage);
  }, []);

  /*
   * ==========================================================
   * IMAGE UPLOAD
   * ==========================================================
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
         * Image insertion is an action, not a persistent
         * interaction mode.
         *
         * Therefore return to Select automatically.
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
   * ==========================================================
   * PASTE IMAGE
   * ==========================================================
   *
   * Ctrl/Cmd + V can directly insert an image
   * copied from:
   *
   * - Screenshot
   * - Browser
   * - Image editor
   * - File explorer
   *
   * Text paste is completely untouched.
   * ==========================================================
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
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}
