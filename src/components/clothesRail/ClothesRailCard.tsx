import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Check, Sparkles } from "lucide-react";
import { ClothesRailProduct, ProductColor } from "@/data/clothesRailProducts";
import { ClothesHanger } from "./ClothesHanger";
import { ShoeRackStand } from "./ShoeRackStand";
import { useStore } from "@/context/StoreContext";
import { sounds } from "@/lib/soundEffects";

interface ClothesRailCardProps {
  product: ClothesRailProduct;
  index: number;
}

export const ClothesRailCard: React.FC<ClothesRailCardProps> = ({ product, index }) => {
  const { addToCart, isWished, toggleWishlist } = useStore();
  const wished = isWished(product.id);

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);

  const isShoe = product.category === "shoes";
  const activeImage = selectedColor?.image || product.image;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    sounds.playHangerClick();
    addToCart(product.id, 1, {
      color: selectedColor.name,
      size: selectedSize,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleColorSelect = (e: React.MouseEvent, color: ProductColor) => {
    e.stopPropagation();
    sounds.playRailSlide();
    setSelectedColor(color);
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    sounds.playHangerClick();
    setSelectedSize(size);
  };

  return (
    <div
      className={`flex flex-col items-center shrink-0 w-[285px] sm:w-[320px] select-none group relative ${
        isHovered ? "z-40" : "z-10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. TOP FIXTURE:
          - Only T-Shirts have top clothing hangers on the rail.
          - Shoes / Sneakers sit on the bottom Shoe Rack Stand (no shirt hangers!).
      */}
      {!isShoe && (
        <div className="w-full relative z-20">
          <ClothesHanger isHovered={isHovered} />
        </div>
      )}

      {/* 2. MAIN PRODUCT CARD:
          - For Shoes: POPS OUT dramatically on hover (scale: 1.14, y: -24, rotate: -2.5deg, deep shadow).
          - For T-Shirts: elegant hanger lift & sway.
          - Kept that exact product visible on hover (NO video replacement).
      */}
      <motion.div
        animate={
          isHovered
            ? isShoe
              ? {
                  // SNEAKER POP-OUT EFFECT
                  y: -24,
                  scale: 1.14,
                  rotate: -2.5,
                  transition: { type: "spring", stiffness: 450, damping: 25 },
                }
              : {
                  // T-SHIRT LIFT & SLIGHT TILT
                  y: -10,
                  scale: 1.03,
                  rotate: 0.8,
                  transition: { type: "spring", stiffness: 350, damping: 25 },
                }
            : {
                y: 0,
                scale: 1,
                rotate: 0,
                transition: { duration: 0.28, ease: "easeOut" },
              }
        }
        className={`w-full relative z-30 bg-black/95 dark:bg-zinc-950/98 text-white border rounded-2xl p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          isHovered
            ? "border-white/50 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.95),0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/30"
            : "border-white/15 dark:border-white/10"
        }`}
      >
        {/* Visual Media Container (Always displays the authentic product image) */}
        <div
          onClick={handleAddToCart}
          className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-white/30 transition-all duration-300 cursor-pointer"
        >
          {/* Active Product Photo with smooth crossfade when color changes */}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={`${product.name} - ${selectedColor.name}`}
              draggable={false}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: isHovered ? (isShoe ? 1.06 : 1.04) : 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Luxury Editorial Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25 pointer-events-none" />

          {/* Top Badges Bar */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-auto">
            {/* Edition & Material Tag */}
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-widest text-zinc-300 uppercase">
              {product.edition}
            </span>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                wished
                  ? "bg-rose-500 text-white border-rose-400"
                  : "bg-black/70 text-zinc-300 border-white/20 hover:text-white hover:border-white/40"
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Pop-out indicator pill for shoes on hover */}
          {isShoe && isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-10 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/40 text-white text-[9px] font-mono tracking-wider backdrop-blur-md"
            >
              <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
              <span className="font-bold">INSPECTION POP-OUT</span>
            </motion.div>
          )}

          {/* Action "ADD TO RAIL" Button */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 pointer-events-auto">
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.96 }}
              className={`w-full py-2.5 px-3 rounded-lg font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                justAdded
                  ? "bg-emerald-500 text-black border border-emerald-400 font-bold"
                  : "bg-white text-black hover:bg-zinc-200 border border-white font-semibold group-hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>HUNG TO RAIL</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ADD TO RAIL</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* 3. Product Metadata & Color/Size Selectors */}
        <div className="mt-3 space-y-2.5 px-1">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                {product.sku} // {product.material}
              </p>
              <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-zinc-200">
                {product.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-white font-mono">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Colorways Selector: Clicking swaps product image in real-time */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[10px] text-zinc-400 font-mono">
              COLOR: <strong className="text-white">{selectedColor.name}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => handleColorSelect(e, color)}
                  className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                    selectedColor.name === color.name
                      ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-125 border-white shadow-sm"
                      : "border-white/30 opacity-70 hover:opacity-100 hover:scale-110"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={`Switch to ${color.name}`}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[10px] text-zinc-400 font-mono">
              SIZE: <strong className="text-white">{selectedSize}</strong>
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {product.sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeSelect(e, size)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium transition-all ${
                    selectedSize === size
                      ? "bg-white text-black font-bold shadow-xs scale-105"
                      : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700"
                  }`}
                >
                  {size}
                </button>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-[8px] text-zinc-500 font-mono">+{product.sizes.length - 5}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. BOTTOM FIXTURE:
          - For Shoes / Sneakers: Authentic industrial Shoe Rack Display Shelf Stand (no shirt rails!).
          - For T-Shirts: Hanging floor ambient shadow.
      */}
      {isShoe ? (
        <ShoeRackStand
          isHovered={isHovered}
          sku={product.sku}
          weight={product.weight}
          edition={product.edition}
        />
      ) : (
        <div className="w-48 h-3 rounded-full bg-black/40 blur-md mt-2 transition-all duration-300 group-hover:scale-110 group-hover:opacity-60" />
      )}
    </div>
  );
};
