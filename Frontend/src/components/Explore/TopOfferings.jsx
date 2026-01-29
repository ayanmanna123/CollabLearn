import React, { useState } from 'react';
import { FiX, FiGift } from 'react-icons/fi';

const offerings = [
  { id: 1, name: 'Mock Interviews', description: 'Practice interviews with experienced mentors to build confidence and improve your interview skills.' },
  { id: 2, name: 'Resume Review', description: 'Get professional feedback on your resume to make it stand out to recruiters and hiring managers.' },
  { id: 3, name: 'Career Guidance', description: 'Receive personalized career advice and guidance to navigate your professional growth.' },
  { id: 4, name: 'Salary Negotiation', description: 'Learn strategies to negotiate your salary and benefits effectively.' },
  { id: 5, name: 'Coding Tutoring', description: 'Master programming concepts with one-on-one coding tutorials from expert mentors.' },
  { id: 6, name: 'Personal Branding', description: 'Build your personal brand and establish yourself as an expert in your field.' }
];

const TopOfferings = () => {
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOfferingClick = (offering) => {
    setSelectedOffering(offering);
    setShowModal(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Top Offerings</h3>
      </div>
      
      <div class="grid grid-cols-1 gap-3">
        {offerings.map((offering) => (
          <button
            key={offering.id}
            onClick={() => handleOfferingClick(offering)}
            className="text-white text-xs font-bold py-3 px-3 rounded-xl hover:opacity-90 transition-all duration-300 text-center border border-green-500/30 w-full cursor-pointer bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-700/30 hover:to-emerald-700/30"
          >
            {offering.name}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedOffering && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl border border-gray-700/30 max-w-md w-full p-6 hover-lift">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <FiGift size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{selectedOffering.name}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <div class="mb-6 pb-6 border-b border-gray-700/30">
              <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 rounded-xl p-4">
                {selectedOffering.description}
              </p>
            </div>

            {/* How to Get Started */}
            <div class="space-y-4 mb-6">
              <div>
                <h3 className="text-white font-bold mb-3 text-lg">How to Get Started:</h3>
                <ol className="text-sm text-gray-300 space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                    <span>Browse mentors offering this service</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                    <span>Check their reviews and experience</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                    <span>Book a session at your preferred time</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-white font-bold bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                    <span>Connect and achieve your goals</span>
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
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Find Mentors
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopOfferings;