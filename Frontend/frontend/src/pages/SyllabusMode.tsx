import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadSyllabus, querySyllabus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Paperclip, Send, Trash2, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import ChatMessage from "@/components/ChatMessage";
import FileCard from "@/components/FileCard";
import QuickChip from "@/components/QuickChip";
import { fetchFiles, UploadedFileDto } from "@/lib/api";

interface Message {
  role: "user" | "ai";
  content: string;
}

const SyllabusMode = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileDto[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello! I've read your syllabus. Ask me anything about it — I'll explain, quiz you, or help you build a study plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchFiles().then(files => {
        setUploadedFiles(files);
        if (files.length > 0 && !activeFile) {
          setActiveFile(files[0].name);
        }
      }).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || !activeFile) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    // Replace with real API call
    try {
      const studentId = user?.email || "guest";
      const response = await querySyllabus(userMsg, studentId);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response.answer,
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I encountered an error. Please try again or check your backend server.",
        },
      ]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const studentId = user?.email || "guest";
      const res = await uploadSyllabus(file, studentId);
      let fileType = file.name.split('.').pop()?.toLowerCase() || 'other';
      if (['png', 'jpg', 'jpeg'].includes(fileType)) fileType = 'image';
      if (fileType !== 'pdf' && fileType !== 'docx' && fileType !== 'image') fileType = 'other';
      
      const newFile: UploadedFileDto = {
        id: res.file_id || String(Date.now()),
        name: file.name,
        type: fileType,
        size: Math.floor(file.size / 1024),
        uploadedAt: new Date().toISOString()
      };
      
      const newFiles = [newFile, ...uploadedFiles.filter(f => f.name !== file.name)];
      setUploadedFiles(newFiles);
      setActiveFile(file.name);
    } catch (error) {
      alert("Failed to upload file. Make sure the backend is running.");
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = ["Explain this topic", "Quiz me", "Summarize syllabus", "Study plan"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-[hsl(0,0%,12%)] border-r border-primary/10 shrink-0">
          <div className="p-4 border-b border-primary/10">
            <h2 className="font-bold text-foreground text-sm">My Syllabi</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your uploaded materials</p>
          </div>
          <div className="p-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              accept=".pdf,.txt,.docx,.png,.jpg,.jpeg" 
            />
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-accent-hover font-semibold rounded-xl h-10 text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {uploadedFiles.map((f) => (
              <FileCard
                key={f.name}
                name={f.name}
                type={f.type}
                date=""
                compact
                isActive={activeFile === f.name}
                onAsk={() => setActiveFile(f.name)}
              />
            ))}
          </div>
          <div className="p-4 border-t border-primary/10">
            <p className="text-xs text-muted-foreground text-center">
              Answers are grounded in your selected file
            </p>
          </div>
        </aside>

        {/* Main chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-primary/10 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {activeFile ? (
                <>
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                    {activeFile}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No file selected</span>
              )}
              <Badge className="bg-primary/20 text-primary border-0 text-[10px] font-medium uppercase tracking-wider">
                Syllabus Mode
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setMessages([
                  {
                    role: "ai",
                    content:
                      "Hello! I've read your syllabus. Ask me anything about it — I'll explain, quiz you, or help you build a study plan.",
                  },
                ])
              }
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear Chat
            </Button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {activeFile ? (
              <>
                {messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} content={m.content} />
                ))}
                {isTyping && (
                  <div className="flex gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      AP
                    </div>
                    <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <p className="text-text-secondary">Select or upload a syllabus to begin your session</p>
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="border-t border-primary/10 bg-card px-4 sm:px-6 py-3">
            <div className="flex items-end gap-2">
              <button className="text-muted-foreground hover:text-primary cursor-pointer transition-colors p-2">
                <Paperclip className="h-5 w-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeFile ? "Ask about your syllabus..." : "Select a file first..."}
                disabled={!activeFile}
                rows={1}
                className="flex-1 bg-bg-tertiary border border-primary/20 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || !activeFile}
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-accent-hover transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {activeFile && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {quickActions.map((a) => (
                  <QuickChip key={a} label={a} onClick={() => setInput(a)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusMode;
