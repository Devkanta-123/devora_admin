import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, MoveHorizontal, Shirt, Footprints } from "lucide-react";
import { T_SHIRTS, SNEAKERS, ClothesRailProduct } from "@/data/clothesRailProducts";
import { ClothesRailCard } from "./ClothesRailCard";
import { sounds } from "@/lib/soundEffects";

type CategoryType = "t-shirt" | "shoes";

export const VirtualClothesRail: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("t-shirt");
  const [isAudioEnabled, setIsAudioEnabled] = useState(sounds.enabled);

  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragWidth, setDragWidth] = useState(0);

  const x = useMotionValue(0);

  const currentProducts: ClothesRailProduct[] = activeCategory === "t-shirt" ? T_SHIRTS : SNEAKERS;

  // Recalculate drag boundary limits on mount, resize, or category change
  useEffect(() => {
    const updateConstraints = () => {
      if (trackRef.current && constraintsRef.current) {
        const trackScrollWidth = trackRef.current.scrollWidth;
        const containerClientWidth = constraintsRef.current.clientWidth;
        const maxDrag = Math.max(0, trackScrollWidth - containerClientWidth);
        setDragWidth(maxDrag);
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    const timer = setTimeout(updateConstraints, 250);

    return () => {
      window.removeEventListener("resize", updateConstraints);
      clearTimeout(timer);
    };
  }, [activeCategory]);

  const toggleSound = () => {
    const nextState = sounds.toggle();
    setIsAudioEnabled(nextState);
  };

  const handleSlideLeft = () => {
    sounds.playRailSlide();
    const currentX = x.get();
    animate(x, Math.min(0, currentX + 340), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  const handleSlideRight = () => {
    sounds.playRailSlide();
    const currentX = x.get();
    animate(x, Math.max(-dragWidth, currentX - 340), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  const handleCategoryChange = (cat: CategoryType) => {
    sounds.playHangerClick();
    setActiveCategory(cat);
    animate(x, 0, { type: "spring", stiffness: 350, damping: 30 });
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-zinc-950 text-white overflow-hidden border-y border-white/10 select-none">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 right-1/4 w-96 h-96 bg-zinc-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-zinc-300 text-xs font-mono tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>INTERACTIVE SHOWROOM // VIRTUAL RAIL</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              The Virtual Clothes Rail
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl leading-relaxed">
              Drag the metallic rail left and right to inspect garments. Hover any piece to engage real-time 360° product rotation, select colorways, and hang items directly onto your checkout rail.
            </p>
          </div>

          {/* Right Action Tools: Category Selector & Sound Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Toggle Tabs */}
            <div className="inline-flex p-1 rounded-full bg-zinc-900 border border-white/15 backdrop-blur-md">
              <button
                onClick={() => handleCategoryChange("t-shirt")}
                className={`relative px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "t-shirt"
                    ? "text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {activeCategory === "t-shirt" && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Shirt className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">T-Shirts ({T_SHIRTS.length})</span>
              </button>

              <button
                onClick={() => handleCategoryChange("shoes")}
                className={`relative px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "shoes"
                    ? "text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {activeCategory === "shoes" && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Footprints className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">Sneakers ({SNEAKERS.length})</span>
              </button>
            </div>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-full border transition-all text-xs flex items-center gap-1.5 ${
                isAudioEnabled
                  ? "bg-white/15 border-white/30 text-white shadow-glow"
                  : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200"
              }`}
              title={isAudioEnabled ? "Mute interactive sounds" : "Enable tactile sound FX"}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSlideLeft}
                className="w-9 h-9 rounded-full bg-zinc-900 border border-white/15 hover:border-white/40 text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
                aria-label="Slide rail left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleSlideRight}
                className="w-9 h-9 rounded-full bg-zinc-900 border border-white/15 hover:border-white/40 text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
                aria-label="Slide rail right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Drag Hint & Category Meta Substrip */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-200 font-semibold">
              {activeCategory === "t-shirt"
                ? "APPAREL CLOTHES RAIL // SLIDING HANGERS"
                : "SNEAKER DISPLAY RACK // HOVER TO POP OUT 3D VIEW"}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-zinc-400">
            <MoveHorizontal className="w-3.5 h-3.5 text-zinc-300" />
            <span>
              {activeCategory === "t-shirt"
                ? "DRAG CLOTHES RAIL LEFT / RIGHT"
                : "DRAG SNEAKER RACK LEFT / RIGHT • HOVER TO POP OUT"}
            </span>
          </div>
        </div>
      </div>

      {/* CLOTHES RAIL / SNEAKER RACK STAGE CONTAINER */}
      <div
        ref={constraintsRef}
        className="w-full relative overflow-hidden cursor-grab active:cursor-grabbing pt-2 pb-12"
      >
        {/* TOP PHYSICAL METAL RAIL ROD (Only displayed for T-Shirts!) */}
        {activeCategory === "t-shirt" && (
          <div className="relative w-full h-4 mb-3 z-10 flex items-center">
            {/* Left Wall Mounting Flange */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-r from-zinc-900 to-zinc-700 border-r border-zinc-600 rounded-r-md z-20 flex flex-col justify-around py-1 shadow-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mx-auto" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mx-auto" />
            </div>

            {/* Heavy Steel Rail Pipe (Cylindrical highlight) */}
            <div className="w-full h-3 bg-gradient-to-b from-zinc-400 via-zinc-100 to-zinc-600 shadow-[0_6px_16px_rgba(0,0,0,0.8)] relative">
              {/* Specular light highlight line */}
              <div className="w-full h-[1.5px] bg-white/90 shadow-sm" />
            </div>

            {/* Right Wall Mounting Flange */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-l from-zinc-900 to-zinc-700 border-l border-zinc-600 rounded-l-md z-20 flex flex-col justify-around py-1 shadow-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mx-auto" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mx-auto" />
            </div>
          </div>
        )}

        {/* TOP SNEAKER RACK RUNWAY HEADER (For Shoes / Sneakers) */}
        {activeCategory === "shoes" && (
          <div className="w-full px-6 sm:px-12 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
                DEVORA FOOTWEAR RACK // SHELF ARCHIVE S26
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest hidden md:block">
              [ 8 FOOTWEAR SPECIMENS • ANGLED DISPLAY SHELVES ]
            </div>
          </div>
        )}

        {/* DRAGGABLE RAIL / RACK TRACK */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            ref={trackRef}
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => sounds.playRailSlide()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`flex gap-6 sm:gap-8 px-6 sm:px-12 relative z-20 ${
              activeCategory === "shoes" ? "pt-6 pb-4" : ""
            }`}
          >
            {currentProducts.map((product, idx) => (
              <ClothesRailCard
                key={product.id}
                product={product}
                index={idx}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* BOTTOM SNEAKER RACK RUNWAY FOUNDATION BEAM (Only for Shoes) */}
        {activeCategory === "shoes" && (
          <div className="relative w-full h-4 mt-4 z-10 flex items-center">
            {/* Left Rack Stanchion Flange */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-8 bg-zinc-800 border-r border-zinc-600 rounded-r-md z-20 shadow-xl" />

            {/* Industrial Heavy Shelf Floor Runner */}
            <div className="w-full h-3 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-y border-zinc-600 relative flex items-center shadow-2xl">
              <div className="w-full h-[1px] bg-white/30" />
            </div>

            {/* Right Rack Stanchion Flange */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-8 bg-zinc-800 border-l border-zinc-600 rounded-l-md z-20 shadow-xl" />
          </div>
        )}
      </div>
    </section>
  );
};
