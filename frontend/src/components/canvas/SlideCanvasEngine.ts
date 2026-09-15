import {
  Canvas,
  type FabricObject,
  type TPointerEvent,
} from "fabric";

export const SLIDE_WIDTH = 1280;

export const SLIDE_HEIGHT = 720;

export function createSlideCanvas(
  element: HTMLCanvasElement,
  canEdit: boolean,
): Canvas {
  const canvas = new Canvas(element, {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    backgroundColor: "#ffffff",
    selection: canEdit,
    preserveObjectStacking: true,
    renderOnAddRemove: true,
  });

  configureSlideCanvas(
    canvas,
    canEdit,
  );

  return canvas;
}

export function configureSlideCanvas(
  canvas: Canvas,
  canEdit: boolean,
): void {
  canvas.selection = canEdit;

  canvas.forEachObject(
    (object) => {
      configureSlideObject(
        object,
        canEdit,
      );
    },
  );
}

export function configureSlideObject(
  object: FabricObject,
  canEdit: boolean,
): void {
  object.set({
    selectable: canEdit,
    evented: canEdit,
    hasControls: canEdit,
    hasBorders: canEdit,
    lockScalingFlip: true,
  });

  object.setCoords();
}

export function deleteSelectedObjects(
  canvas: Canvas,
): boolean {
  const objects =
    canvas.getActiveObjects();

  if (objects.length === 0) {
    return false;
  }

  canvas.discardActiveObject();

  for (const object of objects) {
    canvas.remove(object);
  }

  canvas.requestRenderAll();

  return true;
}

export function getPointerPosition(
  canvas: Canvas,
  event: TPointerEvent,
) {
  return canvas.getScenePoint(
    event,
  );
}