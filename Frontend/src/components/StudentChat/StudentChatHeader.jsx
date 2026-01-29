import React from "react";
import { Circle, MoreVertical } from "lucide-react";

export function StudentChatHeader({ 
  mentorName = "Select a conversation", 
  mentorRole = "", 
  mentorAvatar = ""
}) {
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="flex items-center justify-between px-6 py-2 border-b border-gray-700/30 glass-card">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 border-2 border-gray-600 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center neumorphic">
            {mentorAvatar ? (
              <img 
                src={mentorAvatar} 
                alt={mentorName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span 
              className="text-sm font-bold text-white flex items-center justify-center w-full h-full"
              style={{ display: mentorAvatar ? 'none' : 'flex' }}
            >
              {getInitials(mentorName)}
            </span>
          </div>
          <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-400 text-green-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {mentorName}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {mentorRole && (
              <span className="font-medium">{mentorRole}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-br from-gray-700/30 to-gray-800/30 transition-all duration-300 shadow-sm hover:shadow-md neumorphic"
          title="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
