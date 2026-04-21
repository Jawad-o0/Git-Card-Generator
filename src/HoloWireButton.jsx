import React, { useEffect } from "react";

const STYLE_ID = "holowire-button-v2";

const STYLES = `
  @keyframes holo-border-flow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes holo-pulse {
    0%, 100% { box-shadow: 0 0 18px var(--hb-glow), inset 0 0 0 1px rgba(255,255,255,0.08); }
    50%      { box-shadow: 0 0 30px var(--hb-glow-strong), inset 0 0 0 1px rgba(255,255,255,0.14); }
  }

  .holo-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--hb-min-w);
    height: var(--hb-h);
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 16px;
    overflow: visible;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.2s ease, filter 0.2s ease;
  }

  .holo-btn--block {
    width: 100%;
  }

  .holo-btn:disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .holo-btn:hover {
    transform: translateY(-2px);
  }

  .holo-btn:active {
    transform: translateY(1px) scale(0.98);
  }

  .holo-btn__outer {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    padding: 1.25px;
    background: var(--hb-gradient);
    background-size: 200% 200%;
    animation: holo-border-flow 4s ease infinite, holo-pulse 3s ease-in-out infinite;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .holo-btn:hover .holo-btn__outer {
    animation: holo-border-flow 2s ease infinite;
    box-shadow:
      0 0 40px var(--hb-glow-strong),
      inset 0 0 0 1px rgba(255,255,255,0.2);
    filter: brightness(1.15);
  }

  .holo-btn__inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(15,6,28,0.94), rgba(8,3,16,0.97));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.05),
      inset 0 -1px 0 rgba(0,0,0,0.5),
      inset 0 0 24px rgba(192,26,243,0.04);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Subtle inner scan glow */
  .holo-btn__inner::before {
    content: "";
    position: absolute;
    top: 0;
    left: -30%;
    width: 30%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(192,26,243,0.06), transparent);
    animation: prism-scan 5s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes prism-scan {
    0%   { transform: translateX(-100%); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateX(500%); opacity: 0; }
  }

  .holo-btn__label {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    height: 100%;
    padding: 0 var(--hb-px);
    font-family: 'Orbitron', 'Space Grotesk', sans-serif;
    font-size: var(--hb-font);
    font-weight: 700;
    letter-spacing: var(--hb-letter);
    text-transform: uppercase;
    color: var(--hb-text);
    text-shadow:
      0 0 14px var(--hb-glow),
      0 2px 8px rgba(0,0,0,.8);
  }

  .holo-btn__label svg {
    width: 1.1em;
    height: 1.1em;
    flex-shrink: 0;
    filter: drop-shadow(0 0 4px var(--hb-glow));
  }
`;

const SIZES = {
    xs: { minWidth: "110px", height: "36px", paddingX: "16px", fontSize: "9px",  letter: "0.22em" },
    sm: { minWidth: "150px", height: "42px", paddingX: "22px", fontSize: "10px", letter: "0.24em" },
    md: { minWidth: "190px", height: "48px", paddingX: "26px", fontSize: "10.5px", letter: "0.26em" },
    lg: { minWidth: "230px", height: "54px", paddingX: "30px", fontSize: "11.5px", letter: "0.28em" },
};

const THEMES = {
    magenta: {
        gradient: "linear-gradient(120deg, rgba(192,26,243,0.6), rgba(122,0,212,0.8), rgba(52,209,255,0.5), rgba(192,26,243,0.6))",
        glow: "rgba(192,26,243,0.20)",
        glowStrong: "rgba(192,26,243,0.40)",
        text: "#e0c8ff",
    },
    cyan: {
        gradient: "linear-gradient(120deg, rgba(52,209,255,0.5), rgba(41,224,255,0.6), rgba(167,136,255,0.5), rgba(52,209,255,0.5))",
        glow: "rgba(52,209,255,0.20)",
        glowStrong: "rgba(52,209,255,0.40)",
        text: "#c8eeff",
    },
    amber: {
        gradient: "linear-gradient(120deg, rgba(255,200,100,0.5), rgba(255,140,60,0.6), rgba(255,80,100,0.5), rgba(255,200,100,0.5))",
        glow: "rgba(255,160,80,0.20)",
        glowStrong: "rgba(255,160,80,0.40)",
        text: "#fff0d8",
    },
};

function ensureStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.head.appendChild(style);
}

export default function HoloWireButton({
    children,
    onClick,
    type = "button",
    className = "",
    size = "sm",
    theme = "magenta",
    block = false,
    disabled = false,
    ...rest
}) {
    useEffect(() => {
        ensureStyles();
    }, []);

    const s = SIZES[size] || SIZES.sm;
    const t = THEMES[theme] || THEMES.magenta;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`holo-btn ${block ? "holo-btn--block" : ""} ${className}`}
            style={{
                "--hb-min-w": s.minWidth,
                "--hb-h": s.height,
                "--hb-px": s.paddingX,
                "--hb-font": s.fontSize,
                "--hb-letter": s.letter,
                "--hb-gradient": t.gradient,
                "--hb-glow": t.glow,
                "--hb-glow-strong": t.glowStrong,
                "--hb-text": t.text,
            }}
            {...rest}
        >
            <span className="holo-btn__outer">
                <span className="holo-btn__inner">
                    <span className="holo-btn__label">{children}</span>
                </span>
            </span>
        </button>
    );
}