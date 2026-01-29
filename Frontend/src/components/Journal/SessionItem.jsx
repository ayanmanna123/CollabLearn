import React from 'react';

const SessionItem = ({ session, userRole, isActive, onClick, hasNotes, hasAIAnalysis }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const mentorName = session.mentorName || session.mentor?.name;
  const studentName = session.studentName || session.student?.name;
  const counterpartName = userRole === 'mentor' ? (studentName || 'Student') : (mentorName || 'Mentor');

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
        isActive 
          ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/50 shadow-lg hover-lift' 
          : 'glass-card border-gray-700/30 hover:border-gray-600/50 hover-lift'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold text-sm truncate">
            Session with {counterpartName}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-400 text-xs font-medium">
              {formatDate(session.sessionDate)}
            </span>
            <span className="text-gray-500 text-xs font-medium">•</span>
            <span className="text-gray-400 text-xs font-medium">
              {formatTime(session.sessionTime)}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-gray-500 text-xs font-medium">
              {session.duration || 60} min
            </span>
            {session.topic && (
              <>
                <span className="text-gray-500 text-xs font-medium">•</span>
                <span className="text-gray-300 text-xs font-medium truncate max-w-[100px]">
                  {session.topic}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1 ml-2">
          {hasNotes && (
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-sm" title="Notes Saved"></div>
          )}
          {hasAIAnalysis && (
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm" title="AI Analysis Available"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionItem;
