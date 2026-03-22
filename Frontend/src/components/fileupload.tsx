import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, FileText, Image, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedFile { id: string; name: string; type: string; size: number; file?: File; }
interface FileUploadProps { onFilesChange: (files: UploadedFile[]) => void; files: UploadedFile[]; }

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return FileText;
  if (type.includes("image")) return Image;
  if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUpload = ({ onFilesChange, files }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    const uploaded: UploadedFile[] = newFiles.map((f) => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, name: f.name, type: f.type, size: f.size, file: f }));
    onFilesChange([...files, ...uploaded]);
  };

  return (
    <div className="space-y-3">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
        onClick={() => inputRef.current?.click()}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        className="relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5"
      >
        <input ref={inputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx" onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} className="hidden" />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground"><span className="text-primary font-medium">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, Images, Text files (max 10MB)</p>
      </motion.div>
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div key={file.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={(e) => { e.stopPropagation(); onFilesChange(files.filter((f) => f.id !== file.id)); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;