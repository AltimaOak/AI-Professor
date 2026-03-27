import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar.jsx";
import SkeletonProfessor from "@/components/SkeletonProfessor";
import ChatBox, { Message } from "@/components/chatbox.jsx";
import Toolbox, { Tool } from "@/components/Toolbox.jsx";
import DrawingCanvas from "@/components/DrawingCanvas";

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

    // Simulate AI response (replace with actual backend call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: `Ah, excellent question about "${content}"! Let me explain this to you in a way that'll stick to your bones! 💀\n\nThis is where Professor Bones would provide a detailed, engaging explanation. The backend orchestrator would classify your query, estimate its difficulty, and generate a personalized teaching response using the lesson planner and explanation engine.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      setTimeout(() => setIsTeaching(false), 2000);
    }, 2000);
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
