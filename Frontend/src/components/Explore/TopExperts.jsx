import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiX, FiUser } from 'react-icons/fi';
import { API_BASE_URL } from '../../config/backendConfig';

const TopExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const NON_VERIFIED_BADGES = [
    'Featured',
    'Highly Rated',
    'Mentor Favorite',
    'Top Contributor',
    'In Demand'
  ];

  useEffect(() => {
    const fetchTopExperts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/mentors/top-experts?limit=4`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch top experts');
        }

        const data = await response.json();
        const topExperts = Array.isArray(data.mentors) ? data.mentors : [];
        
        console.log('🏆 Top Experts Raw Data:', topExperts);
        
        const transformedExperts = topExperts.map(mentor => ({
          id: mentor._id,
          name: mentor.name,
          company: mentor.company || 'N/A',
          image: mentor.profilePicture || mentor.mentorProfile?.profilePicture || '',
          verified: mentor.isVerified || false
        }));

        console.log('🏆 Transformed Experts:', transformedExperts);
        setExperts(transformedExperts);
      } catch (error) {
        console.error('Error fetching top experts:', error);
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopExperts();
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getBadgeLabel = (expert) => {
    if (expert?.verified) return 'Top Pick';

    const id = String(expert?.id || '');
    const hash = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const index = NON_VERIFIED_BADGES.length
      ? hash % NON_VERIFIED_BADGES.length
      : 0;

    return NON_VERIFIED_BADGES[index] || 'Featured';
  };

  return (
    <div className="bg-transparent rounded-2xl border border-gray-700/30 overflow-hidden flex flex-col h-[350px] w-[270px]">
      <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
        <h3 className="text-lg font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Top Experts</h3>
      </div>
      <div className="divide-y divide-gray-700/30 overflow-y-auto flex-1 custom-scroll">
        {loading ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-500 border-r-transparent align-[-0.125em]"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : experts.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">No experts found</div>
        ) : (
          experts.map((expert) => (
            <div 
              key={expert.id} 
              className="p-4 hover:bg-gray-800/50 cursor-pointer transition-all duration-300 rounded-lg mx-2 my-1"
              onClick={() => {
                setSelectedExpert(expert);
                setShowModal(true);
              }}
            >
              <div className="flex items-center">
                <div className="relative">
                  {expert.image ? (
                    <img
                      className="h-12 w-12 rounded-2xl object-cover border-2 border-gray-700/50 neumorphic"
                      src={expert.image}
                      alt={expert.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    style={{ display: expert.image ? 'none' : 'flex' }}
                    className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {getInitials(expert.name)}
                  </div>
                  {expert.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full p-1 border-2 border-gray-900 shadow-lg">
                      <FiCheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-white truncate">{expert.name}</span>
                    {expert.verified && (
                      <FiCheckCircle className="ml-1.5 h-4 w-4 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-1">{expert.company}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                    {getBadgeLabel(expert)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && selectedExpert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl border border-gray-700/30 max-w-md w-full p-6 hover-lift">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <FiUser size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Connect with {selectedExpert.name}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Expert Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700/30">
              <div className="relative">
                {selectedExpert.image ? (
                  <img
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-gray-700/50 neumorphic"
                    src={selectedExpert.image}
                    alt={selectedExpert.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  style={{ display: selectedExpert.image ? 'none' : 'flex' }}
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg"
                >
                  {selectedExpert.name?.charAt(0).toUpperCase() || 'M'}
                </div>
                {selectedExpert.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full p-1.5 border-3 border-gray-900 shadow-lg">
                    <FiCheckCircle className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{selectedExpert.name}</p>
                <p className="text-sm text-gray-400">{selectedExpert.company}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                  {getBadgeLabel(selectedExpert)}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-white font-bold mb-3 text-lg">How to Connect:</h3>
                <ol className="text-sm text-gray-300 space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                    <span>View the mentor's full profile and expertise</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                    <span>Check their availability and hourly rate</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                    <span>Book a session or send a message to discuss your goals</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                    <span>Start your mentorship journey and grow together</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopExperts;
