import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Canvas as FabricCanvas, PencilBrush, Circle, IText } from "fabric";
import type { Tool } from "./Toolbox";

export interface DrawingCanvasHandle {
  addBoardNotes: (notes: string[]) => void;
  clear: () => void;
}

interface DrawingCanvasProps {
  activeTool: Tool;
  onClearRef?: React.MutableRefObject<(() => void) | null>;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(({ activeTool, onClearRef }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  const handleClear = useCallback(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "transparent";
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  useImperativeHandle(ref, () => ({
    clear: handleClear,
    addBoardNotes: (notes: string[]) => {
      if (!fabricCanvas) return;
      handleClear();
      
      notes.forEach((note, index) => {
        const text = new IText(note, {
          left: 50,
          top: 60 + index * 55,
          fontSize: 24,
          fontFamily: 'Inter, sans-serif',
          fill: 'hsl(172, 66%, 50%)',
          selectable: true,
          hasControls: true,
          opacity: 0,
        });
        fabricCanvas.add(text);
        // Fade in animation
        text.animate({ opacity: 1 }, {
          duration: 800,
          onChange: fabricCanvas.renderAll.bind(fabricCanvas),
        });
      });
    }
  }));

  useEffect(() => {
    if (onClearRef) {
      onClearRef.current = handleClear;
    }
  }, [handleClear, onClearRef]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = new FabricCanvas(canvasRef.current, {
      width: container.offsetWidth,
      height: container.offsetHeight,
      backgroundColor: "transparent",
      isDrawingMode: false,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "hsl(172, 66%, 50%)";
    canvas.freeDrawingBrush.width = 3;

    setFabricCanvas(canvas);

    const handleResize = () => {
      canvas.setDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Reset all modes
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });

    switch (activeTool) {
      case "erase":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "white"; // Color doesn't matter for destination-out
        fabricCanvas.freeDrawingBrush.width = 40;
        // @ts-ignore - globalCompositeOperation is valid but might not be in some types
        fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
        break;
      case "draw":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "hsl(172, 66%, 50%)";
        fabricCanvas.freeDrawingBrush.width = 3;
        // @ts-ignore
        fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        break;
      case "highlight":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "rgba(251, 191, 36, 0.4)";
        fabricCanvas.freeDrawingBrush.width = 25;
        // @ts-ignore
        fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        break;
      case "point":
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = false;
        // Add click handler for pointing
        const handleClick = (e: any) => {
          if (activeTool !== "point") return;
          const pointer = e.scenePoint || e.pointer || { x: e.e?.offsetX || 0, y: e.e?.offsetY || 0 };
          const circle = new Circle({
            left: pointer.x - 15,
            top: pointer.y - 15,
            radius: 15,
            fill: "transparent",
            stroke: "hsl(0, 84%, 60%)",
            strokeWidth: 3,
            selectable: false,
            evented: false,
          });
          fabricCanvas.add(circle);
          // Fade out after 2 seconds
          setTimeout(() => {
            fabricCanvas.remove(circle);
            fabricCanvas.renderAll();
          }, 2000);
        };
        fabricCanvas.on("mouse:down", handleClick);
        return () => {
          fabricCanvas.off("mouse:down", handleClick);
        };
      case "select":
      default:
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = true;
        break;
    }
  }, [activeTool, fabricCanvas]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto z-10"
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas;
