import React from "react";
import { motion } from "framer-motion";

interface ClothesHangerProps {
  isHovered?: boolean;
}

export const ClothesHanger: React.FC<ClothesHangerProps> = ({ isHovered = false }) => {
  return (
    <div className="relative flex flex-col items-center w-full select-none pointer-events-none">
      {/* Metallic Hanger Ring sliding on the physical rail */}
      <div className="relative -top-2 flex flex-col items-center">
        {/* Ring Loop over the rail */}
        <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-200 bg-transparent shadow-[0_1px_4px_rgba(0,0,0,0.4)]" />
        {/* Hook neck */}
        <div className="w-[2px] h-6 bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 shadow-sm" />
        {/* Swivel brass collar */}
        <div className="w-2.5 h-1.5 rounded-sm bg-gradient-to-r from-amber-600 via-amber-200 to-amber-700 shadow-xs" />
      </div>

      {/* Triangular Wooden / Matte Black Luxury Hanger Silhouette */}
      <motion.div
        animate={isHovered ? { rotate: [0, -1.8, 1.8, -0.8, 0] } : { rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative w-64 -mt-1 flex flex-col items-center origin-top"
      >
        {/* Curved Hanger Shoulders */}
        <svg
          viewBox="0 0 260 50"
          className="w-full h-auto drop-shadow-md overflow-visible"
        >
          <defs>
            <linearGradient id="hangerWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="30%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#3f3f46" />
              <stop offset="70%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
            <linearGradient id="hangerMetal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#71717a" />
              <stop offset="50%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#71717a" />
            </linearGradient>
          </defs>

          {/* Shoulders path */}
          <path
            d="M 10 44 Q 130 6 250 44 Q 248 48 240 48 Q 130 18 20 48 Z"
            fill="url(#hangerWood)"
            stroke="#52525b"
            strokeWidth="0.75"
          />

          {/* Crossbar */}
          <rect
            x="24"
            y="43"
            width="212"
            height="3.5"
            rx="1.75"
            fill="url(#hangerMetal)"
            opacity="0.9"
          />

          {/* Notches for straps */}
          <path d="M 45 35 Q 50 38 55 35" stroke="#09090b" strokeWidth="1.5" fill="none" />
          <path d="M 205 35 Q 210 38 215 35" stroke="#09090b" strokeWidth="1.5" fill="none" />

          {/* Engraved DEVORA brand badge */}
          <text
            x="130"
            y="26"
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize="6.5"
            fontFamily="monospace"
            letterSpacing="3"
            fontWeight="bold"
            opacity="0.85"
          >
            DEVORA // STUDIO
          </text>
        </svg>

        {/* Small hanging shadow underneath */}
        <div className="w-48 h-1.5 bg-black/20 dark:bg-black/60 blur-xs rounded-full -mt-0.5" />
      </motion.div>
    </div>
  );
};
