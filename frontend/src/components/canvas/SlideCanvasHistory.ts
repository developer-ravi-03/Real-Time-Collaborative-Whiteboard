import type { Canvas } from "fabric";

export type SlideHistoryState = {
  canUndo: boolean;
  canRedo: boolean;
};

type HistoryListener = (
  state: SlideHistoryState,
) => void;

export const EMPTY_SLIDE_HISTORY: SlideHistoryState =
  {
    canUndo: false,
    canRedo: false,
  };

export class SlideCanvasHistory {
  private readonly canvas: Canvas;

  private readonly maxHistorySize: number;

  private readonly onChange?: HistoryListener;

  private undoStack: string[] = [];

  private redoStack: string[] = [];

  private restoring = false;

  constructor(
    canvas: Canvas,
    options?: {
      maxHistorySize?: number;
      onChange?: HistoryListener;
    },
  ) {
    this.canvas = canvas;

    this.maxHistorySize =
      options?.maxHistorySize ?? 100;

    this.onChange =
      options?.onChange;
  }

  initialize(): void {
    this.undoStack = [
      this.createSnapshot(),
    ];

    this.redoStack = [];

    this.emitChange();
  }

  push(): void {
    if (this.restoring) {
      return;
    }

    const snapshot =
      this.createSnapshot();

    const previous =
      this.undoStack[
        this.undoStack.length - 1
      ];

    if (snapshot === previous) {
      return;
    }

    this.undoStack.push(
      snapshot,
    );

    if (
      this.undoStack.length >
      this.maxHistorySize
    ) {
      this.undoStack.shift();
    }

    this.redoStack = [];

    this.emitChange();
  }

  async undo(): Promise<boolean> {
    if (
      this.undoStack.length <= 1 ||
      this.restoring
    ) {
      return false;
    }

    this.restoring = true;

    try {
      const current =
        this.undoStack.pop();

      if (!current) {
        return false;
      }

      this.redoStack.push(
        current,
      );

      const previous =
        this.undoStack[
          this.undoStack.length - 1
        ];

      if (!previous) {
        return false;
      }

      await this.restore(
        previous,
      );

      this.emitChange();

      return true;
    } finally {
      this.restoring = false;
    }
  }

  async redo(): Promise<boolean> {
    if (
      this.redoStack.length === 0 ||
      this.restoring
    ) {
      return false;
    }

    this.restoring = true;

    try {
      const next =
        this.redoStack.pop();

      if (!next) {
        return false;
      }

      this.undoStack.push(next);

      await this.restore(next);

      this.emitChange();

      return true;
    } finally {
      this.restoring = false;
    }
  }

  getState(): SlideHistoryState {
    return {
      canUndo:
        this.undoStack.length > 1,

      canRedo:
        this.redoStack.length > 0,
    };
  }

  isRestoring(): boolean {
    return this.restoring;
  }

  clear(): void {
    this.undoStack = [];

    this.redoStack = [];

    this.emitChange();
  }

  private createSnapshot(): string {
    return JSON.stringify(
      this.canvas.toJSON(),
    );
  }

  private async restore(
    snapshot: string,
  ): Promise<void> {
    const data =
      JSON.parse(snapshot);

    await this.canvas.loadFromJSON(
      data,
    );

    this.canvas.requestRenderAll();
  }

  private emitChange(): void {
    this.onChange?.(
      this.getState(),
    );
  }
}