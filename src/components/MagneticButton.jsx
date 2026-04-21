import React, { useRef } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

const MagneticButton = ({ children, className = "", onClick, disabled, as = "button", ...rest }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.3 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const maxDist = 20;
    const dist = Math.hypot(relX, relY);
    const clamped = Math.min(dist, maxDist);
    const angle = Math.atan2(relY, relX);
    x.set(Math.cos(angle) * clamped * 0.4);
    y.set(Math.sin(angle) * clamped * 0.4);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const Comp = as;

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      <Comp onClick={onClick} disabled={disabled} className="w-full h-full" aria-disabled={disabled} {...rest}>
        {children}
      </Comp>
    </motion.div>
  );
};

export default MagneticButton;
