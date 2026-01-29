import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, MessageCircle, Clock, ListChecks, Menu, X, LogOut, MessageSquare } from 'lucide-react';
import UserProfileSidebar from '../UserProfileSidebar';
import LogoHat from '../../assets/logo-hat.png';

const Navbar = ({ userName = 'Student' }) => {
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
    { label: 'Home', href: '/student/dashboard', icon: Home },
    { label: 'Explore', href: '/student/explore', icon: Compass },
    { label: 'Journal', href: '/student/journal', icon: BookOpen, badge: 'New' },
    { label: 'Messages', href: '/student/chat', icon: MessageCircle },
    { label: 'Bookings', href: '/student/sessions', icon: Clock },
    { label: 'My Tasks', href: '/student/tasks', icon: ListChecks },
    { label: 'Ask Questions', href: '/student/forum', icon: MessageSquare },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 supports-backdrop-blur:bg-gray-900/90 border-b border-gray-800/50 shadow-2xl ${isScrolled ? 'bg-gradient-to-r from-gray-900/95 via-gray-950/95 to-black/95 backdrop-blur-xl' : 'bg-gradient-to-r from-gray-900 to-black'}`} style={{
      backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
      WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)'
    }}>
      <div className="px-0">
        <div className="flex items-center justify-between h-14">

          {/* Logo and Branding */}
          <Link to="/student/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 pl-4 group">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-300 shadow-lg">
              <img src={LogoHat} alt="Ment2Be" className="h-8 w-8" />
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-start ml-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${isActive ? 'text-white bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 shadow-lg' : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border hover:border-gray-600/30'}`}
                  title={item.label}
                >
                  <Icon 
                    size={18} 
                    className={isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}
                  />
                  <span className={`text-xs font-bold tracking-wide ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                  
                  {/* Badge for New */}
                  {item.badge && (
                    <span className="ml-1 px-2.5 py-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs rounded-full font-bold shadow-md">
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
              className="md:hidden p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300"
            >
              {isMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-700/50 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <div key={item.label}>
                  {item.href === '#' ? (
                    <button
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition-all duration-300 flex items-center gap-3 text-sm font-medium"
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`w-full block px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                        isActive 
                          ? 'text-white bg-gradient-to-r from-blue-600/30 to-purple-600/30' 
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto px-2 py-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-sm mt-3 shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
