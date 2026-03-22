import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, PencilBrush, Circle } from "fabric";
import type { Tool } from "./Toolbox";

interface DrawingCanvasProps {
  activeTool: Tool;
  onClearRef?: React.MutableRefObject<(() => void) | null>;
}

const DrawingCanvas = ({ activeTool, onClearRef }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  const handleClear = useCallback(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "transparent";
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  useEffect(() => {
    if (onClearRef) onClearRef.current = handleClear;
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
      canvas.setDimensions({ width: container.offsetWidth, height: container.offsetHeight });
      canvas.renderAll();
    };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); canvas.dispose(); };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    fabricCanvas.forEachObject((obj) => { obj.selectable = true; obj.evented = true; });
    switch (activeTool) {
      case "draw":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "hsl(172, 66%, 50%)";
        fabricCanvas.freeDrawingBrush.width = 3;
        break;
      case "highlight":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "rgba(251, 191, 36, 0.4)";
        fabricCanvas.freeDrawingBrush.width = 20;
        break;
      case "erase":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "rgba(0,0,0,0)";
        fabricCanvas.freeDrawingBrush.width = 20;
        break;
      case "point":
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = false;
        const handleClick = (e: any) => {
          const pointer = e.scenePoint || e.pointer || { x: e.e?.offsetX || 0, y: e.e?.offsetY || 0 };
          const circle = new Circle({ left: pointer.x - 15, top: pointer.y - 15, radius: 15, fill: "transparent", stroke: "hsl(0, 84%, 60%)", strokeWidth: 3, selectable: false, evented: false });
          fabricCanvas.add(circle);
          setTimeout(() => { fabricCanvas.remove(circle); fabricCanvas.renderAll(); }, 2000);
        };
        fabricCanvas.on("mouse:down", handleClick);
        return () => { fabricCanvas.off("mouse:down", handleClick); };
      default:
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = true;
        break;
    }
  }, [activeTool, fabricCanvas]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-auto z-10" style={{ touchAction: "none" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DrawingCanvas;