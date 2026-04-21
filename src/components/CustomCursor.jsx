import React, { useEffect } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

const CustomCursor = () => {
  const primaryX = useMotionValue(-100);
  const primaryY = useMotionValue(-100);
  const springTrailX = useSpring(primaryX, { stiffness: 80, damping: 20 });
  const springTrailY = useSpring(primaryY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    let rafId;
    const handleMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        primaryX.set(e.clientX);
        primaryY.set(e.clientY);
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [primaryX, primaryY]);

  return (
    <div className="gpu-accelerate pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <motion.div
        style={{ x: primaryX, y: primaryY }}
        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] mix-blend-screen gpu-accelerate"
      />
      <motion.div
        style={{ x: springTrailX, y: springTrailY }}
        className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 gpu-accelerate"
      />
    </div>
  );
};

export default CustomCursor;
