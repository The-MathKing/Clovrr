'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
      {/* Soft gradient mesh that breathes */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[30%] -left-[20%] w-[150%] h-[150%] opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)'
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-[30%] -right-[20%] w-[150%] h-[150%] opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(52,211,153,0.1) 0%, rgba(0,0,0,0) 70%)'
        }}
      />
    </div>
  );
}
