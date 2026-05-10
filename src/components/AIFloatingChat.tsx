import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, Minimize2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "ai",
  content: "Hello! I'm Nexus AI. I have access to your enterprise risk and compliance data. How can I assist you today?",
  timestamp: new Date(),
};

const AIFloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.role !== "system")
        .map(m => ({
          role: m.role === "user" ? "user" : "ai",
          text: m.content
        }));

      const data = await api("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: userText,
          history: history
        })
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: error instanceof Error ? error.message : "Failed to connect to AI server.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 bg-primary text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Bot size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    Nexus AI
                  </h2>
                  <p className="text-[10px] text-white/70 font-medium">Enterprise Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[90%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    msg.role === "user" ? "bg-primary text-white" : "bg-surface-container-highest border border-outline-variant/30"
                  }`}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-3 py-2 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-tr-sm" 
                        : "bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-tl-sm shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="px-3 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 rounded-tl-sm flex items-center gap-1 shadow-sm">
                    <div className="w-1 h-1 rounded-full bg-on-surface-variant animate-bounce" />
                    <div className="w-1 h-1 rounded-full bg-on-surface-variant animate-bounce [animation-delay:150ms]" />
                    <div className="w-1 h-1 rounded-full bg-on-surface-variant animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nexus AI..."
                  className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 text-xs font-medium rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/20 transition-all"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden",
          isOpen ? "bg-on-surface rotate-90" : "bg-primary"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-bounce" />
        )}
      </button>
    </div>
  );
};

export default AIFloatingChat;
