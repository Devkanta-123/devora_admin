import React from "react";
import { motion } from "framer-motion";

interface ShoeSuspensionRackProps {
  isHovered?: boolean;
  sku?: string;
  weight?: string;
  edition?: string;
}

export const ShoeSuspensionRack: React.FC<ShoeSuspensionRackProps> = ({
  isHovered = false,
  sku = "DVR-SNK-01",
  weight = "390g",
  edition = "EDITION // S26",
}) => {
  return (
    <div className="relative flex flex-col items-center w-full select-none pointer-events-none">
      {/* Dual Steel Rail Clamps sliding on the physical rail */}
      <div className="relative -top-2 w-52 flex justify-between px-6">
        {/* Left Clamp & Cable */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-100 bg-transparent shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
          <div className="w-2 h-2 -mt-1 rounded-full bg-zinc-400 border border-zinc-600" />
          <div className="w-[1.5px] h-7 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-xs" />
        </div>

        {/* Right Clamp & Cable */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-100 bg-transparent shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
          <div className="w-2 h-2 -mt-1 rounded-full bg-zinc-400 border border-zinc-600" />
          <div className="w-[1.5px] h-7 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-xs" />
        </div>
      </div>

      {/* Floating Industrial Suspension Cradle Bracket */}
      <motion.div
        animate={isHovered ? { y: -3, rotate: [0, -1, 1, 0] } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-64 -mt-1 flex flex-col items-center origin-top"
      >
        {/* Horizontal Brushed Steel Suspension Crossbar */}
        <div className="w-60 h-2 rounded-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 border border-zinc-700/60 shadow-md flex items-center justify-between px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shadow-xs" />
          <span className="text-[7px] font-mono tracking-widest text-zinc-300 font-bold uppercase">
            DEVORA FOOTWEAR RACK // {sku}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shadow-xs" />
        </div>

        {/* Hanging Specimen Tag */}
        <div className="absolute -right-2 top-3 z-10 flex flex-col items-center">
          {/* Tag string */}
          <div className="w-px h-3 bg-zinc-400" />
          {/* Acrylic / Kraft Specimen Tag */}
          <div className="bg-black/90 text-white border border-white/20 backdrop-blur-md px-1.5 py-1 rounded text-[7px] font-mono tracking-wider shadow-lg flex flex-col gap-0.5 transform rotate-6">
            <span className="text-zinc-400 uppercase">{edition}</span>
            <span className="text-emerald-400 font-semibold">{weight}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
