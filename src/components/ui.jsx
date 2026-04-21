import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ------------------------- Magnetic Button ------------------------- */
export const MagneticButton = ({ children, className = "", onClick, disabled, as = "button", ...rest }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.3 });
    const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.3 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const maxDist = 20;
        const dist = Math.hypot(relX, relY);
        const clamped = Math.min(dist, maxDist);
        const angle = Math.atan2(relY, relX);
        const newX = Math.cos(angle) * clamped * 0.4;
        const newY = Math.sin(angle) * clamped * 0.4;
        x.set(newX);
        y.set(newY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const Comp = as;

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`inline-block ${className}`}
        >
            <Comp onClick={onClick} disabled={disabled} className="w-full h-full" {...rest}>
                {children}
            </Comp>
        </motion.div>
    );
};

/* ------------------------- Decrypt Text ------------------------- */
export const DecryptText = ({ text = "" }) => {
    const [display, setDisplay] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

    useEffect(() => {
        let frame = 0;
        let revealed = 0;
        const maxFramesPerChar = 3;
        const total = text.length;

        const interval = setInterval(() => {
            frame++;
            if (revealed < total) {
                if (frame % maxFramesPerChar === 0) revealed++;
                let out = "";
                for (let i = 0; i < total; i++) {
                    if (i < revealed) out += text[i];
                    else out += chars[Math.floor(Math.random() * chars.length)];
                }
                setDisplay(out);
            } else {
                setDisplay(text);
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className="inline-block align-baseline font-black tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {display}
        </span>
    );
};

/* ------------------------- Liquid Chrome Button ------------------------- */
export const LiquidChromeButton = ({ children, onClick, size = "sm", className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`chrome-pill ${className}`}
        >
            <span className="chrome-pill__label">{children}</span>
        </button>
    );
};

/* ------------------------- Chrome Wordmark ------------------------- */
export const ChromeWordmark = ({ children, className = "" }) => {
    return (
        <span className={`chrome-wordmark ${className}`}>
            <span className="chrome-wordmark__shadow" aria-hidden>
                {children}
            </span>
            <span className="chrome-wordmark__main">{children}</span>
        </span>
    );
};

/* ------------------------- Custom Cursor ------------------------- */
export const CustomCursor = () => {
    const primaryX = useMotionValue(-100);
    const primaryY = useMotionValue(-100);
    const springTrailX = useSpring(primaryX, { stiffness: 80, damping: 20 });
    const springTrailY = useSpring(primaryY, { stiffness: 80, damping: 20 });

    useEffect(() => {
        let rafId;
        const handleMove = (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                primaryX.set(e.clientX);
                primaryY.set(e.clientY);
            });
        };
        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [primaryX, primaryY]);

    return (
        <div className="gpu-accelerate pointer-events-none fixed inset-0 z-[60]">
            <motion.div
                style={{ x: primaryX, y: primaryY }}
                className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] mix-blend-screen gpu-accelerate"
            />
            <motion.div
                style={{ x: springTrailX, y: springTrailY }}
                className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 gpu-accelerate"
            />
        </div>
    );
};
