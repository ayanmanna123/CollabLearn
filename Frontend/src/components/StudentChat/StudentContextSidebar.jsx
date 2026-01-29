import React from "react";
import { CheckSquare, Lightbulb, Award, TrendingUp, Clock } from "lucide-react";
import "../Chat/chat-scrollbar.css";

export function StudentContextSidebar({ mentor, messages }) {
  const actionItems = messages.filter((m) => m.custom_type === "action" || m.type === "action");
  const insights = messages.filter((m) => m.custom_type === "insight" || m.type === "insight");
  const advice = messages.filter((m) => (m.custom_type === "advice" || m.type === "advice"));

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Mentor profile section */}
      <div className="p-6 border-b border-gray-700/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600/30 flex items-center justify-center overflow-hidden neumorphic">
            {mentor.avatar ? (
              <img 
                src={mentor.avatar} 
                alt={mentor.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span 
              className="text-xl font-bold text-white flex items-center justify-center"
              style={{ display: mentor.avatar ? 'none' : 'flex' }}
            >
              {mentor.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{mentor.name}</h3>
            <p className="text-xs text-gray-400 font-medium">{mentor.role}</p>
          </div>
        </div>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.expertise && mentor.expertise.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-md bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 text-[10px] text-gray-400 font-medium glass-card"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Company info */}
        {mentor.company && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 glass-card hover-lift">
            <p className="text-xs text-gray-500 mb-1 font-bold">Company</p>
            <p className="text-sm text-white font-bold">{mentor.company}</p>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {/* Quick stats */}
        <div className="p-6 border-b border-gray-700/30">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            <TrendingUp className="h-4 w-4 text-green-400" />
            Conversation Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 text-center glass-card hover-lift">
              <span className="block text-xl font-bold text-white">{actionItems.length}</span>
              <span className="text-[10px] text-red-300 font-medium">Action Items</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center glass-card hover-lift">
              <span className="block text-xl font-bold text-white">{insights.length}</span>
              <span className="text-[10px] text-yellow-300 font-medium">Insights</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-center glass-card hover-lift">
              <span className="block text-xl font-bold text-white">{advice.length}</span>
              <span className="text-[10px] text-blue-300 font-medium">Advice</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-center glass-card hover-lift">
              <span className="block text-xl font-bold text-white">{messages.length}</span>
              <span className="text-[10px] text-purple-300 font-medium">Messages</span>
            </div>
          </div>
        </div>

        {/* Pending Action Items */}
        <div className="p-6 border-b border-gray-700/30">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="h-4 w-4 text-green-400" />
            <h4 className="font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Action Items</h4>
            <span className="ml-auto text-xs text-gray-500 font-bold">{actionItems.length}</span>
          </div>
          <div className="space-y-2">
            {actionItems.length > 0 ? (
              actionItems.slice(-3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-gray-700/30 bg-gradient-to-br from-gray-800/40 to-gray-900/40 glass-card hover:border-gray-600/50 transition-all duration-300 hover-lift cursor-pointer"
                >
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">{item.content || item.text}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>From your mentor</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic font-medium">No action items yet</p>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-6 border-b border-gray-700/30">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <h4 className="font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Insights</h4>
            <span className="ml-auto text-xs text-gray-500 font-bold">{insights.length}</span>
          </div>
          <div className="space-y-2">
            {insights.length > 0 ? (
              insights.slice(-3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-gray-700/30 bg-gradient-to-br from-gray-800/40 to-gray-900/40 glass-card hover:border-gray-600/50 transition-all duration-300 hover-lift cursor-pointer"
                >
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">{item.content || item.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic font-medium">No insights yet</p>
            )}
          </div>
        </div>

        {/* Achievements teaser */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-purple-400" />
            <h4 className="font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Next Session</h4>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 text-center glass-card hover-lift">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center neumorphic">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Keep Learning!</p>
            <p className="text-xs text-gray-500 font-medium">
              {mentor.nextSession 
                ? `Session on ${new Date(mentor.nextSession).toLocaleDateString()}`
                : "Schedule your next session"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
