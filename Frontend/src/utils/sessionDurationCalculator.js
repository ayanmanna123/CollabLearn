/**
 * Calculate actual session duration from start and end times
 * Falls back to default duration if start/end times not available
 * @param {Object} session - Session object with sessionStartTime, sessionEndTime, and duration
 * @returns {number} Duration in minutes
 */
export const calculateSessionDuration = (session) => {
  if (session?.sessionStartTime && session?.sessionEndTime) {
    const startTime = new Date(session.sessionStartTime);
    const endTime = new Date(session.sessionEndTime);
    const durationMs = endTime - startTime;
    const durationMins = Math.floor(durationMs / (1000 * 60));
    return durationMins > 0 ? durationMins : 0;
  }
  return session?.duration || 0;
};

/**
 * Format minutes into human-readable time string
 * @param {number} totalMinutes - Total minutes
 * @returns {string} Formatted time string (e.g., "2h 30m" or "45 mins")
 */
export const formatMentoringTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} mins`;
};

/**
 * Calculate total mentoring time from multiple sessions
 * @param {Array} sessions - Array of session objects
 * @returns {string} Formatted total time string
 */
export const calculateTotalMentoringTime = (sessions) => {
  const totalMinutes = sessions.reduce((sum, session) => {
    return sum + calculateSessionDuration(session);
  }, 0);
  
  return formatMentoringTime(totalMinutes);
};
