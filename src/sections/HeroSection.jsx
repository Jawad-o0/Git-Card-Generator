import React from 'react';
import { motion } from 'framer-motion';
import MetallicHeroTitle from '../components/MetallicHeroTitle';
const HeroSection = React.forwardRef(({ smoothHeroLeftX, smoothHeroRightX }, ref) => {
  return (
    <section
      ref={ref}
      className="relative flex w-full flex-col items-center justify-center pt-32 pb-32 text-center min-h-[100vh] overflow-hidden z-[1]"
      aria-labelledby="hero-heading"
    >
      <h1 id="hero-heading" className="sr-only">Git-Card Studio - Prestige Engineering Identity Studio</h1>
      <div className="absolute bottom-6 left-8 text-left font-mono text-[10px] z-20" style={{ color: 'var(--text-muted)' }} aria-live="polite" aria-label="Application status">
        <p>v2.4.0-beta</p>
        <p>System Status: <span className="text-green-500 font-bold">Online</span></p>
      </div>
      <div className="relative z-10 px-6 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-7"
        >
          <span className="font-mono text-purple-300 tracking-[0.35em] text-xs md:text-[13px] font-bold uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
            PRESTIGE ENGINEERING IDENTITY STUDIO
          </span>
        </motion.div>
        <h1 className="text-[44px] sm:text-[64px] md:text-[86px] lg:text-[98px] tracking-tight select-none text-center">
          <MetallicHeroTitle
            lines={['GIT-CARD', 'STUDIO']}
            leftX={smoothHeroLeftX}
            rightX={smoothHeroRightX}
          />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.9, ease: 'easeOut' }}
          className="max-w-3xl mx-auto font-sans font-medium tracking-[0.22em] uppercase mt-6"
          style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.22em' }}
        >
          YOUR ENGINEERING LEGACY, DISTILLED INTO A HIGH-FIDELITY<br className="hidden md:block" /> VISUAL ARTIFACT.
        </motion.p>
      </div>
    </section>
  );
});
HeroSection.displayName = 'HeroSection';
export default HeroSection;
