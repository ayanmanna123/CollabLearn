import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiUsers, FiVideo, FiTarget, FiMessageSquare, FiTrendingUp, FiShield, FiCheck } from 'react-icons/fi';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import studentDashboardImage from '../assets/studentdashbaordimage.png';
import mentorDashboardImage from '../assets/MentorDahboard.png';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:bg-gray-800/60 hover:border-gray-700 transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard = ({ number, label }) => (
  <div className="text-center">
    <h4 className="text-3xl md:text-4xl font-bold text-white mb-1">{number}</h4>
    <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
);

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              🚀 The Future of Mentorship is Here
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Master Your Craft with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                World-Class Mentors
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with industry experts, track your progress, and accelerate your career growth through personalized 1-on-1 mentorship.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link
                to="/student/explore"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
              >
                Find a Mentor <FiArrowRight />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold backdrop-blur-sm border border-white/10 transition-all hover:scale-105 flex items-center justify-center"
              >
                Join as Student
              </Link>
            </div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto max-w-5xl perspective-1000"
          >
            <div className="relative rounded-xl bg-gray-900 shadow-2xl border border-gray-800 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500 group">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800/50 flex items-center px-4 gap-2 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <img
                src={studentDashboardImage}
                alt="CollabLearn Dashboard"
                className="w-full h-auto rounded-b-xl opacity-90 group-hover:opacity-100 transition-opacity"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest">Trusted by industry leaders from</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple text-based logos for now */}
            <h3 className="text-xl font-bold flex items-center gap-2 text-white"><div className="w-6 h-6 bg-white/20 rounded-full" /> TechStart</h3>
            <h3 className="text-xl font-bold flex items-center gap-2 text-white"><div className="w-6 h-6 bg-white/20 rounded-full" /> InnovateLabs</h3>
            <h3 className="text-xl font-bold flex items-center gap-2 text-white"><div className="w-6 h-6 bg-white/20 rounded-full" /> FutureGrow</h3>
            <h3 className="text-xl font-bold flex items-center gap-2 text-white"><div className="w-6 h-6 bg-white/20 rounded-full" /> EduTech</h3>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <span className="text-blue-400">succeed</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform provides all the tools necessary for seamless mentorship, learning, and professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={FiVideo}
              title="1-on-1 Video Sessions"
              description="High-quality video calls with integrated whiteboard and screen sharing for effective learning."
              delay={0.1}
            />
            <FeatureCard
              icon={FiMessageSquare}
              title="Real-time Chat"
              description="Stay connected with your mentor through our instant messaging system. Never lose touch."
              delay={0.2}
            />
            <FeatureCard
              icon={FiTarget}
              title="Goal Tracking"
              description="Set clear milestones and track your progress with our advanced analytics dashboard."
              delay={0.3}
            />
            <FeatureCard
              icon={FiUsers}
              title="Community Forums"
              description="Connect with peers, share knowledge, and solve problems together in our vibrant community."
              delay={0.4}
            />
            <FeatureCard
              icon={FiTrendingUp}
              title="Skill Analytics"
              description="Visualize your skill growth over time and identify areas for improvement."
              delay={0.5}
            />
            <FeatureCard
              icon={FiShield}
              title="Verified Mentors"
              description="All mentors are vetted professionals from top companies, ensuring you get the best guidance."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Dual Persona Switcher */}
      <section className="py-24 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-900/40 rounded-3xl border border-gray-800 p-8 md:p-12 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-8 relative z-10">
                <div className="flex space-x-2 bg-gray-800/50 p-1 rounded-lg w-fit backdrop-blur-sm">
                  <button
                    onClick={() => setActiveTab('student')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    For Students
                  </button>
                  <button
                    onClick={() => setActiveTab('mentor')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'mentor' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    For Mentors
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      {activeTab === 'student' ? "Accelerate Your Career Growth" : "Share Knowledge, Inspire Others"}
                    </h2>
                    <p className="text-gray-400 text-lg mb-8">
                      {activeTab === 'student'
                        ? "Get personalized guidance, tailored learning paths, and direct access to industry veterans who have walked the path you're on."
                        : "Build your personal brand, earn by sharing your expertise, and help shape the next generation of tech leaders."
                      }
                    </p>
                    <ul className="space-y-4 mb-8">
                      {[
                        activeTab === 'student' ? 'Access to 500+ Mentors' : 'Flexible Schedule Management',
                        activeTab === 'student' ? 'Mock Interviews' : 'Set Your Own Rates',
                        activeTab === 'student' ? 'Project Reviews' : 'Built-in Payment Processing'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeTab === 'student' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            <FiCheck className="w-4 h-4" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={activeTab === 'student' ? "/register" : "/register?role=mentor"}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'student'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                    >
                      {activeTab === 'student' ? 'Start Learning' : 'Start Mentoring'} <FiArrowRight />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
                <motion.img
                  key={activeTab}
                  src={activeTab === 'student' ? studentDashboardImage : mentorDashboardImage}
                  alt="Dashboard Preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full rounded-xl shadow-2xl border border-gray-700/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10k+" label="Active Students" />
            <StatCard number="500+" label="Expert Mentors" />
            <StatCard number="50k+" label="Sessions Completed" />
            <StatCard number="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to transform your journey?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of others who are already learning and growing with Ment2Be.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-xl"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
