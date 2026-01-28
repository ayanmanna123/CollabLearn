import React from 'react';
import { motion } from 'framer-motion';

const ParticleField = () => {
  const particles = [...Array(30)].map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    initialX: Math.random() * window.innerWidth,
    initialY: Math.random() * window.innerHeight,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-30"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.initialX,
            top: particle.initialY,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Glowing Orbs */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%)',
          top: '20%',
          left: '80%',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-60 h-60 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)',
          bottom: '10%',
          left: '10%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default ParticleField;
