import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag, CreditCard, Banknote, QrCode, CheckCircle2, ArrowRight, Truck, Copy, Check, Package } from "lucide-react";
import { toast } from "sonner";
import { saveStoredOrder, Order } from "@/data/orders";

type PaymentMethod = "cod" | "card" | "upi";

const Cart = () => {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useStore();
  const shipping = cartTotal > 100 || cart.length === 0 ? 0 : 12;
  const total = cartTotal + shipping;

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [copiedId, setCopiedId] = useState(false);

  const handleProceedPayment = () => {
    const newId = `DEV-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedOrderId(newId);

    const methodName = paymentMethod === "upi" ? "UPI Instant Payment" : paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card";
    const dateFormatted = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeFormatted = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newOrder: Order = {
      id: newId,
      orderDate: `${dateFormatted} • ${timeFormatted}`,
      status: "Order Confirmed",
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      paymentMethod: methodName,
      totalAmount: total,
      subtotal: cartTotal,
      estimatedDeliveryDate: "10 September 2026",
      shippingCarrier: "Devora Express Priority",
      trackingNumber: `DV-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryInformation: {
        customerName: "Alex Morgan",
        phone: "+91 98621 54321",
        addressLine1: "42 Linden Studio Complex, Babupara",
        city: "Imphal East",
        state: "Manipur",
        postalCode: "795005",
        country: "India",
      },
      returnInformation: {
        eligible: true,
        policy: "Easy 1–2 Day Return Policy",
        window: "Eligible for return within 1–2 days of delivery",
        description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
      },
      timeline: [
        {
          status: "Order Confirmed",
          label: "Order Confirmed",
          description: "Your order has been received and confirmed by Devora.",
          timestamp: `${dateFormatted} • ${timeFormatted}`,
          location: "Devora Central System",
          completed: true,
          current: true,
        },
        {
          status: "Packed",
          label: "Packed",
          description: "Your order has been carefully packed and is ready to leave our warehouse.",
          location: "Imphal East Studio",
          completed: false,
          current: false,
        },
        {
          status: "Shipped",
          label: "Shipped",
          description: "Your order has been handed over to our delivery partner.",
          completed: false,
          current: false,
        },
        {
          status: "Out for Delivery",
          label: "Out for Delivery",
          description: "Your Devora order is currently on its way to you.",
          completed: false,
          current: false,
        },
        {
          status: "Delivered",
          label: "Delivered",
          description: "Your order has been successfully delivered.",
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
    setOrderPlaced(true);
    clearCart();
    toast.success(`Payment Successful! Your order #${newId} has been placed via ${methodName}.`);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container py-32 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Discover something you'll love.</p>
        <Link to="/shop"><Button size="lg" className="shadow-glow">Continue shopping</Button></Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container py-20 max-w-xl text-center space-y-6 animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm">
          Thank you for your order with Devora. We've received your request and your items are being prepared for dispatch from our Imphal East studio.
        </p>

        {/* Order Details & ID Card */}
        <div className="p-6 rounded-2xl border border-border bg-surface text-left text-xs space-y-3 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="font-semibold text-sm">Order Reference</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">#{createdOrderId}</span>
              <button
                type="button"
                onClick={() => copyId(createdOrderId)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Copy Order ID"
              >
                {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between"><span>Payment Method:</span> <strong className="uppercase">{paymentMethod}</strong></div>
          <div className="flex justify-between"><span>Total Amount Paid:</span> <strong className="text-foreground font-semibold">₹{total.toFixed(2)}</strong></div>
          <div className="flex justify-between"><span>Delivery Address:</span> <span>Imphal East, Manipur, India</span></div>
          <div className="flex justify-between"><span>Status:</span> <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Order Confirmed</span></div>
        </div>

        {/* Action Buttons: Track Order & My Orders */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={`/order-tracking?id=${createdOrderId}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 shadow-glow px-6">
              <Truck className="h-4 w-4" /> Track Order Now
            </Button>
          </Link>
          <Link to="/orders" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6">
              <Package className="h-4 w-4" /> View My Orders
            </Button>
          </Link>
          <Link to="/shop" className="w-full sm:w-auto">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto px-6">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Your cart</h1>
      
      <div className="grid lg:grid-cols-[1fr,380px] gap-10">
        {/* Cart Items List */}
        <div className="space-y-4">
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 p-4 rounded-lg border border-border bg-surface">
              <Link to={`/product/${product.id}`} className="h-24 w-24 sm:h-28 sm:w-28 rounded-md overflow-hidden bg-surface-elevated flex-shrink-0">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${product.id}`} className="font-medium hover:text-primary">{product.name}</Link>
                  <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground capitalize mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => updateQty(product.id, qty - 1)} className="h-9 w-9 flex items-center justify-center hover:bg-muted">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} className="h-9 w-9 flex items-center justify-center hover:bg-muted">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-semibold">₹{(product.price * qty).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <aside className="h-fit p-6 rounded-lg border border-border bg-surface sticky top-24 space-y-6">
          <h2 className="font-semibold text-lg border-b border-border pb-4">Order summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <Button size="lg" className="w-full shadow-glow" onClick={() => setCheckoutOpen(true)}>
            Proceed to Checkout
          </Button>
          <Link to="/shop" className="block text-center text-sm text-muted-foreground hover:text-primary mt-2">
            Continue shopping
          </Link>
        </aside>
      </div>

      {/* Checkout Payment Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-hidden">
            
            <button onClick={() => setCheckoutOpen(false)} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Devora Checkout</span>
              <h2 className="font-display text-2xl font-bold mt-1">Select Payment Method</h2>
              <p className="text-xs text-muted-foreground mt-1">Total Payable: <strong className="text-foreground">₹{total.toLocaleString("en-IN")}</strong></p>
            </div>

            {/* Payment Options (COD, Credit Card, UPI) */}
            <div className="grid gap-3">
              
              {/* Option 1: UPI / QR */}
              <label
                onClick={() => setPaymentMethod("upi")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-smooth ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-2">
                      UPI / GPay / PhonePe / Paytm <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Instant</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Fast direct UPI payment transfer</p>
                  </div>
                </div>
                <input type="radio" name="payment" checked={paymentMethod === "upi"} readOnly className="accent-primary" />
              </label>

              {/* Option 2: Credit / Debit Card */}
              <label
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-smooth ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
                <input type="radio" name="payment" checked={paymentMethod === "card"} readOnly className="accent-primary" />
              </label>

              {/* Option 3: COD */}
              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-smooth ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground">Pay cash when package arrives</p>
                  </div>
                </div>
                <input type="radio" name="payment" checked={paymentMethod === "cod"} readOnly className="accent-primary" />
              </label>

            </div>

            {/* Confirm Order Action Button */}
            <Button
              size="lg"
              className="w-full shadow-glow py-6 font-bold text-base rounded-xl"
              onClick={handleProceedPayment}
            >
              Complete Order (₹{total.toFixed(2)}) <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
