import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Plus, Minus, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { StripeCheckoutModal } from "./StripeCheckoutModal";
import { sounds } from "@/lib/soundEffects";
import { Link } from "react-router-dom";

export const BottomCheckoutRail: React.FC = () => {
  const { cart, cartTotal, removeFromCart, updateQty } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const totalPieces = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleOpenStripe = () => {
    sounds.playHangerClick();
    setIsStripeModalOpen(true);
  };

  const handleRemoveItem = (id: string, color?: string, size?: string) => {
    sounds.playHangerClick();
    removeFromCart(id, color, size);
  };

  const handleUpdateQty = (id: string, newQty: number, color?: string, size?: string) => {
    sounds.playHangerClick();
    updateQty(id, newQty, color, size);
  };

  return (
    <>
      {/* Stripe Ready Modal */}
      <StripeCheckoutModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
      />

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none select-none">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-2 pointer-events-auto">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              /* Collapsed Floating Pill State */
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="flex items-center justify-between p-2.5 px-5 rounded-full bg-black/95 border border-white/20 text-white shadow-2xl backdrop-blur-xl max-w-md mx-auto"
              >
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="flex items-center gap-3 text-xs font-mono"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">
                    {totalPieces} {totalPieces === 1 ? "PIECE" : "PIECES"} ON RAIL
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span className="font-bold text-white">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenStripe}
                    disabled={cart.length === 0}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#635BFF] to-[#7a72ff] text-white text-[11px] font-mono font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 transition-all shadow-md"
                  >
                    <Lock className="w-3 h-3" />
                    <span>STRIPE</span>
                  </button>

                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white transition-all"
                    aria-label="Expand checkout rail"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Expanded Full Clothes Rail Cart */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="relative rounded-2xl bg-zinc-950/95 border border-white/20 text-white shadow-[0_-12px_45px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden"
              >
                {/* 1. Miniature Physical Rail Rod along the top */}
                <div className="relative w-full h-1.5 bg-gradient-to-r from-zinc-700 via-zinc-200 to-zinc-700 shadow-sm flex items-center justify-between px-6">
                  <div className="w-2 h-2 -ml-3 rounded-full bg-zinc-400 shadow-xs" />
                  <div className="w-2 h-2 -mr-3 rounded-full bg-zinc-400 shadow-xs" />
                </div>

                {/* 2. Content Row */}
                <div className="p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Left / Center: Miniature Hanging Garments along the rail */}
                  <div className="flex-1 overflow-x-auto scrollbar-none py-1">
                    {cart.length === 0 ? (
                      /* Empty state */
                      <div className="flex items-center gap-3 text-zinc-400 text-xs font-mono py-2 px-3">
                        <ShoppingBag className="w-4 h-4 text-zinc-500" />
                        <span>
                          YOUR RAIL IS CURRENTLY EMPTY — Click <strong className="text-white">"ADD TO RAIL"</strong> on any piece above to hang it on your checkout rack.
                        </span>
                      </div>
                    ) : (
                      /* Items hanging on mini hooks */
                      <div className="flex items-center gap-3 min-w-max">
                        {cart.map((item, idx) => (
                          <div
                            key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                            className="relative flex flex-col items-center group/item"
                          >
                            {/* Miniature Hanging Hook */}
                            <div className="w-3 h-3 rounded-t-full border-t-2 border-r-2 border-zinc-300 -mt-2 mb-0.5 bg-transparent" />

                            {/* Hanging Piece Card */}
                            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900 border border-white/10 group-hover/item:border-white/30 transition-all shadow-md">
                              {/* Thumbnail */}
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-10 h-10 object-cover rounded-lg bg-black border border-white/10 shrink-0"
                              />

                              {/* Details */}
                              <div className="min-w-0 pr-1">
                                <p className="text-[11px] font-semibold text-white tracking-tight truncate max-w-[120px]">
                                  {item.product.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                                  {item.selectedSize && (
                                    <span className="px-1 rounded bg-zinc-800 text-zinc-300 font-bold">
                                      {item.selectedSize}
                                    </span>
                                  )}
                                  {item.selectedColor && (
                                    <span className="truncate max-w-[70px]">
                                      {item.selectedColor}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] font-mono font-bold text-white mt-0.5">
                                  ₹{(item.product.price * item.qty).toLocaleString("en-IN")}
                                </p>
                              </div>

                              {/* Qty Steppers */}
                              <div className="flex items-center gap-1 pl-1 border-l border-white/10">
                                <button
                                  onClick={() =>
                                    handleUpdateQty(
                                      item.product.id,
                                      item.qty - 1,
                                      item.selectedColor,
                                      item.selectedSize
                                    )
                                  }
                                  className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-all"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[10px] font-mono font-bold w-4 text-center">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQty(
                                      item.product.id,
                                      item.qty + 1,
                                      item.selectedColor,
                                      item.selectedSize
                                    )
                                  }
                                  className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-all"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() =>
                                  handleRemoveItem(
                                    item.product.id,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                                className="ml-1 p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-all"
                                title="Remove item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Section: Total & Stripe-Ready Checkout Button */}
                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                    {/* Total Summary */}
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        {totalPieces} {totalPieces === 1 ? "PIECE" : "PIECES"} ON RAIL
                      </p>
                      <p className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Stripe Express Checkout Button */}
                      <button
                        onClick={handleOpenStripe}
                        disabled={cart.length === 0}
                        className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#635BFF] via-[#736bff] to-[#635BFF] hover:opacity-95 text-white text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 shadow-[0_4px_20px_rgba(99,91,255,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>PAY WITH STRIPE</span>
                      </button>

                      {/* View Standard Cart Link */}
                      <Link to="/cart">
                        <button
                          className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white text-xs font-mono tracking-wider flex items-center transition-all"
                          title="Full cart view"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      {/* Collapse Rail Button */}
                      <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-all"
                        aria-label="Collapse checkout rail"
                        title="Collapse rail"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
