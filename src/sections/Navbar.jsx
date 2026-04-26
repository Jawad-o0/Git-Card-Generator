import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PrismEdgeButton from '../PrismEdgeButton';
const Navbar = ({ scrolled, scrollProgress, heroRef, toolRef, aboutRef }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };
  const navLinks = [
    ['Home', heroRef],
    ['Generator', toolRef],
    ['Philosophy', aboutRef]
  ];
  return (
    <header
      className="w-full flex justify-center px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ paddingTop: scrolled ? '10px' : '24px' }}
    >
      <nav
        className="flex items-center justify-between w-full max-w-5xl px-5 py-2.5 rounded-2xl transition-all duration-500 relative overflow-hidden"
        style={{
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: scrolled ? '1px solid var(--nav-border-scrolled)' : '1px solid var(--nav-border)',
          boxShadow: scrolled
            ? '0 8px 40px rgba(192,26,243,0.18), 0 2px 0 rgba(192,26,243,0.1) inset'
            : '0 4px 24px rgba(0,0,0,0.4)',
        }}
        aria-label="Main navigation"
      >
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%`, opacity: scrolled ? 1 : 0 }}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Scroll progress"
        />
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 flex items-center justify-center flex-shrink-0 mix-blend-screen"
            style={{ filter: 'drop-shadow(0 0 10px rgba(192,26,243,0.6))' }}
          >
            <img src="/logo1.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="nav-logo-glyph" style={{ lineHeight: 1.1 }} role="heading" aria-level="2">
              GIT-CARD
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '8.5px',
                letterSpacing: '0.3em',
                color: 'rgba(192,26,243,0.7)',
                fontWeight: 600,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              STUDIO
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(([label, ref]) => (
            <button
              key={label}
              onClick={() => scrollToSection(ref)}
              className="nav-link"
              aria-label={`Navigate to ${label} section`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{ color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection(toolRef)}
              aria-label="Launch application"
              className="relative min-w-[150px] group flex items-center justify-center gap-2 rounded-sm bg-[#050505] px-6 py-2.5 font-black uppercase tracking-[0.25em] text-purple-500 outline-none transition-all duration-300 disabled:opacity-50 overflow-hidden border border-purple-900/60 shadow-[0_0_15px_rgba(107,33,168,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:bg-[#0a0a0e] hover:text-purple-300 focus:ring-2 focus:ring-purple-500/50"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px' }}
            >
              <style>{`
                @keyframes shimmer-nav {
                  0% { transform: translateX(-150%) skewX(-20deg); }
                  100% { transform: translateX(250%) skewX(-20deg); }
                }
              `}</style>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-600/10 to-purple-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-purple-600/40 to-transparent pointer-events-none opacity-100" style={{ animation: 'shimmer-nav 2.5s infinite linear' }} />
              Enter Chamber
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="absolute top-full left-0 right-0 backdrop-blur-xl border-t py-4 px-5 flex flex-col gap-2"
            style={{
              background: 'var(--surface-overlay)',
              borderColor: 'var(--border-subtle)',
            }}
            role="menu"
          >
            {navLinks.map(([label, ref]) => (
              <button
                key={label}
                onClick={() => scrollToSection(ref)}
                className="nav-link w-full text-left py-3"
                role="menuitem"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
export default Navbar;
