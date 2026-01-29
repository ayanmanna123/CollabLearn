import React, { useEffect, useState } from 'react';
import SessionItem from './SessionItem';
import sessionDataService from '../../services/sessionDataService';

const SessionSidebar = ({ activeSessionId, onSessionSelect, currentSessionData, userRole }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  const fetchCompletedSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionDataService.getCompletedSessions();
      
      if (response.success) {
        setSessions(response.data || []);
      } else {
        setError('Failed to load sessions');
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (session) => {
    onSessionSelect(session);
  };

  // Add current session to the list if it's not already there
  const allSessions = currentSessionData && !sessions.find(s => s._id === currentSessionData._id)
    ? [currentSessionData, ...sessions]
    : sessions;

  return (
    <div className="w-80 glass-card border-r border-gray-700/30 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700/30">
        <h3 className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Session Journal</h3>
        <p className="text-gray-400 text-sm mt-1">Your completed mentoring sessions</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-purple-300 animate-spin"></div>
            <p className="text-gray-400 text-sm mt-2 font-bold">Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center neumorphic">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 text-sm font-bold">{error}</p>
            <button 
              onClick={fetchCompletedSessions}
              className="mt-3 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
            >
              Retry
            </button>
          </div>
        ) : allSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center neumorphic">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-bold">No completed sessions yet</p>
            <p className="text-gray-500 text-xs mt-1">Complete a mentoring session to see it here</p>
          </div>
        ) : (
          <>
            {allSessions.map((session) => (
              <SessionItem
                key={session._id || session.id}
                session={session}
                userRole={userRole}
                isActive={activeSessionId === (session._id || session.id)}
                onClick={() => handleSessionClick(session)}
                hasNotes={session.hasNotes || false}
                hasAIAnalysis={session.hasAIAnalysis || false}
              />
            ))}
          </>
        )}
      </div>

      </div>
  );
};

export default SessionSidebar;
