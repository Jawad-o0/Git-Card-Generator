import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Eye, EyeOff, Star, Users, Folder,
  Sliders, PaintBucket, ImageIcon, Copy, Loader2, Share2,
  Twitter, Database, CheckCircle, RefreshCw, ChevronDown,
  GitFork, Building2, Zap, GitPullRequest, GitCommit, Clock,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import IdentityCard from '../components/IdentityCard';
import ProximityHeading from '../components/ProximityHeading';
import { themes } from '../lib/themes';
import { artOptions } from '../lib/artOptions';
import { staggerContainer, fadeInUp } from '../lib/motionVariants';

// ─── Card capture / export helpers (unchanged) ────────────────────────────────

const CAPTURE_WIDTH = 480;

async function captureCard(cardEl) {
  const origWidth = cardEl.style.width;
  const origMinWidth = cardEl.style.minWidth;
  const origMaxWidth = cardEl.style.maxWidth;
  cardEl.style.width = `${CAPTURE_WIDTH}px`;
  cardEl.style.minWidth = `${CAPTURE_WIDTH}px`;
  cardEl.style.maxWidth = `${CAPTURE_WIDTH}px`;
  const origOverflow = cardEl.style.overflow;
  cardEl.style.overflow = 'visible';

  const children = cardEl.querySelectorAll(':scope > *');
  const savedChildStyles = [];
  children.forEach(child => {
    if (window.getComputedStyle(child).overflow === 'hidden') {
      savedChildStyles.push({ el: child, val: child.style.overflow });
      child.style.overflow = 'visible';
    }
  });

  await new Promise(r => requestAnimationFrame(r));

  try {
    const canvas = await html2canvas(cardEl, {
      scale: 3,
      width: CAPTURE_WIDTH,
      backgroundColor: null,
      allowTaint: false,
      useCORS: true,
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
    });

    const roundedCanvas = document.createElement('canvas');
    roundedCanvas.width = canvas.width;
    roundedCanvas.height = canvas.height;
    const ctx = roundedCanvas.getContext('2d');
    const radius = 24 * 3;

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(roundedCanvas.width - radius, 0);
    ctx.quadraticCurveTo(roundedCanvas.width, 0, roundedCanvas.width, radius);
    ctx.lineTo(roundedCanvas.width, roundedCanvas.height - radius);
    ctx.quadraticCurveTo(roundedCanvas.width, roundedCanvas.height, roundedCanvas.width - radius, roundedCanvas.height);
    ctx.lineTo(radius, roundedCanvas.height);
    ctx.quadraticCurveTo(0, roundedCanvas.height, 0, roundedCanvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(canvas, 0, 0);
    return roundedCanvas;
  } finally {
    cardEl.style.width = origWidth;
    cardEl.style.minWidth = origMinWidth;
    cardEl.style.maxWidth = origMaxWidth;
    cardEl.style.overflow = origOverflow;
    savedChildStyles.forEach(({ el, val }) => { el.style.overflow = val; });
  }
}

async function exportAsPng(cardEl, username) {
  const canvas = await captureCard(cardEl);
  const link = document.createElement('a');
  link.download = `gitcard-${username || 'user'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function copyCardToClipboard(cardEl) {
  const canvas = await captureCard(cardEl);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

async function shareCard(cardEl, username) {
  const canvas = await captureCard(cardEl);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], `gitcard-${username || 'user'}.png`, { type: 'image/png' });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: `${username}'s Git-Card`,
      text: `Check out ${username}'s GitHub identity card!`,
      files: [file],
    });
  } else {
    throw new Error('SHARE_UNSUPPORTED');
  }
}

async function shareToTwitter(username, cardEl, setAnnouncement) {
  try { await copyCardToClipboard(cardEl); setAnnouncement?.('Card copied — paste it into your tweet!'); } catch { }
  const text = encodeURIComponent(
    `Check out my GitHub identity card forged at Git-Card Studio!⚡\n\nhttps://github.com/${username}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
}

// ─── Small reusable sub-components ───────────────────────────────────────────

/** Collapsible section wrapper matching the app's dark aesthetic. */
function CollapsiblePanel({ title, icon: Icon, count, isOpen, onToggle, children, disabled }) {
  return (
    <div
      className="w-full rounded-2xl border border-purple-900/40 bg-black/70 backdrop-blur-2xl overflow-hidden"
      style={{ boxShadow: 'inset 0 0 1px rgba(192,26,243,0.1)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-purple-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-purple-400" aria-hidden="true" />
          <span
            className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-400"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {title}
          </span>
          {count != null && (
            <span className="ml-1 rounded-full bg-purple-900/50 border border-purple-700/40 px-2 py-0.5 text-[9px] font-bold text-purple-300 uppercase tracking-wider">
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-purple-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-purple-900/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Format "hours since event" into a human-friendly string. */
function timeAgo(hours) {
  if (hours == null) return 'Unknown';
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ─── Main component ───────────────────────────────────────────────────────────

const BLUR_LEVELS = ['none', 'sm', 'md', 'lg'];

const GeneratorSection = React.forwardRef(({
  userData,
  personality,
  events,
  orgs,
  pinnedRepos,
  loading,
  error,
  fetchGitHubData,
  clearCache,
  theme,
  setTheme,
  artSelection,
  setArtSelection,
  customArtUrl,
  setCustomArtUrl,
  bgStyle,
  setBgStyle,
  colorShade,
  setColorShade,
  customMessage,
  setCustomMessage,
  currentTheme,
  currentPattern,
  selectedArt,
  foilX,
  cardFoilY,
  announcement,
  setAnnouncement,
  smoothGeneratorOpacity,
  smoothGeneratorY,
  smoothGeneratorScale,
  cardScrollRef,
}, ref) => {

  const [usernameInput, setUsernameInput] = useState('');
  const [githubToken, setGithubToken] = useState(() => {
    try { return localStorage.getItem('githubToken') || ''; } catch { return ''; }
  });
  const [exportAction, setExportAction] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [blurEffect, setBlurEffect] = useState('none');

  // Track which expandable panels are open
  const [expandedSections, setExpandedSections] = useState({
    pinned: false,
    activity: false,
    orgs: false,
  });

  const cardRef = useRef(null);

  const toggleSection = useCallback((key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  useEffect(() => {
    try {
      if (githubToken) localStorage.setItem('githubToken', githubToken);
      else localStorage.removeItem('githubToken');
    } catch { }
  }, [githubToken]);

  const blurIndex = BLUR_LEVELS.includes(blurEffect)
    ? BLUR_LEVELS.indexOf(blurEffect)
    : 0;

  const handleBlurSlider = useCallback(
    e => setBlurEffect(BLUR_LEVELS[parseInt(e.target.value, 10)]),
    [setBlurEffect]
  );

  const handleExport = useCallback(async (type) => {
    if (!cardRef.current || exportAction) return;
    setExportAction(type);
    setAnnouncement?.(`${type} export started...`);
    setIsCapturing(true);
    await new Promise(r => setTimeout(r, 200));
    try {
      switch (type) {
        case 'png':
          await exportAsPng(cardRef.current, userData?.login);
          setAnnouncement?.('PNG downloaded successfully');
          break;
        case 'clipboard':
          await copyCardToClipboard(cardRef.current);
          setCopySuccess('Copied!');
          setAnnouncement?.('Card copied to clipboard');
          setTimeout(() => setCopySuccess(''), 2000);
          break;
        case 'share':
          try {
            await shareCard(cardRef.current, userData?.login);
            setAnnouncement?.('Card shared successfully');
          } catch (err) {
            if (err.message === 'SHARE_UNSUPPORTED') {
              await copyCardToClipboard(cardRef.current);
              setCopySuccess('Copied!');
              setAnnouncement?.('Sharing not supported — copied to clipboard instead');
              setTimeout(() => setCopySuccess(''), 2000);
            } else throw err;
          }
          break;
        case 'twitter':
          await shareToTwitter(userData?.login, cardRef.current, setAnnouncement);
          setAnnouncement?.('Opened Twitter — card image copied, paste into your tweet!');
          break;
        default: break;
      }
    } catch (err) {
      setAnnouncement?.(`Export failed: ${err.message}`);
      console.error('Export error:', err);
    } finally {
      setIsCapturing(false);
      setExportAction('');
    }
  }, [cardRef, exportAction, userData?.login, setAnnouncement]);

  const handleCopyUrl = useCallback(async () => {
    if (!userData?.html_url) return;
    try {
      await navigator.clipboard.writeText(userData.html_url);
      setCopySuccess('Copied!');
      setAnnouncement?.('Profile URL copied to clipboard');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setAnnouncement?.('Failed to copy URL');
      console.error(err);
    }
  }, [userData?.html_url, setAnnouncement]);

  /** Force-refresh the current user's data, bypassing cache. */
  const handleRefresh = useCallback(() => {
    if (!userData?.login || loading) return;
    clearCache(userData.login);
    fetchGitHubData(userData.login, setAnnouncement, githubToken);
  }, [userData?.login, loading, clearCache, fetchGitHubData, setAnnouncement, githubToken]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
    <motion.section
      ref={ref}
      id="tool"
      className="w-full space-y-24 scroll-mt-32 mt-32 px-4"
      style={{
        position: 'relative',
        zIndex: 10,
        opacity: smoothGeneratorOpacity,
        y: smoothGeneratorY,
        scale: smoothGeneratorScale,
      }}
      aria-labelledby="generator-heading"
    >
      <h2 id="generator-heading" className="sr-only">Git Card Generator</h2>

      <motion.div variants={staggerContainer} className="w-full max-w-7xl mx-auto flex flex-col gap-10">

        {/* ── Hero text ── */}
        <motion.div variants={fadeInUp} className="w-full text-center space-y-4">
          <div>
            <p className="text-base font-semibold uppercase tracking-[0.4em] text-purple-400">
              The Fabrication Lab
            </p>
            <h3 className="text-5xl md:text-6xl font-black tracking-tight mt-2">
              <ProximityHeading
                text="Forge a signature tech identity with precision."
                variant="subheading"
                as="span"
                fontSize="clamp(2.2rem, 5vw, 3.75rem)"
                radius={200}
                falloff="exponential"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #c8c8d8 40%, #8b93a5 70%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              />
            </h3>
          </div>

          <div className="grid text-center gap-5 md:grid-cols-2">
            {[
              {
                title: 'How It Works',
                body: 'Feed us a GitHub username. Our engine dissects repositories, stars, languages, follower graphs, and timelines, then composes a persona blueprint that speaks to your strengths.',
              },
              {
                title: 'Why It Matters',
                body: 'Hiring managers, founders, and collaborators skim. Show them a high-impact artifact that merges data, design, and narrative—before they even click your profile.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
                className="shimmer-border rounded-2xl backdrop-blur-2xl p-[1px]"
              >
                <div
                  className="rounded-2xl bg-black/80 p-6 h-full relative overflow-hidden"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(192,26,243,0.05)' }}
                >
                  <div className="flex flex-col items-center gap-2 text-center mb-3">
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
                    className="text-[13.5px] leading-[1.75] text-center"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(193, 176, 233, 0.82)', letterSpacing: '0.01em' }}
                  >
                    {card.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Search form ── */}
        <motion.div variants={fadeInUp} className="w-full max-w-2xl mx-auto">
          <form
            onSubmit={e => { e.preventDefault(); fetchGitHubData(usernameInput, setAnnouncement, githubToken); }}
            className="relative group w-full search-wrapper"
            role="search"
            aria-label="Search GitHub users"
          >
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-purple-900/40 via-fuchsia-500/30 to-purple-900/40 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-60 group-focus-within:opacity-80 animate-gradient gpu-accelerate" aria-hidden="true" />
            <div
              className="relative rounded-2xl backdrop-blur-2xl px-5 py-4 aurora-container overflow-hidden"
              style={{ background: 'linear-gradient(145deg, rgba(10,0,20,0.85), rgba(25,5,45,0.75))', border: '1px solid rgba(192,26,243,0.20)' }}
            >
              <div className="search-scan-line rounded-2xl" aria-hidden="true" />
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#c01af3', boxShadow: '0 0 8px #c01af3' }} aria-hidden="true" />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(90deg, rgba(192,26,243,0.7), rgba(228,78,255,0.9))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Identity Lookup Protocol
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgba(192,26,243,0.6)' }} aria-hidden="true" />
                  <label htmlFor="github-username" className="sr-only">GitHub Username</label>
                  <input
                    id="github-username"
                    type="text"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="Enter GitHub Handle..."
                    aria-required="true"
                    autoComplete="username"
                    className="w-full rounded-xl bg-white/[0.04] px-11 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:tracking-[0.1em]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", border: '1px solid rgba(192,26,243,0.15)', letterSpacing: '0.02em', caretColor: '#c01af3' }}
                    onFocus={e => { e.target.style.border = '1px solid rgba(192,26,243,0.45)'; e.target.style.boxShadow = '0 0 25px rgba(192,26,243,0.12), inset 0 0 15px rgba(192,26,243,0.04)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                    onBlur={e => { e.target.style.border = '1px solid rgba(192,26,243,0.15)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  aria-label={loading ? 'Forging identity, please wait...' : 'Forge identity card'}
                  className="relative min-w-[150px] group flex items-center justify-center gap-2 rounded-sm bg-[#050505] px-6 py-3.5 font-black uppercase tracking-[0.25em] text-purple-500 outline-none transition-all duration-300 disabled:opacity-50 overflow-hidden border border-purple-900/60 shadow-[0_0_15px_rgba(107,33,168,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:bg-[#0a0a0e] hover:text-purple-300 focus:ring-2 focus:ring-purple-500/50"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <style>{`@keyframes button-shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(250%) skewX(-20deg); } }`}</style>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-600/10 to-purple-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-purple-600/40 to-transparent pointer-events-none opacity-100" style={{ animation: 'button-shimmer 2.5s infinite linear' }} />
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : 'Execute'}
                </button>
              </div>
            </div>

            {/* ── Token input ── */}
            <div className="mt-8 w-full max-w-2xl mx-auto rounded-none border border-purple-900/60 bg-[#050505] p-5 shadow-[0_0_40px_rgba(107,33,168,0.2)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-purple-800/10 to-transparent skew-x-12 translate-x-8 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0a0a0a] border border-purple-900/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-sm">
                    <Database className="w-4 h-4 text-purple-500" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.25em] text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>API Override Protocol</h4>
                    <p className="text-[10px] text-purple-500/80 mt-0.5 uppercase tracking-[0.15em] font-semibold">Standard: 30 Scans / Hour</p>
                  </div>
                </div>
                <div className="text-[11px] text-gray-300 sm:text-right font-medium leading-relaxed max-w-[280px]">
                  You already have <span className="text-white font-bold">30 free high-fidelity scans per hour</span>. Only power users who need to process <span className="text-purple-400 font-bold">50+ profiles in bulk</span> need to authenticate their github API token below to unlock 5,000 req/hr.
                </div>
              </div>
              <div className="relative flex items-center w-full mt-2">
                <input
                  id="github-token"
                  type="password"
                  value={githubToken}
                  onChange={e => setGithubToken(e.target.value)}
                  placeholder="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full rounded-sm bg-[#080808] border border-purple-900/40 px-4 py-3.5 text-[12px] text-purple-300 outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-purple-500 focus:bg-[#0a0a0e] focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] font-mono"
                  style={{ letterSpacing: '0.1em' }}
                />
                {githubToken && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] text-purple-500 uppercase tracking-[0.25em] font-black" style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 10px rgba(168,85,247,0.5)' }}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Authorized
                  </div>
                )}
              </div>
            </div>
          </form>

          {error && (
            <p className="text-red-400 text-sm mt-2 text-center" role="alert" aria-live="assertive">
              {error}
            </p>
          )}
        </motion.div>

        {/* ── Persona warning ── */}
        {userData && !personality && (
          <p className="text-center text-yellow-400 text-sm" role="alert">
            Could not compute persona — try a different username.
          </p>
        )}

        {/* ── Main two-column layout ── */}
        {userData && personality && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start"
          >

            {/* ── LEFT: Customisation panel (unchanged) ── */}
            <div className="space-y-6">
              <div
                className="rounded-2xl border border-purple-900/40 bg-black/70 p-6 backdrop-blur-2xl space-y-6"
                style={{ boxShadow: '0 0 40px rgba(192,26,243,0.05), inset 0 0 1px rgba(192,26,243,0.12)' }}
                role="group"
                aria-label="Card customization options"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-4">
                  <div className="flex items-center gap-3">
                    <Sliders className="h-5 w-5 text-purple-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-purple-300/70">Configuration Parameters</p>
                      <p className="text-sm font-semibold text-white">Calibrate aesthetic output</p>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-purple-300/70">
                    Blur: <span className="text-purple-300">{blurEffect.toUpperCase()}</span>
                  </div>
                </div>

                {/* Theme & bg style */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-300">Chromium Spectrum</p>
                    <div className="flex bg-black/60 rounded-lg p-1 border border-purple-900/40" role="radiogroup" aria-label="Background style selection">
                      {['solid', 'fade'].map((s, i) => (
                        <button
                          key={s}
                          onClick={() => setBgStyle(s)}
                          className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-md transition ${bgStyle === s ? 'bg-purple-700/50 text-white' : 'text-gray-500 hover:text-purple-300'}`}
                          role="radio"
                          aria-checked={bgStyle === s}
                        >
                          {i === 0 ? 'Static Alloy' : 'Gradient Flux'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3" role="radiogroup" aria-label="Theme color selection">
                    {Object.entries(themes).map(([key, t]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTheme(key)}
                        className={`relative flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center text-xs transition ${theme === key ? 'border-purple-400/60 bg-purple-900/20 shadow-[0_0_20px_rgba(192,26,243,0.3)]' : 'border-purple-900/30 bg-black/40 hover:border-purple-700/50'}`}
                        role="radio"
                        aria-checked={theme === key}
                        aria-label={`Select ${t.name} theme`}
                      >
                        <span className="h-6 w-6 rounded-full border border-white/40 flex-shrink-0" style={{ background: `radial-gradient(circle at top, ${t.sheen}, ${t.primary}, ${t.secondary})` }} aria-hidden="true" />
                        <span className="font-medium text-gray-100 text-[10px] leading-tight">{t.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                      <span>Low Luster</span>
                      <span className="text-white font-semibold">Reflective Index</span>
                      <span>High Luster</span>
                    </div>
                    <label htmlFor="shade-slider" className="sr-only">Adjust brightness shade</label>
                    <input id="shade-slider" type="range" min="-50" max="50" value={colorShade} onChange={e => setColorShade(Number(e.target.value))} className="w-full accent-white" />
                  </div>
                </div>

                {/* Art overlay */}
                <div className="space-y-5 border-t border-purple-900/40 pt-6">
                  <div className="flex items-center gap-2">
                    <PaintBucket className="w-4 h-4 text-purple-400" aria-hidden="true" />
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-300">Aesthetic Overlay</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Artwork selection">
                    {Object.entries(artOptions).map(([key, art]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setArtSelection(key)}
                        className={`relative overflow-hidden rounded-xl border p-3 text-left transition flex items-center gap-3 ${artSelection === key ? 'border-purple-400/60 bg-purple-900/20 shadow-[0_0_20px_rgba(192,26,243,0.3)]' : 'border-purple-900/30 bg-black/40 hover:border-purple-700/50'}`}
                        role="radio"
                        aria-checked={artSelection === key}
                        aria-label={`Select ${art.name} artwork`}
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/30 flex-shrink-0">
                          {art.url
                            ? <img src={art.url} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" aria-hidden="true" />
                            : <div className="flex h-full w-full items-center justify-center bg-black/30"><ImageIcon className="h-5 w-5 text-white/70" aria-hidden="true" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-white truncate">{art.name}</p>
                          <p className="mt-0.5 text-[10px] text-gray-300 line-clamp-2">{art.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {artSelection === 'custom' && (
                    <div className="space-y-2">
                      <label htmlFor="custom-art-url" className="text-[10px] uppercase tracking-[0.25em] text-gray-300">Paste Custom Artwork URL</label>
                      <input id="custom-art-url" type="url" value={customArtUrl} onChange={e => setCustomArtUrl(e.target.value)} placeholder="Direct Target URL" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-xs text-white placeholder-gray-400 outline-none transition focus:border-white/40" />
                    </div>
                  )}
                </div>

                {/* Tagline + blur */}
                <div className="space-y-5 border-t border-purple-900/40 pt-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-300">Manifesto</p>
                    <label htmlFor="tagline-input" className="sr-only">Custom tagline message</label>
                    <input id="tagline-input" type="text" value={customMessage} onChange={e => setCustomMessage(e.target.value)} maxLength={60} placeholder="Building AI platforms • Available for advisory roles" className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white placeholder-gray-400 outline-none transition focus:border-white/30" />
                    <p className="text-[10px] text-gray-400 text-right" aria-live="polite">{customMessage.length}/60 characters</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-300">Substrate Refraction</p>
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-gray-500" aria-hidden="true" />
                      <label htmlFor="blur-slider" className="sr-only">Adjust blur intensity</label>
                      <input id="blur-slider" type="range" min="0" max="3" step="1" value={blurIndex} onChange={handleBlurSlider} className="w-full accent-white" />
                      <EyeOff className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Card + export + data panels ── */}
            <div ref={cardScrollRef} className="flex flex-col items-center gap-6">

              {/* Card preview */}
              <div className="relative w-full">
                <IdentityCard
                  ref={cardRef}
                  userData={userData}
                  personality={personality}
                  currentTheme={currentTheme}
                  currentPattern={currentPattern}
                  selectedArt={selectedArt}
                  blurEffect={blurEffect}
                  bgStyle={bgStyle}
                  colorShade={colorShade}
                  foilX={foilX}
                  cardFoilY={cardFoilY}
                  tagline={customMessage}
                />
                {exportAction && exportAction !== 'twitter' && (
                  <div className="absolute inset-0 rounded-3xl bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-3">
                    <Loader2 className="w-9 h-9 text-purple-400 animate-spin" aria-hidden="true" />
                    <p className="text-[11px] uppercase tracking-[0.3em] text-purple-300/80">
                      {exportAction === 'png' && 'Rendering PNG…'}
                      {exportAction === 'clipboard' && 'Copying to clipboard…'}
                      {exportAction === 'share' && 'Preparing share…'}
                    </p>
                  </div>
                )}

              </div>

              {/* Export buttons */}
              <div className="grid w-full grid-cols-2 gap-3">
                {[
                  { type: 'png', label: 'PNG', icon: <Download className="h-3.5 w-3.5 text-purple-500 group-hover:text-purple-400 transition-colors" /> },
                  { type: 'clipboard', label: copySuccess || 'Clipboard', icon: <Copy className="h-3.5 w-3.5 text-purple-500 group-hover:text-purple-400 transition-colors" /> },
                  { type: 'share', label: 'Share', icon: <Share2 className="h-3.5 w-3.5 text-purple-500 group-hover:text-purple-400 transition-colors" /> },
                  { type: 'twitter', label: 'Post on X', icon: <Twitter className="h-3.5 w-3.5 text-purple-500 group-hover:text-purple-400 transition-colors" /> },
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleExport(type)}
                    disabled={!!exportAction}
                    aria-busy={exportAction === type}
                    className="relative w-full group flex items-center justify-center gap-2 rounded-sm bg-[#080808] px-4 py-3 font-bold uppercase tracking-[0.2em] text-gray-300 text-[10px] outline-none transition-all duration-300 disabled:opacity-50 overflow-hidden border border-purple-900/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:border-purple-500/50 hover:bg-[#0c0c10] hover:text-white"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-600/10 to-purple-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {exportAction === type
                      ? <Loader2 className="h-3.5 w-3.5 text-purple-400 animate-spin" />
                      : <>{icon}{label}</>
                    }
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyUrl}
                aria-label="Copy GitHub profile URL to clipboard"
                className="relative w-full group flex items-center justify-center gap-2 rounded-sm bg-[#050505] px-6 py-3.5 font-black uppercase tracking-[0.25em] text-purple-500 outline-none transition-all duration-300 overflow-hidden border border-purple-900/60 shadow-[0_0_15px_rgba(107,33,168,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:bg-[#0a0a0e] hover:text-purple-300 focus:ring-2 focus:ring-purple-500/50 mt-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-600/10 to-purple-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-purple-600/40 to-transparent pointer-events-none" style={{ animation: 'button-shimmer 2.5s infinite linear' }} />
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copySuccess || 'Clone Registry Link'}
              </button>

              {customMessage && (
                <div className="rounded-xl border border-white/25 bg-black/40 backdrop-blur-md px-4 py-3 text-center text-xs font-semibold text-white shadow-lg w-full max-w-lg" role="note" aria-live="polite">
                  ✨ {customMessage} ✨
                </div>
              )}

              {personality.dataAccuracy === 'repo-count' && (
                <div className="w-full rounded-xl border border-yellow-900/40 bg-yellow-950/20 px-4 py-2.5 text-center text-[10px] text-yellow-400/80 backdrop-blur-md">
                  ⚠️ Language stats use repo-count heuristic. Byte-level data may differ.
                </div>
              )}

              {/* ── Heuristic Analysis panel ── */}
              <div
                className="w-full rounded-2xl border border-purple-900/40 bg-black/70 p-5 backdrop-blur-2xl"
                style={{ boxShadow: 'inset 0 0 1px rgba(192,26,243,0.1)' }}
                role="group"
                aria-label="Persona snapshot summary"
              >
                {/* Header with refresh button */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-400">
                    Heuristic Analysis
                  </p>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    aria-label="Refresh profile data"
                    title="Force-refresh this profile"
                    className="text-purple-500/60 hover:text-purple-400 transition-colors disabled:opacity-30"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2" aria-label={`Achievement badges: ${personality.badges.map(b => b.title).join(', ')}`}>
                  {personality.badges.map((badge, i) => (
                    <div key={i} className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-1 text-[11px] font-semibold border border-white/20" role="note">
                      <span aria-hidden="true">{badge.emoji}</span>
                      <span>{badge.title}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[11px] text-gray-200" aria-label="Key statistics">
                  <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                    <Users className="mx-auto mb-2 h-4 w-4 text-white/80" aria-hidden="true" />
                    <div className="text-xl font-black text-white">{userData.followers.toLocaleString()}</div>
                    <div className="tracking-[0.2em] uppercase text-[9px]">Allies</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                    <Folder className="mx-auto mb-2 h-4 w-4 text-white/80" aria-hidden="true" />
                    <div className="text-xl font-black text-white">{userData.public_repos}</div>
                    <div className="tracking-[0.2em] uppercase text-[9px]">Repositories</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                    <Star className="mx-auto mb-2 h-4 w-4 text-white/80" aria-hidden="true" />
                    <div className="text-xl font-black text-white">{personality.totalStars.toLocaleString()}</div>
                    <div className="tracking-[0.2em] uppercase text-[9px]">Stars</div>
                  </div>
                </div>
              </div>

              {/* ── EXPANDABLE: Pinned Repositories ── */}
              <CollapsiblePanel
                title="Pinned Repositories"
                icon={Star}
                count={pinnedRepos?.length ?? null}
                isOpen={expandedSections.pinned}
                onToggle={() => toggleSection('pinned')}
                disabled={false}
              >
                {pinnedRepos && pinnedRepos.length > 0 ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pinnedRepos.map((repo, i) => (
                      <a
                        key={i}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl border border-purple-900/30 bg-white/[0.03] p-3 transition hover:border-purple-500/50 hover:bg-purple-900/10"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[12px] font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {repo.name}
                          </span>
                          {repo.primaryLanguage && (
                            <span className="shrink-0 text-[9px] uppercase tracking-wider text-purple-400 font-semibold">
                              {repo.primaryLanguage.name}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 mb-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500/70" />
                            {repo.stargazerCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            {repo.forkCount.toLocaleString()}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-gray-500 text-center">
                    {githubToken
                      ? 'No pinned repositories found.'
                      : 'Provide a GitHub token to load pinned repositories.'}
                  </p>
                )}
              </CollapsiblePanel>

              {/* ── EXPANDABLE: Activity Pulse ── */}
              <CollapsiblePanel
                title="Activity Pulse"
                icon={Zap}
                count={personality.activityProfile ? `${personality.activityProfile.totalEvents} events` : null}
                isOpen={expandedSections.activity}
                onToggle={() => toggleSection('activity')}
                disabled={false}
              >
                {personality.activityProfile ? (() => {
                  const ap = personality.activityProfile;
                  return (
                    <div className="mt-3 space-y-4">
                      {/* Last active */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          Last active
                        </span>
                        <span className="text-white font-semibold">
                          {timeAgo(ap.hoursSinceLastEvent)}
                        </span>
                      </div>

                      {/* Commits + most active day */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/[0.04] border border-purple-900/30 p-3 text-center">
                          <GitCommit className="mx-auto mb-1 w-4 h-4 text-purple-400" />
                          <div className="text-lg font-black text-white">{ap.totalCommits}</div>
                          <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Commits</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] border border-purple-900/30 p-3 text-center">
                          <Zap className="mx-auto mb-1 w-4 h-4 text-purple-400" />
                          <div className="text-lg font-black text-white">{ap.mostActiveDay}</div>
                          <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Peak Day</div>
                        </div>
                      </div>

                      {/* Activity breakdown bars */}
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-2">30-Day Event Mix</p>
                        {[
                          { label: 'Pushes', pct: ap.pushPct, count: ap.pushCount, color: '#a855f7' },
                          { label: 'PRs', pct: ap.prPct, count: ap.prCount, color: '#22d3ee' },
                          { label: 'Reviews', pct: ap.reviewPct, count: ap.reviewCount, color: '#f59e0b' },
                        ].map(({ label, pct, count, color }) => (
                          <div key={label}>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-gray-400">{label}</span>
                              <span className="text-gray-300">{count} <span className="text-gray-600">({pct}%)</span></span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })() : (
                  <p className="mt-3 text-[11px] text-gray-500 text-center">
                    Activity data unavailable.
                  </p>
                )}
              </CollapsiblePanel>

              {/* ── EXPANDABLE: Organizations ── */}
              <CollapsiblePanel
                title="Organizations"
                icon={Building2}
                count={personality.orgCount || null}
                isOpen={expandedSections.orgs}
                onToggle={() => toggleSection('orgs')}
                disabled={false}
              >
                {orgs && orgs.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {orgs.map((org, i) => (
                      <a
                        key={i}
                        href={`https://github.com/${org.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 rounded-xl border border-purple-900/30 bg-white/[0.03] px-3 py-2 transition hover:border-purple-500/50 hover:bg-purple-900/10"
                        title={org.description || org.login}
                      >
                        {org.avatar_url && (
                          <img
                            src={org.avatar_url}
                            alt={org.login}
                            className="w-5 h-5 rounded-full border border-white/20"
                            crossOrigin="anonymous"
                          />
                        )}
                        <span className="text-[11px] font-semibold text-gray-300 group-hover:text-white transition-colors">
                          {org.login}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-gray-500 text-center">
                    No public organization memberships.
                  </p>
                )}
              </CollapsiblePanel>

            </div>{/* end right column */}
          </motion.div>
        )}
      </motion.div>
    </motion.section>

      {loading && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
          }}
          aria-live="polite"
          role="status"
        >
          <style>{`
            @keyframes scanv {
              0%   { top: -8%; }
              100% { top: 108%; }
            }
            @keyframes skele-pulse {
              0%, 100% { opacity: 0.25; }
              50%      { opacity: 0.45; }
            }
            .scan-overlay-line {
              position: absolute; left: 0; width: 100%; height: 2px;
              background: #c01af3;
              box-shadow: 0 0 12px 2px rgba(192,26,243,0.7), 0 0 28px 4px rgba(228,78,255,0.35);
              animation: scanv 2.4s ease-in-out infinite;
            }
            .scan-overlay-beam {
              position: absolute; left: 0; width: 100%; height: 100px;
              background: linear-gradient(to bottom, transparent 0%, rgba(192,26,243,0.12) 40%, rgba(228,78,255,0.22) 100%);
              animation: scanv 2.4s ease-in-out infinite;
            }
            .skel-block {
              border-radius: 8px;
              background: rgba(192,26,243,0.12);
              animation: skele-pulse 2s ease-in-out infinite;
            }
          `}</style>

          <div style={{
            position: 'relative', width: 340, maxWidth: '90vw',
            aspectRatio: '5/7',
            borderRadius: '1.5rem', overflow: 'hidden',
            border: '1px solid rgba(192,26,243,0.25)',
            background: 'linear-gradient(160deg, #08010f 0%, #0d0318 50%, #08010f 100%)',
            boxShadow: '0 0 60px rgba(192,26,243,0.12), inset 0 0 0 1px rgba(192,26,243,0.08)',
            display: 'flex', flexDirection: 'column',
            padding: '28px 24px', gap: 16,
          }}>
            <div className="scan-overlay-line" />
            <div className="scan-overlay-beam" />

            {/* Skeleton avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="skel-block" style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skel-block" style={{ width: '70%', height: 14 }} />
                <div className="skel-block" style={{ width: '45%', height: 10 }} />
              </div>
            </div>

            {/* Skeleton tagline */}
            <div className="skel-block" style={{ width: '85%', height: 10, marginTop: 4 }} />

            {/* Skeleton stats row */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <div className="skel-block" style={{ flex: 1, height: 40, borderRadius: 10 }} />
              <div className="skel-block" style={{ flex: 1, height: 40, borderRadius: 10 }} />
              <div className="skel-block" style={{ flex: 1, height: 40, borderRadius: 10 }} />
            </div>

            {/* Skeleton language bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <div className="skel-block" style={{ width: '90%', height: 8 }} />
              <div className="skel-block" style={{ width: '60%', height: 8 }} />
              <div className="skel-block" style={{ width: '75%', height: 8 }} />
            </div>

            {/* Skeleton body lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              <div className="skel-block" style={{ width: '100%', height: 10 }} />
              <div className="skel-block" style={{ width: '80%', height: 10 }} />
              <div className="skel-block" style={{ width: '55%', height: 10 }} />
            </div>

            {/* Center label */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 20, pointerEvents: 'none',
            }}>
              <Loader2
                className="animate-spin"
                style={{ width: 32, height: 32, color: '#c01af3', marginBottom: 12 }}
                aria-hidden="true"
              />
              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: '#c084fc',
              }}>
                Scanning Profile…
              </p>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 11, color: 'rgba(200,180,230,0.5)',
                marginTop: 6, letterSpacing: '0.05em',
              }}>
                Fetching repos, events & orgs
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

    </>
  );
});

GeneratorSection.displayName = 'GeneratorSection';
export default GeneratorSection;
