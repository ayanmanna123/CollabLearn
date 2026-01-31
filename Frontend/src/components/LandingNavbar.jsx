import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import logoHat from "../assets/logo-hat.png";

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    // If not on home page, we might need to navigate there first
    // For now, assuming simple scroll if on page, or handled via navigation
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  const DropdownLink = ({ to, title, desc, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="block p-3 rounded-xl hover:bg-white/5 transition-colors group"
    >
      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </Link>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
        ? "bg-black/80 backdrop-blur-xl border-white/5 py-3"
        : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <img src={logoHat} alt="Logo" className="w-5 h-5 brightness-0 invert" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Ment2Be</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors py-2">
                Features <FiChevronDown className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="w-64 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl ring-1 ring-black/5">
                  <DropdownLink
                    to="/"
                    title="Personal Dashboard"
                    desc="Track your progress daily"
                    onClick={() => scrollToSection('dashboard-section')}
                  />
                  <DropdownLink
                    to="/"
                    title="Connect with Mentors"
                    desc="Find your perfect guide"
                    onClick={() => scrollToSection('connect-mentors-section')}
                  />
                </div>
              </div>
            </div>

            {/* Solutions Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors py-2">
                Solutions <FiChevronDown className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="w-64 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl ring-1 ring-black/5">
                  <DropdownLink
                    to="/solutions#students"
                    title="For Students"
                    desc="Accelerate your learning"
                  />
                  <DropdownLink
                    to="/solutions#mentors"
                    title="For Mentors"
                    desc="Share and earn"
                  />
                </div>
              </div>
            </div>

            <NavLink to="/contact-us">Contact Us</NavLink>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-gray-500 font-medium">© Arsh Chauhan</span>
            <div className="h-4 w-[1px] bg-white/10" />
            <Link to="/login" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="group relative px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <FiArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505] border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Navigation</p>
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">Home</Link>
                <Link to="/solutions" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">Solutions</Link>
                <Link to="/contact-us" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">Contact</Link>
              </div>

              <div className="h-[1px] bg-white/10 w-full" />

              <div className="flex gap-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNavbar;
