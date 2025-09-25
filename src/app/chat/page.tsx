"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Copy, RotateCcw } from "lucide-react";
import { clsx } from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-4">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
    <span className="text-gray-500 text-sm ml-2">AI is typing...</span>
  </div>
);

const MessageBubble = ({ message, onCopy }: { message: Message; onCopy: (content: string) => void }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={clsx(
      "group animate-fade-in",
      isUser ? "flex justify-end" : "flex justify-start"
    )}>
      <div className={clsx(
        "flex max-w-[85%] md:max-w-[70%] mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-blue-500 bg-blue-100 text-sm font-medium",
          isUser ? "bg-user-msg ml-3" : "bg-gray-600 text-white mr-3"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        {/* Message Content */}
        <div className={clsx(
          "relative px-4 py-3 rounded-2xl shadow-sm",
          isUser 
            ? "bg-user-msg text-blue-500 bg-blue-100 rounded-br-md" 
            : "bg-assistant-msg border border-border-light rounded-bl-md"
        )}>
          <div className={clsx(
            "text-sm leading-relaxed whitespace-pre-wrap",
            isUser ? "text-blue-500" : "text-gray-800"
          )}>
            {message.content}
          </div>
          
          {/* Message Actions */}
          {!isUser && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-12 top-2">
              <button
                onClick={() => onCopy(message.content)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Copy message"
              >
                <Copy size={14} />
              </button>
            </div>
          )}
          
          {/* Timestamp */}
          <div className={clsx(
            "text-xs mt-1 opacity-70",
            isUser ? "text-gray-700" : "text-gray-500"
          )}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { 
      role: "user", 
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You can add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      {/* Header */}
      <div className="bg-white border-b border-border-light px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
          <p className="text-sm text-gray-500">Powered by Perplexity AI</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            <RotateCcw size={16} />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-2">Welcome to AI Chat</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Start a conversation with our AI assistant. Ask questions, get help with tasks, or just chat!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  onCopy={copyToClipboard}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border-light p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                className="w-full resize-none px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm leading-relaxed"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={clsx(
                  "absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200",
                  input.trim() && !isLoading
                    ? "bg-user-msg text-white hover:bg-blue-600 shadow-sm"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          
          {/* Footer Text */}
          <p className="text-xs text-gray-400 text-center mt-2">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
