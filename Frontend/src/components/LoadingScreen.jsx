import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const quotes = [
    "Great things take time. Keep pushing forward!",
    "Every expert was once a beginner. You're on the right path.",
    "Success is not final, failure is not fatal. Keep learning!",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your mentorship journey starts now. Let's go!",
    "Learning is a journey, not a destination.",
    "Invest in yourself. It's the best investment you can make.",
    "Mentorship is the backbone of professional growth.",
    "You're about to unlock your potential. Stay tuned!",
    "Growth happens outside your comfort zone."
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
      <div className="max-w-md text-center">
        {/* Loading Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-spin" 
              style={{ 
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))'
              }}>
            </div>
            <div className="absolute inset-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading</h2>
        <p className="text-sm text-gray-500 mb-8">Getting everything ready for you...</p>

        {/* Quote */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-gray-700 italic text-base leading-relaxed">
            "{quote}"
          </p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            style={{
              animation: 'progress 2s infinite'
            }}
          ></div>
          <style>{`
            @keyframes progress {
              0% {
                width: 0%;
              }
              50% {
                width: 100%;
              }
              100% {
                width: 100%;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
