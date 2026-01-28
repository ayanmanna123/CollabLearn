import React from 'react';
import { motion } from 'framer-motion';

const SimpleBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Simple gradient overlay with breathing effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-blue-900/10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Three simple floating circles */}
      <motion.div
        className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '20%', left: '15%' }}
      />
      
      <motion.div
        className="absolute w-24 h-24 bg-indigo-500/15 rounded-full blur-xl"
        animate={{
          y: [0, 15, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{ top: '60%', right: '20%' }}
      />

      <motion.div
        className="absolute w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{ bottom: '30%', left: '70%' }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
};

export default SimpleBackground;
