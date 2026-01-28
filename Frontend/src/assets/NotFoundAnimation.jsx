import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NotFoundAnimation = ({ onHomeClick }) => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-20 h-20 bg-red-400 rounded-full opacity-20 top-20 left-10 animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute w-16 h-16 bg-teal-400 rounded-full opacity-20 top-60 right-10 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
        <div className="absolute w-24 h-24 bg-blue-400 rounded-full opacity-20 bottom-20 left-20 animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
        <div className="absolute w-12 h-12 bg-yellow-400 rounded-full opacity-20 top-40 right-30 animate-float" style={{ animationDuration: '6s', animationDelay: '3s' }}></div>
        <div className="absolute w-16 h-16 bg-indigo-400 opacity-20 top-70 left-60 animate-float" style={{ animationDuration: '8s', animationDelay: '4s', transform: 'rotate(45deg)' }}></div>
      </div>
      
      <div className="text-center relative z-10">
        <h1 className="text-9xl font-black text-white/10 animate-glitch mb-8 relative">
          404
          <span className="absolute inset-0 text-cyan-400 opacity-50 animate-pulse z-[-1]">404</span>
          <span className="absolute inset-0 text-pink-400 opacity-50 animate-pulse z-[-2]" style={{ animationDelay: '0.1s' }}>404</span>
        </h1>
        <h2 className="text-3xl text-white mb-4 animate-fade-in">Oops! Page Not Found</h2>
        <p className="text-lg text-white/80 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          The page you're looking for seems to have vanished into the digital void. 
          Don't worry, even the best explorers get lost sometimes!
        </p>
        <button 
          className="bg-white text-purple-600 px-8 py-3 text-lg font-semibold rounded-full hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
          onClick={() => {
            onHomeClick(); // Call the existing onHomeClick function
            navigate('/login'); // Redirect to the login page
          }}
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
};

export default NotFoundAnimation;
