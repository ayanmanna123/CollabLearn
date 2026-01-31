import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiMessageSquare, FiCheckCircle, FiUsers, FiTrendingUp, FiShield, FiStar, FiZap, FiActivity } from 'react-icons/fi';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import studentImage from '../assets/student.png';
import student2Image from '../assets/student2.png';
import student3Image from '../assets/student3.png';
import mentorImage from '../assets/mentor.png';
import mentor2Image from '../assets/mentor2.png';

// --- Shared Components (for consistency) ---

const GradientBlob = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob ${className}`} />
);

const ParallaxText = ({ children, className }) => (
  <motion.h2
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.h2>
);

const BentoItem = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 hover:bg-white/[0.05] transition-colors duration-500 group ${className}`}
  >
    {children}
  </motion.div>
);

const SolutionsPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const { hash } = useLocation();

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Handle hash scrolling
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-indigo-500/30">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GradientBlob className="w-[800px] h-[800px] bg-blue-600/20 top-[-20%] right-[-10%]" />
          <GradientBlob className="w-[600px] h-[600px] bg-indigo-600/20 bottom-[-10%] left-[-10%] animation-delay-2000" />
        </div>

        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="z-10 text-center max-w-7xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="inline-block py-2 px-5 rounded-full bg-white/5 border border-white/10 text-sm font-medium tracking-wide text-blue-300 backdrop-blur-md">
              The Suite
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter mb-8 leading-[0.9]">
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Every tool.
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-indigo-400 to-blue-400">
              One ecosystem.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            From collaborative forums to advanced task tracking. Everything you need to succeed, beautifully integrated.
          </p>
        </motion.div>
      </section>

      {/* Student Solutions Section */}
      <section id="students" className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">For Students</h2>
            <p className="text-xl text-gray-400 max-w-xl">Study smarter, not harder. Tools designed to accelerate your learning curve.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1: The Forum */}
            <BentoItem className="min-h-[500px] flex flex-col justify-between group">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                  <FiMessageSquare size={28} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">Collaborative Forum</h3>
                <p className="text-gray-400 text-lg">Ask questions, share code snippets, and solve problems together in real-time threaded discussions.</p>
              </div>

              {/* 3D Float Effect Image */}
              <div className="relative mt-10 h-64 w-full flex items-center justify-center perspective-1000">
                <motion.div
                  whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src={studentImage} alt="Forum UI" className="w-full h-full object-cover" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="flex -space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-black" />
                      <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-black" />
                      <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-black" />
                    </div>
                    <p className="text-white font-medium">1.2k Active Discussions</p>
                  </div>
                </motion.div>
              </div>
            </BentoItem>

            {/* Feature 2: Task Tracking */}
            <BentoItem className="min-h-[500px] flex flex-col justify-between group bg-gradient-to-br from-gray-900 to-black">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                  <FiCheckCircle size={28} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">Task Management</h3>
                <p className="text-gray-400 text-lg">Break down big goals into manageable steps. Track your progress visually.</p>
              </div>

              <div className="relative mt-8 space-y-3">
                {['Complete Python module', 'Mentor Check-in', 'Update Portfolio'].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-green-500 bg-green-500/20' : 'border-gray-600'}`}>
                      {i === 0 && <FiCheckCircle className="text-green-500 w-4 h-4" />}
                    </div>
                    <span className={i === 0 ? 'text-gray-500 line-through' : 'text-gray-200'}>{item}</span>
                  </div>
                ))}
              </div>
            </BentoItem>
          </div>
        </div>
      </section>

      {/* Mentor Solutions Section */}
      <section id="mentors" className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-right">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">For Mentors</h2>
            <p className="text-xl text-gray-400 max-w-xl ml-auto">Empowering you to share knowledge efficiently and effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Analytics Card */}
            <BentoItem className="md:col-span-1 min-h-[400px]">
              <FiActivity className="text-purple-400 w-10 h-10 mb-6" />
              <h3 className="text-2xl font-bold mb-2">Deep Analytics</h3>
              <p className="text-gray-400 mb-8">Track student engagement and session quality.</p>
              <div className="h-40 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl flex items-end gap-2 px-4 pb-4">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-purple-500/50 rounded-t-sm" />
                ))}
              </div>
            </BentoItem>

            {/* Dashboard Main Feature */}
            <BentoItem className="md:col-span-2 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-0" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">Command Center</h3>
                  <p className="text-gray-300 text-lg mb-6">Manage all your sessions, chats, and ratings from a single powerful dashboard.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-400"><FiZap className="text-yellow-400" /> Instant scheduling</li>
                    <li className="flex items-center gap-2 text-gray-400"><FiShield className="text-green-400" /> Secure payments</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <img src={mentorImage} alt="Mentor Dashboard" className="rounded-lg shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </BentoItem>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-24 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Students", value: "10K+" },
              { label: "Mentors", value: "500+" },
              { label: "Rating", value: "4.9/5" },
              { label: "Success Rate", value: "95%" }
            ].map((stat, i) => (
              <div key={i}>
                <h4 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-2">{stat.value}</h4>
                <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default SolutionsPage;
