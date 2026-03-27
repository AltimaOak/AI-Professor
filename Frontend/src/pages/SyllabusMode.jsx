import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import Navbar from "@/components/navbar.jsx";
import SkeletonProfessor from "@/components/SkeletonProfessor";
import ChatBox, { Message } from "@/components/chatbox.jsx";
import Toolbox, { Tool } from "@/components/Toolbox.jsx";
import DrawingCanvas from "@/components/DrawingCanvas";
import FileUpload from "@/components/fileupload.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

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

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      if (files.length === 0) {
        response = "I notice you haven't uploaded any study materials yet! 📝 Please upload your PDFs, notes, or images first, and then I can teach you based on your syllabus content.";
      } else {
        response = `Based on your uploaded materials (${files.map(f => f.name).join(", ")}), let me explain "${content}"!\n\nThis is where Professor Bones would analyze your uploaded documents using the syllabus retriever and provide a contextual explanation based on your curriculum.`;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      setTimeout(() => setIsTeaching(false), 2000);
    }, 2000);
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

      <div className="pt-24 pb-4 px-4 h-screen flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full flex gap-4 overflow-hidden">
          {/* Professor Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col items-center justify-center w-64 shrink-0"
          >
            <SkeletonProfessor size="lg" isTeaching={isTeaching || isLoading} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center"
            >
              <h3 className="font-display font-bold text-lg">Professor Bones</h3>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Analyzing..." : isTeaching ? "Teaching!" : "Syllabus Mode"}
              </p>
              {files.length > 0 && (
                <p className="text-xs text-primary mt-1">
                  {files.length} file(s) loaded
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Main Teaching Area */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Canvas Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 relative glass-effect rounded-2xl overflow-hidden min-h-[200px]"
            >
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none z-0">
                <div className="text-center">
                  <p className="text-lg font-medium">Syllabus Teaching Area</p>
                  <p className="text-sm">Upload materials and ask questions</p>
                </div>
              </div>
              <DrawingCanvas activeTool={activeTool} onClearRef={clearCanvasRef} />
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="h-80 shrink-0"
            >
              <ChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask about your syllabus content..."
              >
                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                    >
                      <Upload className="w-5 h-5" />
                      {files.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {files.length}
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Study Materials</DialogTitle>
                      <DialogDescription>
                        Upload your PDFs, notes, or images for Professor Bones to teach from.
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
            className="shrink-0"
          >
            <Toolbox
              activeTool={activeTool}
              onToolChange={handleToolChange}
              onClear={handleClear}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusMode;
