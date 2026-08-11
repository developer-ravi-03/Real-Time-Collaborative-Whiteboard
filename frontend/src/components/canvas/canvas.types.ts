export type CanvasTool =
  | "select"
  | "hand"
  | "pen"
  | "eraser"
  | "rectangle"
  | "circle"
  | "line"
  | "text";

export type CanvasData = Record<string, unknown>;