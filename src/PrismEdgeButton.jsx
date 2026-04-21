import React, { useEffect } from "react";

const STYLE_ID = "prism-edge-button-v3";

const STYLES = `
  @keyframes prism-scan {
    0%   { transform:translateX(-170%) skewX(-20deg); opacity:0; }
    18%  { opacity:.04; }
    48%  { opacity:.12; }
    82%  { opacity:.04; }
    100% { transform:translateX(180%) skewX(-20deg); opacity:0; }
  }

  @keyframes prism-border-breathe {
    0%, 100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }

  .prism-btn{
    --h:40px;
    --px:18px;
    --font:10px;
    --space:.18em;
    --edge-a:rgba(192,26,243,.6);
    --edge-b:#7a00d4;
    --edge-c:#c01af3;
    --edge-d:#e060ff;
    --edge-e:rgba(192,26,243,.4);
    --glow:rgba(192,26,243,.18);
    --glow-strong:rgba(192,26,243,.35);
    --text:#e8dff5;
    --dot:#c01af3;

    appearance:none;
    position:relative;
    display:inline-flex;
    min-width:max-content;
    height:var(--h);
    padding:0;
    border:0;
    background:transparent;
    color:inherit;
    cursor:pointer;
    border-radius:14px;
    text-decoration:none;
    -webkit-tap-highlight-color:transparent;
    transition:transform .18s ease, filter .18s ease;
  }

  .prism-btn--block{width:100%}
  .prism-btn:disabled{opacity:.45; pointer-events:none}
  .prism-btn:focus-visible{outline:none; filter:drop-shadow(0 0 16px rgba(192,26,243,.3))}
  .prism-btn:hover{transform:translateY(-2px)}
  .prism-btn:active{transform:translateY(1px) scale(0.98)}

  .prism-btn .frame{
    position:relative;
    width:100%;
    height:100%;
    display:block;
    padding:1.25px;
    border-radius:14px;
    background:linear-gradient(
      135deg,
      var(--edge-a) 0%,
      var(--edge-b) 22%,
      var(--edge-c) 50%,
      var(--edge-d) 78%,
      var(--edge-e) 100%
    );
    box-shadow:
      0 0 0 1px rgba(192,26,243,.06),
      0 8px 24px rgba(0,0,0,.5),
      0 0 20px var(--glow);
    animation: prism-border-breathe 3.5s ease-in-out infinite;
    transition:box-shadow .28s ease, filter .28s ease;
  }

  .prism-btn:hover .frame{
    box-shadow:
      0 0 0 1px rgba(192,26,243,.12),
      0 14px 36px rgba(0,0,0,.6),
      0 0 35px var(--glow-strong);
    filter:brightness(1.15);
    animation: none;
    opacity: 1;
  }

  .prism-btn .surface{
    position:relative;
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    border-radius:13px;
  }

  /* Top highlight edge */
  .prism-btn .surface::before{
    content:"";
    position:absolute;
    left:12px;
    right:12px;
    top:1px;
    height:30%;
    background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0));
    border-radius:10px 10px 0 0;
    opacity:.5;
    pointer-events:none;
  }

  /* Scanning light */
  .prism-btn .surface::after{
    content:"";
    position:absolute;
    top:-25%;
    left:-24%;
    width:24%;
    height:170%;
    background:linear-gradient(
      90deg,
      transparent 0%,
      rgba(192,26,243,.02) 20%,
      rgba(228,78,255,.08) 50%,
      rgba(192,26,243,.02) 80%,
      transparent 100%
    );
    filter:blur(1px);
    mix-blend-mode:screen;
    animation:prism-scan 4s ease-in-out infinite;
    pointer-events:none;
  }

  .prism-btn .label{
    position:relative;
    z-index:2;
    height:100%;
    padding:0 var(--px);
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:.5rem;
    color:var(--text);
    font-family:'Orbitron', 'Space Grotesk', sans-serif;
    font-weight:700;
    font-size:var(--font);
    letter-spacing:var(--space);
    text-transform:uppercase;
    white-space:nowrap;
    text-shadow:
      0 0 12px rgba(192,26,243,.3),
      0 2px 8px rgba(0,0,0,.85);
  }

  .prism-btn .dot{
    width:5px;
    height:5px;
    border-radius:999px;
    background:var(--dot);
    box-shadow:0 0 8px var(--dot), 0 0 18px var(--dot);
    flex:0 0 auto;
    animation: prism-border-breathe 2s ease-in-out infinite;
  }

  /* ─── Surfaces ─── */
  .surface-glass .surface{
    background:
      linear-gradient(180deg, rgba(20,8,35,.92), rgba(12,4,22,.96)),
      radial-gradient(circle at 20% 0%, rgba(192,26,243,.12), transparent 45%);
    backdrop-filter:blur(14px) saturate(130%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.06),
      inset 0 -1px 0 rgba(0,0,0,.4),
      inset 0 0 24px rgba(192,26,243,.04);
  }

  .surface-ghost .surface{
    background:
      linear-gradient(180deg, rgba(15,5,28,.85), rgba(8,2,16,.9));
    backdrop-filter:blur(8px) saturate(120%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.04),
      inset 0 -1px 0 rgba(0,0,0,.3);
  }

  .surface-hollow .surface{
    background: rgba(6, 3, 12, 0.85);
    backdrop-filter: blur(14px);
    box-shadow:
      inset 0 0 0 1px rgba(192,26,243,0.08),
      inset 0 1px 0 rgba(255,255,255,.04);
  }
  .surface-hollow .surface::before{opacity:.06}
  .surface-hollow .surface::after{opacity:.20}

  /* ─── Tones ─── */
  .tone-violet{
    --edge-a:rgba(122,0,212,.5);
    --edge-b:#7a00d4;
    --edge-c:#9b30ff;
    --edge-d:#c01af3;
    --edge-e:rgba(122,0,212,.4);
    --glow:rgba(155,48,255,.18);
    --glow-strong:rgba(155,48,255,.38);
    --text:#e0d0ff;
    --dot:#9b30ff;
  }

  .tone-silver{
    --edge-a:rgba(160,150,180,.4);
    --edge-b:rgba(120,110,145,.6);
    --edge-c:rgba(180,170,200,.5);
    --edge-d:rgba(140,130,165,.5);
    --edge-e:rgba(160,150,180,.3);
    --glow:rgba(180,170,210,.12);
    --glow-strong:rgba(180,170,210,.25);
    --text:#d0c8e0;
    --dot:#a090c0;
  }

  .tone-fuchsia{
    --edge-a:rgba(192,26,243,.5);
    --edge-b:#c01af3;
    --edge-c:#e060ff;
    --edge-d:#ff66d6;
    --edge-e:rgba(228,78,255,.4);
    --glow:rgba(192,26,243,.20);
    --glow-strong:rgba(228,78,255,.40);
    --text:#f8e0ff;
    --dot:#e060ff;
  }

  /* ─── Sizes ─── */
  .size-xs{ --h:32px; --px:14px; --font:8.5px;  --space:.16em; }
  .size-sm{ --h:42px; --px:20px; --font:9.5px;  --space:.20em; }
  .size-md{ --h:48px; --px:24px; --font:10.5px; --space:.22em; }
  .size-lg{ --h:54px; --px:30px; --font:11.5px; --space:.24em; }
`;

const SIZES = {
  xs: "size-xs",
  sm: "size-sm",
  md: "size-md",
  lg: "size-lg",
};

const TONES = {
  violet: "tone-violet",
  silver: "tone-silver",
  fuchsia: "tone-fuchsia",
};

const SURFACES = {
  glass: "surface-glass",
  ghost: "surface-ghost",
  hollow: "surface-hollow",
};

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

export default function PrismEdgeButton({
  children,
  onClick,
  type = "button",
  className = "",
  size = "sm",
  tone = "violet",
  surface = "glass",
  block = false,
  disabled = false,
  dot = false,
  ...rest
}) {
  useEffect(() => {
    ensureStyles();
  }, []);

  const sizeClass = SIZES[size] || SIZES.sm;
  const toneClass = TONES[tone] || TONES.violet;
  const surfaceClass = SURFACES[surface] || SURFACES.glass;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`prism-btn ${sizeClass} ${toneClass} ${surfaceClass} ${block ? "prism-btn--block" : ""
        } ${className}`}
      {...rest}
    >
      <span className="frame">
        <span className="surface">
          <span className="label">
            {children}
            {dot ? <span className="dot" /> : null}
          </span>
        </span>
      </span>
    </button>
  );
}