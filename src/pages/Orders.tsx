import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Headphones,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Search,
  ChevronRight,
  Printer,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredOrders, Order } from "@/data/orders";
import { toast } from "sonner";

export const OrdersContent: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [orders] = useState<Order[]>(() => getStoredOrders());
  const [filter, setFilter] = useState<"all" | "in_transit" | "delivered">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(`Copied ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filter === "in_transit") {
      if (!["Packed", "Shipped", "Out for Delivery", "Order Confirmed"].includes(order.status)) {
        return false;
      }
    } else if (filter === "delivered") {
      if (order.status !== "Delivered") return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.name.toLowerCase().includes(q));
      const matchCarrier = order.shippingCarrier.toLowerCase().includes(q);
      if (!matchId && !matchItem && !matchCarrier) return false;
    }

    return true;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      case "Out for Delivery":
        return "bg-primary/20 text-primary border-primary/40 shadow-glow animate-pulse";
      case "Shipped":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "Packed":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-10">
      {/* 5 E-COMMERCE INFORMATION & ASSURANCE CARDS (Requirement 7) */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* 1. Easy Returns */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-soft flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">Easy 1–2 Day Return Policy</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-primary pt-3 inline-flex items-center gap-1">
            Hassle-free pickups <ChevronRight className="h-3 w-3" />
          </span>
        </div>

        {/* 2. Secure Payments */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-soft flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">100% Secure Payments</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your payment information is protected using secure payment processing.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-500 pt-3 inline-flex items-center gap-1">
            256-Bit Encrypted <ShieldCheck className="h-3 w-3" />
          </span>
        </div>

        {/* 3. Order Protection */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-soft flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">Order Protection</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every Devora order is carefully packed and prepared before dispatch.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-primary pt-3 inline-flex items-center gap-1">
            Tamper-proof sealed <Package className="h-3 w-3" />
          </span>
        </div>

        {/* 4. Delivery Support */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-soft flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Headphones className="h-4 w-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">Need Help With Your Order?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contact Devora support if you have questions about delivery, returns, or your order.
            </p>
          </div>
          <Link to="/contact" className="pt-3">
            <Button size="sm" variant="outline" className="w-full h-8 text-[11px] font-semibold gap-1 rounded-lg">
              Contact Support <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* 5. Authentic Products */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-soft flex flex-col justify-between hover:border-primary/40 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">Quality You Can Trust</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shop with confidence knowing your Devora orders are carefully processed and verified.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-500 pt-3 inline-flex items-center gap-1">
            100% Genuine Devora <Check className="h-3 w-3" />
          </span>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === "all" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("in_transit")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === "in_transit"
                ? "bg-background text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            In Transit ({orders.filter((o) => ["Packed", "Shipped", "Out for Delivery", "Order Confirmed"].includes(o.status)).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("delivered")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === "delivered"
                ? "bg-background text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Delivered ({orders.filter((o) => o.status === "Delivered").length})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders or products..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-background border border-border text-xs outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* 6. ORDER CARDS LIST (Requirement 8 Layout) */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border bg-surface/50 space-y-4">
            <Package className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-lg font-bold">No orders found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any orders matching your criteria. Browse our store to discover new essentials.
            </p>
            <Link to="/shop">
              <Button size="sm" className="shadow-glow">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-soft hover:shadow-elevated transition-all duration-300 space-y-6"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Order ID:</span>
                    <span className="font-mono text-sm font-bold text-foreground">#{order.id}</span>
                    <button
                      type="button"
                      onClick={() => copyId(order.id)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Copy Order ID"
                    >
                      {copiedId === order.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Ordered on {order.orderDate}
                  </p>
                </div>

                {/* Header Action: Track Live Button */}
                <div className="flex items-center gap-2.5">
                  <Link to={`/order-tracking?id=${order.id}`}>
                    <Button size="sm" className="h-9 px-4 rounded-xl gap-2 shadow-glow text-xs font-semibold">
                      <Truck className="h-3.5 w-3.5" /> Track Live Package
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items in Order */}
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-surface-elevated border border-border shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{item.name}</h4>
                        {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Quantity: <strong className="text-foreground">{item.quantity}</strong></span>
                          <span>•</span>
                          <span>Unit Price: ₹{item.price.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-muted-foreground block">Item Total</span>
                      <span className="font-display font-bold text-sm sm:text-base text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Meta Footer: Delivery, Estimated Delivery, Return Policy, Total */}
              <div className="pt-5 border-t border-border grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-2xl">
                {/* 1. Delivery Information */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" /> Delivery Details
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate">{order.deliveryInformation.customerName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {order.deliveryInformation.city}, {order.deliveryInformation.state} — {order.deliveryInformation.postalCode}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">Carrier: {order.shippingCarrier}</p>
                </div>

                {/* 2. Estimated Delivery Date */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" /> Estimated Delivery
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    {order.status === "Delivered" ? order.actualDeliveryDate || order.estimatedDeliveryDate : order.estimatedDeliveryDate}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">Waybill: {order.trackingNumber}</p>
                </div>

                {/* 3. Return Information */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <RotateCcw className="h-3 w-3 text-primary" /> Return Status
                  </span>
                  <p className="text-xs font-semibold text-foreground">{order.returnInformation.policy}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{order.returnInformation.window}</p>
                </div>

                {/* 4. Total Amount & Payment Info */}
                <div className="space-y-1 sm:text-right">
                  <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Total Amount</span>
                  <p className="font-display text-lg font-extrabold text-primary">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Orders: React.FC = () => {
  return (
    <div className="container py-12 sm:py-16 max-w-6xl">
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <Package className="h-4 w-4" /> Devora Customer Orders
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
          Your Orders
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          Review recent purchases, track live shipments with real-time status updates, and manage hassle-free returns.
        </p>
      </div>

      <OrdersContent />
    </div>
  );
};

export default Orders;
