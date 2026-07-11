'use client';

import { motion } from 'framer-motion';

export default function SplitText({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 40,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {words.map((word, idx) => (
        <motion.span
          variants={child}
          style={{ display: 'inline-block', marginRight: '0.3em', paddingBottom: '0.1em' }}
          key={idx}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
