import React, { useState, useEffect } from 'react';
import logo from '../assets/logo-hat.png';

const LandingLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const interval = 50; // Update every 50ms for smooth progress
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 800); // Fade out duration
        }, 500); // Brief pause at 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  const getLoadingMessage = (progress) => {
    if (progress < 20) return 'Initializing your mentorship journey...';
    if (progress < 40) return 'Connecting you with expert mentors...';
    if (progress < 60) return 'Preparing personalized learning paths...';
    if (progress < 80) return 'Setting up your workspace...';
    if (progress < 100) return 'Almost ready...';
    return 'Welcome to Ment2Be!';
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07090e] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Welcome Banner */}
      <div 
        className="absolute top-0 left-0 right-0 py-3 text-center"
        style={{
          animation: 'slideDown 1s ease-out forwards',
          opacity: 0
        }}
      >
        <p className="text-white text-sm font-medium">Welcome to Ment2Be</p>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 40% at 50% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 30% at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse 40% 20% at 20% 80%, rgba(167, 139, 250, 0.04) 0%, transparent 50%)
            `
          }}
        />
        
              </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo with animation */}
        <div className="mb-8">
          <div 
            className="inline-block relative"
            style={{
              animation: 'logoReveal 2s ease-out forwards',
              animationDelay: '0.2s'
            }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
                transform: 'scale(1.5)',
                opacity: 0.8
              }}
            />
            
            {/* Logo */}
            <img 
              src={logo} 
              alt="Ment2Be Logo" 
              className="relative w-20 h-20 rounded-lg shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
                filter: 'brightness(0) invert(1)'
              }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 
          className="text-4xl font-bold text-white mb-2"
          style={{
            animation: 'slideUp 1.2s ease-out forwards',
            animationDelay: '0.4s',
            opacity: 0
          }}
        >
          Ment2Be
        </h1>

        {/* Word Carousel Loader */}
        <div 
          className="card"
          style={{
            animation: 'slideUp 1.2s ease-out forwards',
            animationDelay: '0.6s',
            opacity: 0
          }}
        >
          <div className="loader">
            <span>Connecting</span>
            <span className="words">
              <span className="word">mentors</span>
              <span className="word">experts</span>
              <span className="word">guides</span>
              <span className="word">professionals</span>
              <span className="word">leaders</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
        <div 
          className="h-full bg-white"
          style={{
            animation: 'progressBar 4s ease-in-out infinite',
            width: '100%'
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes logoReveal {
          0% {
            opacity: 0;
            transform: scale(0.8) rotate(-10deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .card {
          --bg-color: #07090e;
          background-color: var(--bg-color);
          padding: 0.5rem 1.5rem;
          border-radius: 1.25rem;
        }

        .loader {
          color: rgb(255, 255, 255);
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          font-size: 20px;
          box-sizing: content-box;
          height: 28px;
          padding: 5px 8px;
          display: flex;
          border-radius: 8px;
          align-items: center;
          gap: 8px;
        }

        .words {
          overflow: hidden;
          position: relative;
          height: 28px;
          display: inline-block;
          min-width: 100px;
        }

        .words::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--bg-color) 10%,
            transparent 30%,
            transparent 70%,
            var(--bg-color) 90%
          );
          z-index: 20;
          pointer-events: none;
        }

        .word {
          display: block;
          height: 28px;
          padding-left: 4px;
          color: #ffffff;
          animation: spin_carousel 5s infinite;
          line-height: 28px;
          white-space: nowrap;
        }

        @keyframes spin_carousel {
          10% {
            transform: translateY(-102%);
          }
          25% {
            transform: translateY(-100%);
          }
          35% {
            transform: translateY(-202%);
          }
          50% {
            transform: translateY(-200%);
          }
          60% {
            transform: translateY(-302%);
          }
          75% {
            transform: translateY(-300%);
          }
          85% {
            transform: translateY(-402%);
          }
          100% {
            transform: translateY(-400%);
          }
        }

        @keyframes progressBar {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          50% {
            transform: scaleX(1);
            transform-origin: left;
          }
          100% {
            transform: scaleX(0);
            transform-origin: right;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingLoader;
