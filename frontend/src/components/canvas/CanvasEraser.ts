import {
  Canvas,
  Circle,
  Group,
  Point,
  util,
  type FabricObject,
} from "fabric";

/*
 * ==========================================================
 * ERASER CONFIG
 * ==========================================================
 */

export const ERASER_SIZES = [12, 20, 28, 40, 60, 80] as const;

export const DEFAULT_ERASER_SIZE = 28;

export type EraserSize = (typeof ERASER_SIZES)[number];

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

export type EraserPoint = {
  x: number;
  y: number;
};

type EraserGroup = Group & {
  __syncboardEraserObject?: boolean;
};

/*
 * ==========================================================
 * CANVAS ERASER
 * ==========================================================
 *
 * Fabric 7.4.0
 *
 * We intentionally do NOT use EraserBrush because it is not
 * available from the normal "fabric" package export in the
 * current setup.
 *
 * Instead we use:
 *
 * Object
 *    ↓
 * relative inverted clipPath
 *    ↓
 * eraser circles
 *
 * The eraser point starts in scene coordinates and is converted
 * into the object's local coordinate system before creating the
 * clip circle.
 *
 * This allows the erased area to remain attached correctly
 * when the object is moved, scaled or rotated.
 *
 * ==========================================================
 */

export class CanvasEraser {
  private readonly canvas: Canvas;

  private active = false;

  private changedObjects = new Set<FabricObject>();

  private lastPoint: EraserPoint | null = null;

  private size: EraserSize;

  /*
   * One eraser group for every object.
   */
  private readonly eraserGroups = new WeakMap<
    FabricObject,
    EraserGroup
  >();

  /*
   * ========================================================
   * CONSTRUCTOR
   * ========================================================
   */

  constructor(
    canvas: Canvas,
    size: EraserSize = DEFAULT_ERASER_SIZE,
  ) {
    this.canvas = canvas;

    this.size = size;
  }

  /*
   * ========================================================
   * SET SIZE
   * ========================================================
   */

  setSize(size: EraserSize): void {
    this.size = size;
  }

  /*
   * ========================================================
   * GET SIZE
   * ========================================================
   */

  getSize(): EraserSize {
    return this.size;
  }

  /*
   * ========================================================
   * START
   * ========================================================
   */

  start(point: EraserPoint): boolean {
    this.active = true;

    this.lastPoint = point;

    this.changedObjects.clear();

    return this.eraseAtPoint(point);
  }

  /*
   * ========================================================
   * MOVE
   * ========================================================
   */

  move(point: EraserPoint): boolean {
    if (!this.active) {
      return false;
    }

    if (this.lastPoint) {
      const distance = Math.hypot(
        point.x - this.lastPoint.x,
        point.y - this.lastPoint.y,
      );

      /*
       * Ignore extremely small movements.
       *
       * This prevents creating thousands of clip circles
       * during a single eraser stroke.
       */
      if (distance < 4) {
        return false;
      }
    }

    this.lastPoint = point;

    return this.eraseAtPoint(point);
  }

  /*
   * ========================================================
   * END
   * ========================================================
   */

  end(): boolean {
    const changed =
      this.changedObjects.size > 0;

    this.active = false;

    this.lastPoint = null;

    /*
     * Refresh every changed object.
     */

    for (const object of this.changedObjects) {
      object.set({
        dirty: true,
      });

      object.setCoords();

      const clipPath = object.clipPath;

      if (clipPath) {
        clipPath.set({
          dirty: true,
        });

        clipPath.setCoords();
      }
    }

    this.canvas.requestRenderAll();

    return changed;
  }

  /*
   * ========================================================
   * CANCEL
   * ========================================================
   */

  cancel(): void {
    this.active = false;

    this.lastPoint = null;

    this.changedObjects.clear();
  }

  /*
   * ========================================================
   * HAS CHANGES
   * ========================================================
   */

  hasChanges(): boolean {
    return this.changedObjects.size > 0;
  }

  /*
   * ========================================================
   * ERASE AT POINT
   * ========================================================
   */

  private eraseAtPoint(
    point: EraserPoint,
  ): boolean {
    let changed = false;

    const objects = this.canvas
      .getObjects()
      .filter((object) => {
        /*
         * Ignore invisible objects.
         */
        if (!object.visible) {
          return false;
        }

        /*
         * Ignore explicitly non-erasable objects.
         */
        if (object.get("erasable") === false) {
          return false;
        }

        /*
         * Ignore internal SyncBoard eraser objects.
         */
        if (
          object.get(
            "__syncboardEraserObject",
          ) === true
        ) {
          return false;
        }

        return true;
      });

    for (const object of objects) {
      /*
       * Quick hit test.
       */
      if (!this.touchesObject(object, point)) {
        continue;
      }

      /*
       * ----------------------------------------------------
       * SCENE → OBJECT LOCAL COORDINATES
       * ----------------------------------------------------
       *
       * Fabric 7 does not expose toLocalPoint() on
       * FabricObject in our current TypeScript setup.
       *
       * Therefore we use Fabric's public matrix utilities.
       */

      const objectMatrix =
        object.calcTransformMatrix();

      const inverseMatrix =
        util.invertTransform(
          objectMatrix,
        );

      const localPoint =
        util.transformPoint(
          new Point(
            point.x,
            point.y,
          ),
          inverseMatrix,
        );

      /*
       * ----------------------------------------------------
       * LOCAL ERASER RADIUS
       * ----------------------------------------------------
       *
       * The configured eraser size is expressed in screen/
       * scene pixels.
       *
       * After converting into local coordinates we compensate
       * for object scaling.
       */

      const scaleX =
        Math.abs(object.scaleX || 1);

      const scaleY =
        Math.abs(object.scaleY || 1);

      const averageScale =
        (scaleX + scaleY) / 2 || 1;

      const localRadius =
        this.size / 2 / averageScale;

      /*
       * ----------------------------------------------------
       * CREATE LOCAL ERASER CIRCLE
       * ----------------------------------------------------
       */

      const circle =
        this.createEraserCircle(
          localPoint.x,
          localPoint.y,
          localRadius,
        );

      /*
       * ----------------------------------------------------
       * ADD TO OBJECT CLIP
       * ----------------------------------------------------
       */

      this.addCircleToObject(
        object,
        circle,
      );

      this.changedObjects.add(object);

      changed = true;
    }

    if (changed) {
      this.canvas.requestRenderAll();
    }

    return changed;
  }

  /*
   * ========================================================
   * CREATE ERASER CIRCLE
   * ========================================================
   */

  private createEraserCircle(
    x: number,
    y: number,
    radius: number,
  ): Circle {
    return new Circle({
      left: x,

      top: y,

      radius: Math.max(
        radius,
        0.5,
      ),

      originX: "center",

      originY: "center",

      fill: "#000000",

      strokeWidth: 0,

      selectable: false,

      evented: false,

      objectCaching: false,

      /*
       * Internal clip object should never
       * itself be erasable.
       */
      erasable: false,
    });
  }

  /*
   * ========================================================
   * FIND EXISTING ERASER GROUP
   * ========================================================
   */

  private getEraserGroup(
    object: FabricObject,
  ): EraserGroup | null {
    /*
     * First use our WeakMap.
     */

    const cached =
      this.eraserGroups.get(object);

    if (cached) {
      return cached;
    }

    /*
     * Try to recover an existing SyncBoard
     * eraser clipPath from loaded JSON.
     */

    const existingClip =
      object.clipPath;

    if (
      existingClip instanceof Group &&
      existingClip.get(
        "__syncboardEraserObject",
      ) === true
    ) {
      /*
       * Older implementation may have used
       * absolutePositioned: true.
       *
       * Convert it to the current relative mode.
       */

      existingClip.set({
        absolutePositioned: false,

        inverted: true,

        selectable: false,

        evented: false,
      });

      const group =
        existingClip as EraserGroup;

      this.eraserGroups.set(
        object,
        group,
      );

      return group;
    }

    return null;
  }

  /*
   * ========================================================
   * ADD CIRCLE TO OBJECT
   * ========================================================
   */

  private addCircleToObject(
    object: FabricObject,
    circle: Circle,
  ): void {
    let group =
      this.getEraserGroup(object);

    /*
     * ======================================================
     * CREATE FIRST ERASER GROUP
     * ======================================================
     */

    if (!group) {
      group =
        new Group(
          [circle],
          {
            /*
             * The clipPath follows the object.
             */
            absolutePositioned: false,

            /*
             * Everything outside the eraser circles
             * remains visible.
             */
            inverted: true,

            /*
             * Local origin.
             */
            originX: "center",

            originY: "center",

            selectable: false,

            evented: false,

            objectCaching: true,
          },
        ) as EraserGroup;

      group.set({
        __syncboardEraserObject: true,
      });

      /*
       * Attach clipPath.
       */

      object.set({
        clipPath: group,
      });

      /*
       * Save reference.
       */

      this.eraserGroups.set(
        object,
        group,
      );

      group.set({
        dirty: true,
      });

      object.set({
        dirty: true,
      });

      group.setCoords();

      object.setCoords();

      return;
    }

    /*
     * ======================================================
     * EXISTING GROUP
     * ======================================================
     */

    group.set({
      absolutePositioned: false,

      inverted: true,

      dirty: true,
    });

    /*
     * Add the new local-space eraser circle.
     */

    group.add(circle);

    group.set({
      dirty: true,
    });

    object.set({
      dirty: true,
    });

    group.setCoords();

    object.setCoords();
  }

  /*
   * ========================================================
   * HIT TEST
   * ========================================================
   */

  private touchesObject(
    object: FabricObject,
    point: EraserPoint,
  ): boolean {
    /*
     * ======================================================
     * QUICK BOUNDING BOX TEST
     * ======================================================
     */

    const bounds =
      object.getBoundingRect();

    const radius =
      this.size / 2;

    const closestX =
      Math.max(
        bounds.left,
        Math.min(
          point.x,
          bounds.left +
            bounds.width,
        ),
      );

    const closestY =
      Math.max(
        bounds.top,
        Math.min(
          point.y,
          bounds.top +
            bounds.height,
        ),
      );

    const dx =
      point.x -
      closestX;

    const dy =
      point.y -
      closestY;

    const distanceSquared =
      dx * dx +
      dy * dy;

    /*
     * Completely outside the bounding box.
     */

    if (
      distanceSquared >
      radius * radius
    ) {
      return false;
    }

    /*
     * ======================================================
     * PRECISE FABRIC INTERSECTION
     * ======================================================
     */

    try {
      const probe =
        new Circle({
          left: point.x,

          top: point.y,

          radius,

          originX: "center",

          originY: "center",

          selectable: false,

          evented: false,

          objectCaching: false,
        });

      probe.setCoords();

      if (
        object.intersectsWithObject(
          probe,
        )
      ) {
        return true;
      }
    } catch {
      /*
       * Bounding-box result above is used as fallback.
       */
    }

    return (
      distanceSquared <=
      radius * radius
    );
  }
}