"use client";

import { motion } from "framer-motion";

export function DiamondFacet({
  className = "h-4 w-4",
  glow = false,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`${className} ${
        glow ? "drop-shadow-[0_0_8px_rgba(255,240,179,0.7)]" : ""
      }`}
    >
      <polygon
        points="8,5 24,5 30,13 16,28 2,13"
        fill="url(#diamondFill)"
        stroke="url(#diamondStroke)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <polyline
        points="2,13 30,13"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1"
      />
      <polyline
        points="8,5 12,13 16,28 20,13 24,5"
        stroke="rgba(255,240,179,0.55)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <polyline
        points="12,13 16,5 20,13"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="diamondFill" x1="2" y1="5" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#FFF0B3" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E5B83B" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="diamondStroke" x1="2" y1="5" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF0B3" />
          <stop offset="100%" stopColor="#E5B83B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FiligreeDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <div className="h-[1px] flex-1 max-w-[110px] bg-gradient-to-r from-transparent via-[var(--gold-muted)] to-[var(--gold-primary)]" />
      <svg viewBox="0 0 28 16" className="h-3.5 w-6 text-[var(--gold-primary)]" fill="none">
        <path
          d="M2 8C6 8 8 2 12 4C14 5 14 8 14 8C14 8 14 5 16 4C20 2 22 8 26 8C22 8 20 14 16 12C14 11 14 8 14 8C14 8 14 11 12 12C8 14 6 8 2 8Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <DiamondFacet className="h-4 w-4 shrink-0" glow />
      <svg viewBox="0 0 28 16" className="h-3.5 w-6 text-[var(--gold-primary)]" fill="none">
        <path
          d="M2 8C6 8 8 2 12 4C14 5 14 8 14 8C14 8 14 5 16 4C20 2 22 8 26 8C22 8 20 14 16 12C14 11 14 8 14 8C14 8 14 11 12 12C8 14 6 8 2 8Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="h-[1px] flex-1 max-w-[110px] bg-gradient-to-l from-transparent via-[var(--gold-muted)] to-[var(--gold-primary)]" />
    </div>
  );
}

const SPARKLE_POINTS = [
  { top: "10%", left: "12%", delay: 0, size: "h-3 w-3" },
  { top: "18%", left: "84%", delay: 0.7, size: "h-3.5 w-3.5" },
  { top: "48%", left: "8%", delay: 1.4, size: "h-2.5 w-2.5" },
  { top: "55%", left: "90%", delay: 0.4, size: "h-3 w-3" },
  { top: "82%", left: "18%", delay: 1.1, size: "h-3.5 w-3.5" },
  { top: "78%", left: "80%", delay: 1.8, size: "h-2.5 w-2.5" },
];

export function DiamondSparkles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SPARKLE_POINTS.map((pt, idx) => (
        <motion.div
          key={idx}
          style={{ top: pt.top, left: pt.left }}
          animate={{
            opacity: [0.2, 0.95, 0.2],
            scale: [0.8, 1.15, 0.8],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3.4,
            delay: pt.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <DiamondFacet className={pt.size} glow />
        </motion.div>
      ))}
    </div>
  );
}
