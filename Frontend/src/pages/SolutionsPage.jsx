import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiCheckCircle, FiUsers, FiTrendingUp, FiShield, FiStar, FiZap, FiActivity, FiCheck, FiX, FiPlus, FiMinus, FiCpu, FiGlobe, FiLayers, FiSmartphone, FiCalendar, FiVideo, FiCode } from 'react-icons/fi';
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

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-white/10">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
    >
      <span className="text-xl font-medium text-gray-200 group-hover:text-white transition-colors">{question}</span>
      <div className={`p-2 rounded-full bg-white/5 transition-colors group-hover:bg-white/10`}>
        {isOpen ? <FiMinus className="w-5 h-5 text-indigo-400" /> : <FiPlus className="w-5 h-5 text-gray-400" />}
      </div>
    </button>
    <AnimatePresence> {/* Note: Need to make sure AnimatePresence is imported or available. It is imported in LandingPage but let's check imports here. */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SolutionsPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const { hash } = useLocation();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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

      {/* Feature Deep Dive Section */}
      <section className="py-32 px-6 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-32">
          {[{
            title: "Simulated Code Execution",
            desc: "Don't just write code—watch it run. Our sandboxed execution environment calculates complexity in real-time.",
            icon: FiCode,
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000",
            color: "blue"
          }, {
            title: "Smart Scheduling",
            desc: "Seamlessly sync calendars. Automated time-zone detection makes global mentorship effortless.",
            icon: FiCalendar,
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000",
            color: "purple"
          }].map((feature, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
              <div className="flex-1 space-y-8">
                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/20 flex items-center justify-center text-${feature.color}-400`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold leading-tight">{feature.title}</h3>
                <p className="text-xl text-gray-400 leading-relaxed">{feature.desc}</p>
                <button className="text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
                  Learn more &rarr;
                </button>
              </div>
              <div className="flex-1 w-full perspective-1000">
                <motion.div
                  initial={{ opacity: 0, rotateY: i % 2 === 0 ? 15 : -15 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-[#0a0a0a]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-tr from-${feature.color}-500/10 to-transparent opacity-50`} />
                  <img src={feature.image} alt={feature.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Integration Section */}
      <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-indigo-400 font-medium tracking-wider uppercase mb-4 block">The Ecosystem</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Everything connected.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-20">
            A unified learning experience where your code, chats, and goals live in perfect harmony.
          </p>

          <div className="relative h-[600px] flex items-center justify-center">
            {/* Center Hub */}
            <div className="relative z-20 w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] border-4 border-black">
              <span className="text-3xl">🚀</span>
            </div>

            {/* Orbiting Planets */}
            {[
              { icon: FiMessageSquare, label: "Forum", x: 0, y: -200, delay: 0 },
              { icon: FiVideo, label: "Calls", x: 200, y: 0, delay: 1 },
              { icon: FiCheckCircle, label: "Tasks", x: 0, y: 200, delay: 2 },
              { icon: FiCode, label: "Code", x: -200, y: 0, delay: 3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="absolute flex flex-col items-center gap-4"
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
              >
                <div className="w-20 h-20 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center text-gray-300 shadow-xl z-20 hover:scale-110 hover:text-white hover:border-indigo-500/50 transition-all duration-300 cursor-pointer">
                  <item.icon size={30} />
                </div>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{item.label}</span>

                {/* Connection Line */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] -z-10 pointer-events-none overflow-visible">
                  <motion.line
                    x1="50%" y1="50%"
                    x2={200 - item.x + (item.x > 0 ? -40 : item.x < 0 ? 40 : 0)}
                    y2={200 - item.y + (item.y > 0 ? -40 : item.y < 0 ? 40 : 0)}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </svg>
              </motion.div>
            ))}

            {/* Orbit Circle */}
            <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full -z-10" />
            <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full -z-10 opacity-50" />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why choose us?</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-6 text-gray-400 font-medium w-1/3">Feature</th>
                  <th className="p-6 text-white font-bold text-xl w-1/3 text-center bg-white/5">CollabLearn</th>
                  <th className="p-6 text-gray-500 font-medium w-1/3 text-center">Others</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Mentorship Matching", us: true, them: false },
                  { feature: "Integrated IDE", us: true, them: false },
                  { feature: "Video Calls", us: true, them: true },
                  { feature: "Task Tracking", us: true, them: "Partial" },
                  { feature: "Community Forum", us: true, them: true },
                  { feature: "Mobile App", us: true, them: false },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-gray-300 font-medium">{row.feature}</td>
                    <td className="p-6 text-center bg-white/[0.02]">
                      {row.us === true ? <div className="inline-flex p-1 bg-green-500/20 rounded-full"><FiCheck className="text-green-500" /></div> : row.us}
                    </td>
                    <td className="p-6 text-center text-gray-600">
                      {row.them === true ? <FiCheck className="mx-auto" /> : row.them === false ? <FiX className="mx-auto" /> : row.them}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 bg-[#050505] relative cursor-default">
        <GradientBlob className="w-[600px] h-[600px] bg-purple-900/20 bottom-0 left-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Simple pricing.</h2>
            <p className="text-xl text-gray-400">Invest in your customized learning journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Explorer",
                price: "Free",
                desc: "Perfect for getting started.",
                features: ["Access to Community Forum", "Browse Mentors", "Basic Profile"],
                cta: "Join for Free",
                highlight: false
              },
              {
                name: "Pro Learner",
                price: "$19",
                period: "/mo",
                desc: "Accelerate your growth.",
                features: ["Unlimited Mentor Messaging", "Priority Booking", "Advanced Goal Tracking", "Code Sandbox Access"],
                cta: "Get Pro",
                highlight: true
              },
              {
                name: "Mentor Elite",
                price: "$0",
                period: "/mo",
                desc: "For leaders who share.",
                features: ["Verified Mentor Badge", "Low Platform Fees (5%)", "Analytics Dashboard", "Priority Support"],
                cta: "Apply Now",
                highlight: false
              }
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border flex flex-col ${plan.highlight ? 'bg-white/10 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-105 z-10' : 'bg-white/[0.03] border-white/10'}`}>
                {plan.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg">MOST POPULAR</div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-400 mb-8 border-b border-white/10 pb-8">{plan.desc}</p>
                <ul className="space-y-4 mb-auto">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-300">
                      <FiCheck className={`shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-gray-500'}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold mt-8 transition-transform hover:scale-105 ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-black hover:bg-gray-200'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
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

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Questions?</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: "Can I upgrade my plan later?", a: "Yes, you can upgrade or downgrade your plan at any time from your account settings." },
              { q: "How are mentors vetted?", a: "We have a rigorous application process including background checks, portfolio reviews, and interviews." },
              { q: "What methods of payment do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay." },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                question={item.q}
                answer={item.a}
                isOpen={openFaqIndex === i}
                onClick={() => toggleFaq(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default SolutionsPage;
