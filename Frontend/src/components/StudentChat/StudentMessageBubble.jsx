import React from "react";
import { MessageSquare, HelpCircle, Lightbulb, BookOpen, CheckSquare, AlertCircle } from "lucide-react";
import { MessageTypes } from "../../lib/types";

// Default configuration for message types
const typeConfig = {
  [MessageTypes.NORMAL]: {
    icon: MessageSquare,
    label: "Message",
    className: "bg-transparent",
  },
  [MessageTypes.QUESTION]: {
    icon: HelpCircle,
    label: "Question",
    className: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-300",
  },
  [MessageTypes.INSIGHT]: {
    icon: Lightbulb,
    label: "Insight",
    className: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-300",
  },
  [MessageTypes.ADVICE]: {
    icon: BookOpen,
    label: "Advice",
    className: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300",
  },
  [MessageTypes.ACTION]: {
    icon: CheckSquare,
    label: "Action Item",
    className: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300",
  },
  // Fallback for unknown message types
  unknown: {
    icon: AlertCircle,
    label: "Unknown",
    className: "bg-gradient-to-br from-gray-700/30 to-gray-800/30 text-gray-300",
  },
};

export function StudentMessageBubble({ message = {} }) {
  // Safely get message properties with defaults
  const { 
    type = MessageTypes.NORMAL,
    custom_type = MessageTypes.NORMAL, // Stream Chat stores custom type here
    sender = 'mentor', 
    content = '',
    text = '', // Stream Chat uses 'text' field
    timestamp = new Date(),
    created_at = new Date(), // Stream Chat uses 'created_at'
    senderName = '',
    receiverName = ''
  } = message;

  // Use text from Stream Chat if content is empty
  const messageContent = (content || text || '').trim();
  // Use custom_type if type is empty (Stream Chat sends type as '')
  const messageType = (type && type !== '') ? type : custom_type;
  // Use created_at if timestamp is not a valid date
  const messageTime = timestamp instanceof Date && !isNaN(timestamp.getTime()) ? timestamp : new Date(created_at);

  // Don't render empty messages
  if (!messageContent) {
    return null;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isMentor = sender === 'mentor' || sender?._id === (user?._id || user?.id);
  
  // Get config with fallback to unknown type
  const config = typeConfig[messageType] || typeConfig.unknown;
  const Icon = config?.icon || AlertCircle;

  const formatTime = (date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return isNaN(dateObj.getTime()) 
        ? 'Invalid Date' 
        : dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return '--:--';
    }
  };

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className={cn("flex w-full mb-3", isMentor ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[80%] relative", isMentor ? "pr-4" : "pl-4")}>
        {/* Sender name */}
        {senderName && (
          <div className="text-xs text-gray-400 mb-1 ml-1 font-medium">
            {senderName}
          </div>
        )}
        
        <div 
          className={cn(
            "rounded-2xl px-4 py-2 text-sm transition-all duration-300 glass-card hover-lift",
            isMentor 
              ? "bg-gradient-to-br from-gray-800/40 to-gray-900/40 text-gray-200 rounded-tl-none border border-gray-700/30" 
              : "bg-gradient-to-br from-blue-500/30 to-indigo-500/30 text-white rounded-tr-none border border-blue-400/30",
            "hover:shadow-lg hover:shadow-gray-900/30"
          )}
        >
          {/* Message type indicator */}
          {messageType !== MessageTypes.NORMAL && (
            <div className={cn("flex items-center mb-1 text-xs font-bold", isMentor ? 'text-gray-400' : 'text-blue-200')}>
              <Icon className="w-3.5 h-3.5 mr-1" />
              <span>{config.label}</span>
            </div>
          )}
          
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words font-medium">
            {messageContent || 'No content'}
          </div>
          
          {/* Message time */}
          <div className={cn("text-xs mt-1 text-right font-medium", isMentor ? 'text-gray-500' : 'text-blue-200')}>
            {formatTime(messageTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
