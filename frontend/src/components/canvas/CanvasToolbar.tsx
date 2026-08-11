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
  Undo2,
  Redo2,
} from "lucide-react";

import type { CanvasTool } from "./canvas.types";

type CanvasToolbarProps = {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  canEdit: boolean;

  canUndo: boolean;
  canRedo: boolean;

  onUndo: () => void;
  onRedo: () => void;
};

type ToolConfig = {
  id: CanvasTool;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
};

const tools: ToolConfig[] = [
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
    id: "eraser",
    label: "Eraser",
    icon: <Eraser className="h-4 w-4" />,
    shortcut: "E",
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

export function CanvasToolbar({
  activeTool,
  onToolChange,
  canEdit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: CanvasToolbarProps) {
  /*
   * Prevent the clicked toolbar button from keeping
   * browser focus.
   *
   * This removes the second outline/highlight that appeared
   * when:
   *
   * 1. Rectangle was clicked with mouse
   * 2. Then Eraser was selected using keyboard
   */
  const blurToolbarButton = () => {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  };

  const handleToolChange = (tool: CanvasTool) => {
    blurToolbarButton();

    onToolChange(tool);
  };

  const handleUndo = () => {
    blurToolbarButton();

    onUndo();
  };

  const handleRedo = () => {
    blurToolbarButton();

    onRedo();
  };

  return (
    <div
      className="
        absolute
        left-1/2
        top-4
        z-30

        flex
        -translate-x-1/2
        items-center
        gap-1

        rounded-2xl
        border
        border-white/10

        bg-zinc-950/95

        px-2
        py-2

        shadow-2xl
        backdrop-blur-xl

        whitespace-nowrap
      "
    >
      {/* ====================================================
          UNDO
          ==================================================== */}

      <button
        type="button"
        disabled={!canEdit || !canUndo}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={handleUndo}
        title="Undo (Ctrl + Z)"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center

          rounded-xl

          text-zinc-400

          outline-none
          focus:outline-none
          focus-visible:outline-none
          focus-visible:ring-0

          transition-all
          duration-150

          hover:bg-white/10
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <Undo2 className="h-4 w-4" />
      </button>

      {/* ====================================================
          REDO
          ==================================================== */}

      <button
        type="button"
        disabled={!canEdit || !canRedo}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={handleRedo}
        title="Redo (Ctrl + Y)"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center

          rounded-xl

          text-zinc-400

          outline-none
          focus:outline-none
          focus-visible:outline-none
          focus-visible:ring-0

          transition-all
          duration-150

          hover:bg-white/10
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <Redo2 className="h-4 w-4" />
      </button>

      {/* ====================================================
          DIVIDER
          ==================================================== */}

      <div className="mx-1 h-6 w-px bg-white/10" />

      {/* ====================================================
          TOOLS
          ==================================================== */}

      {tools.map((tool) => {
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            disabled={!canEdit}
            onMouseDown={(event) => {
              /*
               * Prevent browser from keeping focus on
               * this toolbar button.
               */
              event.preventDefault();
            }}
            onClick={() => handleToolChange(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
            className={`
              group

              flex
              h-9
              items-center
              gap-1.5

              rounded-xl
              px-2.5

              text-xs
              font-medium

              outline-none
              focus:outline-none
              focus-visible:outline-none
              focus-visible:ring-0

              transition-all
              duration-150

              ${
                isActive
                  ? "bg-white text-zinc-900 shadow-md"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }

              ${!canEdit ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
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
    </div>
  );
}
