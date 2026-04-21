import React, { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Github } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import DecryptText from './DecryptText';



const IdentityCardBase = (
  {
    userData,
    personality,
    currentTheme,
    currentPattern,
    selectedArt,
    blurEffect,
    bgStyle,
    colorShade,
    foilX,
    cardFoilY,
    tagline,
    isFrozen
  },
  ref
) => {
  const username = userData?.name || userData?.login || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, rotateY: 85, y: 60 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.1 }}
      style={{ transformPerspective: 1200 }}
      className="w-full"
      role="article"
      aria-label={`GitHub identity card for ${username}`}
      aria-describedby="card-description"
    >
      <p id="card-description" className="sr-only">
        This identity card displays GitHub statistics for {username}.
        Followers: {userData?.followers || 0}, Repositories: {userData?.public_repos || 0},
        Total Stars: {personality?.totalStars || 0}.
        Languages used include: {personality?.topLanguages?.map(l => l.name).join(', ')}.
      </p>

      <Tilt
        perspective={1200}
        glareEnable={!isFrozen}
        glareMaxOpacity={0.06}
        glareColor="#ffffff"
        glareBorderRadius="24px"
        tiltMaxAngleX={isFrozen ? 0 : 5}
        tiltMaxAngleY={isFrozen ? 0 : 5}
        tiltEnable={!isFrozen}
        className="w-full"
      >
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl gpu-accelerate group"
          style={{
            background: bgStyle === 'solid' ? currentTheme.secondary : currentTheme.glow,
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: `0 28px 56px -12px rgba(0,0,0,0.88), inset 0 1px 1px rgba(255,255,255,0.04), 0 0 0 1px ${currentTheme.accent}28`,
            willChange: "transform",
            filter: `brightness(${1 + (colorShade / 100)})`
          }}
        >
          {selectedArt?.url ? (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
              <img
                src={selectedArt.url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ filter: 'contrast(1.05)' }}
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none z-0"
              style={{ background: bgStyle === 'solid' ? currentTheme.secondary : currentTheme.glow }}
              aria-hidden="true"
            />
          )}

          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              backdropFilter: blurEffect === 'none' ? 'none' : blurEffect === 'sm' ? 'blur(4px)' : blurEffect === 'md' ? 'blur(8px)' : blurEffect === 'lg' ? 'blur(16px)' : 'none',
              WebkitBackdropFilter: blurEffect === 'none' ? 'none' : blurEffect === 'sm' ? 'blur(4px)' : blurEffect === 'md' ? 'blur(8px)' : blurEffect === 'lg' ? 'blur(16px)' : 'none'
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-5 p-7" style={{ overflow: 'visible' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0" style={{ overflow: 'visible' }}>
                <div className="flex items-center gap-1.5">
                  <Github className="h-3 w-3 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden="true" />
                  <span className="text-[8.5px] font-semibold uppercase tracking-[0.32em]" style={{ color: 'rgba(255,255,255,0.90)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    GitHub {personality.archetype} Identity
                  </span>
                </div>
                <h3
                  className="text-[28px] font-black leading-tight tracking-tight text-white"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                    overflow: 'visible',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    paddingBottom: '4px',
                    lineHeight: 1.15,
                  }}
                >
                  <DecryptText key={userData.login} text={userData.name || userData.login} />
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.90)' }}>
                  @{userData.login}
                </p>
                {tagline && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/90 pt-1 line-clamp-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    "{tagline}"
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <img
                  src={userData.avatar_url}
                  alt={`${username}'s profile picture`}
                  className="h-14 w-14 rounded-2xl object-cover"
                  style={{ border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 4px 16px rgba(0,0,0,0.6)' }}
                  crossOrigin="anonymous"
                />
                <div
                  className="flex items-center justify-center rounded-lg p-1 transition-opacity duration-300"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.95 }}
                  role="img"
                  aria-label="QR code linking to GitHub profile page"
                >
                  <QRCodeSVG value={userData.html_url} size={38} bgColor="transparent" fgColor="rgba(255,255,255,0.95)" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5" aria-label={`User badges: ${personality.badges.map(b => b.title).join(', ')}`}>
              {personality.badges.map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 * i, duration: 0.3, ease: 'easeOut' }}
                  className="inline-flex items-center gap-1 rounded-full text-[9.5px] font-medium px-2.5 py-0.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: `2px solid ${currentTheme.accent}70`,
                    color: 'rgba(12, 1, 1, 1)'
                  }}
                  role="note"
                >
                  <span className="text-[9px]">{badge.emoji}</span>
                  {badge.title}
                </motion.span>
              ))}
            </div>

            <div
              className="flex items-stretch overflow-hidden rounded-xl"
              style={{ border: '1px solid rgba(255,255,255,0.20)', background: 'rgba(0,0,0,0.28)' }}
              aria-label={`Statistics: ${userData.followers} followers, ${userData.public_repos} repositories, ${personality.totalStars} stars`}
            >
              {[
                { label: 'Followers', value: userData.followers },
                { label: 'Repos', value: userData.public_repos },
                { label: 'Stars', value: personality.totalStars }
              ].map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-center py-3 px-1" style={i < 2 ? { borderRight: '1px solid rgba(255,255,255,0.25)' } : {}}>
                  <div className="text-[17px] font-black font-mono text-white leading-none">{s.value}</div>
                  <div className="mt-1 text-[7.5px] uppercase tracking-[0.22em] font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {personality.topLanguages.length > 0 && (
              <div className="space-y-2" aria-label="Programming languages breakdown">
                <p className="sr-only">Programming languages usage percentage</p>
                {personality.topLanguages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10.5px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{lang.name}</span>
                      <span className="font-mono text-[10.5px]" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{lang.percentage}%</span>
                    </div>
                    <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }} role="progressbar" aria-valuenow={lang.percentage} aria-valuemin="0" aria-valuemax="100" aria-label={`${lang.name}: ${lang.percentage}%`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percentage}%` }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.9, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${currentTheme.secondary}, ${currentTheme.accent})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="flex items-center justify-between pt-3 font-mono text-[8px] uppercase tracking-[0.2em]"
              style={{ borderTop: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.80)' }}
            >
              <span>Git‑Card Studio</span>
              <span>{personality.accountAge}yr longevity</span>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const IdentityCard = memo(forwardRef(IdentityCardBase));
export default IdentityCard;
