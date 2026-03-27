interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-sm text-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
        AP
      </div>
      <div className="max-w-[75%] bg-secondary text-foreground px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
