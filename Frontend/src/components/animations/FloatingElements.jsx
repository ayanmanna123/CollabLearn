import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large Floating Shapes */}
      <motion.div
        className="absolute w-72 h-72 opacity-20"
        initial={{ x: -100, y: 100, rotate: 0 }}
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '20%', left: '5%' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl transform rotate-45" />
      </motion.div>

      <motion.div
        className="absolute w-48 h-48 opacity-15"
        initial={{ x: 100, y: -50, rotate: 45 }}
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          rotate: [45, 225, 405],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        style={{ top: '50%', right: '10%' }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full" />
      </motion.div>

      {/* Medium Floating Elements */}
      <motion.div
        className="absolute w-32 h-32 opacity-25"
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{ bottom: '30%', left: '15%' }}
      >
        <div className="w-full h-full bg-gradient-to-bl from-emerald-500 to-teal-400 rounded-2xl transform rotate-12" />
      </motion.div>

      <motion.div
        className="absolute w-24 h-24 opacity-30"
        animate={{
          rotate: [0, -360],
          scale: [1, 0.8, 1],
          x: [0, -25, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{ top: '70%', right: '25%' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
      </motion.div>

      {/* Small Floating Dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-indigo-400 rounded-full opacity-40"
          animate={{
            y: [0, -80, 0],
            x: [0, Math.sin(i) * 40, 0],
            scale: [0.5, 1, 0.5],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
          style={{
            left: `${10 + (i * 5)}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}

      {/* Connecting Lines Animation */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M 100 200 Q 300 100 500 200 T 900 200"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M 200 400 Q 400 300 600 400 T 1000 400"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default FloatingElements;
