"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";

type SlideCanvasProps = {
  canvasData: Record<string, unknown>;
  canEdit: boolean;
};

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

export function SlideCanvas({ canvasData, canEdit }: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  const [scale, setScale] = useState(1);

  /*
   * Calculate slide scale from the actual workspace.
   */
  useEffect(() => {
    const calculateScale = () => {
      const container = containerRef.current;

      if (!container) return;

      const availableWidth = container.clientWidth - 48;
      const availableHeight = container.clientHeight - 48;

      if (availableWidth <= 0 || availableHeight <= 0) {
        return;
      }

      const widthScale = availableWidth / SLIDE_WIDTH;
      const heightScale = availableHeight / SLIDE_HEIGHT;

      const nextScale = Math.min(widthScale, heightScale);

      setScale(Math.max(nextScale, 0.25));
    };

    calculateScale();

    const observer = new ResizeObserver(calculateScale);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Create Fabric canvas once.
   */
  useEffect(() => {
    const element = canvasElementRef.current;

    if (!element) return;

    const canvas = new Canvas(element, {
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      backgroundColor: "#ffffff",
      selection: canEdit,
    });

    fabricCanvasRef.current = canvas;

    return () => {
      if (fabricCanvasRef.current === canvas) {
        fabricCanvasRef.current = null;
      }

      canvas.dispose();
    };
  }, [canEdit]);

  /*
   * Load page canvas data.
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    let cancelled = false;

    const loadCanvas = async () => {
      try {
        canvas.clear();

        canvas.backgroundColor = "#ffffff";

        if (canvasData && Object.keys(canvasData).length > 0) {
          await canvas.loadFromJSON(canvasData);
        }

        if (cancelled) return;

        canvas.requestRenderAll();
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load slide canvas:", error);
        }
      }
    };

    loadCanvas();

    return () => {
      cancelled = true;
    };
  }, [canvasData]);

  return (
    <div
      ref={containerRef}
      className="
        flex
        h-full
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-muted/20
        p-6
      "
    >
      <div
        className="
          relative
          shrink-0
          overflow-hidden
          bg-white
          shadow-2xl
        "
        style={{
          width: SLIDE_WIDTH * scale,
          height: SLIDE_HEIGHT * scale,
        }}
      >
        <canvas
          ref={canvasElementRef}
          className="absolute left-0 top-0"
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </div>
  );
}
