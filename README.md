<div align="center">

<h1>
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=42&duration=3000&pause=1000&color=6B21A8&center=true&vCenter=true&width=600&lines=GIT-CARD+STUDIO" alt="GIT-CARD STUDIO" />
</h1>

<p align="center">
  <a href="https://git-card-generator.vercel.app/">
    <img src="https://img.shields.io/badge/⬢_Launch-Live_Studio-6B21A8?style=for-the-badge&labelColor=0a0a0f" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Status-Live-6B21A8?style=for-the-badge&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/React-19-6B21A8?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/Vite-Latest-6B21A8?style=for-the-badge&logo=vite&logoColor=white&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-6B21A8?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/Framer_Motion-Latest-6B21A8?style=for-the-badge&logo=framer&logoColor=white&labelColor=0a0a0f" />
</p>

<p align="center">
  <a href="https://git-card-generator.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/%E2%97%86_SYSTEM-OPERATIONAL-00FF66?style=for-the-badge&labelColor=0a0a0f" alt="System Status" /></a><a href="https://git-card-generator.vercel.app/" target="_blank"><img src="https://img.shields.io/badge/CORE_ENGINE-ACCESS_STUDIO_%E2%A4%9E-A855F7?style=for-the-badge&logo=vercel&logoColor=white&labelColor=120224" alt="Launch Engine" />
  </a>
</p>

<p align="center">
  <b>⬢ PRESTIGE ENGINEERING IDENTITY SYSTEMS ⬢</b><br/>
  <sub>Deconstruct raw GitHub telemetry. Synthesize high-fidelity developer signatures.</sub>
</p>

<br/>

> *"We don't just compile metrics. We frame your legacy into an uncompromised visual artifact."*

<br/>

### **[  EXECUTE PROTOCOL: ENTER THE FABRICATION LAB ⤞ ](https://git-card-generator.vercel.app/)**

<br/>

</div>

---

## ◈ Overview

**Git-Card Studio** is an ultra-premium web application that dynamically transforms raw GitHub data into personalized **Developer Identity Cards**. It serves as a visual resume and statement piece for engineers to showcase their coding personas, dominant languages, and open-source impact — with the aesthetic rigor of a world-class product launch.

This is not a stat tracker. It is a **Persona Engine** — merging data, design, and narrative into a shareable artifact that speaks to your strengths before anyone even clicks your profile.

The application discards standard flat web design in favor of an aggressive **cyber-premium aesthetic** — matte blacks, deep purples, sophisticated glassmorphism, and cinematic motion at every layer.

---

## ◈ The Vision

### ▸ Persona Intelligence
Machine-assisted heuristics analyze your repositories, languages, stars, and commit history to determine your developer archetype. The engine computes intelligent snapshots, categorizing your expertise and generating narrative-driven achievement badges dynamically based on weighted thresholds.

### ▸ Design Engineered
Every gradient, highlight, blur, and typography choice is meticulously tuned. Whether viewed on a high-res retina display or exported for social media, the card maintains absolute visual fidelity — featuring real-time CSS shaders, dynamic glow effects, and interactive parallax tilt physics.

### ▸ Instant Deployment
Export high-resolution PNGs directly to your clipboard, share natively to your OS, or broadcast your new persona across X (Twitter), LinkedIn, and investor decks with one click.

---

## ◈ Core Features

### ▸ Interactive Vault Universe
A fully rendered 3D Spline scene that reacts to your presence in real-time. Step inside the holographic vault where prestige Git identities are forged. Rotation-only controls with zoom lock for a frictionless scroll experience.

### ▸ The Fabrication Lab

| Feature | Description |
|---|---|
| **Identity Lookup Protocol** | Input any GitHub username to instantly pull live data |
| **API Override Protocol** | PAT support — bypass 30 req/hr limit, unlock 5,000 req/hr |
| **Chromium Spectrum** | Platinum, Obsidian, Royal Burgundy, Slate, Synthwave, Terminal, Aurora, Gold Foil |
| **Aesthetic Overlays** | 9 curated art backgrounds or paste any custom image URL |
| **Substrate Refraction** | Multi-level backdrop blur controls via CSS backdrop-filters |
| **Manifesto** | 60-character custom tagline injected directly onto the card |
| **Reflective Index** | Fine-tune brightness and luster with a precision slider |

### ▸ Heuristic Analysis Engine

| Feature | Description |
|---|---|
| **Algorithmic Profiling** | Dynamic archetypes — `Architect`, `Luminary`, `Polyglot`, `Veteran`, `Rising Star` |
| **Language Detection** | Exact byte-level language calculation across all repos |
| **Badge Generation** | `Pioneer`, `Titan`, `Founding Member`, `Elite` — awarded by heuristic thresholds |
| **Account Intelligence** | Longevity tracking, star trajectory, follower authority scoring |
| **Activity Pulse** | 30-day event mix — Pushes, PRs, Reviews, peak activity days |

---

## ◈ UX Engineering — Solved Problems

### ▸ The 3D Scroll-Trap Problem

**Problem** — Embedding a Spline canvas hijacks the mouse wheel, zooming into the globe instead of scrolling the page.

**Solution** — A custom event interception layer was engineered:
```
Normal scroll  →  bypasses the 3D scene entirely
Drag gesture   →  transparent overlay forwards pointer events for rotation
Wheel event    →  blocked at capture phase before reaching Spline internals
Camera zoom    →  locked via minDistance = maxDistance on load
```

### ▸ High-Fidelity Canvas Export

**Problem** — `html2canvas` is notoriously buggy with flexbox alignment and custom web fonts, causing text to baseline-shift or render in system fallback fonts on export.

**Solution:**
```
Font pre-loading  →  Orbitron embedded into capture context before html2canvas fires
Tilt freeze       →  react-parallax-tilt disabled (isFrozen prop) before capture
Animation freeze  →  capture-freeze class kills all @keyframes during snapshot
Timing delay      →  200ms settle window after freeze before canvas render fires
```

### ▸ Graceful Degradation

**Problem** — Heavy animations, blurs, and 3D scenes cause framerate drops on low-end hardware.

**Solution** — `useMobileDetect` + hardware concurrency check (`isLowEnd`):
```
Low-end detected  →  aurora effects + starfield particles disabled
Reduced motion    →  spring physics snap to instant transitions
Mobile viewport   →  backdrop blurs fallback to solid semi-transparent overlays
Spline on mobile  →  beam count and complexity scaled down automatically
```

---

## ◈ Intelligent API Architecture

Dual-tier fallback system to bypass GitHub's unauthenticated rate limits:

```
Free Tier (Heuristic Mode)
  └── Ultra-optimized repo-count heuristic
  └── Reduces cost from ~32 API calls → 2 calls per scan
  └── Allows 30 high-fidelity scans per hour

Power User Mode (PAT Override)
  └── Client-side encrypted GitHub Personal Access Token
  └── Byte-level precision language parsing
  └── 5,000 requests per hour
```

---

## ◈ Export Pipeline

| Export Type | Description |
|---|---|
| **High-Res PNG** | `html2canvas` pixel-perfect capture at `2x` scale |
| **Clipboard** | Native OS clipboard image copy |
| **Web Share API** | Deep integration with iOS/Android native share sheets |
| **X (Twitter)** | One-click post intent with card pre-copied to clipboard |

---

## ◈ Tech Stack

| Layer | Technology |
|---|---|
| **Core** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 + Vanilla CSS keyframes |
| **Animation** | Framer Motion — spring physics, scroll-linked, stagger reveals |
| **3D** | Spline (`@splinetool/react-spline`) |
| **Card Tilt** | `react-parallax-tilt` |
| **Export** | `html2canvas` |
| **QR Code** | `qrcode.react` |
| **Icons** | Lucide React |

---

## ◈ Getting Started

### Prerequisites
- Node.js `18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Jawad-o0/git-card-generator.git

# Navigate into the project
cd git-card-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## ◈ Project Structure

```
src/
├── assets/              # Card art images (webp, avif, jpg)
├── components/          # Reusable UI components
│   ├── IdentityCard.jsx     # The main card component
│   ├── DecryptText.jsx      # Animated text scramble effect
│   ├── CanvasParticleField.jsx
│   └── ...
├── sections/            # Page sections
│   ├── HeroSection.jsx
│   ├── VaultSection.jsx     # Spline globe section
│   ├── GeneratorSection.jsx # Main forge tool
│   └── Navbar.jsx
├── hooks/               # Custom React hooks
│   ├── useGitHubData.js
│   ├── useMobileDetect.js
│   └── ...
├── lib/                 # Core logic & config
│   ├── artOptions.js        # Card art definitions
│   ├── themes.js            # Color theme definitions
│   ├── computePersonality.js # Heuristic analysis engine
│   └── ColorModeContext.jsx
└── App.jsx
```

---

## ◈ GitHub Token (Optional)

For byte-level language precision and higher rate limits:

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a token with `read:user` and `public_repo` scopes
3. Paste it into the **Power User Override** field in the app

Your token is encrypted client-side and never leaves your browser.

---

## ◈ License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

<br/>

**Built by [Jawad Ali](https://github.com/Jawad-o0)**

<a href="https://github.com/Jawad-o0">
  <img src="https://img.shields.io/badge/GitHub-Jawad--o0-6B21A8?style=for-the-badge&logo=github&logoColor=white&labelColor=0a0a0f" />
</a>
<a href="https://www.linkedin.com/in/jawad-ali-677aa6346">
  <img src="https://img.shields.io/badge/LinkedIn-Jawad_Ali-6B21A8?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0a0a0f" />
</a>
<a href="mailto:Jawadaliii986@gmail.com">
  <img src="https://img.shields.io/badge/Email-Contact-6B21A8?style=for-the-badge&logo=gmail&logoColor=white&labelColor=0a0a0f" />
</a>

<br/><br/>

<sub>© 2026 Git-Card Studio • Engineering Identity Systems</sub>

</div>
