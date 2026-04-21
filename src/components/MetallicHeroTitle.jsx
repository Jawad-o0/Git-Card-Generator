import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const MetallicHeroTitle = ({ lines, leftX, rightX }) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } }
  };
  const letterVariants = {
    hidden: { opacity: 0, y: 52, rotateX: -38, filter: 'blur(7px)' },
    visible: {
      opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 85, damping: 13 }
    }
  };

  return (
    <div className="metallic-title-wrap" role="heading" aria-level="1">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ perspective: '900px' }}
        aria-hidden="true"
      >
        {lines.map((line, li) => (
          <div key={li} className="flex justify-center flex-wrap leading-[1.0]">
            {[...line].map((char, ci) => {
              const isLeftHalf = ci < line.length / 2;
              return (
                <motion.span
                  key={`${li}-${ci}`}
                  variants={letterVariants}
                  style={{ x: isLeftHalf ? leftX : rightX, display: 'inline-block' }}
                  className="metallic-letter"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MetallicHeroTitle;
