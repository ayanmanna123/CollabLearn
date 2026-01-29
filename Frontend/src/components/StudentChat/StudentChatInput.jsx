import React, { useState } from "react";
import { Send, MessageSquare, HelpCircle, Lightbulb, BookOpen, CheckSquare } from "lucide-react";
import { MessageTypes } from "../../lib/types";

const messageTypes = [
  {
    type: MessageTypes.NORMAL,
    icon: MessageSquare,
    label: "Message",
    color: "text-gray-400 hover:text-white",
    activeColor: "bg-gradient-to-br from-gray-700 to-gray-800 text-white ring-gray-600/50",
  },
  {
    type: MessageTypes.QUESTION,
    icon: HelpCircle,
    label: "Question",
    color: "text-blue-400 hover:text-blue-300",
    activeColor: "bg-gradient-to-br from-blue-600/30 to-indigo-600/30 text-blue-300 ring-blue-500/50",
  },
  {
    type: MessageTypes.INSIGHT,
    icon: Lightbulb,
    label: "Insight",
    color: "text-yellow-400 hover:text-yellow-300",
    activeColor: "bg-gradient-to-br from-yellow-600/30 to-orange-600/30 text-yellow-300 ring-yellow-500/50",
  },
  {
    type: MessageTypes.ADVICE,
    icon: BookOpen,
    label: "Advice",
    color: "text-green-400 hover:text-green-300",
    activeColor: "bg-gradient-to-br from-green-600/30 to-emerald-600/30 text-green-300 ring-green-500/50",
  },
  {
    type: MessageTypes.ACTION,
    icon: CheckSquare,
    label: "Action",
    color: "text-purple-400 hover:text-purple-300",
    activeColor: "bg-gradient-to-br from-purple-600/30 to-pink-600/30 text-purple-300 ring-purple-500/50",
  },
];

export function StudentChatInput({ selectedType, onTypeChange, onSendMessage }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className="px-6 py-4 border-t border-gray-700/30 glass-card">
      {/* Message type selector */}
      <div className="flex items-center gap-1 mb-3">
        {messageTypes.map(({ type, icon: Icon, label, color, activeColor }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md neumorphic",
              selectedType === type ? `${activeColor} ring-1 ring-inset` : `${color} hover:bg-gradient-to-br from-gray-700/30 to-gray-800/30`,
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className={cn(
              "w-full resize-none rounded-xl border border-gray-700/30 bg-gradient-to-br from-gray-800/40 to-gray-900/40 glass-card",
              "px-4 py-3 text-sm text-white placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
              "transition-all duration-300 min-h-[48px] max-h-[120px] hover-lift",
            )}
            style={{ height: "48px" }}
            onInput={(e) => {
              const target = e.target;
              target.style.height = "48px";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/30 hover:border-blue-400/50 hover-lift",
          )}
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
