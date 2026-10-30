import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, RefreshCw, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { saveStoredOrder, Order } from "@/data/orders";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useStore();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("Alexandre De Vora");
  const [email, setEmail] = useState("atelier@devora.luxury");
  const [address, setAddress] = useState("102 Avenue Montaigne, Atelier 4B");
  const [city, setCity] = useState("Mumbai");
  const [postalCode, setPostalCode] = useState("400001");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

  const shipping = 0; // Complimentary luxury shipping
  const total = cartTotal + shipping;

  const handleQuickFill = () => {
    setCardNumber("4242 •••• •••• 4242");
    setExpiry("12/28");
    setCvc("888");
    toast.success("Stripe test credentials populated");
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your clothes rail is empty.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `DEV-STP-${Math.floor(100000 + Math.random() * 900000)}`;
      const dateFormatted = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeFormatted = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newOrder: Order = {
        id: orderId,
        orderDate: `${dateFormatted} • ${timeFormatted}`,
        status: "Order Confirmed",
        paymentStatus: "Paid",
        paymentMethod: "Stripe 256-bit Secure Express",
        totalAmount: total,
        subtotal: cartTotal,
        estimatedDeliveryDate: "Priority 2-Day Air",
        shippingCarrier: "Devora White Glove Courier",
        trackingNumber: `DV-STP-${Math.floor(100000 + Math.random() * 900000)}`,
        deliveryInformation: {
          customerName: name,
          phone: "+91 98200 12345",
          addressLine1: address,
          city: city,
          state: "Maharashtra",
          postalCode: postalCode,
          country: "India",
        },
        returnInformation: {
          eligible: true,
          policy: "Complimentary 30-Day Atelier Returns",
          window: "30 days from dispatch",
          description: "All clothes-rail garments arrive in climate-sealed wardrobe packaging with prepaid return seals.",
        },
        timeline: [
          {
            status: "Order Confirmed",
            label: "Stripe Payment Captured",
            description: "256-bit encrypted transaction finalized via Stripe Payments.",
            timestamp: `${dateFormatted} • ${timeFormatted}`,
            location: "Stripe Cloud Gateway",
            completed: true,
            current: true,
          },
          {
            status: "Packed",
            label: "Atelier Garment Packaging",
            description: "Garments steamed, tagged, and folded into Devora magnetic presentation box.",
            location: "Central Atelier",
            completed: false,
            current: false,
          },
        ],
        items: cart.map((c) => ({
          id: c.product.id,
          name: c.product.name,
          price: c.product.price,
          quantity: c.qty,
          image: c.product.image,
          category: c.product.category,
        })),
      };

      saveStoredOrder(newOrder);
      setCreatedOrderId(orderId);
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      toast.success("Payment authorized by Stripe!");
    }, 1800);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        >
          {/* Top Stripe Branded Header */}
          <div className="px-6 py-4 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#8075ff] flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-base tracking-tighter">S</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Stripe Secure Express Checkout
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#635BFF]/20 text-[#a59fff] text-[10px] font-mono font-semibold border border-[#635BFF]/40">
                    TEST MODE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit SSL encrypted • Instant authorization</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto">
            {isSuccess ? (
              /* Success Screen */
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-2xl font-bold text-white">
                    Order Confirmed via Stripe
                  </h4>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto">
                    Your transaction has been securely captured. A confirmation receipt has been dispatched to{" "}
                    <span className="text-white font-mono">{email}</span>.
                  </p>
                </div>

                <div className="inline-block p-4 rounded-xl bg-zinc-900 border border-white/10 font-mono text-xs text-left space-y-1">
                  <div className="text-zinc-400">ORDER IDENTIFIER:</div>
                  <div className="text-base font-bold text-emerald-400">{createdOrderId}</div>
                  <div className="text-[10px] text-zinc-500 pt-1">
                    STRIPE TRANSACTION CHARGE: COMPLETED
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <Link to="/order-tracking" onClick={handleClose}>
                    <button className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg">
                      <span>Track Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 rounded-full bg-zinc-900 border border-white/15 text-white font-medium text-xs tracking-wider uppercase hover:bg-zinc-800 transition-all"
                  >
                    Back to Rail
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form Layout */
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left Column: Order Pieces from Rail (2 cols) */}
                <div className="md:col-span-2 space-y-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                      Items on Rail ({cart.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleQuickFill}
                      className="text-[10px] font-mono text-[#a59fff] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-fill Test Card
                    </button>
                  </div>

                  {/* List of Hanging Pieces */}
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/60 border border-white/10"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded bg-black shrink-0 border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            Qty: {item.qty} {item.selectedSize ? `• ${item.selectedSize}` : ""} {item.selectedColor ? `• ${item.selectedColor}` : ""}
                          </p>
                          <p className="text-xs font-mono font-bold text-white mt-0.5">
                            ₹{(item.product.price * item.qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Atelier Courier</span>
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                      <span>Total Due</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Stripe Payment Form (3 cols) */}
                <form onSubmit={handlePay} className="md:col-span-3 space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 uppercase mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 focus:border-[#635BFF] text-white text-xs outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 uppercase mb-1 flex justify-between">
                      <span>Card Details</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Stripe Elements</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 rounded-lg bg-zinc-900 border border-white/15 focus:border-[#635BFF] text-white text-xs outline-none transition-all font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-300 uppercase mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 focus:border-[#635BFF] text-white text-xs outline-none transition-all font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-300 uppercase mb-1 flex justify-between">
                        <span>CVC</span>
                        <Lock className="w-3 h-3 text-zinc-500" />
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 focus:border-[#635BFF] text-white text-xs outline-none transition-all font-mono text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 uppercase mb-1">
                      Billing Address & Country
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="col-span-2 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 focus:border-[#635BFF] text-white text-xs outline-none transition-all font-mono"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 focus:border-[#635BFF] text-white text-xs outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Stripe Pay Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#635BFF] via-[#756eff] to-[#635BFF] hover:opacity-95 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,91,255,0.4)] transition-all duration-300 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authorizing via Stripe Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Pay ₹{total.toLocaleString("en-IN")} via Stripe</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
