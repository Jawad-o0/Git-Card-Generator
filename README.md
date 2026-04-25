<div align="center">

<h1>
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=42&duration=3000&pause=1000&color=6B21A8&center=true&vCenter=true&width=600&lines=GIT-CARD+STUDIO" alt="GIT-CARD STUDIO" />
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-6B21A8?style=for-the-badge&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/React-18-6B21A8?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/Vite-Latest-6B21A8?style=for-the-badge&logo=vite&logoColor=white&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-6B21A8?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0a0a0f" />
  <img src="https://img.shields.io/badge/Framer_Motion-Latest-6B21A8?style=for-the-badge&logo=framer&logoColor=white&labelColor=0a0a0f" />
</p>

<p align="center">
  <strong>Prestige Engineering Identity Studio</strong><br/>
  <sub>Transform raw GitHub data into stunning, high-fidelity Developer Identity Cards.</sub>
</p>

<br/>

> *"We don't just show stats — we frame your legacy."*

<br/>

</div>

---

## ◈ Overview

**Git-Card Studio** is an ultra-premium web application that dynamically transforms raw GitHub data into personalized **Developer Identity Cards**. It serves as a visual resume and statement piece for engineers to showcase their coding personas, dominant languages, and open-source impact — with the aesthetic rigor of a world-class product launch.

The application discards standard flat web design in favor of an aggressive **cyber-premium aesthetic** — matte blacks, deep purples, and sophisticated glassmorphism layered with cinematic motion.

---

## ◈ Features

### ▸ Visual Identity & Aesthetic Engineering

- **Cinematic UI** — Ambient aurora gradients, radial glows, and rotating shimmer borders throughout
- **Metallic Typography** — Custom `@keyframes` create a living metallic sheen that breathes across headings
- **Micro-Interactions** — Light-sweep shimmers on all interactive elements, powered by Framer Motion hover states
- **Glassmorphic Layering** — Heavy `backdrop-blur` over low-opacity dark backgrounds for physical depth
- **Interactive 3D Globe** — Spline-powered vault universe with rotation-only controls and zoom lock

---

### ▸ Heuristic Analysis Engine

The core algorithm doesn't just read data — it **interprets** it.

| Feature | Description |
|---|---|
| **Algorithmic Profiling** | Assigns dynamic titles like `Architect`, `Luminary`, `Polyglot` from weighted GitHub metrics |
| **Language Detection** | Calculates exact language bytes across repos to determine primary tech stack |
| **Badge Generation** | Awards stylized badges (`Pioneer`, `Titan`, `Founding Member`) based on heuristic thresholds |
| **Account Intelligence** | Tracks longevity, star trajectory, and follower authority score |

---

### ▸ Intelligent API Architecture

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

### ▸ Export Pipeline

| Export Type | Description |
|---|---|
| **High-Res PNG** | `html2canvas` pixel-perfect capture at `2x` scale |
| **Clipboard** | Native OS clipboard image copy |
| **Web Share API** | Deep integration with iOS/Android native share sheets |
| **X (Twitter)** | One-click post intent with card pre-copied to clipboard |

---

### ▸ Card Customization

- **8 Chromium Themes** — Platinum, Obsidian, Royal Burgundy, Slate, Synthwave, Terminal, Aurora, Gold Foil
- **9 Art Overlays** — Steel Serpent, Liquid Glass, Royal Baroque, The Operator, Cosmic Drifter, and more
- **Reflective Index Slider** — Fine-tune brightness and luster
- **Substrate Refraction** — 4-level backdrop blur control
- **Custom Manifesto** — 60-character personal tagline on the card
- **Custom Artwork URL** — Paste any direct image URL as card art

---

## ◈ Tech Stack

| Layer | Technology |
|---|---|
| **Core** | React 18 + Vite |
| **Styling** | Tailwind CSS v3 |
| **Animation** | Framer Motion |
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

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
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

<br/><br/>

<sub>© 2026 Git-Card Studio • Engineering Identity Systems</sub>

</div>
