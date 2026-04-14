import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import SkeletonProfessor from "@/components/skeletonprofessor";
import ChatBox, { Message } from "@/components/chatbox";
import Toolbox, { Tool } from "@/components/Toolbox";
import DrawingCanvas, { DrawingCanvasHandle } from "@/components/drawingcanvas";

import { api } from "@/lib/api";

const STORAGE_KEY = "general_mode_messages";

const GeneralMode = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [isTeaching, setIsTeaching] = useState(false);
  const clearCanvasRef = useRef<(() => void) | null>(null);
  const canvasHandleRef = useRef<DrawingCanvasHandle>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

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
      const data = await api.general(content);
      
      // Handle the new structured response
      const answer = typeof data === 'string' ? data : (data.answer || "I've explained that in the board notes!");
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
      console.error("Error calling AI Professor:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I had trouble connecting to the brain center. Please try again! 🦴",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsTeaching(false), 2000);
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
            animate={{ 
              opacity: 1, 
              x: isTeaching || isLoading ? 40 : 0,
              scale: isTeaching || isLoading ? 1.05 : 1
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="hidden lg:flex flex-col items-center justify-center w-64 shrink-0 relative"
          >
            <AnimatePresence>
              {(isTeaching || isLoading) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 10 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-bl-none shadow-xl z-20 whitespace-nowrap"
                >
                  <div className="absolute -bottom-2 left-0 w-4 h-4 bg-primary rotate-45" />
                  <p className="text-sm font-bold relative z-10">Listen up! 🦴</p>
                </motion.div>
              )}
            </AnimatePresence>
            <SkeletonProfessor size="lg" isTeaching={isTeaching || isLoading} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center"
            >
              <h3 className="font-display font-bold text-lg">Professor Bones</h3>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Thinking..." : isTeaching ? "Teaching!" : "Ready to help!"}
              </p>
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
                  <p className="text-lg font-medium">Teaching Area</p>
                  <p className="text-sm">Use tools to draw, highlight, or point at concepts</p>
                </div>
              </div>
              <DrawingCanvas ref={canvasHandleRef} activeTool={activeTool} onClearRef={clearCanvasRef} />
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
              />
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

export default GeneralMode;
