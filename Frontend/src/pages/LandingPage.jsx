import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import studentDashboardImage from '../assets/studentdashbaordimage.png';
import mentorDashboardImage from '../assets/MentorDahboard.png';
import mentoringIllustration from '../assets/mentoring-illustration.svg';
import connectIllustration from '../assets/connect.svg';
import groupsIllustration from '../assets/groups.svg';
import connect4Image from '../assets/connect4.png';
import connect5Image from '../assets/connect5.png';
import taskbymenteeImage from '../assets/taskbymentee.png';
import trustImage from '../assets/trust.png';
import logo from '../assets/logo-hat.png';

const LandingPage = () => {
  const [animateElements, setAnimateElements] = useState({
    heading: false,
    description: false,
    image: false,
    buttons: false
  });
  const [dashboardView, setDashboardView] = useState('mentor');
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let hasAnimated = false;

    const handleScroll = () => {
      const element = document.getElementById('dashboard-section');
      if (element && !hasAnimated) {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isInViewport) {
          hasAnimated = true;
          // Stagger animations
          setTimeout(() => setAnimateElements(prev => ({ ...prev, heading: true })), 0);
          setTimeout(() => setAnimateElements(prev => ({ ...prev, description: true })), 200);
          setTimeout(() => setAnimateElements(prev => ({ ...prev, image: true })), 400);
          setTimeout(() => setAnimateElements(prev => ({ ...prev, buttons: true })), 600);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide-in {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .white-illustration {
          filter: brightness(0) invert(1) sepia(1) hue-rotate(200deg) saturate(2);
        }
        .blue-outline-illustration {
          filter: brightness(0.8) invert(1) sepia(1) hue-rotate(180deg) saturate(5) contrast(1.5) brightness(1.2);
        }
        .badge-3d {
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-bottom: 3px solid rgba(255, 255, 255, 0.2);
          border-right: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 4px 12px rgba(255, 255, 255, 0.15),
            0 2px 6px rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
        }
      `}</style>
      {/* Blue Gradient Background with Texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 50%, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 40%, transparent 70%),
            linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.4) 100%)
          `
        }}
      />
      
      {/* Starry Night Effect - White Dots */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, white 1px, transparent 1px),
            radial-gradient(circle, white 0.5px, transparent 0.5px)
          `,
          backgroundSize: '100px 100px, 150px 150px',
          backgroundPosition: '0 0, 50px 50px',
          opacity: 0.15
        }}
      />
      
      {/* Textured Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)
          `,
          backgroundSize: '50px 50px, 50px 50px'
        }}
      />
      
            
            
      <div className="absolute top-40 right-16 z-10 hidden lg:block">
        <div className="px-6 py-3 rounded-full badge-3d backdrop-blur-sm">
          <span className="text-white text-sm font-medium">Task Management</span>
        </div>
      </div>
      
            
      {/* Navbar */}
      <LandingNavbar />
      
      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 items-center">
          {/* Left Side - Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Accessible and Tailored
              <br />
              Mentorship Experience
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Find mentors to develop your skills and connect with like minded individuals.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 bg-white text-black font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              <span>Try Ment2Be</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Right Side - Illustration */}
          <div className="hidden lg:flex justify-center">
            <img 
              src={mentoringIllustration} 
              alt="Mentoring Illustration" 
              className="w-full max-w-md h-auto white-illustration"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Switcher Section */}
      <div className="relative z-10 py-24 px-6" id="dashboard-section">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold text-white mb-4 ${animateElements.heading ? 'animate-slide-in' : ''}`}>
              {dashboardView === 'student' ? 'Student Dashboard' : 'Mentor Dashboard'}
            </h2>
            <p className={`text-xl text-gray-400 ${animateElements.description ? 'animate-slide-in' : ''}`}>
              {dashboardView === 'student' 
                ? 'Track progress, manage tasks, and connect with mentors all in one place'
                : 'Manage mentees, track their progress, and provide guidance'}
            </p>
          </div>
          
          {/* Dashboard Container with Toggle */}
          <div>
            {/* Dashboard Image */}
            <div className={`relative group ${animateElements.image ? 'animate-slide-in' : ''}`}>
              {/* Glow Effect Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              
              {/* Image with Fade Transition */}
              <img 
                src={dashboardView === 'student' ? studentDashboardImage : mentorDashboardImage}
                alt={`${dashboardView === 'student' ? 'Student' : 'Mentor'} Dashboard`}
                className="relative w-full rounded-xl shadow-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300"
              />
              
              {/* Corner Badge */}
              <div className="absolute top-6 right-6 bg-white text-black px-4 py-2 rounded-lg font-semibold shadow-lg">
                {dashboardView === 'student' ? 'Student View' : 'Mentor View'}
              </div>
            </div>
            
            {/* Toggle Arrows - Below Image */}
            <div className={`flex items-center justify-center gap-4 mt-8 ${animateElements.buttons ? 'animate-slide-in' : ''}`}>
              <button 
                onClick={() => setDashboardView('student')}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-white text-sm font-medium px-4 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                {dashboardView === 'student' ? 'Student' : 'Mentor'}
              </span>
              <button 
                onClick={() => setDashboardView('mentor')}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Black Space with Texture - Blended from Previous Section */}
      <div className="min-h-screen bg-[#000000] relative overflow-hidden" id="connect-mentors-section">
        {/* Starry Night Effect */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, white 1px, transparent 1px),
              radial-gradient(circle, white 0.5px, transparent 0.5px)
            `,
            backgroundSize: '100px 100px, 150px 150px',
            backgroundPosition: '0 0, 50px 50px',
            opacity: 0.15
          }}
        />
        
        {/* Grid Texture Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)
            `,
            backgroundSize: '50px 50px, 50px 50px'
          }}
        />
        
        {/* Content with Illustration */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Connect with Expert Mentors
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Build meaningful connections with industry professionals who can guide your career journey and help you achieve your goals.
              </p>
              <div className="space-y-4">
                <div className="text-gray-300">
                  <span>• 1-on-1 personalized mentorship sessions</span>
                </div>
                <div className="text-gray-300">
                  <span>• Real-time collaboration and feedback</span>
                </div>
                <div className="text-gray-300">
                  <span>• Access to exclusive learning resources</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Illustration */}
            <div className="hidden lg:flex justify-center">
              <img 
                src={groupsIllustration} 
                alt="Groups and Community" 
                className="w-full max-w-2xl h-auto white-illustration"
              />
            </div>
          </div>
        
        {/* Connect4/5 Image Section - Flip Animation */}
        <div className="max-w-6xl mx-auto relative z-10 mt-16">
          <div className="relative w-full max-w-4xl mx-auto">
            <div 
              className="relative w-full h-96 cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div 
                className="relative w-full h-full transition-all duration-700 ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Side - Connect4 Image */}
                <div 
                  className="absolute w-full h-full rounded-xl group"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <img 
                    src={connect4Image}
                    alt="Connect Community"
                    className="w-full h-full rounded-xl"
                    style={{
                      border: '3px solid rgba(255, 255, 255, 0.4)',
                      borderBottom: '6px solid rgba(255, 255, 255, 0.25)',
                      borderRight: '6px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset -1px 0 0 rgba(255, 255, 255, 0.2),
                        0 4px 12px rgba(0, 0, 0, 0.15),
                        0 2px 6px rgba(0, 0, 0, 0.1)
                      `
                    }}
                  />
                  {/* Highlight Overlay - Shows on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">Community Building</h3>
                      <p className="text-sm text-gray-200">Connect with mentors and build lasting professional relationships</p>
                    </div>
                  </div>
                </div>
                
                {/* Back Side - Connect5 Image */}
                <div 
                  className="absolute w-full h-full rounded-xl group"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <img 
                    src={connect5Image}
                    alt="Connect Community 5"
                    className="w-full h-full rounded-xl"
                    style={{
                      border: '3px solid rgba(255, 255, 255, 0.4)',
                      borderBottom: '6px solid rgba(255, 255, 255, 0.25)',
                      borderRight: '6px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset -1px 0 0 rgba(255, 255, 255, 0.2),
                        0 4px 12px rgba(0, 0, 0, 0.15),
                        0 2px 6px rgba(0, 0, 0, 0.1)
                      `
                    }}
                  />
                  {/* Highlight Overlay - Shows on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">Skill Development</h3>
                      <p className="text-sm text-gray-200">Master new skills and advance your career with expert guidance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm">Click to flip image</p>
          </div>
        </div>
        </div>

      {/* New Section with Color Blend Background */}
      <div 
        className="w-full py-32"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #0d0d0d 15%, #131313 35%, #161616 60%, #171717 85%, #1a1a1a 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Trusted by Many Mentors Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Trusted by Many Mentors</h2>
            
            {/* Mentor Names Carousel */}
            <div className="p-8 mb-8">
              <div className="overflow-hidden">
                <div className="flex animate-scroll space-x-8">
                  <div className="flex-shrink-0 text-center">
                    <img src="/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign.jpg" alt="Dr. Sarah Johnson" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Dr. Sarah Johnson</p>
                    <p className="text-gray-300 text-sm">Tech Expert</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/cheerful-indian-man.jpg" alt="Prof. Michael Chen" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Prof. Michael Chen</p>
                    <p className="text-gray-300 text-sm">Data Science</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/close-up-excited-person-portrait.jpg" alt="Emily Rodriguez" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Emily Rodriguez</p>
                    <p className="text-gray-300 text-sm">Design Lead</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/medium-shot-smiley-man-posing.jpg" alt="James Wilson" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">James Wilson</p>
                    <p className="text-gray-300 text-sm">Business Strategy</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/happy-brunette-woman-confident-with-natural-hair-feeling-satisfied.jpg" alt="Lisa Thompson" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Lisa Thompson</p>
                    <p className="text-gray-300 text-sm">Marketing Pro</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/portrait-young-indian-businessman-student-sitting-with-pen.jpg" alt="David Kim" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">David Kim</p>
                    <p className="text-gray-300 text-sm">AI Specialist</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/pleased-young-brunette-caucasian-woman-stands-sideways-with-crossed-arms.jpg" alt="Dr. Maria Garcia" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Dr. Maria Garcia</p>
                    <p className="text-gray-300 text-sm">Healthcare</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/portrait-young-stylish-indian-man-model-isolated-pink-wall-background.jpg" alt="Robert Taylor" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Robert Taylor</p>
                    <p className="text-gray-300 text-sm">Finance Expert</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/smiling-young-beautiful-girl-looking-straight-ahead-wearing-white-t-shirt-isolated-pink.jpg" alt="Jennifer Lee" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Jennifer Lee</p>
                    <p className="text-gray-300 text-sm">Education Tech</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/smiling-young-brunette-caucasian-girl-looks-camera-olive-green.jpg" alt="Alex Martinez" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Alex Martinez</p>
                    <p className="text-gray-300 text-sm">Software Dev</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/cheerful-indian-man.jpg" alt="Sophie Brown" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Sophie Brown</p>
                    <p className="text-gray-300 text-sm">UX Research</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <img src="/close-up-excited-person-portrait.jpg" alt="Kevin Davis" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    <p className="text-white font-semibold">Kevin Davis</p>
                    <p className="text-gray-300 text-sm">Product Mgmt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={mentoringIllustration}
                  alt="Mentorship"
                  className="w-28 h-28 white-illustration"
                />
              </div>

              <p className="text-[#d9d3c7] text-sm tracking-wide mb-6">Have that “aha” mentorship moment</p>

              <h3 className="text-4xl md:text-5xl font-extrabold text-[#f3ead7] leading-tight">
                Lots of platforms promise to “match” you with a mentor,
                then leave you with a bunch of empty chats.
                <span className="text-[#ff6fae]"> Hooray, you got nowhere.</span>
              </h3>

              <p className="text-[#d9d3c7] text-base md:text-lg mt-8 leading-relaxed">
                We don’t skip the hard parts. Ment2Be helps you book sessions, set clear goals,
                track tasks, and get feedback — so you keep moving forward, one step at a time.
              </p>

              <div className="mt-10 flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-[#ff6fae] text-black font-semibold shadow-[0_10px_30px_rgba(255,111,174,0.25)] hover:bg-[#ff86bb] transition-colors"
                >
                  I’M READY LET’S GO!
                </Link>
              </div>
            </div>
          </div>
          
                  </div>
      </div>

      {/* Footer with Ment2Be Branding */}
      <div className="relative z-10 py-16 px-6 bg-[#171717]">
        <div className="max-w-6xl mx-auto text-center">
        </div>
      </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
