import { motion } from "framer-motion";
import {
  MousePointer2,
  Pencil,
  Eraser,
  Highlighter,
  Trash2,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";

export type Tool = "select" | "point" | "draw" | "erase" | "highlight" | "clear";

interface ToolboxProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onClear: () => void;
}

const tools: { id: Tool; icon: typeof MousePointer2; label: string; description: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", description: "Select and move objects" },
  { id: "point", icon: Hand, label: "Point", description: "Point at areas of doubt" },
  { id: "draw", icon: Pencil, label: "Draw", description: "Draw diagrams and notes" },
  { id: "erase", icon: Eraser, label: "Erase", description: "Erase drawings" },
  { id: "highlight", icon: Highlighter, label: "Highlight", description: "Highlight important areas" },
];

const Toolbox = ({ activeTool, onToolChange, onClear }: ToolboxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-effect rounded-2xl p-3 flex flex-col gap-2"
    >
      <span className="text-xs font-medium text-muted-foreground px-2 mb-1">
        Tools
      </span>
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="icon"
                onClick={() => onToolChange(tool.id)}
                className={`relative transition-all duration-200 ${
                  isActive
                    ? "gradient-bg text-primary-foreground shadow-glow"
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="activeToolIndicator"
                    className="absolute inset-0 rounded-md gradient-bg opacity-20"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="font-medium">{tool.label}</p>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
      <div className="h-px bg-border my-1" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="font-medium">Clear All</p>
          <p className="text-xs text-muted-foreground">Reset the teaching area</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
};

export default Toolbox;
