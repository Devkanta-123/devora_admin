import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, RotateCcw, Film } from "lucide-react";
import registerVideo from "@/assets/video/register_animation.mp4";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsap?: any;
  }
}

const Register = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const gsap = window.gsap;
    if (gsap) {
      // Initial positions
      gsap.set(videoContainerRef.current, { x: -120, opacity: 0, scale: 0.9 });
      gsap.set(formRef.current, { x: 180, opacity: 0, scale: 0.88 });

      // Video glides in slowly over the first 1.5 seconds
      gsap.to(videoContainerRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      });
    }

    // Safety fallback: Ensure form gets pushed into place after 5.2s if video trigger delays
    const timer = setTimeout(() => {
      triggerFormPush();
    }, 5200);

    return () => clearTimeout(timer);
  }, []);

  const triggerFormPush = () => {
    if (pushedRef.current) return;
    pushedRef.current = true;

    const gsap = window.gsap;
    if (gsap && formRef.current) {
      gsap.to(formRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.95,
        ease: "back.out(1.3)",
      });
    } else if (formRef.current) {
      formRef.current.style.transform = "none";
      formRef.current.style.opacity = "1";
    }
  };

  const handleTimeUpdate = () => {
    // Synchronize form push with video reaching 5.0 seconds
    if (videoRef.current && videoRef.current.currentTime >= 5.0) {
      triggerFormPush();
    }
  };

  const replayAnimation = () => {
    pushedRef.current = false;
    const gsap = window.gsap;
    if (gsap && formRef.current) {
      gsap.set(formRef.current, { x: 180, opacity: 0, scale: 0.88 });
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setSubmitted(true);
    toast.success("Account created successfully! Welcome to Devora.");
    setTimeout(() => {
      navigate("/account");
    }, 1500);
  };

  return (
    <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[82vh]">
      <div className="text-center max-w-lg mb-10 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Devora Membership
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Join Devora for early access drops, curated wishlist syncing, and order tracking.
        </p>
      </div>

      <div className="w-full max-w-5xl relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Animated Video Mascot (Pusher) */}
        <div ref={videoContainerRef} className="flex flex-col items-center justify-center shrink-0 z-10">
          <div className="relative w-64 sm:w-80 rounded-2xl overflow-hidden glass border border-white/15 shadow-2xl group transition-all duration-500 hover:border-primary/40">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-auto object-cover rounded-2xl"
            >
              <source src={registerVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs text-white/90 font-medium flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5 text-primary" /> Synchronized 5s Push Effect
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase bg-muted/60 px-3 py-1 rounded-md border border-border/50">
              Devo — Assistant
            </span>
            <button
              onClick={replayAnimation}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
              title="Replay Animation"
            >
              <RotateCcw className="h-3 w-3" /> Replay Sync
            </button>
          </div>
        </div>

        {/* Registration Form Card */}
        <div
          ref={formRef}
          className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-border/80 bg-surface/90 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-sky-400" />
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Fast & Secure Registration</span>
            </div>
            <span className="text-xs text-muted-foreground">Step 1 of 1</span>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4 animate-fade-in">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
              <h3 className="font-display text-2xl font-bold">Welcome aboard!</h3>
              <p className="text-sm text-muted-foreground">
                Your Devora account is set up. Redirecting to your personal account dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Devkanta Singh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg bg-background border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="devkanta@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg bg-background border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg bg-background border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg bg-background border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and Privacy Policy.
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full shadow-glow mt-4">
                Complete Registration <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-center pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/account" className="font-semibold text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Register;
