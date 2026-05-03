import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, GraduationCap } from "lucide-react";
import Navbar from "@/components/navbar";
import SkeletonProfessor from "@/components/skeletonprofessor";
import ChatBox, { Message } from "@/components/chatbox";
import Toolbox, { Tool } from "@/components/Toolbox";
import DrawingCanvas, { DrawingCanvasHandle } from "@/components/drawingcanvas";
import FileUpload from "@/components/fileupload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

import { api } from "@/lib/api";

const STORAGE_KEY = "syllabus_mode_messages";
const FILES_KEY = "syllabus_mode_files";

const SyllabusMode = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [];
  });
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    const saved = localStorage.getItem(FILES_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [isTeaching, setIsTeaching] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const clearCanvasRef = useRef<(() => void) | null>(null);
  const canvasHandleRef = useRef<DrawingCanvasHandle>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  }, [files]);

  // Welcome message if no files
  useEffect(() => {
    if (files.length === 0 && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: "Welcome to Syllabus Mode! 📚 I'm Professor Bones, and I'm ready to teach you based on your course materials.\n\nPlease upload your PDFs, notes, or images using the upload button, and I'll start teaching from your curriculum!",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTeaching(true);

    try {
      let data;
      if (files.length > 0) {
        data = await api.askFile(content);
      } else {
        // Fallback or specific syllabus call if no files uploaded yet
        data = await api.general(content);
      }

      // Handle structured response
      const answer = typeof data === 'string' ? data : (data.answer || "I've explained that on the board!");
      const boardNotes = data.board_notes || [];

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: answer,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (boardNotes.length > 0 && canvasHandleRef.current) {
        canvasHandleRef.current.addBoardNotes(boardNotes);
      }
    } catch (error) {
      console.error("Error calling Syllabus API:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I had trouble analyzing your syllabus. Please check your connection! 🦴",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsTeaching(false), 2000);
    }
  };

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0 && files.length === 0) {
      const confirmMessage: Message = {
        id: `system-${Date.now()}`,
        content: `Excellent! I've received ${newFiles.length} file(s): ${newFiles.map(f => f.name).join(", ")}.\n\nI'm processing your materials now... 🦴 Ask me anything about your syllabus content!`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMessage]);
    }
  };

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleClear = () => {
    clearCanvasRef.current?.();
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      <div className="pt-24 pb-6 px-6 h-screen flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full flex gap-6 overflow-hidden">
          {/* Professor Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ 
              opacity: 1, 
              x: isTeaching || isLoading ? 20 : 0,
              scale: isTeaching || isLoading ? 1.02 : 1
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="hidden lg:flex flex-col items-center justify-center w-72 shrink-0 relative px-4"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-3xl -z-10" />
            
            <AnimatePresence>
              {(isTeaching || isLoading) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 10 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 gradient-bg text-primary-foreground px-6 py-3 rounded-2xl rounded-bl-none shadow-glow z-20 whitespace-nowrap"
                >
                  <div className="absolute -bottom-2 left-0 w-4 h-4 bg-primary rotate-45" />
                  <p className="text-sm font-black tracking-tight relative z-10 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    ACADEMIC MODE! 🦴
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
               <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <SkeletonProfessor size="lg" isTeaching={isTeaching || isLoading} className="relative z-10" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center glass-effect px-6 py-4 rounded-2xl border border-white/10 w-full"
            >
              <h3 className="font-display font-black text-xl tracking-tight">Professor Bones</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : isTeaching ? 'bg-secondary' : 'bg-secondary/50'}`} />
                 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {isLoading ? "Analyzing..." : isTeaching ? "Teaching!" : "Syllabus Ready"}
                 </p>
              </div>
              {files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Knowledge Base</p>
                   <div className="flex flex-wrap justify-center gap-1">
                      {files.slice(0, 3).map(f => (
                         <span key={f.id} className="px-2 py-1 rounded-md bg-secondary/10 text-secondary text-[9px] font-bold truncate max-w-[80px]">
                            {f.name}
                         </span>
                      ))}
                      {files.length > 3 && <span className="text-[9px] font-bold text-muted-foreground">+{files.length - 3} more</span>}
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Main Teaching Area */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Canvas Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 relative glass-card overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 pointer-events-none z-0">
                <div className="text-center">
                  <GraduationCap className="w-20 h-20 mx-auto mb-4 opacity-10" />
                  <p className="text-2xl font-black tracking-tight opacity-20 uppercase">Curriculum Canvas</p>
                  <p className="text-sm font-medium uppercase tracking-widest opacity-20">Teaching from your materials</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-10 flex gap-2">
                 <div className="glass-effect px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    Syllabus Sync
                 </div>
              </div>

              <DrawingCanvas ref={canvasHandleRef} activeTool={activeTool} onClearRef={clearCanvasRef} />
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="h-96 shrink-0"
            >
              <ChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask about your syllabus... I've read every bone of it! 📚"
              >
                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-12 w-12 rounded-xl hover:bg-secondary/10 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-secondary" />
                      {files.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                          {files.length}
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glass-card border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black tracking-tight">Upload Materials</DialogTitle>
                      <DialogDescription className="font-medium text-muted-foreground">
                        Feed the Professor your PDFs, notes, or images.
                      </DialogDescription>
                    </DialogHeader>
                    <FileUpload files={files} onFilesChange={handleFilesChange} />
                  </DialogContent>
                </Dialog>
              </ChatBox>
            </motion.div>
          </div>

          {/* Toolbox */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="shrink-0 flex flex-col gap-4"
          >
            <div className="glass-card p-2 flex flex-col gap-2 shadow-2xl">
              <Toolbox
                activeTool={activeTool}
                onToolChange={handleToolChange}
                onClear={handleClear}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusMode;
