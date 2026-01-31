import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import { API_BASE_URL } from '../config/backendConfig';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';

const GradientBlob = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob ${className}`} />
);

const ContactCard = ({ icon: Icon, title, value, href, delay }) => (
  <motion.a
    href={href}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group cursor-pointer"
  >
    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-white font-semibold">{value}</p>
    </div>
  </motion.a>
);

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden">
      <LandingNavbar />

      <div className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GradientBlob className="w-[600px] h-[600px] bg-purple-600/20 top-0 left-0" />
          <GradientBlob className="w-[500px] h-[500px] bg-blue-600/20 bottom-0 right-0 animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">

          {/* Left Column: Info */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="inline-block py-2 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-indigo-400 backdrop-blur-md mb-6">
                Contact Us
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Let's start a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  conversation.
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Whether you're a student looking for guidance or a mentor ready to share expertise, we're here to help you connect.
              </p>
            </motion.div>

            <div className="space-y-4 max-w-md">
              <ContactCard
                icon={FiMail}
                title="Email Us"
                value="arshchouhan004@gmail.com"
                href="mailto:arshchouhan004@gmail.com"
                delay={0.2}
              />
              <ContactCard
                icon={FiPhone}
                title="Call Us"
                value="+91 8544758216"
                href="tel:+918544758216"
                delay={0.3}
              />
              <ContactCard
                icon={FiMapPin}
                title="Visit Us"
                value="Phagwara, India"
                href="#"
                delay={0.4}
              />
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:bg-black/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:bg-black/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Subject</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                    className="w-full pl-12 pr-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:bg-black/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="How can we help you?"
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:bg-black/30 resize-none"
                />
              </div>

              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl flex items-start gap-3 ${submitStatus === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}
                  >
                    {submitStatus === 'success' ? <FiCheckCircle className="mt-1 flex-shrink-0" /> : <FiAlertCircle className="mt-1 flex-shrink-0" />}
                    <p className="text-sm">
                      {submitStatus === 'success'
                        ? "Message sent successfully! We'll get back to you shortly."
                        : "Something went wrong. Please check your connection and try again."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message <FiSend className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default ContactUsPage;
