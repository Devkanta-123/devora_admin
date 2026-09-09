import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Rotate3d,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MoveHorizontal,
  Compass,
  HelpCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";

interface Product360ViewerProps {
  product: Product;
  className?: string;
  onCloseModal?: () => void;
  isModal?: boolean;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  product,
  className,
  onCloseModal,
  isModal = false,
}) => {
  // Core rotation, tilt and zoom state
  const [angle, setAngle] = useState(0); // 0 to 359.9 degrees
  const [pitch, setPitch] = useState(0); // -16 to +16 degrees (3D vertical tilt)
  const [zoom, setZoom] = useState(1); // 1 to 2.2
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [autoSpeed, setAutoSpeed] = useState<0.5 | 1 | 2>(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for tracking drag coordinates, momentum, and animation loops
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const momentumFrameRef = useRef<number | null>(null);

  // Normalize angle between 0 and 360 degrees
  const normalizeAngle = (deg: number) => ((deg % 360) + 360) % 360;

  // Perspective label based on degree
  const getPerspectiveLabel = (deg: number) => {
    const d = normalizeAngle(deg);
    if (d >= 337.5 || d < 22.5) return "Front View (0°)";
    if (d >= 22.5 && d < 67.5) return "Front-Right (45°)";
    if (d >= 67.5 && d < 112.5) return "Right Profile (90°)";
    if (d >= 112.5 && d < 157.5) return "Rear-Right (135°)";
    if (d >= 157.5 && d < 202.5) return "Back View (180°)";
    if (d >= 202.5 && d < 247.5) return "Rear-Left (225°)";
    if (d >= 247.5 && d < 292.5) return "Left Profile (270°)";
    return "Front-Left (315°)";
  };

  // Continuous auto-rotate animation loop (Turntable Animation View)
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let lastTime = performance.now();
    const speedDegPerSec = autoSpeed === 0.5 ? 20 : autoSpeed === 1 ? 40 : 80;

    const step = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setAngle((prev) => normalizeAngle(prev + speedDegPerSec * dt));
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isDragging, autoSpeed]);

  // Momentum physics when pointer drag is released
  const applyMomentum = useCallback(() => {
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);

    const step = () => {
      if (Math.abs(velocityRef.current) < 0.08) {
        velocityRef.current = 0;
        return;
      }
      velocityRef.current *= 0.92; // smooth friction decay
      setAngle((prev) => normalizeAngle(prev + velocityRef.current));
      momentumFrameRef.current = requestAnimationFrame(step);
    };

    momentumFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Pointer drag events (Mouse, Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, input, select, .no-drag")) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is not supported or already captured
    }

    setIsDragging(true);
    setHasInteracted(true);
    setShowHelp(false);

    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = 0;

    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - pointerPosRef.current.x;
    const deltaY = e.clientY - pointerPosRef.current.y;
    pointerPosRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.65;
    setAngle((prev) => normalizeAngle(prev + deltaX * sensitivity));
    setPitch((prev) => Math.max(-16, Math.min(16, prev - deltaY * 0.15)));

    velocityRef.current = deltaX * 0.8;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer was already released
    }

    if (!isAutoRotating && Math.abs(velocityRef.current) > 0.4) {
      applyMomentum();
    }
  };

  // Wheel / Trackpad Scroll to Rotate in 360°
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setHasInteracted(true);
      setShowHelp(false);

      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const scrollSensitivity = 0.35;

      setAngle((prev) => normalizeAngle(prev + delta * scrollSensitivity));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Quick preset jump
  const goToPreset = (targetDeg: number) => {
    setIsAutoRotating(false);
    setHasInteracted(true);
    setShowHelp(false);
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);

    setAngle(targetDeg);
    setPitch(0);
  };

  // Reset angle, pitch and zoom to initial state
  const handleReset = () => {
    setIsAutoRotating(false);
    setAngle(0);
    setPitch(0);
    setZoom(1);
  };

  // Toggle Auto-rotate animation
  const toggleAutoRotate = () => {
    setIsAutoRotating((prev) => !prev);
    setHasInteracted(true);
    setShowHelp(false);
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
  };

  // Turntable platform tick marks (every 15 degrees)
  const turntableTicks = Array.from({ length: 24 }).map((_, i) => i * 15);
  const currentAngleNormalized = normalizeAngle(angle);

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-gradient-to-b from-card/90 via-surface-elevated/95 to-surface overflow-hidden select-none shadow-elevated transition-all flex flex-col",
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : "w-full aspect-square",
        className
      )}
    >
      {/* Top HUD Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 bg-gradient-to-b from-background/90 via-background/60 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md text-xs font-semibold text-primary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75", isAutoRotating ? "block" : "hidden")} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <Rotate3d className="h-3.5 w-3.5" />
            <span>360° Angle View</span>
          </div>
        </div>

        {/* Real-time Angle Readout & HUD Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border border-border backdrop-blur-md text-xs text-foreground/80 font-mono">
            <Compass className="h-3.5 w-3.5 text-primary" style={{ transform: `rotate(${currentAngleNormalized}deg)` }} />
            <span>{Math.round(currentAngleNormalized)}°</span>
            <span className="text-[10px] text-muted-foreground hidden md:inline">
              ({getPerspectiveLabel(currentAngleNormalized).split(" ")[0]})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            aria-label="Help & Gestures"
            className="h-8 w-8 rounded-full bg-background/80 border border-border backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset View"
            title="Reset angle & zoom"
            className="h-8 w-8 rounded-full bg-background/80 border border-border backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (isModal && onCloseModal) {
                onCloseModal();
              } else {
                setIsFullscreen((prev) => !prev);
              }
            }}
            aria-label={isFullscreen || isModal ? "Close Fullscreen" : "Fullscreen"}
            className="h-8 w-8 rounded-full bg-background/80 border border-border backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
          >
            {isFullscreen || isModal ? <X className="h-4 w-4" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive 360 Product Stage */}
      <div
        ref={viewerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative flex-1 w-full overflow-hidden flex items-center justify-center touch-none select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {/* Dynamic Studio Lighting Spotlight Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${50 + 20 * Math.sin((currentAngleNormalized * Math.PI) / 180)}% ${
              40 + 10 * Math.cos((currentAngleNormalized * Math.PI) / 180)
            }%, hsl(var(--primary) / 0.12) 0%, transparent 70%)`,
          }}
        />

        {/* 3D Turntable Pedestal Base with Rotating Degree Markers */}
        <div
          className="absolute bottom-6 sm:bottom-10 w-[78%] max-w-[420px] aspect-[2.6/1] pointer-events-none"
          style={{
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Outer Pedestal Disc */}
          <div
            className="w-full h-full rounded-[50%] border-2 border-primary/25 bg-gradient-to-b from-card/80 via-primary/5 to-surface-elevated/90 shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_hsl(var(--primary)/0.15)] relative flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `rotateX(66deg) rotateZ(${-currentAngleNormalized}deg)`,
            }}
          >
            {/* Concentric Glowing Accent Rings */}
            <div className="absolute inset-3 rounded-[50%] border border-primary/30 border-dashed" />
            <div className="absolute inset-7 rounded-[50%] border border-primary/20" />
            <div className="absolute inset-12 rounded-[50%] bg-radial from-primary/15 to-transparent" />

            {/* Radial Degree Tick Marks */}
            {turntableTicks.map((deg) => (
              <div
                key={deg}
                className="absolute inset-0 flex items-start justify-center"
                style={{
                  transform: `rotate(${deg}deg)`,
                }}
              >
                <div
                  className={cn(
                    "w-[2px] transition-all",
                    deg % 90 === 0
                      ? "h-3 bg-primary"
                      : deg % 45 === 0
                      ? "h-2 bg-primary/70"
                      : "h-1.5 bg-muted-foreground/40"
                  )}
                />
              </div>
            ))}

            {/* Degree Cardinal Direction Labels on Turntable Edge */}
            <span className="absolute top-1 text-[9px] font-bold tracking-widest text-primary/80">0° FRONT</span>
            <span className="absolute right-2 text-[9px] font-bold tracking-widest text-primary/70">90°</span>
            <span className="absolute bottom-1 text-[9px] font-bold tracking-widest text-primary/70">180° REAR</span>
            <span className="absolute left-2 text-[9px] font-bold tracking-widest text-primary/70">270°</span>
          </div>

          {/* Dynamic Ground Shadow below Product Image */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/60 blur-md pointer-events-none transition-all duration-75"
            style={{
              width: `${55 * (0.85 + 0.15 * Math.abs(Math.cos((currentAngleNormalized * Math.PI) / 180)))}%`,
              height: `${24 * (0.8 + 0.2 * Math.abs(Math.sin((currentAngleNormalized * Math.PI) / 180)))}px`,
              transform: `rotateX(66deg) skewX(${-12 * Math.sin((currentAngleNormalized * Math.PI) / 180)}deg)`,
              opacity: 0.7 - (zoom - 1) * 0.2,
            }}
          />
        </div>

        {/* 3D Turntable Product Image Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center p-8"
          style={{
            perspective: "1200px",
          }}
        >
          <div
            className="relative flex items-center justify-center max-h-[75%] max-w-[85%] aspect-square transition-transform duration-75"
            style={{
              transform: `rotateY(${currentAngleNormalized}deg) rotateX(${pitch}deg) scale(${zoom})`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              draggable={false}
              className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] pointer-events-none select-none transition-all"
              style={{
                filter: `brightness(${
                  0.88 + 0.18 * Math.cos((currentAngleNormalized * Math.PI) / 180)
                }) contrast(${
                  0.96 + 0.08 * Math.abs(Math.sin((currentAngleNormalized * Math.PI) / 180))
                })`,
              }}
            />

            {/* Specular Lighting Sheen Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-lg mix-blend-overlay opacity-60 transition-all duration-75"
              style={{
                background: `linear-gradient(${
                  currentAngleNormalized + 45
                }deg, transparent 25%, rgba(255,255,255,0.45) 50%, transparent 75%)`,
              }}
            />

            {/* Rear Angle Inspection Layer */}
            {currentAngleNormalized > 90 && currentAngleNormalized < 270 && (
              <div
                className="absolute inset-0 pointer-events-none rounded-lg flex items-center justify-center bg-black/25 backdrop-blur-[0.5px] border border-primary/20"
                style={{
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center px-4 py-2 rounded-md bg-background/75 border border-border shadow-lg">
                  <p className="text-[11px] font-bold text-primary tracking-widest uppercase">
                    {product.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground">360° Rear Angle View</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guidance Overlay Hint (Fades out when user interacts) */}
        {showHelp && !hasInteracted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30 backdrop-blur-[1px] animate-fade-in z-20">
            <div className="px-4 py-3 rounded-xl bg-card/95 border border-primary/40 shadow-glow flex flex-col items-center gap-1.5 text-center max-w-xs animate-pulse">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <MoveHorizontal className="h-4 w-4 animate-bounce" />
                <span>Drag or Scroll to Rotate 360°</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Click & drag horizontally, or use mouse wheel / trackpad to spin the product in 360° view.
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-primary/80">
                <span>← 360° Product Spin →</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Left Floating Degree Compass / Direction */}
        <div className="absolute bottom-20 left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/85 border border-border backdrop-blur-md shadow-sm text-xs pointer-events-none">
          <span className="text-muted-foreground font-medium">Angle:</span>
          <span className="font-mono font-semibold text-primary">{Math.round(currentAngleNormalized)}°</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-foreground/90 font-medium">{getPerspectiveLabel(currentAngleNormalized)}</span>
        </div>

        {/* Bottom Right Floating Zoom Controls */}
        <div className="absolute bottom-20 right-4 z-10 flex items-center gap-1 bg-background/85 border border-border backdrop-blur-md rounded-lg p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
            disabled={zoom <= 1}
            title="Zoom Out"
            className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-muted transition-smooth"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px] font-mono w-10 text-center text-foreground font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.25).toFixed(2)))}
            disabled={zoom >= 2.2}
            title="Zoom In"
            className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-muted transition-smooth"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar: Scrub Slider, Presets, Play/Pause Animation */}
      <div className="relative z-20 border-t border-border bg-card/95 backdrop-blur-md p-3 space-y-2.5">
        {/* Scrub Slider with Degree Milestones */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={Math.round(currentAngleNormalized)}
              onChange={(e) => {
                setAngle(Number(e.target.value));
                setIsAutoRotating(false);
                setHasInteracted(true);
                setShowHelp(false);
              }}
              className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {/* Milestone markers */}
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono px-1">
            <span
              onClick={() => goToPreset(0)}
              className={cn("cursor-pointer hover:text-primary transition-colors", Math.round(currentAngleNormalized) <= 15 && "text-primary font-bold")}
            >
              0° Front
            </span>
            <span
              onClick={() => goToPreset(90)}
              className={cn("cursor-pointer hover:text-primary transition-colors", Math.abs(Math.round(currentAngleNormalized) - 90) <= 15 && "text-primary font-bold")}
            >
              90° Right
            </span>
            <span
              onClick={() => goToPreset(180)}
              className={cn("cursor-pointer hover:text-primary transition-colors", Math.abs(Math.round(currentAngleNormalized) - 180) <= 15 && "text-primary font-bold")}
            >
              180° Back
            </span>
            <span
              onClick={() => goToPreset(270)}
              className={cn("cursor-pointer hover:text-primary transition-colors", Math.abs(Math.round(currentAngleNormalized) - 270) <= 15 && "text-primary font-bold")}
            >
              270° Left
            </span>
            <span
              onClick={() => goToPreset(360)}
              className={cn("cursor-pointer hover:text-primary transition-colors", Math.round(currentAngleNormalized) >= 345 && "text-primary font-bold")}
            >
              360°
            </span>
          </div>
        </div>

        {/* Toolbar: Play/Pause Animation View, Speed, Preset Angle Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Left: Animation Spin Toggle & Speed */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={isAutoRotating ? "default" : "outline"}
              onClick={toggleAutoRotate}
              className={cn(
                "h-8 px-3 text-xs gap-1.5 shadow-sm font-medium transition-smooth",
                isAutoRotating && "shadow-glow"
              )}
            >
              {isAutoRotating ? (
                <>
                  <Pause className="h-3.5 w-3.5" /> Pause Spin
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" /> Auto-Spin 360°
                </>
              )}
            </Button>

            {/* Speed Pills */}
            <div className="flex items-center rounded-md bg-muted p-0.5 border border-border text-[10px]">
              {([0.5, 1, 2] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setAutoSpeed(s);
                    if (!isAutoRotating) setIsAutoRotating(true);
                  }}
                  className={cn(
                    "px-2 py-1 rounded transition-smooth font-mono font-medium",
                    autoSpeed === s
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Right: Quick Preset Angle Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPreset(0)}
              className={cn(
                "px-2 py-1 rounded text-xs transition-smooth border",
                Math.round(currentAngleNormalized) === 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => goToPreset(90)}
              className={cn(
                "px-2 py-1 rounded text-xs transition-smooth border",
                Math.round(currentAngleNormalized) === 90
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              Side 90°
            </button>
            <button
              type="button"
              onClick={() => goToPreset(180)}
              className={cn(
                "px-2 py-1 rounded text-xs transition-smooth border",
                Math.round(currentAngleNormalized) === 180
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              Back 180°
            </button>
            <button
              type="button"
              onClick={() => goToPreset(270)}
              className={cn(
                "px-2 py-1 rounded text-xs transition-smooth border",
                Math.round(currentAngleNormalized) === 270
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              Side 270°
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product360Viewer;
