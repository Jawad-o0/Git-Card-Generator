import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring
} from "framer-motion";
import { Sparkles, Code, Download, Github, Linkedin, Twitter } from "lucide-react";
import { ColorModeProvider } from "./lib/ColorModeContext";
import CustomCursor from "./components/CustomCursor";
import CanvasParticleField from "./components/CanvasParticleField";
import Announcer from "./components/Announcer";
import ProximityHeading from "./components/ProximityHeading";
import SectionDivider from "./components/SectionDivider";
import Beams from "./Beams";
import CurvedLoop from "./CurvedLoop";
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import VaultSection from "./sections/VaultSection";
import GeneratorSection from "./sections/GeneratorSection";
import { useGitHubData } from "./hooks/useGitHubData";
import { useMobileDetect } from "./hooks/useMobileDetect";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useBeamsVisibility } from "./hooks/useBeamsVisibility";
import { sectionInView } from "./lib/motionVariants";
import { themes } from "./lib/themes";
import { artOptions } from "./lib/artOptions";
import { patterns } from "./lib/patterns";
export default function App() {
  return (
    <ColorModeProvider>
      <AppContent />
    </ColorModeProvider>
  );
}
function AppContent() {
  const { scrolled, scrollProgress } = useScrollProgress(40);
  const isMobile = useMobileDetect(768);
  const showBeams = useBeamsVisibility();
  const { userData, personality, loading, error, fetchGitHubData } = useGitHubData();
  const [blurEffect, setBlurEffect] = useState("none");
  const [theme, setTheme] = useState("platinum");
  const [pattern, setPattern] = useState("mesh");
  const [bgStyle, setBgStyle] = useState("fade");
  const [colorShade, setColorShade] = useState(0);
  const [artSelection, setArtSelection] = useState("plain_color");
  const [customArtUrl, setCustomArtUrl] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const toolRef = useRef(null);
  const aboutRef = useRef(null);
  const cardScrollRef = useRef(null);
  const splineRef = useRef(null);
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroLeftX = useTransform(heroProgress, [0, 0.8], [0, -600]);
  const heroRightX = useTransform(heroProgress, [0, 0.8], [0, 600]);
  const smoothHeroLeftX = useSpring(heroLeftX, { stiffness: 60, damping: 20 });
  const smoothHeroRightX = useSpring(heroRightX, { stiffness: 60, damping: 20 });
  const { scrollYProgress: generatorProgress } = useScroll({
    target: toolRef,
    offset: ["start end", "start 25%"]
  });
  const generatorOpacity = useTransform(generatorProgress, [0, 1], [0, 1]);
  const generatorY = useTransform(generatorProgress, [0, 1], [150, 0]);
  const generatorScale = useTransform(generatorProgress, [0, 1], [0.93, 1]);
  const smoothGeneratorOpacity = useSpring(generatorOpacity, { stiffness: 60, damping: 20 });
  const smoothGeneratorY = useSpring(generatorY, { stiffness: 60, damping: 20 });
  const smoothGeneratorScale = useSpring(generatorScale, { stiffness: 60, damping: 20 });
  const { scrollYProgress: splineProgress } = useScroll({
    target: splineRef,
    offset: ["start end", "center center"]
  });
  const splineScale = useTransform(splineProgress, [0, 1], [0.8, 1]);
  const splineOpacity = useTransform(splineProgress, [0.1, 0.8], [0, 1]);
  const splineY = useTransform(splineProgress, [0, 1], [150, 0]);
  const splineRotateX = useTransform(splineProgress, [0, 1], [15, 0]);
  const smoothSplineScale = useSpring(splineScale, { stiffness: 60, damping: 20 });
  const smoothSplineOpacity = useSpring(splineOpacity, { stiffness: 60, damping: 20 });
  const smoothSplineY = useSpring(splineY, { stiffness: 60, damping: 20 });
  const smoothSplineRotateX = useSpring(splineRotateX, { stiffness: 60, damping: 20 });
  const { scrollYProgress: vaultExitProgress } = useScroll({
    target: splineRef,
    offset: ["end end", "end start"]
  });
  const beamsOpacity = useTransform(vaultExitProgress, [0, 0.5], [1, 0]);
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardScrollRef,
    offset: ["start end", "end start"]
  });
  const cardFoilY = useTransform(cardProgress, [0, 1], ["-12%", "12%"]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 }); 
  const foilX = useTransform(smoothX, [-40, 40], ["0%", "100%"]);
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;
    mouseX.set(x * 40);
    mouseY.set(y * 40);
  };
  const scrollToTool = () => {
    if (toolRef.current) {
      toolRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const currentTheme = themes[theme];
  const currentPattern = patterns[pattern];
  const selectedArt =
    artSelection === "custom" && customArtUrl.trim().length > 6
      ? { url: customArtUrl.trim(), name: "Custom Artwork" }
      : artOptions[artSelection];
  return (
    <>
      <Announcer message={announcement} type="polite" />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <style>{`
        @import "tailwindcss";
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&family=Michroma&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .gpu-accelerate {
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }
        .will-change-filter {
          will-change: filter, transform;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .sr-only-focusable:focus {
          position: static;
          width: auto;
          height: auto;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
        .beams-exit-fade {
          height: 150px;
          background: linear-gradient(
            to bottom, 
            rgba(10,10,15,0.3) 0%, 
            rgba(192,26,243,0.08) 40%, 
            rgba(10,10,15,0.95) 100%
          );
          pointer-events: none;
          position: relative;
          z-index: 5;
        }
        @media (max-width: 768px) {
          .beams-exit-fade {
            height: 80px;
          }
        }
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #c01af3;
          color: white;
          padding: 8px 16px;
          z-index: 100;
          transition: top 0.3s;
          font-weight: 600;
          font-size: 14px;
        }
        .skip-link:focus {
          top: 0;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3.5s ease-in-out infinite;
        }
        @keyframes search-scan {
          0%   { left: -20%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        .search-scan-line {
          position: absolute;
          top: 0;
          left: -20%;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(192,26,243,0.15), rgba(228,78,255,0.25), rgba(192,26,243,0.15), transparent);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
        }
        .search-wrapper:focus-within .search-scan-line {
          animation: search-scan 2.5s ease-in-out infinite;
        }
        @keyframes border-rotate {
          0%   { --border-angle: 0deg; }
          100% { --border-angle: 360deg; }
        }
        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .shimmer-border {
          --border-angle: 0deg;
          border: 1px solid transparent;
          background:
            linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)) padding-box,
            conic-gradient(from var(--border-angle), transparent 25%, #7a00d4 50%, #c01af3 55%, #e060ff 60%, transparent 75%) border-box;
          animation: border-rotate 4s linear infinite;
        }
        @keyframes aurora-pulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(192,26,243,0.0), 0 0 60px rgba(122,0,212,0.0), inset 0 0 1px rgba(192,26,243,0.15);
          }
          50% {
            box-shadow: 0 0 30px rgba(192,26,243,0.15), 0 0 80px rgba(122,0,212,0.08), inset 0 0 1px rgba(192,26,243,0.3);
          }
        }
        .aurora-container {
          animation: aurora-pulse 4s ease-in-out infinite;
        }
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-20px) scale(0.5); opacity: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #4a0070; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #c01af3; }
        .page-glow-1 {
          position: fixed;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 1200px;
          height: 800px;
          background: radial-gradient(ellipse at center, rgba(192,26,243,0.15) 0%, rgba(122,0,212,0.05) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .page-glow-2 {
          position: fixed;
          bottom: -10%;
          right: -10%;
          width: 900px;
          height: 900px;
          background: radial-gradient(ellipse at center, rgba(228,78,255,0.12) 0%, rgba(130,0,180,0.04) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .spline-lock canvas {
          pointer-events: auto;
        }
        body, html {
          font-family: 'Space Grotesk', system-ui, sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Orbitron', 'Space Grotesk', sans-serif;
          letter-spacing: -0.02em;
        }
        code, pre, .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes nav-border-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll-progress-glow {
          0%, 100% { box-shadow: 0 0 6px #c01af3; }
          50% { box-shadow: 0 0 18px #e060ff; }
        }
        .nav-link {
          position: relative;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          padding: 6px 14px;
          border-radius: 6px;
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #c01af3, transparent);
          border-radius: 999px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .nav-link:hover {
          color: rgba(255,255,255,0.95);
        }
        .nav-link:hover::after {
          transform: translateX(-50%) scaleX(1);
        }
        .nav-link.active {
          color: #e0aaff;
        }
        .nav-link.active::after {
          transform: translateX(-50%) scaleX(1);
          background: linear-gradient(90deg, transparent, #c01af3, transparent);
          animation: nav-border-pulse 2s ease infinite;
        }
        .nav-logo-glyph {
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, #ffffff 0%, #e0aaff 50%, #c01af3 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 8px rgba(192,26,243,0.6));
        }
        .nav-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 20px;
          font-family: 'Orbitron', sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff;
          border: none;
          border-radius: 999px;
          background: linear-gradient(120deg, #3d006e 0%, #7a00d4 40%, #c01af3 75%, #e060ff 100%);
          background-size: 200% 200%;
          box-shadow: 0 0 20px rgba(192,26,243,0.45), inset 0 0 0 1px rgba(255,255,255,0.15);
          cursor: pointer;
          transition: background-position 0.6s ease, box-shadow 0.3s ease, transform 0.15s ease;
          overflow: hidden;
        }
        .nav-cta::before {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 60%);
          pointer-events: none;
        }
        .nav-cta:hover {
          background-position: 100% 50%;
          box-shadow: 0 0 35px rgba(192,26,243,0.75), inset 0 0 0 1px rgba(255,255,255,0.25);
          transform: translateY(-1px);
        }
        .nav-cta:active { transform: scale(0.97); }
        .scroll-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #7a00d4, #c01af3, #e060ff);
          border-radius: 0 0 16px 16px;
          animation: scroll-progress-glow 2s ease infinite;
          transition: width 0.1s linear;
          max-width: 100%;
          overflow: hidden;
        }
        .hero-title-font { font-family: 'Orbitron', sans-serif; }
        @keyframes holo-shimmer {
          0% { background-position: 50% 0%; }
          50% { background-position: 50% 100%; }
          100% { background-position: 50% 0%; }
        }
        .metallic-letter {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e6e9f0 14%,
            #8b93a5 28%,
            #f8f9fc 42%,
            #4a505b 52%,
            #b1b8c4 68%,
            #ffffff 82%,
            #535a66 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.3);
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.4)) drop-shadow(0 15px 15px rgba(0,0,0,0.9));
          display: inline-block;
          font-size: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          animation: holo-shimmer 5s infinite cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .metallic-title-wrap {
          position: relative;
          overflow: hidden;
        }
        .section-divider {
          width: 100%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent 0%, rgba(192,26,243,0.3) 20%, rgba(228,78,255,0.7) 50%, rgba(192,26,243,0.3) 80%, transparent 100%);
          margin: 0 auto;
          max-width: 1100px;
          box-shadow: 0 0 15px rgba(192,26,243,0.5);
        }
      `}</style>
      <div
        ref={pageRef}
        className="relative min-h-screen text-white overflow-hidden cursor-none bg-black"
        onMouseMove={handleMouseMove}
      >
        <CustomCursor />
        <div className="page-glow-1" />
        <div className="page-glow-2" />
        <Navbar
          scrolled={scrolled}
          scrollProgress={scrollProgress}
          heroRef={heroRef}
          toolRef={toolRef}
          aboutRef={aboutRef}
        />
        <CanvasParticleField />
        <main id="main-content" className="relative flex flex-col items-center w-full min-h-screen" role="main" aria-label="Git-Card Studio Application">
          {showBeams && (
            <motion.div
              className="fixed inset-0 z-0 pointer-events-none"
              style={{ opacity: beamsOpacity }}
              aria-hidden="true"
            >
              <Beams
                beamWidth={isMobile ? 1.8 : 2.4}
                beamHeight={isMobile ? 8 : 15}
                beamNumber={isMobile ? 15 : 30}
                lightColor="#b21bd8"
                speed={isMobile ? 2 : 3}
                noiseIntensity={isMobile ? 1.5 : 2.75}
                scale={isMobile ? 0.15 : 0.2}
                rotation={25}
              />
            </motion.div>
          )}
          <HeroSection
            ref={heroRef}
            smoothHeroLeftX={smoothHeroLeftX}
            smoothHeroRightX={smoothHeroRightX}
          />
          <VaultSection
            ref={splineRef}
            smoothSplineOpacity={smoothSplineOpacity}
            smoothSplineY={smoothSplineY}
            scrollToTool={scrollToTool}
          />
          <SectionDivider className="mt-12" />
          <GeneratorSection
            ref={toolRef}
            userData={userData}
            personality={personality}
            loading={loading}
            error={error}
            fetchGitHubData={fetchGitHubData}
            theme={theme}
            setTheme={setTheme}
            artSelection={artSelection}
            setArtSelection={setArtSelection}
            customArtUrl={customArtUrl}
            setCustomArtUrl={setCustomArtUrl}
            bgStyle={bgStyle}
            setBgStyle={setBgStyle}
            colorShade={colorShade}
            setColorShade={setColorShade}
            blurEffect={blurEffect}
            setBlurEffect={setBlurEffect}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
            currentTheme={currentTheme}
            currentPattern={currentPattern}
            selectedArt={selectedArt}
            foilX={foilX}
            cardFoilY={cardFoilY}
            cardScrollRef={cardScrollRef}
            announcement={announcement}
            setAnnouncement={setAnnouncement}
            smoothGeneratorOpacity={smoothGeneratorOpacity}
            smoothGeneratorY={smoothGeneratorY}
            smoothGeneratorScale={smoothGeneratorScale}
          />
          <SectionDivider className="mt-16 z-[10] relative" />
          <div className="w-full relative z-10 overflow-hidden pt-12 pb-8">
            <CurvedLoop
              marqueeText="Git-Card Studio ✦ Forge Your Identity ✦ Engineering Legacy ✦ Developer Persona ✦ High Fidelity ✦ Prestige Identity ✦"
              speed={1}
              curveAmount={300}
              direction="left"
              interactive={true}
              className="curved-marquee-text"
            />
          </div>
          <SectionDivider />
          <motion.section
            ref={aboutRef}
            id="about"
            variants={sectionInView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="relative w-full space-y-12 px-4 mt-32"
            style={{ position: 'relative', zIndex: 10 }}
            aria-labelledby="about-heading"
          >
            <h2 id="about-heading" className="sr-only">Our Creative Doctrine</h2>
            <div className="space-y-4 text-center max-w-7xl mx-auto">
              <p className="text-md font-semibold uppercase tracking-[0.4em] text-purple-400">
                Our Creative Doctrine
              </p>
              <h3 className="text-5xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <ProximityHeading
                  text="We Brand Developers Like World-Class Product Launches."
                  variant="subheading"
                  as="div"
                  fontSize="clamp(2.2rem, 5vw, 3.75rem)"
                  radius={200}
                  falloff="exponential"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0d6ff 50%, #c01af3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                />
              </h3>
              <p
                className="max-w-3xl mx-auto text-center leading-[1.85] text-[1.05rem]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '0.01em',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(220,190,255,0.75) 55%, rgba(192,26,243,0.65) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 18px rgba(192,26,243,0.20))',
                }}
              >
                Git-Card Studio is where engineering heritage meets cinematic design.
                Our system transfigures GitHub metadata into high-fidelity visual artifacts,
                applying the same aesthetic rigor to your developer persona that global brands
                reserve for flagship product reveals. We don't just show stats;&nbsp;
                <span style={{ fontWeight: 700, WebkitTextFillColor: 'rgba(228,150,255,0.95)' }}>we frame your legacy.</span>
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
              {[
                {
                  tag: '01',
                  icon: <Sparkles className="h-5 w-5 text-purple-400" />,
                  title: 'Persona Intelligence',
                  body: 'Machine-assisted heuristics identify archetypes—Architect, Luminary, Polyglot—and pair them with narrative copy that earns trust instantly.'
                },
                {
                  tag: '02',
                  icon: <Code className="h-5 w-5 text-purple-400" />,
                  title: 'Design Engineered',
                  body: 'Every gradient, highlight, and blur is tuned for export clarity. Whether on retina displays, projectors, or social carousels, the card holds its shine.'
                },
                {
                  tag: '03',
                  icon: <Download className="h-5 w-5 text-purple-400" />,
                  title: 'Instant Deployment',
                  body: 'Export high-resolution PNGs, copy the executive summary, and broadcast your new persona across LinkedIn, X, Notion, or investor decks.'
                }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 44, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, delay: i * 0.13, ease: 'easeOut' }}
                  className="shimmer-border rounded-2xl backdrop-blur-2xl p-[1px]"
                  role="article"
                  aria-label={card.title}
                >
                  <div
                    className="rounded-2xl bg-black/80 p-6 h-full relative overflow-hidden space-y-3"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(192,26,243,0.05)' }}
                  >
                    <span
                      className="absolute top-4 right-5 font-mono text-[11px] font-bold tracking-[0.3em] uppercase"
                      style={{ color: 'rgba(192,26,243,0.35)' }}
                      aria-hidden="true"
                    >
                      {card.tag}
                    </span>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <span aria-hidden="true">{card.icon}</span>
                      <h4
                        className="text-sm font-bold uppercase tracking-[0.25em]"
                        style={{
                          fontFamily: "'Orbitron', sans-serif",
                          background: 'linear-gradient(135deg, #e0aaff 0%, #c01af3 60%, #7a00d4 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {card.title}
                      </h4>
                    </div>
                    <p
                      className="text-[13px] leading-[1.75] text-center"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: 'rgba(200,180,230,0.80)',
                        letterSpacing: '0.01em',
                      }}
                    >{card.body}</p>
                    <div
                      className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(192,26,243,0.08), transparent 70%)' }}
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
          <SectionDivider className="mt-12" />
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-8 w-full border-t border-purple-900/30 pt-6 pb-12 px-4 text-sm text-gray-300"
            role="contentinfo"
          >
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row max-w-7xl mx-auto">
              <p className="text-gray-300">
                © {new Date().getFullYear()} Git-Card Studio • Engineering Identity Systems.
              </p>
              <nav aria-label="Social media links" className="flex flex-col items-start sm:items-end gap-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400/70 font-semibold">
                  Developer Contact
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/Jawad-o0"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    aria-label="Visit GitHub page (opens in new tab)"
                  >
                    <Github className="h-5 w-5" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jawad-ali-677aa6346?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    aria-label="Visit LinkedIn page (opens in new tab)"
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </nav>
            </div>
          </motion.footer>
        </main>
      </div>
    </>
  );
}
