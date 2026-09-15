import {
  Canvas,
  Circle,
  IText,
  Line,
  PencilBrush,
  Rect,
  Textbox,
  type FabricObject,
  type TPointerEvent,
  type TPointerEventInfo,
} from "fabric";

import type { CanvasTool } from "./canvas.types";

import { SLIDE_WIDTH } from "./SlideCanvasEngine";

const STROKE_COLOR = "#111827";

const FILL_COLOR = "rgba(59, 130, 246, 0.12)";

const STROKE_WIDTH = 2;

const PEN_WIDTH = 3;

const TEXT_SIZE = 28;

const PAGE_PADDING = 24;

const MIN_TEXTBOX_WIDTH = 120;

type DrawingState = {
  startX: number;

  startY: number;

  object: Rect | Circle | Line;
};

export type SlideCanvasToolsController = {
  destroy: () => void;
};

/*
 * ==========================================================
 * SCENE POINT
 * ==========================================================
 */

function getScenePoint(canvas: Canvas, event: TPointerEvent) {
  return canvas.getScenePoint(event);
}

/*
 * ==========================================================
 * HIDDEN TEXTAREA
 * ==========================================================
 */

type EditableTextObject = {
  hiddenTextarea?: HTMLTextAreaElement | null;
};

function protectHiddenTextarea(text: EditableTextObject): void {
  const textarea = text.hiddenTextarea;

  if (!textarea) {
    return;
  }

  textarea.style.setProperty("position", "fixed", "important");

  textarea.style.setProperty("left", "-10000px", "important");

  textarea.style.setProperty("top", "-10000px", "important");

  textarea.style.setProperty("width", "1px", "important");

  textarea.style.setProperty("height", "1px", "important");

  textarea.style.setProperty("min-width", "1px", "important");

  textarea.style.setProperty("min-height", "1px", "important");

  textarea.style.setProperty("max-width", "1px", "important");

  textarea.style.setProperty("max-height", "1px", "important");

  textarea.style.setProperty("margin", "0", "important");

  textarea.style.setProperty("padding", "0", "important");

  textarea.style.setProperty("border", "0", "important");

  textarea.style.setProperty("overflow", "hidden", "important");

  textarea.style.setProperty("opacity", "0", "important");

  textarea.style.setProperty("pointer-events", "none", "important");

  textarea.style.setProperty("transform", "none", "important");
}

/*
 * ==========================================================
 * TEXT EDITING CONFIGURATION
 * ==========================================================
 */

const configuredTextObjects = new WeakSet<IText>();

export function configureSlideTextEditing(canvas: Canvas): void {
  const container = canvas.wrapperEl;

  if (!container) {
    return;
  }

  canvas.forEachObject((object) => {
    if (!(object instanceof IText)) {
      return;
    }

    object.hiddenTextareaContainer = container;

    if (configuredTextObjects.has(object)) {
      if (object.isEditing) {
        protectHiddenTextarea(object);
      }

      return;
    }

    configuredTextObjects.add(object);

    const handleEditingEntered = () => {
      object.hiddenTextareaContainer = container;

      protectHiddenTextarea(object);

      requestAnimationFrame(() => {
        protectHiddenTextarea(object);
      });
    };

    object.on("editing:entered", handleEditingEntered);

    if (object.isEditing) {
      protectHiddenTextarea(object);
    }
  });
}

/*
 * ==========================================================
 * RECTANGLE
 * ==========================================================
 */

function createRectangle(canvas: Canvas, startX: number, startY: number): Rect {
  const object = new Rect({
    left: startX,
    top: startY,

    width: 1,
    height: 1,

    fill: FILL_COLOR,

    stroke: STROKE_COLOR,

    strokeWidth: STROKE_WIDTH,

    originX: "left",
    originY: "top",

    selectable: false,
    evented: false,
  });

  canvas.add(object);

  return object;
}

/*
 * ==========================================================
 * CIRCLE
 * ==========================================================
 */

function createCircle(canvas: Canvas, startX: number, startY: number): Circle {
  const object = new Circle({
    left: startX,
    top: startY,

    radius: 1,

    fill: FILL_COLOR,

    stroke: STROKE_COLOR,

    strokeWidth: STROKE_WIDTH,

    originX: "center",
    originY: "center",

    selectable: false,
    evented: false,
  });

  canvas.add(object);

  return object;
}

/*
 * ==========================================================
 * LINE
 * ==========================================================
 */

function createLine(canvas: Canvas, startX: number, startY: number): Line {
  const object = new Line([startX, startY, startX, startY], {
    stroke: STROKE_COLOR,

    strokeWidth: STROKE_WIDTH,

    selectable: false,

    evented: false,
  });

  canvas.add(object);

  return object;
}

/*
 * ==========================================================
 * RECTANGLE UPDATE
 * ==========================================================
 */

function updateRectangle(
  object: Rect,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
): void {
  const left = Math.min(startX, currentX);

  const top = Math.min(startY, currentY);

  const width = Math.abs(currentX - startX);

  const height = Math.abs(currentY - startY);

  object.set({
    left,
    top,

    width: Math.max(width, 1),

    height: Math.max(height, 1),
  });

  object.setCoords();
}

/*
 * ==========================================================
 * CIRCLE UPDATE
 * ==========================================================
 */

function updateCircle(
  object: Circle,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
): void {
  const width = currentX - startX;

  const height = currentY - startY;

  const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

  const centerX = startX + width / 2;

  const centerY = startY + height / 2;

  object.set({
    left: centerX,

    top: centerY,

    radius: Math.max(radius, 1),
  });

  object.setCoords();
}

/*
 * ==========================================================
 * LINE UPDATE
 * ==========================================================
 */

function updateLine(
  object: Line,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
): void {
  object.set({
    x1: startX,
    y1: startY,

    x2: currentX,
    y2: currentY,
  });

  object.setCoords();
}

/*
 * ==========================================================
 * DRAWING TOOL
 * ==========================================================
 */

function isDrawingTool(tool: CanvasTool): boolean {
  return tool === "rectangle" || tool === "circle" || tool === "line";
}

/*
 * ==========================================================
 * OBJECT INTERACTION
 * ==========================================================
 */

function updateObjectInteraction(
  canvas: Canvas,
  canEdit: boolean,
  tool: CanvasTool,
): void {
  const canSelect = canEdit && tool === "select";

  const canErase = canEdit && tool === "eraser";

  canvas.forEachObject((object) => {
    /*
     * Do not disturb text that is
     * currently being edited.
     */

    if (object instanceof IText && object.isEditing) {
      return;
    }

    object.set({
      selectable: canSelect,

      /*
       * Eraser needs objects to be
       * evented so Fabric can detect
       * them as pointer targets.
       */

      evented: canSelect || canErase,
    });

    object.setCoords();
  });
}

/*
 * ==========================================================
 * TOOL CONTROLLER
 * ==========================================================
 */

export function setupSlideCanvasTools(
  canvas: Canvas,
  activeTool: CanvasTool,
  canEdit: boolean,
  onMutation: () => void,
): SlideCanvasToolsController {
  const currentTool = activeTool;

  const currentCanEdit = canEdit;

  let drawingState: DrawingState | null = null;

  let destroyed = false;

  /*
   * ========================================================
   * ERASER STATE
   * ========================================================
   *
   * Multiple objects erased during
   * one mouse drag are treated as
   * one history action.
   * ========================================================
   */

  const erasedObjects = new Set<FabricObject>();

  let isErasing = false;

  /*
   * ========================================================
   * PEN
   * ========================================================
   */

  const pencilBrush = new PencilBrush(canvas);

  pencilBrush.color = STROKE_COLOR;

  pencilBrush.width = PEN_WIDTH;

  /*
   * ========================================================
   * APPLY TOOL MODE
   * ========================================================
   */

  const applyToolMode = () => {
    if (destroyed) {
      return;
    }

    /*
     * PEN
     */

    canvas.isDrawingMode = currentCanEdit && currentTool === "pen";

    /*
     * SELECT
     */

    canvas.selection = currentCanEdit && currentTool === "select";

    /*
     * OBJECT INTERACTION
     */

    updateObjectInteraction(canvas, currentCanEdit, currentTool);

    /*
     * CURSOR
     */

    if (currentTool === "select") {
      canvas.defaultCursor = "default";

      canvas.hoverCursor = "move";
    } else if (currentTool === "text") {
      canvas.defaultCursor = "text";

      canvas.hoverCursor = "text";
    } else if (currentTool === "eraser") {
      canvas.defaultCursor = "crosshair";

      canvas.hoverCursor = "crosshair";
    } else if (currentTool === "hand") {
      /*
       * Hand is no longer exposed
       * in the Slide toolbar.
       *
       * Keep this harmless fallback
       * for type safety.
       */

      canvas.defaultCursor = "default";

      canvas.hoverCursor = "default";
    } else {
      canvas.defaultCursor = "crosshair";

      canvas.hoverCursor = "crosshair";
    }

    /*
     * PEN BRUSH
     */

    if (currentTool === "pen") {
      canvas.freeDrawingBrush = pencilBrush;
    }

    /*
     * Slide viewport is always
     * fixed at origin.
     */

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    configureSlideTextEditing(canvas);

    canvas.requestRenderAll();
  };

  /*
   * ========================================================
   * ERASE OBJECT
   * ========================================================
   */

  const eraseObject = (object: FabricObject | undefined): void => {
    if (!object || destroyed || !currentCanEdit || currentTool !== "eraser") {
      return;
    }

    /*
     * Object may already have been
     * removed during this drag.
     */

    if (erasedObjects.has(object)) {
      return;
    }

    /*
     * Confirm the object still
     * belongs to this canvas.
     */

    if (!canvas.contains(object)) {
      return;
    }

    /*
     * Do not erase an object that
     * is currently being edited.
     */

    if (object instanceof IText && object.isEditing) {
      return;
    }

    canvas.remove(object);

    erasedObjects.add(object);

    canvas.discardActiveObject();

    canvas.requestRenderAll();
  };

  /*
   * ========================================================
   * ERASER MOUSE DOWN
   * ========================================================
   */

  const handleEraserMouseDown = (event: TPointerEventInfo<TPointerEvent>) => {
    if (!currentCanEdit || currentTool !== "eraser" || destroyed) {
      return;
    }

    isErasing = true;

    eraseObject(event.target);
  };

  /*
   * ========================================================
   * ERASER MOUSE MOVE
   * ========================================================
   */

  const handleEraserMouseMove = (event: TPointerEventInfo<TPointerEvent>) => {
    if (
      !isErasing ||
      !currentCanEdit ||
      currentTool !== "eraser" ||
      destroyed
    ) {
      return;
    }

    eraseObject(event.target);
  };

  /*
   * ========================================================
   * ERASER MOUSE UP
   * ========================================================
   */

  const handleEraserMouseUp = () => {
    if (!isErasing) {
      return;
    }

    isErasing = false;

    /*
     * One complete drag is one
     * history operation.
     */

    if (erasedObjects.size > 0) {
      onMutation();
    }

    erasedObjects.clear();
  };

  /*
   * ========================================================
   * MOUSE DOWN
   * ========================================================
   */

  const handleMouseDown = (event: { e: TPointerEvent }) => {
    if (!currentCanEdit || destroyed) {
      return;
    }

    /*
     * ERASER
     *
     * Dedicated handler handles it.
     */

    if (currentTool === "eraser") {
      return;
    }

    /*
     * HAND
     *
     * Slide intentionally does
     * not pan.
     */

    if (currentTool === "hand") {
      canvas.discardActiveObject();

      canvas.requestRenderAll();

      return;
    }

    /*
     * TEXT
     */

    if (currentTool === "text") {
      return;
    }

    /*
     * DRAWING
     */

    if (!isDrawingTool(currentTool)) {
      return;
    }

    const point = getScenePoint(canvas, event.e);

    if (currentTool === "rectangle") {
      const object = createRectangle(canvas, point.x, point.y);

      drawingState = {
        startX: point.x,

        startY: point.y,

        object,
      };

      canvas.requestRenderAll();

      return;
    }

    if (currentTool === "circle") {
      const object = createCircle(canvas, point.x, point.y);

      drawingState = {
        startX: point.x,

        startY: point.y,

        object,
      };

      canvas.requestRenderAll();

      return;
    }

    if (currentTool === "line") {
      const object = createLine(canvas, point.x, point.y);

      drawingState = {
        startX: point.x,

        startY: point.y,

        object,
      };

      canvas.requestRenderAll();
    }
  };

  /*
   * ========================================================
   * MOUSE MOVE
   * ========================================================
   */

  const handleMouseMove = (event: { e: TPointerEvent }) => {
    if (!currentCanEdit || destroyed) {
      return;
    }

    if (!drawingState) {
      return;
    }

    const point = getScenePoint(canvas, event.e);

    const { startX, startY, object } = drawingState;

    if (object instanceof Rect) {
      updateRectangle(object, startX, startY, point.x, point.y);
    }

    if (object instanceof Circle) {
      updateCircle(object, startX, startY, point.x, point.y);
    }

    if (object instanceof Line) {
      updateLine(object, startX, startY, point.x, point.y);
    }

    canvas.requestRenderAll();
  };

  /*
   * ========================================================
   * MOUSE UP
   * ========================================================
   */

  const handleMouseUp = () => {
    /*
     * ERASER
     */

    if (currentTool === "eraser") {
      handleEraserMouseUp();

      return;
    }

    /*
     * DRAWING
     */

    if (!drawingState) {
      return;
    }

    const object = drawingState.object;

    const width = object.getScaledWidth();

    const height = object.getScaledHeight();

    /*
     * Ignore accidental click.
     */

    if (width < 3 && height < 3) {
      canvas.remove(object);

      canvas.requestRenderAll();

      drawingState = null;

      return;
    }

    /*
     * Newly created objects
     * become selectable only
     * when Select is active.
     */

    object.set({
      selectable: currentCanEdit && currentTool === "select",

      evented: currentCanEdit && currentTool === "select",
    });

    object.setCoords();

    canvas.requestRenderAll();

    drawingState = null;

    onMutation();
  };

  /*
   * ========================================================
   * TEXT TOOL
   * ========================================================
   */

  const handleTextTool = (event: { e: TPointerEvent }) => {
    if (!currentCanEdit || currentTool !== "text" || destroyed) {
      return;
    }

    const activeObject = canvas.getActiveObject();

    if (activeObject instanceof IText && activeObject.isEditing) {
      return;
    }

    const point = getScenePoint(canvas, event.e);

    const hiddenTextareaContainer = canvas.wrapperEl;

    if (!hiddenTextareaContainer) {
      return;
    }

    /*
     * ====================================================
     * TEXTBOX WIDTH
     * ====================================================
     */

    const availableWidth = SLIDE_WIDTH - point.x - PAGE_PADDING;

    const textboxWidth = Math.max(availableWidth, MIN_TEXTBOX_WIDTH);

    const safeLeft = Math.min(
      Math.max(point.x, 0),
      Math.max(SLIDE_WIDTH - MIN_TEXTBOX_WIDTH, 0),
    );

    /*
     * ====================================================
     * CREATE TEXTBOX
     * ====================================================
     */

    const text = new Textbox("Text", {
      left: safeLeft,

      top: Math.max(point.y, 0),

      width: textboxWidth,

      fill: STROKE_COLOR,

      fontSize: TEXT_SIZE,

      fontFamily: "Arial",

      originX: "left",

      originY: "top",

      splitByGrapheme: true,

      editable: true,

      selectable: false,

      evented: true,

      hiddenTextareaContainer,
    });

    text.set({
      lockScalingX: true,

      lockScalingFlip: true,
    });

    canvas.add(text);

    canvas.setActiveObject(text);

    text.hiddenTextareaContainer = hiddenTextareaContainer;

    canvas.requestRenderAll();

    /*
     * ====================================================
     * ENTER EDITING
     * ====================================================
     */

    text.enterEditing();

    text.selectAll();

    protectHiddenTextarea(text);

    requestAnimationFrame(() => {
      protectHiddenTextarea(text);
    });

    /*
     * ====================================================
     * EDITING ENTERED
     * ====================================================
     */

    const handleEditingEntered = () => {
      text.hiddenTextareaContainer = hiddenTextareaContainer;

      protectHiddenTextarea(text);

      requestAnimationFrame(() => {
        protectHiddenTextarea(text);
      });
    };

    /*
     * ====================================================
     * TEXT CHANGED
     * ====================================================
     */

    const handleTextChanged = () => {
      protectHiddenTextarea(text);

      requestAnimationFrame(() => {
        protectHiddenTextarea(text);
      });

      canvas.requestRenderAll();
    };

    /*
     * ====================================================
     * EDITING EXITED
     * ====================================================
     */

    const handleTextEditingExited = () => {
      text.off("editing:entered", handleEditingEntered);

      text.off("changed", handleTextChanged);

      text.off("editing:exited", handleTextEditingExited);

      /*
       * Remove empty textbox.
       */

      if (!text.text?.trim()) {
        canvas.remove(text);

        canvas.discardActiveObject();

        canvas.requestRenderAll();

        return;
      }

      /*
       * Keep textbox inside
       * slide width.
       */

      const maxWidth = SLIDE_WIDTH - Math.max(text.left ?? 0, 0) - PAGE_PADDING;

      if (text.width > maxWidth) {
        text.set({
          width: Math.max(maxWidth, MIN_TEXTBOX_WIDTH),
        });
      }

      text.set({
        selectable: false,

        evented: false,

        lockScalingX: true,

        lockScalingFlip: true,
      });

      text.setCoords();

      canvas.discardActiveObject();

      canvas.requestRenderAll();

      onMutation();
    };

    text.on("editing:entered", handleEditingEntered);

    text.on("changed", handleTextChanged);

    text.on("editing:exited", handleTextEditingExited);
  };

  /*
   * ========================================================
   * REGISTER EVENTS
   * ========================================================
   */

  canvas.on("mouse:down", handleMouseDown);

  canvas.on("mouse:move", handleMouseMove);

  canvas.on("mouse:up", handleMouseUp);

  canvas.on("mouse:down", handleTextTool);

  canvas.on("mouse:down", handleEraserMouseDown);

  canvas.on("mouse:move", handleEraserMouseMove);

  canvas.on("mouse:up", handleEraserMouseUp);

  /*
   * ========================================================
   * INITIAL
   * ========================================================
   */

  configureSlideTextEditing(canvas);

  applyToolMode();

  /*
   * ========================================================
   * DESTROY
   * ========================================================
   */

  return {
    destroy: () => {
      if (destroyed) {
        return;
      }

      destroyed = true;

      canvas.off("mouse:down", handleMouseDown);

      canvas.off("mouse:move", handleMouseMove);

      canvas.off("mouse:up", handleMouseUp);

      canvas.off("mouse:down", handleTextTool);

      canvas.off("mouse:down", handleEraserMouseDown);

      canvas.off("mouse:move", handleEraserMouseMove);

      canvas.off("mouse:up", handleEraserMouseUp);

      if (drawingState?.object) {
        canvas.remove(drawingState.object);
      }

      drawingState = null;

      isErasing = false;

      erasedObjects.clear();

      canvas.isDrawingMode = false;

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    },
  };
}
