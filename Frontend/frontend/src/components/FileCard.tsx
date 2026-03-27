import { FileText, Image, File, Trash2 } from "lucide-react";

interface FileCardProps {
  name: string;
  type: "pdf" | "docx" | "image" | "other";
  date: string;
  onAsk?: () => void;
  onDelete?: () => void;
  isActive?: boolean;
  compact?: boolean;
}

const iconMap = {
  pdf: <FileText className="h-5 w-5 text-red-400" />,
  docx: <File className="h-5 w-5 text-blue-400" />,
  image: <Image className="h-5 w-5 text-green-400" />,
  other: <File className="h-5 w-5 text-muted-foreground" />,
};

const FileCard = ({ name, type, date, onAsk, onDelete, isActive, compact }: FileCardProps) => {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive
            ? "bg-accent-soft border-l-[3px] border-l-primary"
            : "hover:bg-secondary/60"
        }`}
        onClick={onAsk}
      >
        {iconMap[type]}
        <span className="text-sm truncate flex-1 text-foreground">{name}</span>
        {isActive && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary">Active</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-primary/[0.15] hover:border-primary/30 transition-all duration-200">
      {iconMap[type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      {onAsk && (
        <button
          onClick={onAsk}
          className="text-xs text-primary hover:text-accent-hover font-medium cursor-pointer transition-colors duration-200"
        >
          Ask Questions →
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FileCard;
