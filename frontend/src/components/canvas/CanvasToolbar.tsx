"use client";

import {
  MousePointer2,
  Hand,
  Pencil,
  Eraser,
  Square,
  Circle,
  Minus,
  Type,
  ImagePlus,
  Undo2,
  Redo2,
} from "lucide-react";

import { useRef, type ReactNode } from "react";

import type { CanvasTool } from "./canvas.types";

import { ERASER_SIZES, type EraserSize } from "./CanvasEraser";

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

type CanvasToolbarProps = {
  activeTool: CanvasTool;

  onToolChange: (tool: CanvasTool) => void;

  eraserSize: EraserSize;

  onEraserSizeChange: (size: EraserSize) => void;

  canEdit: boolean;

  canUndo: boolean;

  canRedo: boolean;

  onUndo: () => void | Promise<void>;

  onRedo: () => void | Promise<void>;

  onImageUpload?: (file: File) => void | Promise<void>;

  /*
   * Hand:
   *
   * Infinite -> true
   * Slide   -> false
   */
  showHand?: boolean;

  /*
   * Eraser:
   *
   * Infinite -> true
   * Slide   -> true
   */
  showEraser?: boolean;

  /*
   * Eraser size:
   *
   * Infinite -> true
   * Slide   -> false
   */
  showEraserSize?: boolean;

  /*
   * Image:
   *
   * Infinite -> true
   * Slide   -> true
   */
  showImage?: boolean;
};

/*
 * ==========================================================
 * TOOL CONFIG
 * ==========================================================
 */

type ToolConfig = {
  id: CanvasTool;

  label: string;

  icon: ReactNode;

  shortcut: string;
};

const BASE_TOOLS: ToolConfig[] = [
  {
    id: "select",

    label: "Select",

    icon: <MousePointer2 className="h-4 w-4" />,

    shortcut: "V",
  },

  {
    id: "hand",

    label: "Hand",

    icon: <Hand className="h-4 w-4" />,

    shortcut: "H",
  },

  {
    id: "pen",

    label: "Pen",

    icon: <Pencil className="h-4 w-4" />,

    shortcut: "P",
  },

  {
    id: "rectangle",

    label: "Rectangle",

    icon: <Square className="h-4 w-4" />,

    shortcut: "R",
  },

  {
    id: "circle",

    label: "Circle",

    icon: <Circle className="h-4 w-4" />,

    shortcut: "C",
  },

  {
    id: "line",

    label: "Line",

    icon: <Minus className="h-4 w-4" />,

    shortcut: "L",
  },

  {
    id: "text",

    label: "Text",

    icon: <Type className="h-4 w-4" />,

    shortcut: "T",
  },
];

const ERASER_TOOL: ToolConfig = {
  id: "eraser",

  label: "Eraser",

  icon: <Eraser className="h-4 w-4" />,

  shortcut: "E",
};

/*
 * ==========================================================
 * COMPONENT
 * ==========================================================
 */

export function CanvasToolbar({
  activeTool,

  onToolChange,

  eraserSize,

  onEraserSizeChange,

  canEdit,

  canUndo,

  canRedo,

  onUndo,

  onRedo,

  onImageUpload,

  showHand = true,

  showEraser = false,

  showEraserSize = true,

  showImage = true,
}: CanvasToolbarProps) {
  /*
   * ========================================================
   * IMAGE INPUT
   * ========================================================
   */

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  /*
   * ========================================================
   * VISIBLE TOOLS
   * ========================================================
   */

  const tools = BASE_TOOLS.filter((tool) => {
    if (tool.id === "hand") {
      return showHand;
    }

    return true;
  });

  /*
   * Add Eraser immediately
   * after Pen.
   */

  const visibleTools: ToolConfig[] = showEraser
    ? [...tools.slice(0, 3), ERASER_TOOL, ...tools.slice(3)]
    : tools;

  /*
   * ========================================================
   * BLUR ACTIVE ELEMENT
   * ========================================================
   */

  const blurActiveElement = () => {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  };

  /*
   * ========================================================
   * TOOL CHANGE
   * ========================================================
   */

  const handleToolChange = (tool: CanvasTool) => {
    if (!canEdit) {
      return;
    }

    blurActiveElement();

    onToolChange(tool);
  };

  /*
   * ========================================================
   * UNDO
   * ========================================================
   */

  const handleUndo = () => {
    if (!canEdit || !canUndo) {
      return;
    }

    blurActiveElement();

    void onUndo();
  };

  /*
   * ========================================================
   * REDO
   * ========================================================
   */

  const handleRedo = () => {
    if (!canEdit || !canRedo) {
      return;
    }

    blurActiveElement();

    void onRedo();
  };

  /*
   * ========================================================
   * ERASER SIZE
   * ========================================================
   */

  const handleEraserSizeChange = (value: string) => {
    const size = Number(value) as EraserSize;

    onEraserSizeChange(size);
  };

  /*
   * ========================================================
   * IMAGE PICKER
   * ========================================================
   */

  const handleImageButtonClick = () => {
    const uploadImage = onImageUpload;

    if (!canEdit || !uploadImage) {
      return;
    }

    blurActiveElement();

    imageInputRef.current?.click();
  };

  /*
   * ========================================================
   * IMAGE SELECTED
   * ========================================================
   */

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const uploadImage = onImageUpload;

    if (!canEdit || !uploadImage) {
      return;
    }

    void uploadImage(file);
  };

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <>
      {/* ====================================================
          HIDDEN IMAGE INPUT
          ==================================================== */}

      {showImage && (
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImageChange}
        />
      )}

      {/* ====================================================
          TOOLBAR
          ==================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-5
          z-40

          flex
          max-w-[calc(100%-2rem)]
          -translate-x-1/2

          items-center

          overflow-x-auto

          rounded-2xl

          border
          border-white/10

          bg-zinc-950/95

          p-1

          shadow-2xl

          backdrop-blur-xl

          scrollbar-none
        "
      >
        {/* ==================================================
            UNDO
            ================================================== */}

        <button
          type="button"
          disabled={!canEdit || !canUndo}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={handleUndo}
          title="Undo (Ctrl + Z)"
          aria-label="Undo"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center

            rounded-xl

            text-zinc-400

            outline-none

            transition-all
            duration-150

            hover:bg-white/10
            hover:text-white

            focus:outline-none
            focus-visible:outline-none
            focus-visible:ring-0

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <Undo2 className="h-4 w-4" />
        </button>

        {/* ==================================================
            REDO
            ================================================== */}

        <button
          type="button"
          disabled={!canEdit || !canRedo}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={handleRedo}
          title="Redo (Ctrl + Y)"
          aria-label="Redo"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center

            rounded-xl

            text-zinc-400

            outline-none

            transition-all
            duration-150

            hover:bg-white/10
            hover:text-white

            focus:outline-none
            focus-visible:outline-none
            focus-visible:ring-0

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <Redo2 className="h-4 w-4" />
        </button>

        {/* ==================================================
            DIVIDER
            ================================================== */}

        <div
          className="
            mx-1
            h-6
            w-px
            shrink-0
            bg-white/10
          "
        />

        {/* ==================================================
            TOOLS
            ================================================== */}

        {visibleTools.map((tool) => {
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              disabled={!canEdit}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => handleToolChange(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={`
                  group

                  flex
                  h-9
                  shrink-0
                  items-center
                  gap-1.5

                  rounded-xl
                  px-2.5

                  text-xs
                  font-medium

                  outline-none

                  transition-all
                  duration-150

                  focus:outline-none
                  focus-visible:outline-none
                  focus-visible:ring-0

                  ${
                    isActive
                      ? "bg-white text-zinc-900 shadow-md"
                      : "text-zinc-400 hover:bg-white/10 hover:text-white"
                  }

                  ${
                    !canEdit
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
            >
              {tool.icon}

              <span className="hidden md:inline">{tool.label}</span>

              <span
                className={`
                    rounded-md

                    px-1
                    py-0.5

                    text-[9px]
                    font-semibold

                    ${
                      isActive
                        ? "bg-zinc-200 text-zinc-700"
                        : "bg-white/10 text-zinc-500"
                    }
                  `}
              >
                {tool.shortcut}
              </span>
            </button>
          );
        })}

        {/* ==================================================
            IMAGE
            ================================================== */}

        {showImage && (
          <button
            type="button"
            disabled={!canEdit || !onImageUpload}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={handleImageButtonClick}
            title="Insert Image (I)"
            className="
              group

              flex
              h-9
              shrink-0
              items-center
              gap-1.5

              rounded-xl
              px-2.5

              text-xs
              font-medium

              text-zinc-400

              outline-none

              transition-all
              duration-150

              hover:bg-white/10
              hover:text-white

              focus:outline-none
              focus-visible:outline-none
              focus-visible:ring-0

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <ImagePlus className="h-4 w-4" />

            <span className="hidden md:inline">Image</span>

            <span
              className="
                rounded-md

                bg-white/10

                px-1
                py-0.5

                text-[9px]
                font-semibold
                text-zinc-500
              "
            >
              I
            </span>
          </button>
        )}

        {/* ==================================================
            INFINITE ERASER SIZE ONLY
            ================================================== */}

        {showEraserSize && showEraser && activeTool === "eraser" && canEdit && (
          <div
            className="
                ml-1
                flex
                shrink-0
                items-center

                border-l
                border-white/10

                pl-2
              "
          >
            <label className="sr-only" htmlFor="eraser-size">
              Eraser size
            </label>

            <select
              id="eraser-size"
              value={eraserSize}
              onChange={(event) => handleEraserSizeChange(event.target.value)}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              className="
                  h-9

                  rounded-xl

                  border
                  border-white/10

                  bg-white/10

                  px-2

                  text-xs
                  font-medium
                  text-white

                  outline-none

                  transition

                  hover:bg-white/15

                  focus:outline-none
                "
              aria-label="Eraser size"
            >
              {ERASER_SIZES.map((size) => (
                <option key={size} value={size} className="bg-zinc-950">
                  {size} px
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
}
