import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

const ChatBox = ({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Ask Professor Bones anything...",
  children,
}: ChatBoxProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden shadow-2xl">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-center font-medium">
                👋 Hello! I'm <span className="text-foreground font-bold">Professor Bones</span>.<br />
                Ask me anything and I'll teach you!
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[85%] px-5 py-4 rounded-[1.5rem] shadow-sm ${
                    message.role === "user"
                      ? "gradient-bg text-primary-foreground rounded-br-none"
                      : "glass-effect border border-white/20 dark:border-white/5 text-foreground rounded-bl-none"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="absolute -left-12 bottom-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                      🦴
                    </div>
                  )}
                  {message.role === "user" ? (
                    <p className="text-sm md:text-base font-medium leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm md:prose-base dark:prose-invert leading-relaxed max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="glass-effect px-5 py-4 rounded-[1.5rem] rounded-bl-none border border-white/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-sm font-bold text-muted-foreground italic">
                  Professor Bones is thinking...
                </span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {children}
          <form onSubmit={handleSubmit} className="flex-1 flex gap-3">
            <div className="relative flex-1 group">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading}
                className="h-14 px-6 rounded-2xl bg-white/5 dark:bg-black/40 border-white/10 focus:border-primary/50 transition-all text-base font-medium"
              />
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-14 w-14 rounded-2xl gradient-bg shadow-glow hover:scale-105 transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
