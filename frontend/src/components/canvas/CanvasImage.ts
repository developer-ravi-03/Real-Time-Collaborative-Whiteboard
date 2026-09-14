import {
  Canvas,
  FabricImage,
  type FabricObject,
} from "fabric";

/*
 * ==========================================================
 * IMAGE CONFIG
 * ==========================================================
 */

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/*
 * Maximum size of the image when initially inserted.
 *
 * The user can resize it afterwards using Fabric controls.
 */
const MAX_INITIAL_WIDTH = 500;
const MAX_INITIAL_HEIGHT = 400;

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

export type AddCanvasImageResult = {
  object: FabricImage;
  dataUrl: string;
};

/*
 * ==========================================================
 * SUPPORTED IMAGE TYPES
 * ==========================================================
 */

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

/*
 * ==========================================================
 * READ FILE
 * ==========================================================
 */

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image file."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file."));
    };

    reader.readAsDataURL(file);
  });
};

/*
 * ==========================================================
 * VALIDATE IMAGE
 * ==========================================================
 */

const validateImageFile = (file: File): void => {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "Unsupported image format. Please use PNG, JPG, JPEG or WebP.",
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "Image is too large. Please choose an image smaller than 5 MB.",
    );
  }
};

/*
 * ==========================================================
 * CALCULATE INITIAL SCALE
 * ==========================================================
 */

const calculateInitialScale = (
  width: number,
  height: number,
): number => {
  if (width <= 0 || height <= 0) {
    return 1;
  }

  const widthScale = MAX_INITIAL_WIDTH / width;

  const heightScale = MAX_INITIAL_HEIGHT / height;

  const scale = Math.min(widthScale, heightScale, 1);

  return Math.max(scale, 0.05);
};

/*
 * ==========================================================
 * ADD IMAGE TO CANVAS
 * ==========================================================
 *
 * IMPORTANT:
 *
 * We convert the uploaded File into a data URL.
 *
 * This means the Fabric JSON contains the image source and
 * the image does not depend on a temporary blob/object URL.
 *
 * Later, when Cloudinary upload is implemented, this helper
 * can be changed so that the Fabric object stores a permanent
 * Cloudinary URL instead.
 *
 * ==========================================================
 */

export const addImageToCanvas = async (
  canvas: Canvas,
  file: File,
): Promise<AddCanvasImageResult> => {
  validateImageFile(file);

  const dataUrl = await readFileAsDataUrl(file);

  const image = await FabricImage.fromURL(dataUrl);

  if (!image) {
    throw new Error("Failed to create Fabric image.");
  }

  /*
   * ========================================================
   * INITIAL SIZE
   * ========================================================
   */

  const originalWidth = image.width ?? 0;

  const originalHeight = image.height ?? 0;

  const initialScale = calculateInitialScale(
    originalWidth,
    originalHeight,
  );

  image.set({
    originX: "center",
    originY: "center",

    scaleX: initialScale,
    scaleY: initialScale,

    erasable: true,

    selectable: true,

    evented: true,
  });

  /*
   * ========================================================
   * CENTER IMAGE IN CURRENT VIEW
   * ========================================================
   *
   * getVpCenter() returns the center of the currently visible
   * viewport in scene coordinates.
   *
   * This is important because the user may have already panned
   * or zoomed the infinite canvas.
   */

  const center = canvas.getVpCenter();

  image.set({
    left: center.x,
    top: center.y,
  });

  image.setCoords();

  /*
   * ========================================================
   * ADD
   * ========================================================
   */

  canvas.add(image);

  /*
   * Select the newly inserted image.
   */

  canvas.setActiveObject(image);

  canvas.requestRenderAll();

  return {
    object: image,
    dataUrl,
  };
};