import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FiArrowRight, FiUsers, FiVideo, FiTarget, FiMessageSquare, FiTrendingUp, FiShield, FiCpu, FiGlobe, FiAward } from 'react-icons/fi';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import studentDashboardImage from '../assets/studentdashbaordimage.png';

// --- Components ---

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

const ParallaxText = ({ children, className }) => {
  return (
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
};

const GradientBlob = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob ${className}`} />
);

// --- Main Page ---

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-indigo-500/30">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GradientBlob className="w-[800px] h-[800px] bg-indigo-600/20 top-[-20%] left-[-10%]" />
          <GradientBlob className="w-[600px] h-[600px] bg-purple-600/20 bottom-[-10%] right-[-10%] animation-delay-2000" />
          <GradientBlob className="w-[500px] h-[500px] bg-blue-600/20 top-[40%] left-[30%] animation-delay-4000" />
        </div>

        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="z-10 text-center max-w-7xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="inline-block py-2 px-5 rounded-full bg-white/5 border border-white/10 text-sm font-medium tracking-wide text-indigo-300 backdrop-blur-md">
              New: AI-Powered Learning Paths
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter mb-8 leading-[0.9]">
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Mentorship.
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-indigo-300 via-purple-300 to-indigo-300">
              Reimagined.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The all-in-one platform for effortless learning. Connect with experts, track your growth, and achieve your dreams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/student/explore"
              className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Find a Mentor
              <span className="absolute inset-0 rounded-full ring-2 ring-white/50 ring-offset-2 ring-offset-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full text-white font-medium text-lg hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm"
            >
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{ perspective: 1000 }}
          className="relative mt-20 w-full max-w-[1400px] px-4 md:px-8"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a] group">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />

            <img
              src={studentDashboardImage}
              alt="Dashboard Interface"
              className="w-full h-auto object-cover opacity-90 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 md:pl-8 border-l-2 border-indigo-500/50">
            <ParallaxText className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Powerful tools.
            </ParallaxText>
            <ParallaxText className="text-4xl md:text-6xl font-bold text-gray-500">
              Beautifully simple.
            </ParallaxText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

            {/* Card 1: Large Feature */}
            <BentoItem className="md:col-span-2 min-h-[400px] flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                  <FiVideo size={24} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">Crystal Clear Video</h3>
                <p className="text-gray-400 text-lg max-w-md">HD video calls with built-in whiteboard and code sharing. It feels like you're in the same room.</p>
              </div>
              {/* Decorative Abstract UI Element */}
              <div className="mt-8 relative h-48 bg-white/5 rounded-t-xl border-t border-l border-r border-white/10 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                <div className="grid grid-cols-2 gap-4 p-4 opacity-50">
                  <div className="h-24 bg-gray-700/50 rounded-lg animate-pulse" />
                  <div className="h-24 bg-gray-700/50 rounded-lg animate-pulse delay-100" />
                </div>
              </div>
            </BentoItem>

            {/* Card 2: Tall Vertical */}
            <BentoItem className="md:row-span-2 flex flex-col justify-between bg-gradient-to-b from-gray-900 to-black">
              <div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                  <FiCpu size={24} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">AI Magic</h3>
                <p className="text-gray-400">Smart matching algorithms find the perfect mentor for your unique goals.</p>
              </div>
              <div className="mt-10 flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse" />
                  <div className="absolute inset-4 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                </div>
              </div>
            </BentoItem>

            {/* Card 3: Small Square */}
            <BentoItem className="md:col-span-1 min-h-[250px] flex flex-col">
              <FiTarget className="text-green-400 w-10 h-10 mb-auto" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Goal Tracking</h3>
                <p className="text-gray-400 text-sm">Visual progress bars.</p>
              </div>
            </BentoItem>

            {/* Card 4: Small Square */}
            <BentoItem className="md:col-span-1 min-h-[250px] flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <FiGlobe className="text-blue-400 w-10 h-10 mb-auto relative z-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-2">Global Network</h3>
                <p className="text-gray-400 text-sm">Mentors from 50+ countries.</p>
              </div>
            </BentoItem>

            {/* Card 5: Wide Bottom */}
            <BentoItem className="md:col-span-3 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-gray-900 via-gray-900 to-indigo-900/20">
              <div className="flex-1">
                <h3 className="text-3xl font-semibold mb-4">Enterprise-Grade Security</h3>
                <p className="text-gray-400 text-lg">Your data is encrypted and protected. Privacy first, always.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <FiShield className="text-green-400" />
                  <span className="text-sm">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <FiAward className="text-yellow-400" />
                  <span className="text-sm">GDPR Compliant</span>
                </div>
              </div>
            </BentoItem>

          </div>
        </div>
      </section>

      {/* Parallax Section - Large Text Reveal */}
      <section className="py-32 bg-white text-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ParallaxText className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
            Start your journey.
          </ParallaxText>
          <p className="text-xl md:text-3xl font-medium text-gray-500 max-w-3xl leading-relaxed">
            Join a community of ambitious learners and world-class experts. The skills you need are one conversation away.
          </p>

          <div className="mt-16 flex gap-6">
            <Link to="/register" className="px-10 py-5 bg-black text-white rounded-full font-bold text-xl hover:scale-105 transition-transform">
              Get Started Free
            </Link>
          </div>
        </div>
        {/* Background Texture */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-gray-100 rounded-full blur-3xl -z-0" />
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
