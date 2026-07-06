"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Trash2, HelpCircle, Bot, User } from "lucide-react";
import { localDB } from "@/lib/supabase";
import { getChatbotResponse } from "@/utils/astrologyData";

interface ChatBotProps {
  activeReport?: any;
}

export default function ChatBot({ activeReport }: ChatBotProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync initial message history
  const loadHistory = async () => {
    const history = await localDB.getChatHistory();
    setMessages(history);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    
    // Save user message
    const userMsg = await localDB.saveChatMessage({ role: "user", content: userText });
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI thinking and replying
    setTimeout(async () => {
      const responseText = getChatbotResponse(messages, userText, activeReport);
      const botMsg = await localDB.saveChatMessage({ role: "assistant", content: responseText });
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleClear = async () => {
    const reset = await localDB.clearChat();
    setMessages(reset);
  };

  const handleSuggestClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const suggestions = [
    "What does my fate line mean?",
    "When will I get career growth?",
    "What careers suit my personality?",
    "What are my remedies?",
  ];

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-gold/15 bg-cosmic/50 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-cosmic border-b border-gold/15">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full border border-gold/30 bg-midnight flex items-center justify-center">
            <Bot className="h-4.5 w-4.5 text-gold" />
            <div className="absolute inset-0 rounded-full border border-dashed border-gold/25 animate-spin-slow"></div>
          </div>
          <div>
            <h5 className="font-serif text-sm font-bold text-white tracking-wide">
              AI Astrologer Chat
            </h5>
            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Cosmic Node Online
            </span>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear Chat History"
          className="text-purple-300 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full border text-[10px] ${
                msg.role === "user"
                  ? "bg-violet-dark/30 border-violet-light/30 text-violet-light"
                  : "bg-midnight border-gold/30 text-gold"
              }`}
            >
              {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div
              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "bg-violet-dark/40 border border-violet-light/20 text-purple-100 rounded-tr-none"
                  : "bg-cosmic/80 border border-gold/10 text-purple-200/90 rounded-tl-none"
              }`}
            >
              {/* Render markdown style list or paragraphs */}
              <div className="whitespace-pre-line space-y-1.5">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[85%] mr-auto">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-midnight text-gold">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="bg-cosmic/80 border border-gold/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-1.5 items-center">
              <span className="h-2 w-2 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="h-2 w-2 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="h-2 w-2 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggestion tags */}
      {messages.length <= 2 && !isTyping && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSuggestClick(sug)}
              className="text-[10px] text-gold/80 hover:text-gold border border-gold/15 hover:border-gold/45 bg-midnight/35 px-2.5 py-1 rounded-full transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-cosmic border-t border-gold/15 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activeReport ? "Ask about your lines, careers, or future..." : "Analyze your palm first to chat..."}
          className="flex-1 bg-midnight/80 border border-gold/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-midnight hover:bg-gold/90 disabled:bg-gold/40 disabled:text-midnight/60 transition-all shrink-0"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
