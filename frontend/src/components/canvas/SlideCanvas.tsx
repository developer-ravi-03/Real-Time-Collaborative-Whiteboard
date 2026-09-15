"use client";

import { useCallback, useEffect, useRef } from "react";

import { Canvas } from "fabric";

import type { CanvasData, CanvasTool } from "./canvas.types";

import {
  createSlideCanvas,
  configureSlideCanvas,
  deleteSelectedObjects,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
} from "./SlideCanvasEngine";

import {
  SlideCanvasHistory,
  type SlideHistoryState,
} from "./SlideCanvasHistory";

import {
  configureSlideTextEditing,
  setupSlideCanvasTools,
} from "./SlideCanvasTools";

import { addImageToCanvas } from "./CanvasImage";

type SlideCanvasProps = {
  canvasData: CanvasData;

  canEdit: boolean;

  activeTool?: CanvasTool;

  onHistoryChange?: (state: SlideHistoryState) => void;

  onHistoryActions?: (actions: {
    undo: () => void;

    redo: () => void;

    addImage: (file: File) => Promise<void>;
  }) => void;

  onCanvasChange?: (canvasData: CanvasData) => void;
};

export function SlideCanvas({
  canvasData,
  canEdit,
  activeTool = "select",
  onHistoryChange,
  onHistoryActions,
  onCanvasChange,
}: SlideCanvasProps) {
  /*
   * ========================================================
   * DOM
   * ========================================================
   */

  const stageRef = useRef<HTMLDivElement | null>(null);

  const hostRef = useRef<HTMLDivElement | null>(null);

  /*
   * ========================================================
   * FABRIC
   * ========================================================
   */

  const canvasRef = useRef<Canvas | null>(null);

  const historyRef = useRef<SlideCanvasHistory | null>(null);

  /*
   * ========================================================
   * LATEST PROPS
   * ========================================================
   */

  const canEditRef = useRef(canEdit);

  const activeToolRef = useRef(activeTool);

  const onCanvasChangeRef = useRef(onCanvasChange);

  const onHistoryChangeRef = useRef(onHistoryChange);

  const onHistoryActionsRef = useRef(onHistoryActions);

  /*
   * ========================================================
   * LIFECYCLE
   * ========================================================
   */

  const disposedRef = useRef(false);

  const initializingRef = useRef(true);

  const loadIdRef = useRef(0);

  /*
   * ========================================================
   * PROP SYNC
   * ========================================================
   */

  useEffect(() => {
    canEditRef.current = canEdit;
  }, [canEdit]);

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    onCanvasChangeRef.current = onCanvasChange;
  }, [onCanvasChange]);

  useEffect(() => {
    onHistoryChangeRef.current = onHistoryChange;
  }, [onHistoryChange]);

  useEffect(() => {
    onHistoryActionsRef.current = onHistoryActions;
  }, [onHistoryActions]);

  /*
   * ========================================================
   * EMIT CHANGE
   * ========================================================
   */

  const emitCanvasChange = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || disposedRef.current || initializingRef.current) {
      return;
    }

    onCanvasChangeRef.current?.(canvas.toJSON() as CanvasData);
  }, []);

  /*
   * ========================================================
   * RECORD MUTATION
   * ========================================================
   */

  const recordMutation = useCallback(() => {
    const canvas = canvasRef.current;

    const history = historyRef.current;

    if (
      !canvas ||
      !history ||
      disposedRef.current ||
      initializingRef.current ||
      history.isRestoring()
    ) {
      return;
    }

    history.push();

    emitCanvasChange();
  }, [emitCanvasChange]);

  /*
   * ========================================================
   * CREATE FABRIC
   * ========================================================
   */

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    host.replaceChildren();

    disposedRef.current = false;

    initializingRef.current = true;

    const element = document.createElement("canvas");

    element.width = SLIDE_WIDTH;

    element.height = SLIDE_HEIGHT;

    element.style.display = "block";

    element.style.position = "absolute";

    element.style.left = "0";

    element.style.top = "0";

    host.appendChild(element);

    const canvas = createSlideCanvas(element, canEditRef.current);

    canvasRef.current = canvas;

    /*
     * Never allow an old viewport
     * transform to survive.
     */

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    configureSlideTextEditing(canvas);

    /*
     * ======================================================
     * HISTORY
     * ======================================================
     */

    const history = new SlideCanvasHistory(canvas, {
      maxHistorySize: 100,

      onChange: (state) => {
        onHistoryChangeRef.current?.(state);
      },
    });

    historyRef.current = history;

    /*
     * ======================================================
     * FABRIC EVENTS
     * ======================================================
     */

    const handleObjectModified = () => {
      recordMutation();
    };

    const handlePathCreated = () => {
      recordMutation();
    };

    canvas.on("object:modified", handleObjectModified);

    canvas.on("path:created", handlePathCreated);

    /*
     * ======================================================
     * HISTORY ACTIONS
     * ======================================================
     */

    const undo = () => {
      void (async () => {
        const changed = await history.undo();

        if (changed) {
          emitCanvasChange();
        }
      })();
    };

    const redo = () => {
      void (async () => {
        const changed = await history.redo();

        if (changed) {
          emitCanvasChange();
        }
      })();
    };

    /*
     * ======================================================
     * IMAGE
     * ======================================================
     */

    const addImage = async (file: File) => {
      if (!canEditRef.current || disposedRef.current) {
        return;
      }

      await addImageToCanvas(canvas, file);

      history.push();

      emitCanvasChange();
    };

    onHistoryActionsRef.current?.({
      undo,
      redo,
      addImage,
    });

    history.initialize();

    /*
     * ======================================================
     * CLEANUP
     * ======================================================
     */

    return () => {
      disposedRef.current = true;

      initializingRef.current = true;

      loadIdRef.current += 1;

      canvas.off("object:modified", handleObjectModified);

      canvas.off("path:created", handlePathCreated);

      history.clear();

      canvas.isDrawingMode = false;

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      canvas.destroy();

      canvasRef.current = null;

      historyRef.current = null;

      host.replaceChildren();
    };
  }, [emitCanvasChange, recordMutation]);

  /*
   * ========================================================
   * LOAD PAGE DATA
   * ========================================================
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    const history = historyRef.current;

    if (!canvas || !history) {
      return;
    }

    const requestId = ++loadIdRef.current;

    let cancelled = false;

    const loadCanvas = async () => {
      initializingRef.current = true;

      try {
        /*
         * Clear objects only.
         */

        canvas.clear();

        /*
         * Always reset viewport.
         */

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

        canvas.backgroundColor = "#ffffff";

        if (canvasData && Object.keys(canvasData).length > 0) {
          await canvas.loadFromJSON(canvasData);
        }

        if (
          cancelled ||
          disposedRef.current ||
          requestId !== loadIdRef.current
        ) {
          return;
        }

        /*
         * IMPORTANT:
         *
         * Saved canvasData should
         * never control viewport.
         */

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

        configureSlideCanvas(canvas, canEditRef.current);

        configureSlideTextEditing(canvas);

        canvas.discardActiveObject();

        canvas.requestRenderAll();

        history.initialize();
      } catch (error) {
        if (
          !cancelled &&
          !disposedRef.current &&
          requestId === loadIdRef.current
        ) {
          console.error("Failed to load slide canvas:", error);
        }
      } finally {
        if (
          !cancelled &&
          !disposedRef.current &&
          requestId === loadIdRef.current
        ) {
          initializingRef.current = false;
        }
      }
    };

    void loadCanvas();

    return () => {
      cancelled = true;
    };
  }, [canvasData]);

  /*
   * ========================================================
   * EDIT PERMISSION
   * ========================================================
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canEditRef.current = canEdit;

    configureSlideCanvas(canvas, canEdit);

    configureSlideTextEditing(canvas);

    if (!canEdit) {
      canvas.discardActiveObject();

      canvas.requestRenderAll();
    }
  }, [canEdit]);

  /*
   * ========================================================
   * TOOL CONTROLLER
   * ========================================================
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const controller = setupSlideCanvasTools(
      canvas,
      activeTool,
      canEdit,
      recordMutation,
    );

    return () => {
      controller.destroy();
    };
  }, [activeTool, canEdit, recordMutation]);

  /*
   * ========================================================
   * RESPONSIVE SLIDE SIZE
   * ========================================================
   *
   * Fabric internal scene:
   *
   *     1280 x 720
   *
   * Browser visual size:
   *
   *     calculated width/height
   *
   * NO CSS TRANSFORM.
   *
   * Fabric's own CSS dimension
   * system controls the complete
   * canvas stack.
   * ========================================================
   */

  useEffect(() => {
    const stage = stageRef.current;

    const host = hostRef.current;

    const canvas = canvasRef.current;

    if (!stage || !host || !canvas) {
      return;
    }

    const updateSize = () => {
      if (disposedRef.current) {
        return;
      }

      const availableWidth = Math.max(stage.clientWidth - 48, 1);

      const availableHeight = Math.max(stage.clientHeight - 48, 1);

      const widthScale = availableWidth / SLIDE_WIDTH;

      const heightScale = availableHeight / SLIDE_HEIGHT;

      const scale = Math.min(widthScale, heightScale, 1);

      const safeScale = Math.max(scale, 0.1);

      const visualWidth = Math.max(Math.round(SLIDE_WIDTH * safeScale), 1);

      const visualHeight = Math.max(Math.round(SLIDE_HEIGHT * safeScale), 1);

      /*
       * IMPORTANT:
       *
       * Scale Fabric's CSS dimensions,
       * NOT its DOM wrapper with transform.
       */

      canvas.setDimensions(
        {
          width: `${visualWidth}px`,
          height: `${visualHeight}px`,
        },
        {
          cssOnly: true,
        },
      );

      /*
       * Host owns only the visual
       * layout box.
       */

      host.style.width = `${visualWidth}px`;

      host.style.height = `${visualHeight}px`;

      host.style.position = "relative";

      host.style.overflow = "hidden";

      host.style.flex = "0 0 auto";

      /*
       * Never allow old viewport
       * movement.
       */

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      canvas.calcOffset();

      canvas.requestRenderAll();
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(stage);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * ========================================================
   * DELETE / BACKSPACE
   * ========================================================
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canEditRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

      /*
       * Do not delete while typing.
       */

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key !== "Delete" && event.key !== "Backspace") {
        return;
      }

      if (activeToolRef.current !== "select") {
        return;
      }

      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const deleted = deleteSelectedObjects(canvas);

      if (!deleted) {
        return;
      }

      event.preventDefault();

      recordMutation();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [recordMutation]);

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <div
      ref={stageRef}
      className="
        absolute
        inset-0

        flex
        min-h-0
        min-w-0

        items-center
        justify-center

        overflow-hidden
        overscroll-none

        bg-muted/20

        select-none
      "
      style={{
        contain: "strict",
      }}
    >
      <div
        ref={hostRef}
        className="
          relative
          shrink-0

          overflow-hidden

          bg-white

          shadow-2xl
        "
        style={{
          width: `${SLIDE_WIDTH}px`,
          height: `${SLIDE_HEIGHT}px`,
        }}
      />
    </div>
  );
}
