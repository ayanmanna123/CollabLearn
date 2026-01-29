import React, { useState } from 'react';
import { API_BASE_URL } from '../../config/backendConfig';

const RateModal = ({ isOpen, onClose, onSubmit, sessionId, bookingId, mentorName, sessionDate, sessionTime }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const formatSessionDate = (date) => {
    if (!date) return 'Date not available';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatSessionTime = (date) => {
    if (!date) return 'Time not available';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: sessionId || bookingId,
          bookingId: bookingId || sessionId,
          rating,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Rating submitted!');
        setRating(0);
        onClose();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-7 w-full max-w-md border border-gray-700/30 shadow-2xl hover-lift">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Rate {mentorName}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group">
            <span className="text-gray-400 group-hover:text-white text-xl">×</span>
          </button>
        </div>

        {/* Session Info */}
        <div className="bg-gray-800/30 rounded-2xl p-5 mb-7 border border-gray-700/30">
          <p className="text-xs text-gray-400 mb-3 font-semibold tracking-wide">Session Details</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-700/30 rounded-xl p-3">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-base text-white font-medium">{formatSessionDate(sessionDate)}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-700/30 rounded-xl p-3">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-base text-white font-medium">{formatSessionTime(sessionDate)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-7">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl transition-all duration-300 transform hover:scale-110 ${
                star <= rating ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-600 hover:text-gray-500'
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-300 font-bold border border-gray-700/50 hover:border-gray-600/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateModal;
