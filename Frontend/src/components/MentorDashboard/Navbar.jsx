import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Users, CheckSquare, MessageCircle, UserPlus, Menu, X, Home, LogOut, BookOpen } from 'lucide-react';
import UserProfileSidebar from '../UserProfileSidebar';
import LogoHat from '../../assets/logo-hat.png';

const MentorNavbar = ({ userName = 'Mentor' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home', href: '/mentor/dashboard', icon: Home, color: 'text-white' },
    { label: 'My Mentees', href: '/mentor/mentees', icon: Users, color: 'text-white' },
    { label: 'My Tasks', href: '/mentor/tasks', icon: CheckSquare, color: 'text-white' },
    { label: 'Messages', href: '/mentor/messages', icon: MessageCircle, color: 'text-white' },
    { label: 'Get Mentees', href: '/mentor/get-mentees', icon: UserPlus, color: 'text-white' },
    { label: 'Journal', href: '/mentor/journal', icon: BookOpen, color: 'text-white', badge: 'New' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 supports-backdrop-blur:bg-gray-900/80 border-b border-gray-700/30 shadow-lg ${isScrolled ? 'bg-gray-900/90 backdrop-blur-lg shadow-white/10' : 'bg-gradient-to-r from-gray-900 to-gray-950 shadow-white/5'} glass-card`} style={{
      backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none'
    }}>
      <div className="px-0">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo and Branding */}
          <Link to="/mentor/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 pl-4 hover-lift">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center neumorphic">
              <img
                src={LogoHat}
                alt="Ment2Be"
                className="h-6 w-6"
              />
            </div>
            <span className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">Ment2Be</span>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-start ml-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 hover-lift ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white border border-blue-500/30 shadow-lg' 
                      : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border hover:border-gray-600/30'
                  }`}
                  title={item.label}
                >
                  <Icon 
                    size={18} 
                    className={isActive ? 'text-blue-300' : item.color} 
                  />
                  <span className={`text-sm font-bold ${
                    isActive ? 'text-white' : 'text-gray-300'
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - User Profile Sidebar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <UserProfileSidebar userName={userName} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
            >
              {isMenuOpen ? <X size={20} className="text-red-400" /> : <Menu size={20} className="text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-700/30 pt-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full block px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white border border-blue-500/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border hover:border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-blue-300' : item.color} />
                    <span className="text-sm font-bold">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MentorNavbar;
