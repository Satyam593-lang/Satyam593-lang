import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";
import { SKUItem } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  isDarkMode?: boolean;
  items: SKUItem[];
  activeScenario?: string;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUERIES = [
  "Which SKUs are at stockout risk & what should I do?",
  "Suggest markdown promo tactics for overstocked items",
  "How does inflation affect my average setup cost?",
  "Give me carrying capital optimization tips"
];

export default function AIChatbot({ isDarkMode = true, items, activeScenario, isOpen, onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your LogiCast Supply Chain Intelligence Companion. I have complete index context of your active SKU inventory, warehousing utilization, and scenario sandboxing. Ask me any optimization prompt!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent) return;

    if (!textToSend) {
      setInputValue("");
    }

    // append user message
    const updatedMessages = [...messages, { role: "user" as const, content: messageContent }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          items,
          activeScenario: activeScenario || "Baseline Mode"
        })
      });

      if (!resp.ok) {
        throw new Error("Chat api failed");
      }

      const body = await resp.json();
      setMessages(prev => [...prev, { role: "assistant" as const, content: body.reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { role: "assistant" as const, content: "⚠️ Connection timeout. Please verify that your Gemini API key is configured in the environment variables." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onClose} // in parent this will toggle open
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl p-4 cursor-pointer shadow-lg shadow-blue-500/30 border border-blue-400/20 flex items-center gap-2 group hover:scale-105 transition-all"
        id="trigger-floating-chatbot-btn"
      >
        <Bot className="h-5.5 w-5.5 animate-pulse" />
        <span className="text-xs font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300">
          Ask Control Tower AI
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[440px] z-50 transition-transform duration-300 transform translate-x-0 ${
      isDarkMode ? "bg-slate-950/95 text-slate-100" : "bg-white text-slate-800"
    } border-l ${isDarkMode ? "border-white/10" : "border-slate-200"} shadow-2xl flex flex-col justify-between`}>
      
      {/* Drawer Header */}
      <div className={`px-5 py-4 border-b flex justify-between items-center ${
        isDarkMode ? "border-white/10 bg-slate-900" : "border-slate-200 bg-slate-50"
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/25">
            <Bot className="h-5 w-5 text-blue-450" />
          </div>
          <div>
            <h3 className="text-sm font-semibold font-display tracking-tight text-white flex items-center gap-1.5">
              Control Tower AI Assistant
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Powered by Gemini 3.5-flash</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          type="button"
          className="text-slate-450 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages Output Area */}
      <div 
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto space-y-4 select-text max-h-[calc(100vh-165px)]"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                isUser 
                  ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/15" 
                  : isDarkMode 
                    ? "bg-white/[0.04] border border-white/5 text-slate-100 rounded-bl-none font-sans" 
                    : "bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none"
              }`}>
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5 select-none">
                    <Sparkles className="h-3 w-3" />
                    <span>Control Tower Counsel</span>
                  </div>
                )}
                {/* Clean inline bulleting handling */}
                <p className="whitespace-pre-line text-xs">{msg.content}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
              isDarkMode ? "bg-white/[0.04] text-slate-400" : "bg-slate-100 text-slate-500"
            }`}>
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-450" />
              <span>Sensing inventory datasets...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer input container */}
      <div className={`p-4 border-t ${
        isDarkMode ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"
      }`}>
        
        {/* Helper Quick Prompts */}
        {messages.length === 1 && (
          <div className="mb-3 space-y-1.5 select-none">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Quick-Access Scopes</span>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  type="button"
                  className={`text-[9.5px] text-left p-1.5 rounded-lg border leading-tight truncate font-sans hover:text-white transition-all cursor-pointer ${
                    isDarkMode ? "bg-black/50 border-white/5 text-slate-400 hover:bg-slate-800" : "bg-white border-slate-250 text-slate-650 hover:bg-slate-100"
                  }`}
                  title={q}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Query about overstocks, lead times, safety stocks..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className={`flex-grow text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
              isDarkMode ? "bg-black border-white/10 text-white placeholder-slate-600" : "bg-white border-slate-250 text-slate-800"
            }`}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2.5 flex items-center justify-center cursor-pointer transition-all disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
