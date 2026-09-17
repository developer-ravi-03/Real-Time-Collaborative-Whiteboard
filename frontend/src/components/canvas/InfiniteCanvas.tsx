"use client";

import { useEffect, useRef, useState } from "react";

import { Canvas, Circle, IText, Line, PencilBrush, Point, Rect } from "fabric";

import type { TPointerEvent, TPointerEventInfo } from "fabric";

import type { CanvasTool } from "./canvas.types";

import { CanvasEraser, type EraserSize } from "./CanvasEraser";
import { addImageToCanvas } from "./CanvasImage";

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

type HistoryState = {
  canUndo: boolean;
  canRedo: boolean;
};

type HistoryActions = {
  undo: () => void;

  redo: () => void;

  addImage: (file: File) => Promise<void>;
};

type InfiniteCanvasProps = {
  pageId: string;

  canvasData: Record<string, unknown>;

  canEdit: boolean;

  activeTool: CanvasTool;

  eraserSize: EraserSize;

  onHistoryChange?: (state: HistoryState) => void;

  onHistoryActions?: (actions: HistoryActions) => void;

  onCanvasChange?: (canvasData: Record<string, unknown>) => void;

  /*
   * Canvas state received from another
   * collaborator through Socket.IO.
   */
  remoteCanvasUpdate?: {
    pageId: string;

    canvasData: Record<string, unknown>;

    userId?: string;
  } | null;
};

/*
 * ==========================================================
 * CONSTANTS
 * ==========================================================
 */

const MAX_HISTORY = 50;

const MIN_ZOOM = 0.1;

const MAX_ZOOM = 5;

const PEN_WIDTH = 3;

/*
 * ==========================================================
 * PEN CURSOR
 * ==========================================================
 */

const PEN_CURSOR_SVG = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 32 32"
>
  <path
    d="M7 23.5L20.8 9.7L25.3 14.2L11.5 28H7V23.5Z"
    fill="white"
    stroke="#111827"
    stroke-width="1.8"
    stroke-linejoin="round"
  />

  <path
    d="M20.8 9.7L23.1 7.4C24 6.5 25.5 6.5 26.4 7.4L27.6 8.6C28.5 9.5 28.5 11 27.6 11.9L25.3 14.2"
    fill="#e5e7eb"
    stroke="#111827"
    stroke-width="1.8"
    stroke-linejoin="round"
  />

  <path
    d="M7 28L11.5 28L7 23.5V28Z"
    fill="#111827"
  />

  <path
    d="M17.5 13L22 17.5"
    stroke="#9ca3af"
    stroke-width="1.5"
  />
</svg>
`;

const PEN_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  PEN_CURSOR_SVG,
)}") 3 28, auto`;

/*
 * ==========================================================
 * COMPONENT
 * ==========================================================
 */

export function InfiniteCanvas({
  pageId,
  canvasData,
  canEdit,
  activeTool,
  eraserSize,
  onHistoryChange,
  onHistoryActions,
  onCanvasChange,
  remoteCanvasUpdate,
}: InfiniteCanvasProps) {
  /*
   * ========================================================
   * DOM / FABRIC REFS
   * ========================================================
   */

  const containerRef = useRef<HTMLDivElement | null>(null);

  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  const fabricCanvasRef = useRef<Canvas | null>(null);

  const eraserRef = useRef<CanvasEraser | null>(null);

  /*
   * ========================================================
   * ERASER CURSOR
   * ========================================================
   */

  const eraserCursorRef = useRef<HTMLDivElement | null>(null);

  /*
   * ========================================================
   * LATEST PROPS
   * ========================================================
   */

  const activeToolRef = useRef<CanvasTool>(activeTool);

  const canEditRef = useRef<boolean>(canEdit);

  const eraserSizeRef = useRef<EraserSize>(eraserSize);

  /*
   * ========================================================
   * PAN
   * ========================================================
   */

  const spacePressedRef = useRef(false);

  const isPanningRef = useRef(false);

  const lastPanPointRef = useRef({
    x: 0,
    y: 0,
  });

  /*
   * ========================================================
   * SHAPE DRAWING
   * ========================================================
   */

  const isDrawingShapeRef = useRef(false);

  const shapeStartPointRef = useRef({
    x: 0,
    y: 0,
  });

  const currentShapeRef = useRef<Rect | Circle | Line | null>(null);

  /*
   * ========================================================
   * ERASER
   * ========================================================
   */

  const isErasingRef = useRef(false);

  /*
   * ========================================================
   * HISTORY
   * ========================================================
   */

  const historyRef = useRef<string[]>([]);

  const redoHistoryRef = useRef<string[]>([]);

  const restoringHistoryRef = useRef(false);

  const historyBusyRef = useRef(false);

  const applyingRemoteUpdateRef = useRef(false);

  /*
   * ========================================================
   * CANVAS INITIALIZATION
   * ========================================================
   *
   * IMPORTANT:
   *
   * Loading canvasData from the database is NOT a user
   * modification.
   *
   * During Fabric's loadFromJSON(), internal Fabric events
   * may happen. We must prevent those events from causing
   * onCanvasChange() and therefore prevent false:
   *
   *     Unsaved changes
   *
   * immediately after reopening a board.
   */

  const isInitializingRef = useRef(true);

  /*
   * ========================================================
   * CALLBACK REFS
   * ========================================================
   */

  const onHistoryChangeRef = useRef(onHistoryChange);

  const onHistoryActionsRef = useRef(onHistoryActions);

  const onCanvasChangeRef = useRef(onCanvasChange);

  /*
   * ========================================================
   * UI STATE
   * ========================================================
   */

  const [zoom, setZoom] = useState(1);

  /*
   * ========================================================
   * CALLBACK REF SYNC
   * ========================================================
   */

  useEffect(() => {
    onHistoryChangeRef.current = onHistoryChange;
  }, [onHistoryChange]);

  useEffect(() => {
    onHistoryActionsRef.current = onHistoryActions;
  }, [onHistoryActions]);

  useEffect(() => {
    onCanvasChangeRef.current = onCanvasChange;
  }, [onCanvasChange]);

  /*
   * ========================================================
   * PROP REF SYNC
   * ========================================================
   */

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    canEditRef.current = canEdit;
  }, [canEdit]);

  useEffect(() => {
    eraserSizeRef.current = eraserSize;

    eraserRef.current?.setSize(eraserSize);

    const cursor = eraserCursorRef.current;

    if (cursor) {
      const currentZoom = fabricCanvasRef.current?.getZoom() ?? zoom;

      const visualSize = eraserSize * currentZoom;

      cursor.style.width = `${visualSize}px`;

      cursor.style.height = `${visualSize}px`;
    }
  }, [eraserSize, zoom]);

  /*
   * ========================================================
   * ERASER CURSOR VISIBILITY
   * ========================================================
   */

  useEffect(() => {
    const cursor = eraserCursorRef.current;

    if (!cursor) {
      return;
    }

    if (activeTool === "eraser" && canEdit) {
      cursor.style.display = "block";
    } else {
      cursor.style.display = "none";
    }
  }, [activeTool, canEdit]);

  /*
   * ========================================================
   * HISTORY NOTIFICATION
   * ========================================================
   */

  const notifyHistoryChange = () => {
    onHistoryChangeRef.current?.({
      canUndo: historyRef.current.length > 1,

      canRedo: redoHistoryRef.current.length > 0,
    });
  };

  /*
   * ========================================================
   * PUSH HISTORY
   * ========================================================
   *
   * IMPORTANT:
   *
   * Do not create history / dirty state while the canvas
   * is being initialized from persisted canvasData.
   */

  const pushHistory = () => {
    const canvas = fabricCanvasRef.current;

    if (
      !canvas ||
      restoringHistoryRef.current ||
      isInitializingRef.current ||
      applyingRemoteUpdateRef.current
    ) {
      return;
    }

    const snapshot = JSON.stringify(canvas.toJSON());

    const history = historyRef.current;

    if (history.length > 0 && history[history.length - 1] === snapshot) {
      return;
    }

    history.push(snapshot);

    if (history.length > MAX_HISTORY) {
      history.shift();
    }

    redoHistoryRef.current = [];

    notifyHistoryChange();

    onCanvasChangeRef.current?.(canvas.toJSON() as Record<string, unknown>);
  };

  /*
   * ========================================================
   * RESTORE SNAPSHOT
   * ========================================================
   */

  const restoreSnapshot = async (snapshot: string) => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    if (canvas.destroyed || canvas.disposed) {
      return;
    }

    restoringHistoryRef.current = true;

    /*
     * IMPORTANT
     *
     * DO NOT call canvas.clear() here.
     *
     * Fabric's loadFromJSON() replaces the canvas object
     * collection itself. Calling clear() first creates a
     * visible blank frame.
     */
    const previousRenderOnAddRemove = canvas.renderOnAddRemove;

    canvas.renderOnAddRemove = false;

    try {
      /*
       * Discard selection without clearing the canvas.
       */
      canvas.discardActiveObject();

      /*
       * Replace the current Fabric objects with the
       * snapshot.
       *
       * There is intentionally NO canvas.clear() before this.
       */
      await canvas.loadFromJSON(JSON.parse(snapshot));

      /*
       * The canvas may have been destroyed/replaced while
       * asynchronous JSON loading was running.
       */
      if (
        fabricCanvasRef.current !== canvas ||
        canvas.destroyed ||
        canvas.disposed
      ) {
        return;
      }

      /*
       * Restore object-level Fabric configuration.
       */
      canvas.getObjects().forEach((object) => {
        object.set({
          erasable: true,
        });

        object.setCoords();

        if (object.clipPath) {
          object.clipPath.set({
            selectable: false,
            evented: false,
          });

          object.clipPath.setCoords();
        }
      });

      /*
       * Make sure nothing remains selected after undo/redo.
       */
      canvas.discardActiveObject();

      /*
       * Render only the final restored state.
       */
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Failed to restore canvas snapshot:", error);
    } finally {
      /*
       * Always restore the previous Fabric setting.
       */
      if (!canvas.destroyed && !canvas.disposed) {
        canvas.renderOnAddRemove = previousRenderOnAddRemove;

        canvas.requestRenderAll();
      }

      restoringHistoryRef.current = false;
    }
  };

  /*
   * ========================================================
   * UNDO
   * ========================================================
   */

  const undo = async () => {
    if (historyBusyRef.current || historyRef.current.length <= 1) {
      return;
    }

    historyBusyRef.current = true;

    try {
      const currentState = historyRef.current.pop();

      if (!currentState) {
        return;
      }

      redoHistoryRef.current.push(currentState);

      const previousState = historyRef.current[historyRef.current.length - 1];

      if (!previousState) {
        return;
      }

      await restoreSnapshot(previousState);

      notifyHistoryChange();

      const canvas = fabricCanvasRef.current;

      if (canvas) {
        onCanvasChangeRef.current?.(canvas.toJSON() as Record<string, unknown>);
      }
    } finally {
      historyBusyRef.current = false;
    }
  };

  /*
   * ========================================================
   * REDO
   * ========================================================
   */

  const redo = async () => {
    if (historyBusyRef.current) {
      return;
    }

    const nextState = redoHistoryRef.current[redoHistoryRef.current.length - 1];

    if (!nextState) {
      return;
    }

    historyBusyRef.current = true;

    try {
      redoHistoryRef.current.pop();

      historyRef.current.push(nextState);

      await restoreSnapshot(nextState);

      notifyHistoryChange();

      const canvas = fabricCanvasRef.current;

      if (canvas) {
        onCanvasChangeRef.current?.(canvas.toJSON() as Record<string, unknown>);
      }
    } finally {
      historyBusyRef.current = false;
    }
  };

  /*
   * ========================================================
   * ADD IMAGE
   * ========================================================
   */

  const addImage = async (file: File) => {
    const canvas = fabricCanvasRef.current;

    if (!canvas || !canEditRef.current) {
      return;
    }

    try {
      await addImageToCanvas(canvas, file);

      pushHistory();
    } catch (error) {
      console.error("Failed to add image:", error);

      throw error;
    }
  };

  /*
   * ========================================================
   * HISTORY ACTION BRIDGE
   * ========================================================
   */

  useEffect(() => {
    onHistoryActionsRef.current?.({
      undo: () => {
        void undo();
      },

      redo: () => {
        void redo();
      },

      addImage: async (file: File) => {
        await addImage(file);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * ========================================================
   * POINTER HELPERS
   * ========================================================
   */

  const getClientPosition = (
    event: TPointerEvent,
  ): {
    x: number;
    y: number;
  } => {
    if ("clientX" in event && "clientY" in event) {
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }

    if ("touches" in event && event.touches.length > 0) {
      const touch = event.touches[0];

      return {
        x: touch.clientX,
        y: touch.clientY,
      };
    }

    if ("changedTouches" in event && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];

      return {
        x: touch.clientX,
        y: touch.clientY,
      };
    }

    return {
      x: 0,
      y: 0,
    };
  };

  const getButton = (event: TPointerEvent): number => {
    if ("button" in event) {
      return event.button;
    }

    return 0;
  };

  /*
   * ========================================================
   * REMOTE CANVAS UPDATE
   * ========================================================
   *
   * Socket.IO delivers the latest canvas snapshot from
   * another collaborator. Applying it must never become a
   * local history entry, autosave operation, or socket event.
   */

  useEffect(() => {
    const update = remoteCanvasUpdate;

    if (!update || update.pageId !== pageId) {
      return;
    }

    const canvas = fabricCanvasRef.current;

    if (!canvas || canvas.destroyed || canvas.disposed) {
      return;
    }

    /* Do not interrupt an active local drawing interaction. */
    if (
      isDrawingShapeRef.current ||
      isPanningRef.current ||
      isErasingRef.current
    ) {
      return;
    }

    let cancelled = false;

    const applyRemoteUpdate = async () => {
      if (
        applyingRemoteUpdateRef.current ||
        canvas.destroyed ||
        canvas.disposed
      ) {
        return;
      }

      applyingRemoteUpdateRef.current = true;
      restoringHistoryRef.current = true;

      const previousRenderOnAddRemove = canvas.renderOnAddRemove;

      canvas.renderOnAddRemove = false;

      try {
        canvas.discardActiveObject();

        /*
         * IMPORTANT: do not call canvas.clear() here. It creates
         * a visible blank frame before the remote snapshot loads.
         */
        await canvas.loadFromJSON(update.canvasData);

        if (
          cancelled ||
          fabricCanvasRef.current !== canvas ||
          canvas.destroyed ||
          canvas.disposed
        ) {
          return;
        }

        canvas.getObjects().forEach((object) => {
          object.set({ erasable: true });
          object.setCoords();

          if (object.clipPath) {
            object.clipPath.set({
              selectable: false,
              evented: false,
            });
            object.clipPath.setCoords();
          }
        });

        canvas.discardActiveObject();
        canvas.requestRenderAll();

        console.info(
          `[Realtime] Applied canvas update from ${
            update.userId ?? "another user"
          }`,
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "[Realtime] Failed to apply remote canvas update:",
            error,
          );
        }
      } finally {
        if (!canvas.destroyed && !canvas.disposed) {
          canvas.renderOnAddRemove = previousRenderOnAddRemove;
          canvas.requestRenderAll();
        }

        restoringHistoryRef.current = false;
        applyingRemoteUpdateRef.current = false;
      }
    };

    void applyRemoteUpdate();

    return () => {
      cancelled = true;
    };
  }, [remoteCanvasUpdate, pageId]);

  /*
   * ========================================================
   * FABRIC INITIALIZATION
   * ========================================================
   */

  useEffect(() => {
    const container = containerRef.current;

    const element = canvasElementRef.current;

    if (!container || !element) {
      return;
    }

    let cancelled = false;

    element.setAttribute("aria-label", "Infinite collaborative canvas");

    const canvas = new Canvas(element, {
      selection: canEditRef.current,

      preserveObjectStacking: true,

      backgroundColor: "#f8fafc",
    });

    fabricCanvasRef.current = canvas;

    /*
     * ======================================================
     * MARK CANVAS AS INITIALIZING
     * ======================================================
     *
     * Everything that happens while persisted canvasData is
     * being loaded must NOT be treated as a user edit.
     */

    isInitializingRef.current = true;

    /*
     * ======================================================
     * PEN CURSOR
     * ======================================================
     */

    canvas.freeDrawingCursor = PEN_CURSOR;

    /*
     * ------------------------------------------------------
     * CREATE ERASER
     * ------------------------------------------------------
     */

    const eraser = new CanvasEraser(canvas, eraserSizeRef.current);

    eraserRef.current = eraser;

    /*
     * ------------------------------------------------------
     * INTERACTION CANVAS
     * ------------------------------------------------------
     */

    const interactionElement = canvas.upperCanvasEl;

    if (!interactionElement) {
      isInitializingRef.current = false;

      void canvas.dispose().catch((error) => {
        console.error("Failed to dispose Fabric canvas:", error);
      });

      return;
    }

    interactionElement.style.cursor = "default";

    interactionElement.style.userSelect = "none";

    interactionElement.style.webkitUserSelect = "none";

    interactionElement.style.touchAction = "none";

    /*
     * ======================================================
     * RESIZE
     * ======================================================
     */

    const resizeCanvas = () => {
      if (cancelled) {
        return;
      }

      const width = container.clientWidth;

      const height = container.clientHeight;

      if (width <= 0 || height <= 0) {
        return;
      }

      canvas.setDimensions({
        width,
        height,
      });

      canvas.requestRenderAll();
    };

    resizeCanvas();

    /*
     * ======================================================
     * LOAD CANVAS DATA
     * ======================================================
     */

    const loadCanvas = async () => {
      try {
        if (cancelled) {
          return;
        }

        /*
         * --------------------------------------------------
         * EMPTY CANVAS
         * --------------------------------------------------
         */

        if (!canvasData || Object.keys(canvasData).length === 0) {
          historyRef.current = [JSON.stringify(canvas.toJSON())];

          redoHistoryRef.current = [];

          notifyHistoryChange();

          return;
        }

        /*
         * --------------------------------------------------
         * LOAD PERSISTED DATA
         * --------------------------------------------------
         *
         * isInitializingRef remains true here.
         *
         * Therefore any Fabric events caused by loading
         * persisted objects cannot trigger dirty state.
         */

        await canvas.loadFromJSON(canvasData);

        if (cancelled) {
          return;
        }

        canvas.getObjects().forEach((object) => {
          object.set({
            erasable: true,
          });

          object.setCoords();

          if (object.clipPath) {
            object.clipPath.set({
              selectable: false,
              evented: false,
            });

            object.clipPath.setCoords();
          }
        });

        canvas.discardActiveObject();

        canvas.requestRenderAll();

        setZoom(canvas.getZoom());

        /*
         * --------------------------------------------------
         * INITIAL HISTORY STATE
         * --------------------------------------------------
         */

        historyRef.current = [JSON.stringify(canvas.toJSON())];

        redoHistoryRef.current = [];

        notifyHistoryChange();
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load infinite canvas:", error);
        }
      } finally {
        /*
         * ==================================================
         * INITIALIZATION COMPLETE
         * ==================================================
         *
         * From this point onward, canvas mutations are
         * genuine user changes and may create dirty state.
         */

        isInitializingRef.current = false;
      }
    };

    void loadCanvas();

    /*
     * ======================================================
     * WHEEL
     * ======================================================
     */

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      /*
       * ====================================================
       * ZOOM
       * ====================================================
       */

      if (event.ctrlKey || event.metaKey) {
        let nextZoom = canvas.getZoom();

        nextZoom *= 0.999 ** event.deltaY;

        nextZoom = Math.min(Math.max(nextZoom, MIN_ZOOM), MAX_ZOOM);

        const point = new Point(event.offsetX, event.offsetY);

        canvas.zoomToPoint(point, nextZoom);

        setZoom(nextZoom);

        canvas.requestRenderAll();

        /*
         * Update eraser cursor size.
         */

        const cursor = eraserCursorRef.current;

        if (cursor) {
          const visualSize = eraserSizeRef.current * nextZoom;

          cursor.style.width = `${visualSize}px`;

          cursor.style.height = `${visualSize}px`;
        }

        return;
      }

      /*
       * ====================================================
       * PAN
       * ====================================================
       */

      const transform = canvas.viewportTransform;

      if (!transform) {
        return;
      }

      transform[4] -= event.deltaX;

      transform[5] -= event.deltaY;

      canvas.requestRenderAll();
    };

    interactionElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    /*
     * ======================================================
     * TOOL MODE
     * ======================================================
     */

    const updateToolMode = () => {
      const tool = activeToolRef.current;

      /*
       * ====================================================
       * VIEWER
       * ====================================================
       */

      if (!canEditRef.current) {
        canvas.isDrawingMode = false;

        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        canvas.defaultCursor = "default";

        canvas.hoverCursor = "default";

        interactionElement.style.cursor = "default";

        return;
      }

      /*
       * ====================================================
       * SPACE PAN
       * ====================================================
       */

      if (spacePressedRef.current) {
        canvas.isDrawingMode = false;

        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        canvas.defaultCursor = "grab";

        canvas.hoverCursor = "grab";

        interactionElement.style.cursor = "grab";

        return;
      }

      /*
       * ====================================================
       * SELECT
       * ====================================================
       */

      if (tool === "select") {
        canvas.isDrawingMode = false;

        canvas.selection = true;

        canvas.skipTargetFind = false;

        canvas.defaultCursor = "default";

        canvas.hoverCursor = "move";

        interactionElement.style.cursor = "default";

        canvas.requestRenderAll();

        return;
      }

      /*
       * ====================================================
       * HAND
       * ====================================================
       */

      if (tool === "hand") {
        canvas.isDrawingMode = false;

        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        canvas.defaultCursor = "grab";

        canvas.hoverCursor = "grab";

        interactionElement.style.cursor = "grab";

        return;
      }

      /*
       * ====================================================
       * PEN
       * ====================================================
       */

      if (tool === "pen") {
        canvas.isDrawingMode = true;

        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        if (!(canvas.freeDrawingBrush instanceof PencilBrush)) {
          canvas.freeDrawingBrush = new PencilBrush(canvas);
        }

        canvas.freeDrawingBrush.width = PEN_WIDTH;

        canvas.freeDrawingBrush.color = "#111827";

        canvas.freeDrawingCursor = PEN_CURSOR;

        canvas.defaultCursor = PEN_CURSOR;

        canvas.hoverCursor = PEN_CURSOR;

        interactionElement.style.cursor = PEN_CURSOR;

        canvas.requestRenderAll();

        return;
      }

      /*
       * ====================================================
       * ERASER
       * ====================================================
       */

      if (tool === "eraser") {
        canvas.isDrawingMode = false;

        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        canvas.defaultCursor = "none";

        canvas.hoverCursor = "none";

        interactionElement.style.cursor = "none";

        const cursor = eraserCursorRef.current;

        if (cursor) {
          const visualSize = eraserSizeRef.current * canvas.getZoom();

          cursor.style.width = `${visualSize}px`;

          cursor.style.height = `${visualSize}px`;

          cursor.style.display = "block";
        }

        canvas.requestRenderAll();

        return;
      }

      /*
       * ====================================================
       * SHAPES / TEXT
       * ====================================================
       */

      if (
        tool === "rectangle" ||
        tool === "circle" ||
        tool === "line" ||
        tool === "text"
      ) {
        canvas.isDrawingMode = false;

        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        canvas.defaultCursor = "crosshair";

        canvas.hoverCursor = "crosshair";

        interactionElement.style.cursor = "crosshair";

        canvas.requestRenderAll();
      }
    };

    /*
     * ======================================================
     * START PAN
     * ======================================================
     */

    const startPan = (event: TPointerEvent) => {
      const position = getClientPosition(event);

      isPanningRef.current = true;

      lastPanPointRef.current = {
        x: position.x,
        y: position.y,
      };

      interactionElement.style.cursor = "grabbing";

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      canvas.requestRenderAll();
    };

    /*
     * ======================================================
     * MOUSE DOWN
     * ======================================================
     */

    const handleMouseDown = (event: TPointerEventInfo<TPointerEvent>) => {
      if (!canEditRef.current) {
        return;
      }

      const pointerEvent = event.e;

      const button = getButton(pointerEvent);

      /*
       * ====================================================
       * SPACE + LEFT CLICK
       * ====================================================
       */

      if (spacePressedRef.current && button === 0) {
        startPan(pointerEvent);

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * MIDDLE MOUSE
       * ====================================================
       */

      if (button === 1) {
        startPan(pointerEvent);

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * HAND
       * ====================================================
       */

      if (activeToolRef.current === "hand" && button === 0) {
        startPan(pointerEvent);

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * LEFT CLICK ONLY
       * ====================================================
       */

      if (button !== 0) {
        return;
      }

      /*
       * ====================================================
       * ERASER
       * ====================================================
       */

      if (activeToolRef.current === "eraser") {
        canvas.selection = false;

        canvas.skipTargetFind = true;

        canvas.discardActiveObject();

        const pointer = event.scenePoint;

        isErasingRef.current = true;

        eraserRef.current?.start({
          x: pointer.x,
          y: pointer.y,
        });

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * RECTANGLE
       * ====================================================
       */

      if (activeToolRef.current === "rectangle") {
        const pointer = event.scenePoint;

        shapeStartPointRef.current = {
          x: pointer.x,
          y: pointer.y,
        };

        isDrawingShapeRef.current = true;

        const rectangle = new Rect({
          left: pointer.x,

          top: pointer.y,

          width: 0,

          height: 0,

          fill: "rgba(59, 130, 246, 0.12)",

          stroke: "#3b82f6",

          strokeWidth: 2,

          rx: 8,

          ry: 8,

          erasable: true,
        });

        currentShapeRef.current = rectangle;

        canvas.add(rectangle);

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * CIRCLE
       * ====================================================
       */

      if (activeToolRef.current === "circle") {
        const pointer = event.scenePoint;

        shapeStartPointRef.current = {
          x: pointer.x,
          y: pointer.y,
        };

        isDrawingShapeRef.current = true;

        const circle = new Circle({
          left: pointer.x,

          top: pointer.y,

          radius: 0,

          fill: "rgba(16, 185, 129, 0.12)",

          stroke: "#10b981",

          strokeWidth: 2,

          erasable: true,
        });

        currentShapeRef.current = circle;

        canvas.add(circle);

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * LINE
       * ====================================================
       */

      if (activeToolRef.current === "line") {
        const pointer = event.scenePoint;

        shapeStartPointRef.current = {
          x: pointer.x,
          y: pointer.y,
        };

        isDrawingShapeRef.current = true;

        const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: "#111827",

          strokeWidth: 3,

          selectable: true,

          evented: true,

          erasable: true,
        });

        currentShapeRef.current = line;

        canvas.add(line);

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * TEXT
       * ====================================================
       */

      if (activeToolRef.current === "text") {
        const pointer = event.scenePoint;

        const text = new IText("Type here", {
          left: pointer.x,

          top: pointer.y,

          fontSize: 28,

          fill: "#111827",

          fontFamily: "Inter, Arial, sans-serif",

          editable: true,

          padding: 5,

          erasable: true,
        });

        canvas.add(text);

        canvas.setActiveObject(text);

        text.enterEditing();

        text.selectAll();

        canvas.requestRenderAll();

        pushHistory();

        pointerEvent.preventDefault();
      }
    };

    /*
     * ======================================================
     * MOUSE MOVE
     * ======================================================
     */

    const handleMouseMove = (event: TPointerEventInfo<TPointerEvent>) => {
      const pointerEvent = event.e;

      /*
       * ====================================================
       * ERASER CURSOR
       * ====================================================
       */

      if (activeToolRef.current === "eraser" && canEditRef.current) {
        const cursor = eraserCursorRef.current;

        if (cursor) {
          const zoomValue = canvas.getZoom();

          const visualSize = eraserSizeRef.current * zoomValue;

          cursor.style.width = `${visualSize}px`;

          cursor.style.height = `${visualSize}px`;

          cursor.style.left = `${event.viewportPoint.x}px`;

          cursor.style.top = `${event.viewportPoint.y}px`;

          cursor.style.transform = "translate3d(-50%, -50%, 0)";

          cursor.style.opacity = "1";
        }
      }

      /*
       * ====================================================
       * ERASER MOVE
       * ====================================================
       */

      if (isErasingRef.current) {
        const pointer = event.scenePoint;

        eraserRef.current?.move({
          x: pointer.x,
          y: pointer.y,
        });

        pointerEvent.preventDefault();

        return;
      }

      /*
       * ====================================================
       * DRAW SHAPE
       * ====================================================
       */

      if (isDrawingShapeRef.current && currentShapeRef.current) {
        const pointer = event.scenePoint;

        const start = shapeStartPointRef.current;

        const current = currentShapeRef.current;

        /*
         * --------------------------------------------------
         * RECTANGLE
         * --------------------------------------------------
         */

        if (current instanceof Rect) {
          const width = pointer.x - start.x;

          const height = pointer.y - start.y;

          current.set({
            left: width < 0 ? pointer.x : start.x,

            top: height < 0 ? pointer.y : start.y,

            width: Math.abs(width),

            height: Math.abs(height),
          });

          current.setCoords();
        }

        /*
         * --------------------------------------------------
         * CIRCLE
         * --------------------------------------------------
         */

        if (current instanceof Circle) {
          const deltaX = pointer.x - start.x;

          const deltaY = pointer.y - start.y;

          const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2;

          current.set({
            radius: Math.max(radius, 1),

            left: (start.x + pointer.x) / 2,

            top: (start.y + pointer.y) / 2,
          });

          current.setCoords();
        }

        /*
         * --------------------------------------------------
         * LINE
         * --------------------------------------------------
         */

        if (current instanceof Line) {
          current.set({
            x2: pointer.x,

            y2: pointer.y,
          });

          current.setCoords();
        }

        canvas.requestRenderAll();

        return;
      }

      /*
       * ====================================================
       * PAN
       * ====================================================
       */

      if (!isPanningRef.current) {
        return;
      }

      const position = getClientPosition(pointerEvent);

      const last = lastPanPointRef.current;

      const deltaX = position.x - last.x;

      const deltaY = position.y - last.y;

      lastPanPointRef.current = {
        x: position.x,

        y: position.y,
      };

      const transform = canvas.viewportTransform;

      if (!transform) {
        return;
      }

      transform[4] += deltaX;

      transform[5] += deltaY;

      canvas.requestRenderAll();
    };

    /*
     * ======================================================
     * MOUSE OUT
     * ======================================================
     */

    const handleMouseOut = () => {
      const cursor = eraserCursorRef.current;

      if (cursor) {
        cursor.style.opacity = "0";
      }
    };

    /*
     * ======================================================
     * MOUSE UP
     * ======================================================
     */

    const handleMouseUp = () => {
      /*
       * ==================================================
       * FINISH ERASER
       * ==================================================
       */

      if (isErasingRef.current) {
        isErasingRef.current = false;

        const changed = eraserRef.current?.end() ?? false;

        if (changed) {
          pushHistory();
        }

        canvas.discardActiveObject();

        canvas.requestRenderAll();

        updateToolMode();

        return;
      }

      /*
       * ==================================================
       * FINISH SHAPE
       * ==================================================
       */

      if (isDrawingShapeRef.current) {
        isDrawingShapeRef.current = false;

        const shape = currentShapeRef.current;

        if (shape) {
          shape.setCoords();

          if (shape instanceof Rect) {
            if ((shape.width ?? 0) < 2 || (shape.height ?? 0) < 2) {
              canvas.remove(shape);
            }
          }

          if (shape instanceof Circle) {
            if ((shape.radius ?? 0) < 2) {
              canvas.remove(shape);
            }
          }

          if (shape instanceof Line) {
            const dx = (shape.x2 ?? 0) - (shape.x1 ?? 0);

            const dy = (shape.y2 ?? 0) - (shape.y1 ?? 0);

            const length = Math.sqrt(dx * dx + dy * dy);

            if (length < 2) {
              canvas.remove(shape);
            }
          }
        }

        currentShapeRef.current = null;

        canvas.requestRenderAll();

        pushHistory();

        return;
      }

      /*
       * ==================================================
       * STOP PAN
       * ==================================================
       */

      if (!isPanningRef.current) {
        return;
      }

      isPanningRef.current = false;

      updateToolMode();
    };

    /*
     * ======================================================
     * PEN PATH CREATED
     * ======================================================
     */

    const handlePathCreated = () => {
      if (
        restoringHistoryRef.current ||
        isInitializingRef.current ||
        applyingRemoteUpdateRef.current
      ) {
        return;
      }

      const objects = canvas.getObjects();

      const lastObject = objects[objects.length - 1];

      if (lastObject) {
        lastObject.set({
          erasable: true,
        });

        lastObject.setCoords();
      }

      canvas.requestRenderAll();

      pushHistory();
    };

    /*
     * ======================================================
     * OBJECT MODIFIED
     * ======================================================
     */

    const handleObjectModified = () => {
      if (
        restoringHistoryRef.current ||
        isInitializingRef.current ||
        applyingRemoteUpdateRef.current
      ) {
        return;
      }

      const activeObjects = canvas.getActiveObjects();

      activeObjects.forEach((object) => {
        object.setCoords();

        if (object.clipPath) {
          object.clipPath.set({
            selectable: false,

            evented: false,

            dirty: true,
          });

          object.clipPath.setCoords();
        }

        object.set({
          dirty: true,
        });
      });

      canvas.requestRenderAll();

      pushHistory();
    };

    /*
     * ======================================================
     * DELETE / BACKSPACE
     * ======================================================
     */

    const handleDeleteKey = (event: KeyboardEvent) => {
      if (!canEditRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

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

      const canvas = fabricCanvasRef.current;

      if (!canvas) {
        return;
      }

      const focusedElement = document.activeElement;

      if (focusedElement instanceof HTMLElement) {
        focusedElement.blur();
      }

      const activeObjects = canvas.getActiveObjects();

      if (activeObjects.length === 0) {
        return;
      }

      event.preventDefault();

      activeObjects.forEach((object) => {
        canvas.remove(object);
      });

      canvas.discardActiveObject();

      canvas.selection = false;

      canvas.requestRenderAll();

      updateToolMode();

      pushHistory();
    };

    /*
     * ======================================================
     * UNDO / REDO KEYBOARD
     * ======================================================
     */

    const handleHistoryKeyDown = async (event: KeyboardEvent) => {
      if (!canEditRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const modifier = event.ctrlKey || event.metaKey;

      if (!modifier) {
        return;
      }

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          await redo();
        } else {
          await undo();
        }

        return;
      }

      if (event.key.toLowerCase() === "y") {
        event.preventDefault();

        await redo();
      }
    };

    /*
     * ======================================================
     * SPACE PAN
     * ======================================================
     */

    const handleSpaceKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || spacePressedRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      spacePressedRef.current = true;

      updateToolMode();

      event.preventDefault();
    };

    const handleSpaceKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      spacePressedRef.current = false;

      isPanningRef.current = false;

      updateToolMode();

      event.preventDefault();
    };

    /*
     * ======================================================
     * WINDOW BLUR
     * ======================================================
     */

    const handleWindowBlur = () => {
      spacePressedRef.current = false;

      isPanningRef.current = false;

      isDrawingShapeRef.current = false;

      currentShapeRef.current = null;

      if (isErasingRef.current) {
        isErasingRef.current = false;

        eraserRef.current?.cancel();
      }

      const cursor = eraserCursorRef.current;

      if (cursor) {
        cursor.style.opacity = "0";
      }

      updateToolMode();
    };

    /*
     * ======================================================
     * RESIZE OBSERVER
     * ======================================================
     */

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(container);

    /*
     * ======================================================
     * FABRIC EVENTS
     * ======================================================
     */

    canvas.on("mouse:down", handleMouseDown);

    canvas.on("mouse:move", handleMouseMove);

    canvas.on("mouse:up", handleMouseUp);

    canvas.on("mouse:out", handleMouseOut);

    canvas.on("path:created", handlePathCreated);

    canvas.on("object:modified", handleObjectModified);

    /*
     * ======================================================
     * WINDOW EVENTS
     * ======================================================
     */

    window.addEventListener("keydown", handleDeleteKey);

    window.addEventListener("keydown", handleHistoryKeyDown);

    window.addEventListener("keydown", handleSpaceKeyDown);

    window.addEventListener("keyup", handleSpaceKeyUp);

    window.addEventListener("blur", handleWindowBlur);

    /*
     * ======================================================
     * INITIAL TOOL MODE
     * ======================================================
     */

    activeToolRef.current = activeTool;

    canEditRef.current = canEdit;

    eraserSizeRef.current = eraserSize;

    eraser.setSize(eraserSize);

    canvas.freeDrawingCursor = PEN_CURSOR;

    updateToolMode();

    /*
     * ======================================================
     * CLEANUP
     * ======================================================
     */

    return () => {
      cancelled = true;

      isInitializingRef.current = true;

      resizeObserver.disconnect();

      interactionElement.removeEventListener("wheel", handleWheel);

      canvas.off("mouse:down", handleMouseDown);

      canvas.off("mouse:move", handleMouseMove);

      canvas.off("mouse:up", handleMouseUp);

      canvas.off("mouse:out", handleMouseOut);

      canvas.off("path:created", handlePathCreated);

      canvas.off("object:modified", handleObjectModified);

      window.removeEventListener("keydown", handleDeleteKey);

      window.removeEventListener("keydown", handleHistoryKeyDown);

      window.removeEventListener("keydown", handleSpaceKeyDown);

      window.removeEventListener("keyup", handleSpaceKeyUp);

      window.removeEventListener("blur", handleWindowBlur);

      eraser.cancel();

      eraserRef.current = null;

      if (fabricCanvasRef.current === canvas) {
        fabricCanvasRef.current = null;
      }

      void canvas.dispose().catch((error) => {
        console.error("Failed to dispose Fabric canvas:", error);
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  /*
   * ==========================================================
   * TOOL MODE EFFECT
   * ==========================================================
   */

  useEffect(() => {
    activeToolRef.current = activeTool;

    canEditRef.current = canEdit;

    const canvas = fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const interactionElement = canvas.upperCanvasEl;

    if (!interactionElement) {
      return;
    }

    /*
     * ======================================================
     * VIEWER
     * ======================================================
     */

    if (!canEdit) {
      canvas.isDrawingMode = false;

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      canvas.defaultCursor = "default";

      canvas.hoverCursor = "default";

      interactionElement.style.cursor = "default";

      return;
    }

    /*
     * ======================================================
     * SPACE PAN
     * ======================================================
     */

    if (spacePressedRef.current) {
      canvas.isDrawingMode = false;

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      canvas.defaultCursor = "grab";

      canvas.hoverCursor = "grab";

      interactionElement.style.cursor = "grab";

      return;
    }

    /*
     * ======================================================
     * SELECT
     * ======================================================
     */

    if (activeTool === "select") {
      canvas.isDrawingMode = false;

      canvas.selection = true;

      canvas.skipTargetFind = false;

      canvas.defaultCursor = "default";

      canvas.hoverCursor = "move";

      interactionElement.style.cursor = "default";

      canvas.requestRenderAll();

      return;
    }

    /*
     * ======================================================
     * HAND
     * ======================================================
     */

    if (activeTool === "hand") {
      canvas.isDrawingMode = false;

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      canvas.defaultCursor = "grab";

      canvas.hoverCursor = "grab";

      interactionElement.style.cursor = "grab";

      canvas.requestRenderAll();

      return;
    }

    /*
     * ======================================================
     * PEN
     * ======================================================
     */

    if (activeTool === "pen") {
      canvas.isDrawingMode = true;

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      if (!(canvas.freeDrawingBrush instanceof PencilBrush)) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
      }

      canvas.freeDrawingBrush.width = PEN_WIDTH;

      canvas.freeDrawingBrush.color = "#111827";

      canvas.freeDrawingCursor = PEN_CURSOR;

      canvas.defaultCursor = PEN_CURSOR;

      canvas.hoverCursor = PEN_CURSOR;

      interactionElement.style.cursor = PEN_CURSOR;

      canvas.requestRenderAll();

      return;
    }

    /*
     * ======================================================
     * ERASER
     * ======================================================
     */

    if (activeTool === "eraser") {
      canvas.isDrawingMode = false;

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      canvas.defaultCursor = "none";

      canvas.hoverCursor = "none";

      interactionElement.style.cursor = "none";

      const cursor = eraserCursorRef.current;

      if (cursor) {
        const visualSize = eraserSize * canvas.getZoom();

        cursor.style.width = `${visualSize}px`;

        cursor.style.height = `${visualSize}px`;

        cursor.style.display = "block";
      }

      canvas.requestRenderAll();

      return;
    }

    /*
     * ======================================================
     * SHAPES / TEXT
     * ======================================================
     */

    if (
      activeTool === "rectangle" ||
      activeTool === "circle" ||
      activeTool === "line" ||
      activeTool === "text"
    ) {
      canvas.isDrawingMode = false;

      canvas.selection = false;

      canvas.skipTargetFind = true;

      canvas.discardActiveObject();

      canvas.defaultCursor = "crosshair";

      canvas.hoverCursor = "crosshair";

      interactionElement.style.cursor = "crosshair";

      canvas.requestRenderAll();
    }
  }, [activeTool, canEdit, eraserSize]);

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div
      ref={containerRef}
      className="
        relative
        h-full
        w-full
        overflow-hidden
        bg-slate-100
      "
    >
      <canvas
        ref={canvasElementRef}
        aria-label="Infinite collaborative canvas"
        className="
        absolute
        inset-0
        h-full
        w-full
      "
      />

      {/* ====================================================
          ERASER CURSOR
          ==================================================== */}

      <div
        ref={eraserCursorRef}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          z-50

          rounded-full

          border-2
          border-slate-700

          bg-white/20

          opacity-0

          shadow-sm

          will-change-transform
        "
        style={{
          display: activeTool === "eraser" && canEdit ? "block" : "none",

          width: eraserSize * zoom,

          height: eraserSize * zoom,

          left: 0,

          top: 0,

          transform: "translate3d(-50%, -50%, 0)",

          transition: "width 80ms ease-out, height 80ms ease-out",
        }}
      />

      {/* ====================================================
          ZOOM
          ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-4
          right-4
          z-20

          rounded-lg

          border
          border-border

          bg-background/90

          px-3
          py-2

          text-xs
          font-medium
          text-muted-foreground

          shadow
          backdrop-blur
        "
      >
        {Math.round(zoom * 100)}%
      </div>

      {/* ====================================================
          ERASER INFO
          ==================================================== */}

      {activeTool === "eraser" && canEdit && (
        <div
          className="
              pointer-events-none

              absolute
              bottom-4
              left-1/2
              z-20

              -translate-x-1/2

              rounded-lg

              border
              border-border

              bg-background/90

              px-3
              py-2

              text-xs
              font-medium
              text-muted-foreground

              shadow
              backdrop-blur
            "
        >
          Eraser · {eraserSize}px
        </div>
      )}
    </div>
  );
}
