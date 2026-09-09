import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Printer,
  Headphones,
  CreditCard,
  Building2,
} from "lucide-react";
import orderPackVideo from "@/assets/video/order_pack.mp4";
import heroFallback from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { findOrderByQuery, Order, TimelineStep } from "@/data/orders";
import { toast } from "sonner";

const OrderTracking: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("id") || "";

  const [orderIdInput, setOrderIdInput] = useState(queryFromUrl);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isAnimatingTimeline, setIsAnimatingTimeline] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [revealedBarPct, setRevealedBarPct] = useState(0);
  const [errorState, setErrorState] = useState<{ query: string; message: string } | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const animationRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-search if query ID is present in URL
  useEffect(() => {
    if (queryFromUrl) {
      setOrderIdInput(queryFromUrl);
      executeTrack(queryFromUrl);
    }
  }, [queryFromUrl]);

  const executeTrack = (idToSearch: string) => {
    const trimmed = idToSearch.trim();
    if (!trimmed) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    setIsAnimatingTimeline(true);
    setAnimationProgress(0);
    setErrorState(null);
    setActiveOrder(null);
    setRevealedBarPct(0);

    // Smooth scroll down towards the animation section
    setTimeout(() => {
      animationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2.2;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setAnimationProgress(100);

        setTimeout(() => {
          setIsAnimatingTimeline(false);
          const order = findOrderByQuery(trimmed);
          if (order) {
            setActiveOrder(order);
            setErrorState(null);

            // Animate real timeline bar smoothly into active position
            setTimeout(() => {
              const stepIndex = order.timeline.findIndex((t) => t.current);
              const effectiveIndex = stepIndex >= 0 ? stepIndex : order.status === "Delivered" ? 4 : 0;
              const pct = (effectiveIndex / (order.timeline.length - 1)) * 100;
              setRevealedBarPct(pct);
              resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          } else {
            setErrorState({
              query: trimmed,
              message: "We couldn't find an order with this ID. Please check your Order ID and try again.",
            });
            setActiveOrder(null);
          }
        }, 320);
      } else {
        setAnimationProgress(currentProgress);
      }
    }, 35);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setSearchParams({ id: orderIdInput.trim() });
    executeTrack(orderIdInput.trim());
  };

  const handleSelectSample = (sampleId: string) => {
    setOrderIdInput(sampleId);
    setSearchParams({ id: sampleId });
    executeTrack(sampleId);
  };

  const copyTrackingNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const getStepIcon = (status: TimelineStep["status"], completed: boolean, current: boolean) => {
    if (completed && !current) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    }
    switch (status) {
      case "Order Confirmed":
        return <Sparkles className={`h-5 w-5 ${current ? "text-primary animate-pulse" : "text-muted-foreground"}`} />;
      case "Packed":
        return <Package className={`h-5 w-5 ${current ? "text-primary animate-pulse" : "text-muted-foreground"}`} />;
      case "Shipped":
        return <Truck className={`h-5 w-5 ${current ? "text-primary animate-pulse" : "text-muted-foreground"}`} />;
      case "Out for Delivery":
        return <MapPin className={`h-5 w-5 ${current ? "text-primary animate-pulse" : "text-muted-foreground"}`} />;
      case "Delivered":
        return <CheckCircle2 className={`h-5 w-5 ${current ? "text-primary" : "text-muted-foreground"}`} />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const sampleIds = ["DEV-102938", "DV-10199", "DV-10044", "DEV-20451"];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* 1. HERO / ANIMATION SECTION - Full-Screen edge-to-edge like Home page */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Full-width Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover scale-105 filter brightness-[0.72] contrast-[1.08] z-0"
        >
          <source src={orderPackVideo} type="video/mp4" />
          <img
            src={heroFallback}
            alt="Devora Order Packaging Station"
            className="h-full w-full object-cover"
          />
        </video>

        {/* Ambient Hero Gradients matching Home.tsx */}
        <div className="absolute inset-0 bg-gradient-hero opacity-85 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent z-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Hero Content Overlay */}
        <div className="container relative z-20 py-20 sm:py-28">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-semibold tracking-wide text-primary border border-primary/30 shadow-glow">
              <Truck className="h-3.5 w-3.5 animate-pulse text-primary" />
              <span>DEVORA PRIORITY FULFILLMENT</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-white">
              Track Your Order
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-lg font-normal">
              Your Devora order is on its way.
            </p>

            {/* Order ID Search Component */}
            <div className="pt-2 max-w-xl">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2.5">
                Enter your Order ID
              </label>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 p-1.5 sm:p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 shadow-elevated focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    placeholder="e.g. DEV-102938"
                    aria-label="Order ID"
                    className="w-full h-12 sm:h-13 pl-11 pr-4 rounded-xl bg-transparent text-white placeholder:text-zinc-400 text-sm sm:text-base outline-none font-medium"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isAnimatingTimeline}
                  size="lg"
                  className="h-12 sm:h-13 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  {isAnimatingTimeline ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Scanning...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Track Order <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Quick-test Sample Order ID Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-1 text-xs text-zinc-400">
                <span className="font-medium text-zinc-300">Quick Test IDs:</span>
                {sampleIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectSample(id)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50 border border-white/10 font-mono text-zinc-300 transition-all duration-200"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ANIMATION TIMELINE SCANNER (Displays immediately upon clicking Track) */}
      {isAnimatingTimeline && (
        <section ref={animationRef} className="container mt-12 max-w-5xl space-y-8 animate-fade-in">
          <div className="p-8 sm:p-12 rounded-3xl border border-primary/30 bg-surface/95 shadow-glow backdrop-blur-xl space-y-8 text-center relative overflow-hidden">
            {/* Ambient Shimmer Scanner Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/30 shadow-glow animate-pulse">
                <Truck className="h-3.5 w-3.5" />
                <span>DEVORA REAL-TIME DISPATCH SCANNER</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                Analyzing Live Logistics Telemetry
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                Establishing encrypted coordinates across Devora fulfillment network for Order{" "}
                <span className="font-mono text-primary font-bold">#{orderIdInput.toUpperCase() || "DEV-102938"}</span>
              </p>
            </div>

            {/* The Animated Timeline */}
            <div className="relative pt-10 pb-6 max-w-4xl mx-auto">
              {/* Background track line */}
              <div className="absolute top-16 left-8 right-8 h-1.5 bg-muted rounded-full" />
              {/* Active progressive laser beam */}
              <div
                className="absolute top-16 left-8 h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full shadow-glow transition-all duration-150 ease-out"
                style={{ width: `calc(${Math.min(animationProgress, 98)}% - 16px)` }}
              />

              {/* Moving truck indicator along the timeline */}
              <div
                className="absolute top-11 -ml-5 z-20 transition-all duration-150 ease-out hidden sm:flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-glow border-2 border-background"
                style={{ left: `calc(16px + ${Math.min(animationProgress, 94)}% * 0.94)` }}
              >
                <Truck className="h-5 w-5 animate-bounce" />
              </div>

              {/* 5 Timeline Nodes */}
              <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-4">
                {[
                  { label: "Order Confirmed", icon: Sparkles, pct: 10 },
                  { label: "Packed", icon: Package, pct: 35 },
                  { label: "Shipped", icon: Truck, pct: 60 },
                  { label: "Out for Delivery", icon: MapPin, pct: 85 },
                  { label: "Expected 10 Sep 2026", icon: CheckCircle2, pct: 100 },
                ].map((step, idx) => {
                  const isPassed = animationProgress >= step.pct;
                  const isCurrent = animationProgress >= step.pct - 20 && animationProgress < step.pct;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div
                        className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isPassed
                            ? "bg-primary text-primary-foreground border-primary shadow-glow scale-105"
                            : isCurrent
                            ? "bg-primary/20 text-primary border-primary animate-pulse scale-110 ring-4 ring-primary/20"
                            : "bg-surface-elevated text-muted-foreground border-border"
                        }`}
                      >
                        <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isPassed ? "text-primary-foreground" : ""}`} />
                      </div>
                      <span
                        className={`text-[11px] sm:text-xs font-bold mt-3 transition-colors ${
                          isPassed ? "text-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                      {idx === 4 && (
                        <span className="text-[10px] font-bold text-emerald-500 font-mono mt-0.5">
                          10 Sep 2026
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Telemetry Progress Readout */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border/80 max-w-xl mx-auto flex items-center justify-between gap-4 relative z-10 shadow-soft">
              <div className="flex items-center gap-3 text-left">
                <div className="h-3 w-3 rounded-full bg-primary animate-ping" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {animationProgress < 25 && "Verifying Order ID & Devora authentication tokens..."}
                    {animationProgress >= 25 && animationProgress < 50 && "Accessing Imphal East dispatch center staging log..."}
                    {animationProgress >= 50 && animationProgress < 75 && "Transmitting carrier waypoint telemetry..."}
                    {animationProgress >= 75 && animationProgress < 95 && "Calculating ETA: Expected on 10 September 2026..."}
                    {animationProgress >= 95 && "Live tracking coordinates synchronized!"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Telemetry status: {Math.round(animationProgress)}% completed
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-extrabold text-primary shrink-0">
                {Math.round(animationProgress)}%
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 3. INLINE ANIMATED ERROR STATE */}
      {errorState && !isAnimatingTimeline && (
        <section className="container mt-8 max-w-4xl animate-fade-in">
          <div className="p-6 sm:p-8 rounded-2xl border border-destructive/40 bg-destructive/5 dark:bg-destructive/10 backdrop-blur-md shadow-soft">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-destructive/15 text-destructive shrink-0">
                <AlertCircle className="h-6 w-6 animate-bounce" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-bold text-foreground">Order not found</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We couldn't find an order with this ID. Please check your Order ID and try again.
                </p>
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Searched: <code className="px-2 py-0.5 rounded bg-muted font-mono">{errorState.query}</code>
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectSample("DEV-102938")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Try sample order DEV-102938
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/contact" className="text-xs font-semibold text-muted-foreground hover:text-foreground underline">
                    Contact Devora Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. REVEALED ORDER TRACKING RESULT ("and came") */}
      {activeOrder && !isAnimatingTimeline && (
        <div ref={resultRef} className="container mt-12 max-w-5xl space-y-10 animate-fade-in">
          {/* Order Header Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-soft backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Order Identification</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold text-xs">
                    #{activeOrder.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyTrackingNumber(activeOrder.id)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedTracking ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedTracking ? "Copied" : "Copy ID"}</span>
                  </button>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Order Status: <span className="text-primary">{activeOrder.status}</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Placed on {activeOrder.orderDate} • Paid via {activeOrder.paymentMethod}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                {/* Expected Delivery Date Highlight Card */}
                <div className="p-3.5 px-5 rounded-2xl bg-surface-elevated border border-primary/40 text-left md:text-right shadow-soft">
                  <span className="block text-[11px] font-bold text-primary uppercase tracking-wider">
                    Expected Delivery Date
                  </span>
                  <span className="font-display text-base sm:text-lg font-extrabold text-foreground">
                    10 September 2026
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Carrier: <strong className="text-foreground">{activeOrder.shippingCarrier}</strong>
                </span>
              </div>
            </div>

            {/* Tracking Progress Timeline with Animated Reveal */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Fulfillment Timeline
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted font-mono text-muted-foreground">
                  Waybill: {activeOrder.trackingNumber}
                </span>
              </div>

              {/* Horizontal / Stepper Timeline for Desktop */}
              <div className="relative hidden md:block pt-6 pb-4">
                {/* Background Track Line */}
                <div className="absolute top-11 left-8 right-8 h-1.5 bg-muted rounded-full z-0" />
                {/* Active Progress Bar animating into place */}
                <div
                  className="absolute top-11 left-8 h-1.5 bg-gradient-to-r from-primary to-emerald-400 rounded-full z-0 transition-all duration-1000 ease-out shadow-glow"
                  style={{ width: `calc(${revealedBarPct}% - 16px)` }}
                />

                <div className="relative z-10 grid grid-cols-5 gap-4">
                  {activeOrder.timeline.map((step, idx) => {
                    const isPassed = step.completed;
                    const isCurrent = step.current;

                    return (
                      <div key={idx} className="flex flex-col items-center text-center group">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            isCurrent
                              ? "bg-primary text-primary-foreground border-primary shadow-glow scale-110 ring-4 ring-primary/20"
                              : isPassed
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                              : "bg-surface-elevated text-muted-foreground border-border"
                          }`}
                        >
                          {getStepIcon(step.status, isPassed, isCurrent)}
                        </div>

                        {/* Status Label & Current Highlight */}
                        <div className="mt-4 space-y-1">
                          <p
                            className={`text-xs font-bold transition-colors ${
                              isCurrent ? "text-primary text-sm font-extrabold" : isPassed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-glow animate-pulse">
                              Active Stage
                            </span>
                          )}
                          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 max-w-[150px] mx-auto">
                            {step.description}
                          </p>
                          {step.timestamp && (
                            <p className="text-[10px] font-mono text-zinc-400 pt-1">
                              {step.timestamp}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Timeline for Mobile */}
              <div className="md:hidden space-y-6 pt-2">
                {activeOrder.timeline.map((step, idx) => {
                  const isPassed = step.completed;
                  const isCurrent = step.current;
                  const isLast = idx === activeOrder.timeline.length - 1;

                  return (
                    <div key={idx} className="relative flex gap-4">
                      {!isLast && (
                        <div
                          className={`absolute left-5 top-10 bottom-0 w-0.5 ${
                            isPassed ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
                          isCurrent
                            ? "bg-primary text-primary-foreground border-primary shadow-glow ring-4 ring-primary/20"
                            : isPassed
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                            : "bg-surface-elevated text-muted-foreground border-border"
                        }`}
                      >
                        {getStepIcon(step.status, isPassed, isCurrent)}
                      </div>

                      <div className={`flex-1 pb-4 rounded-xl p-3 border ${isCurrent ? "border-primary/40 bg-primary/5 shadow-soft" : "border-transparent"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                        {step.timestamp && (
                          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{step.timestamp}</span>
                            {step.location && <span>• {step.location}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Status Highlight Banner */}
              {(() => {
                const currentStep = activeOrder.timeline.find((t) => t.current) || activeOrder.timeline[activeOrder.timeline.length - 1];
                return (
                  <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-glow shrink-0">
                        {getStepIcon(currentStep.status, true, true)}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Live Dispatch Trajectory</span>
                        <h4 className="font-bold text-foreground text-sm sm:text-base">{currentStep.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          Package is on scheduled trajectory for delivery on <strong className="text-foreground">10 September 2026</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground">
                        {currentStep.timestamp || "Active"}
                      </span>
                      <span className="text-[10px] font-bold text-primary">Expected: 10 September 2026</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Order Details & Delivery Information Grid */}
          <div className="grid lg:grid-cols-[1fr,360px] gap-8">
            {/* Package Contents List */}
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-soft">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" /> Package Items ({activeOrder.items.length})
                  </h3>
                  <span className="text-xs text-muted-foreground">Verified by Devora QA</span>
                </div>

                <div className="divide-y divide-border">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-surface-elevated border border-border shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{item.name}</h4>
                        {item.variant && <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            Quantity: <strong className="text-foreground">{item.quantity}</strong>
                          </span>
                          <span className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-6 mt-4 border-t border-border space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{activeOrder.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Devora Priority Shipping</span>
                    <span className="text-emerald-500 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                    <span>Total Paid</span>
                    <span className="text-primary">₹{activeOrder.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Policy Badges inside Result */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-surface flex items-start gap-3.5">
                  <RotateCcw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-foreground">Easy 1–2 Day Return Policy</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-surface flex items-start gap-3.5">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-foreground">Order Protection Guaranteed</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Every Devora order is carefully packed and prepared before dispatch with tamper-evident seal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Details: Destination, Carrier, Support */}
            <aside className="space-y-6">
              {/* Delivery Address */}
              <div className="p-6 rounded-3xl border border-border bg-surface shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border">
                  <MapPin className="h-4 w-4 text-primary" /> Delivery Destination
                </div>
                <div className="text-xs space-y-1 text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground text-sm">{activeOrder.deliveryInformation.customerName}</p>
                  <p>{activeOrder.deliveryInformation.addressLine1}</p>
                  <p>
                    {activeOrder.deliveryInformation.city}, {activeOrder.deliveryInformation.state} — {activeOrder.deliveryInformation.postalCode}
                  </p>
                  <p>{activeOrder.deliveryInformation.country}</p>
                  <p className="pt-1 text-zinc-400 font-mono">Contact: {activeOrder.deliveryInformation.phone}</p>
                </div>
              </div>

              {/* Carrier & Waybill */}
              <div className="p-6 rounded-3xl border border-border bg-surface shadow-soft space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border">
                  <Building2 className="h-4 w-4 text-primary" /> Courier Partner
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carrier:</span>
                    <strong className="text-foreground">{activeOrder.shippingCarrier}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking ID:</span>
                    <strong className="font-mono text-primary">{activeOrder.trackingNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Delivery:</span>
                    <strong className="font-semibold text-foreground">10 September 2026</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-[10px]">
                      {activeOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Need Help Card with direct Contact Support action */}
              <div className="p-6 rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-elevated shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Headphones className="h-4 w-4 text-primary" /> Need Help With Your Order?
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contact Devora support if you have questions about delivery, returns, or your order.
                </p>
                <div className="pt-2 space-y-2">
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full justify-center gap-2 text-xs rounded-xl shadow-soft">
                      Contact Support <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-2.5 px-4 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Tracking Slip
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* 5. BRAND PROMISES / REASSURANCE FOOTER BAR */}
      <section className="container mt-20 pt-8 border-t border-border">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Fast Dispatch</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Orders packed and dispatched from Imphal studio within 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Easy 1–2 Day Return</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Hassle-free return request pickup on all eligible apparel & gear.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Quality You Can Trust</h4>
              <p className="text-xs text-muted-foreground mt-0.5">100% authentic curated designer essentials guaranteed.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">100% Secure Payments</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Protected with 256-bit encrypted checkout and UPI verification.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;
