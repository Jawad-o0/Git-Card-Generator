import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';
import VariableProximity from '../VariableProximity';
import PrismEdgeButton from '../PrismEdgeButton';
import '../VariableProximity.css';

const SplineShimmer = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
    <div className="relative w-48 h-48">
      {/* Pulsing rings */}
      <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute inset-4 rounded-full border border-purple-500/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
      <div className="absolute inset-8 rounded-full border border-purple-500/40 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.6s' }} />
      {/* Center glow */}
      <div className="absolute inset-12 rounded-full bg-purple-600/20 blur-xl animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    </div>
    <p className="text-[10px] uppercase tracking-[0.4em] text-purple-400/60 font-bold animate-pulse">
      Loading Vault...
    </p>
  </div>
);

const SplineFallback = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
    <div
      className="w-64 h-64 rounded-3xl flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(192,26,243,0.08), rgba(122,0,212,0.15), rgba(192,26,243,0.08))',
        border: '1px solid rgba(192,26,243,0.2)',
        boxShadow: '0 0 60px rgba(192,26,243,0.1)',
      }}
    >
      <div className="text-center space-y-3">
        <div className="text-4xl">🔮</div>
        <p className="text-xs uppercase tracking-[0.3em] text-purple-400/70 font-semibold">
          3D Scene Unavailable
        </p>
        <p className="text-[10px] text-gray-500 max-w-[180px]">
          The interactive vault couldn't load. Try refreshing the page.
        </p>
      </div>
    </div>
  </div>
);

const SplineGlobeContainer = ({ splineLoaded, splineError, setSplineLoaded, setSplineError }) => {
  const containerRef = useRef(null);
  const splineRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Block ALL wheel events from reaching Spline (stops zoom)
    const blockWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    // Block right-click drag (stops pan)
    const blockContext = (e) => e.preventDefault();

    el.addEventListener('wheel', blockWheel, { passive: false, capture: true });
    el.addEventListener('contextmenu', blockContext);

    return () => {
      el.removeEventListener('wheel', blockWheel, { capture: true });
      el.removeEventListener('contextmenu', blockContext);
    };
  }, []);

  const handleSplineLoad = (splineApp) => {
    splineRef.current = splineApp;

    // Lock camera zoom by setting min and max distance to the same value
    try {
      const camera = splineApp.findObjectByName('Camera');
      if (camera) {
        // Freeze zoom by clamping distance
        camera.controls.minDistance = camera.controls.maxDistance = camera.position.length();
        // Allow only orbit rotation, disable pan
        camera.controls.enablePan = false;
        camera.controls.enableZoom = false;
      }
    } catch (err) {
      // Camera control access not available, wheel block above still helps
      console.warn('Could not access Spline camera controls:', err);
    }

    setSplineLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className="spline-lock w-full h-full max-w-[700px] max-h-[700px] relative overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        touchAction: 'none', // blocks pinch zoom on mobile too
        userSelect: 'none',
      }}
      onMouseDown={e => { if (e.button !== 0) e.preventDefault(); }}
      onPointerDown={e => { if (e.button !== 0) e.preventDefault(); }}
    >
      {!splineLoaded && !splineError && <SplineShimmer />}
      {splineError && <SplineFallback />}

      {!splineError && (
        <Spline
          scene="https://prod.spline.design/wHiWOAQivw1IrHct/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
            opacity: splineLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            aspectRatio: '1/1',
            pointerEvents: 'auto',
          }}
          onLoad={handleSplineLoad}
          onError={() => setSplineError(true)}
        />
      )}
    </div>
  );
};

const VaultSection = React.forwardRef(({
  smoothSplineOpacity,
  smoothSplineY,
  scrollToTool,
}, ref) => {
  const vaultHeadingRef = useRef(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  return (
    <section ref={ref} className="relative w-full px-4 mt-16 py-16 z-[1]" aria-labelledby="vault-heading">
      <h2 id="vault-heading" className="sr-only">Interactive Vault Universe</h2>

      <motion.div
        className="relative mx-auto max-w-7xl rounded-[40px] border border-purple-900/30 bg-black/40 backdrop-blur-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden"
        style={{
          boxShadow: '0 0 80px rgba(192,26,243,0.12), inset 0 0 1px rgba(192,26,243,0.2)',
          opacity: smoothSplineOpacity,
          y: smoothSplineY,
          transformPerspective: 1200,
          transformOrigin: "bottom center"
        }}
      >
        <motion.div
          className="lg:w-2/5 space-y-8 text-left z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 mb-2">
              IMMERSIVE INTERFACE
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.1 }}>
              <div ref={vaultHeadingRef} style={{ position: 'relative' }}>
                <VariableProximity
                  label="Walk through the"
                  className="vp-subheading"
                  fromFontVariationSettings="'wght' 600"
                  toFontVariationSettings="'wght' 1000"
                  containerRef={vaultHeadingRef}
                  radius={120}
                  falloff="gaussian"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                    color: '#ffffff',
                    display: 'block',
                    marginBottom: '0.1em'
                  }}
                />
                <VariableProximity
                  label="Vault Universe."
                  className="vp-subheading"
                  fromFontVariationSettings="'wght' 600"
                  toFontVariationSettings="'wght' 1000"
                  containerRef={vaultHeadingRef}
                  radius={120}
                  falloff="gaussian"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                    color: 'rgba(109, 40, 217, 0.6)',
                    filter: 'drop-shadow(0 0 12px rgba(192,26,243,0.4))',
                    display: 'block'
                  }}
                />
              </div>
            </h2>
          </div>

          <p className="text-base text-gray-400 leading-relaxed font-medium">
            Step inside the holographic vault where prestige Git identities are forged.
            Every glow and refraction reacts to your presence in real-time.
          </p>

          <div className="pl-0 pr-1">
            <PrismEdgeButton
              onClick={scrollToTool}
              size="md"
              tone="violet"
              surface="glass"
              dot
              aria-label="Explore technology showcase"
            >
              View Infrastructure
            </PrismEdgeButton>
          </div>
        </motion.div>

        <div className="lg:w-3/5 h-[500px] md:h-[650px] w-full relative flex items-center justify-center">
          <SplineGlobeContainer
            splineLoaded={splineLoaded}
            splineError={splineError}
            setSplineLoaded={setSplineLoaded}
            setSplineError={setSplineError}
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10" aria-hidden="true" />

          <div className="absolute bottom-0 right-0 p-4 border-l border-t border-purple-900/30 rounded-tl-2xl bg-black/40 backdrop-blur-md" role="region" aria-label="Spline interface information">
            <p className="text-[9px] uppercase tracking-[0.3em] text-purple-400/60 font-bold">
              Interactive Vault • Rotate to Explore
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

VaultSection.displayName = 'VaultSection';
export default VaultSection;
