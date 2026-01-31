import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiVideo, FiTarget, FiShield, FiCpu, FiGlobe, FiAward,
  FiUserPlus, FiSearch, FiBookOpen, FiStar, FiChevronDown, FiPlus, FiMinus,
  FiBriefcase, FiDollarSign, FiUsers
} from 'react-icons/fi';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import studentDashboardImage from '../assets/studentdashbaordimage.png';
import mentorDashboardImage from '../assets/MentorDahboard.png';

// --- Data ---
const testimonials = {
  student: [
    { name: "Sarah J.", role: "Software Engineer", quote: "Ment2Be helped me break into big tech. My mentor was incredible." },
    { name: "David L.", role: "Product Manager", quote: "The structure and goal tracking kept me accountable every week." },
    { name: "Emily R.", role: "UX Designer", quote: "I learned more in 3 months here than 2 years of tutorials." },
    { name: "Michael C.", role: "Data Scientist", quote: "Found a mentor who guided me through my entire career transition." },
    { name: "Jessica K.", role: "Frontend Dev", quote: "The mock interviews were a game changer for my confidence." },
    { name: "Alex P.", role: "Founder", quote: "Invaluable advice on scaling my startup from industry veterans." },
  ],
  mentor: [
    { name: "Dr. James W.", role: "Senior Architect", quote: "Sharing my knowledge has been incredibly rewarding. Also great side income." },
    { name: "Anita S.", role: "Ex-Google Lead", quote: "I love connecting with ambitious students. The platform makes scheduling so easy." },
    { name: "Robert M.", role: "CTO at TechCorp", quote: "Ment2Be takes care of all the admin work so I can focus on mentoring." },
    { name: "Lisa T.", role: "Design Director", quote: "It’s helped me refine my own leadership skills while helping others grow." },
    { name: "Kevin D.", role: "AI Researcher", quote: "The community of mentors here is top-notch. Great networking opportunity." },
    { name: "Priya G.", role: "Startup Advisor", quote: "Flexible hours mean I can mentor on weekends without disrupting my job." },
  ]
};

const faqData = {
  student: [
    { question: "How does the matching process work?", answer: "Our AI analyzes your goals, skills, and learning style to recommend the perfect mentors from our database of over 500+ experts." },
    { question: "Is there a free trial?", answer: "Yes! You can browse mentors and join community discussions for free. Premium mentorship sessions start with a 14-day money-back guarantee." },
    { question: "Can I be both a mentor and a mentee?", answer: "Absolutely. We believe everyone has something to teach and something to learn. You can easily switch between roles in your dashboard." },
    { question: "What happens if I'm not satisfied?", answer: "If a session doesn't meet your expectations, we offer a full refund and will help you find a better match." },
  ],
  mentor: [
    { question: "How do I get paid?", answer: "We process payments directly to your bank account every week. You keep 90% of your earnings; we take a small platform fee." },
    { question: "Can I set my own rates?", answer: "Yes, you have complete control over your hourly rate and session availability. You can change them at any time." },
    { question: "What acts as proof of expertise?", answer: "We verify your LinkedIn profile and may ask for certifications or work history during the onboarding process to ensure quality." },
    { question: "Is there a minimum commitment?", answer: "No. You can mentor as little as 1 hour a month or 20 hours a week. It's completely up to your schedule." },
  ]
};

const steps = {
  student: [
    { icon: FiUserPlus, title: "Create Profile", desc: "Tell us about your goals and what you want to learn." },
    { icon: FiSearch, title: "Get Matched", desc: "Our AI pairs you with mentors who fit your needs perfectly." },
    { icon: FiBookOpen, title: "Start Learning", desc: "Book 1-on-1 sessions and track your progress instantly." },
  ],
  mentor: [
    { icon: FiBriefcase, title: "Build Profile", desc: "Showcase your experience, skills, and teaching style." },
    { icon: FiDollarSign, title: "Set Availability", desc: "Choose your hours and set your own hourly rates." },
    { icon: FiUsers, title: "Start Mentoring", desc: "Receive booking requests and start guiding the next generation." },
  ]
};

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

const GradientBlob = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob ${className}`} />
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
    <AnimatePresence>
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

// --- Main Page ---

const LandingPage = () => {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('student');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-indigo-500/30">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
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
            {/* Persona Switcher */}
            <div className="inline-flex p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'student' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveTab('mentor')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'mentor' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                For Mentors
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter mb-8 leading-[0.9]">
                <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                  {activeTab === 'student' ? 'Mentorship.' : 'Leadership.'}
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-b from-indigo-300 via-purple-300 to-indigo-300">
                  {activeTab === 'student' ? 'Reimagined.' : 'Amplified.'}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                {activeTab === 'student'
                  ? "The all-in-one platform for effortless learning. Connect with experts, track your growth, and achieve your dreams."
                  : "Share your expertise, mentor the next generation, and earn on your schedule. Join a global network of leaders."
                }
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to={activeTab === 'student' ? "/student/explore" : "/register?role=mentor"}
                  className={`group relative px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 ${activeTab === 'student' ? 'bg-white text-black' : 'bg-indigo-600 text-white'}`}
                >
                  {activeTab === 'student' ? 'Find a Mentor' : 'Apply to Mentor'}
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
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{ perspective: 1000 }}
          className="relative mt-20 w-full max-w-[1400px] px-4 md:px-8"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a] group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
            <motion.img
              key={activeTab}
              src={activeTab === 'student' ? studentDashboardImage : mentorDashboardImage}
              alt="Dashboard Interface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">
              Your path to {activeTab === 'student' ? 'mastery' : 'impact'}.
            </h2>
            <p className="text-gray-400 text-lg">Three simple steps to start your journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {steps[activeTab].map((step, idx) => (
                <motion.div
                  key={`${activeTab}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full blur-2xl transition-colors ${activeTab === 'student' ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20' : 'bg-purple-500/10 group-hover:bg-purple-500/20'}`} />
                  <div className="relative">
                    <div className="w-14 h-14 bg-gray-900 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                      <step.icon className={`w-6 h-6 ${activeTab === 'student' ? 'text-indigo-400' : 'text-purple-400'}`} />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section (Common for now, but titled appropriately) */}
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
            {/* Bento Cards (Keeping these generic as platform features apply to both mostly) */}
            <BentoItem className="md:col-span-2 min-h-[400px] flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                  <FiVideo size={24} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">Crystal Clear Video</h3>
                <p className="text-gray-400 text-lg max-w-md">HD video calls with built-in whiteboard and code sharing. It feels like you're in the same room.</p>
              </div>
              <div className="mt-8 relative h-48 bg-white/5 rounded-t-xl border-t border-l border-r border-white/10 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                <div className="grid grid-cols-2 gap-4 p-4 opacity-50">
                  <div className="h-24 bg-gray-700/50 rounded-lg animate-pulse" />
                  <div className="h-24 bg-gray-700/50 rounded-lg animate-pulse delay-100" />
                </div>
              </div>
            </BentoItem>

            <BentoItem className="md:row-span-2 flex flex-col justify-between bg-gradient-to-b from-gray-900 to-black">
              <div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                  <FiCpu size={24} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">AI Magic</h3>
                <p className="text-gray-400">Smart matching algorithms find the perfect {activeTab === 'student' ? 'mentor' : 'match'} for your unique goals.</p>
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

            <BentoItem className="md:col-span-1 min-h-[250px] flex flex-col">
              <FiTarget className="text-green-400 w-10 h-10 mb-auto" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Goal Tracking</h3>
                <p className="text-gray-400 text-sm">Visual progress bars.</p>
              </div>
            </BentoItem>

            <BentoItem className="md:col-span-1 min-h-[250px] flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <FiGlobe className="text-blue-400 w-10 h-10 mb-auto relative z-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-2">Global Network</h3>
                <p className="text-gray-400 text-sm">Connect from anywhere.</p>
              </div>
            </BentoItem>

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

      {/* Testimonials Marquee Section */}
      <section className="py-24 overflow-hidden bg-white/[0.02]">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-indigo-400 tracking-widest uppercase mb-2">Community</p>
          <h2 className="text-3xl md:text-5xl font-bold">Loved by thousands.</h2>
        </div>

        <div className="relative w-full overflow-hidden mask-linear-fade">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />

          {/* Keyed animation to reset when tab changes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-6 w-max animate-scroll-left hover:[animation-play-state:paused]"
            >
              {[...testimonials[activeTab], ...testimonials[activeTab]].map((t, i) => (
                <div
                  key={`${activeTab}-${i}`}
                  className="w-[350px] p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 flex-shrink-0"
                >
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold">{t.name}</h4>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Questions?</h2>
            <p className="text-gray-400">We have answers.</p>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {faqData[activeTab].map((item, index) => (
                <AccordionItem
                  key={`${activeTab}-${index}`}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFaqIndex === index}
                  onClick={() => toggleFaq(index)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white text-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ParallaxText className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
            Start your {activeTab === 'student' ? 'journey' : 'legacy'}.
          </ParallaxText>
          <p className="text-xl md:text-3xl font-medium text-gray-500 max-w-3xl leading-relaxed">
            Join a community of ambitious learners and world-class experts. {activeTab === 'student' ? 'The skills you need are one conversation away.' : 'Your knowledge can change lives.'}
          </p>

          <div className="mt-16 flex gap-6">
            <Link to={activeTab === 'student' ? "/register" : "/register?role=mentor"} className="px-10 py-5 bg-black text-white rounded-full font-bold text-xl hover:scale-105 transition-transform">
              {activeTab === 'student' ? 'Get Started Free' : 'Start Mentoring'}
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-gray-100 rounded-full blur-3xl -z-0" />
      </section>

      <LandingFooter />

      {/* Inline Styles for marquee animation specifically */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
