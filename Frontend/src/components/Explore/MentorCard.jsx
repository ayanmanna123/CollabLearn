import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiGift } from 'react-icons/fi';

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();
  const [mentorStats, setMentorStats] = useState({
    mentoredStudents: 0,
    totalSessions: 0
  });

  useEffect(() => {
    const fetchMentorStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !mentor.id) {
          console.log('⚠️ [MentorCard] Missing token or mentor.id:', { hasToken: !!token, mentorId: mentor.id });
          return;
        }

        console.log('🔍 [MentorCard] Fetching stats for mentor:', mentor.id, 'Name:', mentor.name);

        // Fetch mentor stats using the correct endpoint
        const url = `http://localhost:4000/api/bookings/mentor/stats?mentorId=${mentor.id}`;
        console.log('📍 [MentorCard] API URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log('📊 [MentorCard] API Response:', { status: response.status, success: data.success, sessionsCompleted: data.data?.sessionsCompleted });
        
        if (response.ok && data.success && data.data) {
          console.log('✅ [MentorCard] Stats for', mentor.name, ':', { 
            mentoredStudents: data.data.sessionsCompleted,
            totalSessions: data.data.sessionsCompleted
          });

          setMentorStats({
            mentoredStudents: data.data.sessionsCompleted || 0,
            totalSessions: data.data.sessionsCompleted || 0
          });
        }
      } catch (err) {
        console.error('❌ [MentorCard] Error fetching mentor stats:', err);
      }
    };

    fetchMentorStats();
  }, [mentor.id]);

  const handleCardClick = () => {
    navigate(`/mentor-profile?mentor=${encodeURIComponent(mentor.name)}&mentorId=${mentor.id}`);
  };

  return (
    <div 
      className="glass-card rounded-2xl border border-gray-700/30 overflow-hidden hover:border-white transition-all duration-300 cursor-pointer w-full hover-lift"
      onClick={handleCardClick}
    >
      <div class="p-6">
        <div className="flex items-start">
          {/* Mentor Image */}
          <div className="relative mr-5">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden neumorphic">
              {mentor.image ? (
                <img
                  className="h-24 w-24 rounded-2xl object-cover"
                  src={mentor.image}
                  alt={mentor.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <span 
                style={{ display: mentor.image ? 'none' : 'flex' }}
                className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl"
              >
                {mentor.name?.charAt(0).toUpperCase() || 'M'}
              </span>
            </div>
            {mentor.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-3 border-gray-900 animate-pulse"></div>
            )}
          </div>

          {/* Mentor Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{mentor.name}</h3>
                <p className="text-base font-medium text-white mt-1">{mentor.title}</p>
                <p className="text-sm text-gray-400 mt-1">{mentor.companies}</p>
                <p className="text-xs text-gray-500 mt-2">{mentor.experience}</p>
              </div>
              <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 text-sm font-bold px-3 py-1.5 rounded-full border border-yellow-500/30">
                <FiStar className="text-yellow-400 mr-1.5" size={16} />
                {Number(mentor.rating || mentor.averageRating || 0).toFixed(1)} <span className="text-gray-400 ml-1">({mentor.ratedCount || mentor.totalReviews || 0})</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-300 line-clamp-2 bg-gray-800/30 rounded-xl p-3">{mentor.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {mentor.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Mentor Stats */}
            <div className="mt-4 flex items-center gap-5 text-xs text-gray-300 bg-gray-800/30 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-green-500/10">
                  <span className="text-green-400">👥</span>
                </div>
                <span>Mentored {mentorStats.mentoredStudents} students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-purple-500/10">
                  <span className="text-purple-400">⏱️</span>
                </div>
                <span>{mentorStats.totalSessions} sessions</span>
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center pt-4 border-t border-gray-700/50">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                <FiGift className="text-white" size={16} />
                <span>Free Trial</span>
              </button>
              <div className="text-xl font-bold text-white">
                ${mentor.price}<span className="text-sm font-normal text-gray-400">/{mentor.priceUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
