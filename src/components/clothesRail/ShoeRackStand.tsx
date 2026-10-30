import React from "react";
import { motion } from "framer-motion";

interface ShoeRackStandProps {
  isHovered?: boolean;
  sku?: string;
  weight?: string;
  edition?: string;
}

export const ShoeRackStand: React.FC<ShoeRackStandProps> = ({
  isHovered = false,
  sku = "DVR-SNK-01",
  weight = "420g",
  edition = "EDITION // S26",
}) => {
  return (
    <div className="w-full relative flex flex-col items-center select-none pointer-events-none mt-2">
      {/* Dynamic Pop-out Shadow on the Rack Shelf */}
      <motion.div
        animate={
          isHovered
            ? { scale: 1.25, opacity: 0.8, y: 4 }
            : { scale: 1, opacity: 0.35, y: 0 }
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-48 h-3 rounded-full bg-black/80 blur-md -mb-1 z-10"
      />

      {/* Industrial Floating Sneaker Display Shelf Deck (The Rack) */}
      <div className="relative w-full max-w-[280px] z-20 flex flex-col items-center">
        {/* Slanted Steel Shelf Tray */}
        <div className="w-full h-4 rounded-lg bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/80 shadow-2xl flex items-center justify-between px-3 relative overflow-hidden">
          {/* Subtle LED Underglow Line on the shelf */}
          <motion.div
            animate={
              isHovered
                ? { opacity: 1, boxShadow: "0 0 15px rgba(255, 255, 255, 0.45)" }
                : { opacity: 0.3, boxShadow: "none" }
            }
            transition={{ duration: 0.3 }}
            className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"
          />

          {/* Left Shelf Bolt */}
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 border border-zinc-400 shadow-xs" />

          {/* Metal Specimen Plate */}
          <span className="text-[7.5px] font-mono tracking-widest text-zinc-300 font-bold uppercase truncate">
            DEVORA SNEAKER RACK // {sku}
          </span>

          {/* Right Shelf Bolt */}
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 border border-zinc-400 shadow-xs" />
        </div>

        {/* Bottom Shelf Bracket & Wall Cantilever Column */}
        <div className="flex items-center gap-10 -mt-0.5">
          {/* Left Heavy-Duty Bracket */}
          <div className="w-2.5 h-4 bg-gradient-to-b from-zinc-700 to-zinc-950 border-x border-b border-zinc-600 rounded-b-xs shadow-md" />

          {/* Center Spec Tag badge */}
          <div className="px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[7px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <span className="text-white font-bold">{edition}</span>
            <span>•</span>
            <span className="text-emerald-400">{weight}</span>
          </div>

          {/* Right Heavy-Duty Bracket */}
          <div className="w-2.5 h-4 bg-gradient-to-b from-zinc-700 to-zinc-950 border-x border-b border-zinc-600 rounded-b-xs shadow-md" />
        </div>
      </div>
    </div>
  );
};
