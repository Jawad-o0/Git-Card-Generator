import { useState, useEffect } from 'react';

/**
 * Returns whether beams should be visible (hides when generator section is in view).
 */
export function useBeamsVisibility() {
  const [showBeams, setShowBeams] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const generatorSection = document.getElementById('tool');
      if (generatorSection) {
        const rect = generatorSection.getBoundingClientRect();
        setShowBeams(rect.top > 200);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return showBeams;
}
