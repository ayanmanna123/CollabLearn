import React, { useState, useEffect } from 'react';
import { FiClock, FiVideo, FiCalendar, FiUser } from 'react-icons/fi';
import { API_BASE_URL } from '../config/backendConfig';

const SessionTimer = ({ session, onJoinSession, onSessionExpired, userRole = 'student' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStatus, setSessionStatus] = useState(session?.status);

  // Update timer every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Function to get session timing info
  const getSessionTiming = (session) => {
    if (!session) {
      return { canJoin: false, message: 'No session data', timeLeft: null };
    }

    // Parse session date and time
    let sessionDateTime;
    try {
      let timeString = session.sessionTime;
      
      // Convert 12-hour format to 24-hour format if needed
      if (timeString && (timeString.includes('AM') || timeString.includes('PM'))) {
        const parts = timeString.trim().split(' ');
        if (parts.length === 2) {
          const [time, period] = parts;
          const timeParts = time.split(':');
          if (timeParts.length >= 2) {
            let hours = parseInt(timeParts[0]);
            let minutes = parseInt(timeParts[1]) || 0;
            
            if (period.toUpperCase() === 'PM' && hours !== 12) {
              hours += 12;
            } else if (period.toUpperCase() === 'AM' && hours === 12) {
              hours = 0;
            }
            
            timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
          }
        }
      }
      
      // Extract just the date part if sessionDate is a full ISO string
      let dateString = session.sessionDate;
      if (dateString.includes('T')) {
        dateString = dateString.split('T')[0];
      }
      
      // Create the full datetime string
      const dateTimeString = `${dateString}T${timeString}`;
      sessionDateTime = new Date(dateTimeString);
      
      // Check if date is valid
      if (isNaN(sessionDateTime.getTime())) {
        return { canJoin: false, message: 'Invalid session time', timeLeft: null };
      }
    } catch (error) {
      return { canJoin: false, message: 'Error parsing time', timeLeft: null };
    }

    const now = currentTime;
    const timeDiff = sessionDateTime.getTime() - now.getTime();
    const secondsUntilSession = Math.floor(timeDiff / 1000);
    const minutesUntilSession = Math.floor(secondsUntilSession / 60);

    // Handle different statuses
    if (sessionStatus === 'cancelled') {
      return { canJoin: false, message: 'Session cancelled', timeLeft: null };
    }

    if (sessionStatus === 'completed') {
      return { canJoin: false, message: 'Session completed', timeLeft: null };
    }

    if (sessionStatus === 'expired') {
      return { canJoin: false, message: 'Expired', timeLeft: null, isExpired: true };
    }

    // For pending and confirmed sessions
    if (sessionStatus === 'pending' || sessionStatus === 'confirmed') {
      // Can join only if confirmed and within 5 minutes
      const canJoin = session.status === 'confirmed' && 
                     secondsUntilSession <= 300 && // 5 minutes = 300 seconds
                     secondsUntilSession >= -(session.duration * 60); // session duration in seconds

      if (canJoin) {
        if (secondsUntilSession > 0) {
          const minutes = Math.floor(secondsUntilSession / 60);
          const seconds = secondsUntilSession % 60;
          const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
          return { 
            canJoin: true, 
            message: `Starts in ${timeDisplay}`, 
            timeLeft: secondsUntilSession,
            isStartingSoon: true,
            clockDisplay: {
              days: 0,
              hours: 0,
              minutes: minutes,
              seconds: seconds
            }
          };
        } else if (secondsUntilSession >= -(session.duration * 60)) {
          const secondsIntoSession = Math.abs(secondsUntilSession);
          const remainingSeconds = (session.duration * 60) - secondsIntoSession;
          if (remainingSeconds > 0) {
            const remainingMinutes = Math.floor(remainingSeconds / 60);
            const remainingSecondsDisplay = remainingSeconds % 60;
            const timeDisplay = remainingMinutes > 0 ? `${remainingMinutes}m ${remainingSecondsDisplay}s` : `${remainingSecondsDisplay}s`;
            return { 
              canJoin: true, 
              message: `In progress (${timeDisplay} left)`, 
              timeLeft: remainingSeconds,
              isInProgress: true,
              clockDisplay: {
                days: 0,
                hours: 0,
                minutes: remainingMinutes,
                seconds: remainingSecondsDisplay
              }
            };
          } else {
            return { canJoin: false, message: 'Expired', timeLeft: null, isExpired: true };
          }
        }
      }

      // Show countdown for both pending and confirmed sessions
      if (secondsUntilSession > 0) {
        const daysUntil = Math.floor(secondsUntilSession / (60 * 60 * 24));
        const hoursUntil = Math.floor((secondsUntilSession % (60 * 60 * 24)) / (60 * 60));
        const minutesUntil = Math.floor((secondsUntilSession % (60 * 60)) / 60);
        const secondsRemaining = secondsUntilSession % 60;
        
        let timeMessage;
        if (daysUntil > 0) {
          timeMessage = `${daysUntil}d ${hoursUntil}h ${minutesUntil}m`;
        } else if (hoursUntil > 0) {
          timeMessage = `${hoursUntil}h ${minutesUntil}m ${secondsRemaining}s`;
        } else if (minutesUntil > 0) {
          timeMessage = `${minutesUntil}m ${secondsRemaining}s`;
        } else {
          timeMessage = `${secondsRemaining}s`;
        }

        const statusPrefix = session.status === 'pending' ? 'Pending - ' : '';
        return { 
          canJoin: false, 
          message: `${statusPrefix}Starts in ${timeMessage}`, 
          timeLeft: secondsUntilSession,
          isPending: session.status === 'pending',
          clockDisplay: {
            days: daysUntil,
            hours: hoursUntil,
            minutes: minutesUntil,
            seconds: secondsRemaining
          }
        };
      } else {
        // Session time has completely passed - mark as expired
        return { canJoin: false, message: 'Expired', timeLeft: null, isExpired: true };
      }
    }

    return { canJoin: false, message: `Status: ${session.status}`, timeLeft: null };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#202327] text-white border-white';
      case 'pending':
        return 'bg-[#202327] text-white border-white';
      case 'cancelled':
        return 'bg-[#202327] text-white border-white';
      case 'completed':
        return 'bg-[#202327] text-white border-white';
      case 'expired':
        return 'bg-[#202327] text-white border-white';
      default:
        return 'bg-[#202327] text-white border-white';
    }
  };

  const timing = getSessionTiming(session);

  // Mark session as expired in the database
  const markSessionAsExpired = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !session._id) return;

      await fetch(`${API_BASE_URL}/bookings/${session._id}/expire`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state immediately
      setSessionStatus('expired');
      
      // Notify parent component
      if (onSessionExpired) {
        onSessionExpired(session._id);
      }
    } catch (error) {
      console.error('Error marking session as expired:', error);
    }
  };

  // Call markSessionAsExpired when session expires
  useEffect(() => {
    if (timing.isExpired && sessionStatus !== 'expired') {
      markSessionAsExpired();
    }
  }, [timing.isExpired, sessionStatus, session._id]);

  return (
    <div className="glass-card rounded-2xl shadow-xl border border-gray-700/30 p-5 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {session.sessionTitle}
        </h3>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(sessionStatus)}`}>
          {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 rounded-xl p-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10 mr-3">
            <FiCalendar className="w-4 h-4 text-blue-400" />
          </div>
          <span>{formatDate(session.sessionDate)} at {session.sessionTime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 rounded-xl p-3">
          <div className="p-1.5 rounded-lg bg-purple-500/10 mr-3">
            <FiClock className="w-4 h-4 text-purple-400" />
          </div>
          <span>{session.duration} minutes</span>
        </div>
        {userRole === 'student' && session.mentor && (
          <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 rounded-xl p-3">
            <div className="p-1.5 rounded-lg bg-green-500/10 mr-3">
              <FiUser className="w-4 h-4 text-green-400" />
            </div>
            <span className="font-medium">Mentor: {session.mentor.name}</span>
          </div>
        )}
        {userRole === 'mentor' && session.student && (
          <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 rounded-xl p-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 mr-3">
              <FiUser className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-medium">Student: {session.student.name}</span>
          </div>
        )}
      </div>

      {/* Compact Digital Timer Display */}
      {timing.clockDisplay ? (
        <div className="bg-gray-800/30 rounded-2xl p-4 mb-4 font-mono border border-gray-700/30">
          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            {timing.clockDisplay.days > 0 && (
              <>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl px-3 py-2 min-w-[3rem] text-base neumorphic">
                    {String(timing.clockDisplay.days).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">D</div>
                </div>
                <div className="text-gray-400 text-lg">:</div>
              </>
            )}
            
            {(timing.clockDisplay.hours > 0 || timing.clockDisplay.days > 0) && (
              <>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl px-3 py-2 min-w-[3rem] text-base neumorphic">
                    {String(timing.clockDisplay.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">H</div>
                </div>
                <div className="text-gray-400 text-lg">:</div>
              </>
            )}
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl px-3 py-2 min-w-[3rem] text-base neumorphic">
                {String(timing.clockDisplay.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-400 mt-1 font-medium">M</div>
            </div>
            
            <div className={`text-gray-400 text-lg ${timing.isStartingSoon || timing.isInProgress ? 'animate-pulse text-red-400' : ''}`}>:</div>
            
            <div className="text-center">
              <div className={`rounded-xl px-3 py-2 min-w-[3rem] text-base ${
                timing.isStartingSoon || timing.isInProgress 
                  ? 'bg-gradient-to-br from-red-600 to-red-700 text-white animate-pulse shadow-lg' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white neumorphic'
              }`}>
                {String(timing.clockDisplay.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-400 mt-1 font-medium">S</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/30 rounded-2xl p-4 mb-4 border border-gray-700/30">
          <div className="text-center">
            <span className={`text-base font-bold ${
              timing.isExpired ? 'text-gray-500' :
              timing.isPending ? 'text-gray-400' : 
              timing.isInProgress ? 'text-green-400' :
              timing.isStartingSoon ? 'text-yellow-400' :
              timing.timeLeft ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {timing.message}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Expired Button */}
        {timing.isExpired && (
          <button
            disabled
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all duration-300 bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed"
          >
            <FiVideo className="w-4 h-4 mr-2" />
            Session Expired
          </button>
        )}
        
        {/* Testing Join Button - Always Available */}
        {!timing.isExpired && (
          <button
            onClick={() => onJoinSession(session)}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border border-blue-500/30 shadow-lg hover:shadow-xl"
          >
            <FiVideo className="w-4 h-4 mr-2" />
            Join Session (Test Mode)
          </button>
        )}
        
        {/* Timer-based Join Button */}
        {timing.canJoin && !timing.isExpired && (
          <button
            onClick={() => onJoinSession(session)}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border border-green-500/30 shadow-lg hover:shadow-xl animate-pulse-glow"
          >
            <FiVideo className="w-4 h-4 mr-2" />
            {timing.isInProgress ? 'Join Session (Live)' : 'Join Session (Starting Soon)'}
          </button>
        )}
      </div>

      {/* Session Description */}
      {session.sessionDescription && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-sm text-gray-300 line-clamp-2 bg-gray-800/30 rounded-xl p-3">{session.sessionDescription}</p>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
