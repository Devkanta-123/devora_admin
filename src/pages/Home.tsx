import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw, Star, Volume2, VolumeX, Film, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import sneakerVideo from "@/assets/video/sneaker.mp4";
import nikeVideo from "@/assets/video/nike.mp4";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { VirtualClothesRail } from "@/components/clothesRail/VirtualClothesRail";
import { BottomCheckoutRail } from "@/components/clothesRail/BottomCheckoutRail";

const heroSlides = [
  {
    id: "sneaker",
    video: sneakerVideo,
    badge: "New Season Drop",
    titleLine1: "Premium essentials,",
    titleLine2: "designed for life.",
    description: "A considered collection of objects you'll keep — not chase. Crafted by makers who care.",
    tag: "Sneaker Edition",
  },
  {
    id: "nike",
    video: nikeVideo,
    badge: "Nike Performance Drop",
    titleLine1: "Just move forward,",
    titleLine2: "crafted for motion.",
    description: "Experience cutting-edge sportswear and footwear designed for relentless performance.",
    tag: "Nike Campaign",
  },
];

const testimonials = [
  { name: "Amelia Chen", role: "Designer", review: "Devora's curation is impeccable. Every piece feels considered, and the packaging is a moment in itself.", avatar: "AC" },
  { name: "Marcus Reid", role: "Photographer", review: "I've never had a smoother online shopping experience. The headphones are the best I've ever owned.", avatar: "MR" },
  { name: "Sofia Alvarez", role: "Architect", review: "Premium without being loud. The leather watch has become a daily staple — beautifully made.", avatar: "SA" },
  { name: "Jonas Weber", role: "Founder", review: "Thoughtful, minimal, and fast shipping. Devora has replaced three other stores I used to visit.", avatar: "JW" },
];

const Home = () => {
  const featured = products.filter((p) => p.featured);
  const trending = products.filter((p) => p.trending);

  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMuted, setIsMuted] = useState(true);

  const slide = heroSlides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    videoRefs.current.forEach((v) => {
      if (v) v.muted = nextMuted;
    });
    setIsMuted(nextMuted);
  };

  return (
    <>
      {/* Hero Video Carousel */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background Videos with cross-fade transition */}
        {heroSlides.map((s, idx) => (
          <video
            key={s.id}
            ref={(el) => (videoRefs.current[idx] = el)}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className={`absolute inset-0 h-full w-full object-cover scale-105 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-60 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <source src={s.video} type="video/mp4" />
            <img src={hero} alt="Devora Hero" className="h-full w-full object-cover" />
          </video>
        ))}

        <div className="absolute inset-0 bg-gradient-hero opacity-80 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />
        
        {/* Hero Content Overlay */}
        <div className="container relative z-20 py-24">
          <div key={slide.id} className="max-w-2xl space-y-6 transition-all duration-700 ease-out animate-fade-in">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold tracking-wide text-primary transition-all duration-500 hover:scale-105">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" /> {slide.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-semibold text-zinc-300">
                <Film className="h-3.5 w-3.5 text-primary" /> {slide.tag}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight transition-all duration-700 hover:tracking-normal">
              <span className="inline-block transition-transform duration-700 hover:translate-x-1">{slide.titleLine1}</span><br />
              <span className="text-gradient inline-block transition-all duration-700 hover:scale-105 origin-left">{slide.titleLine2}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg transition-opacity duration-700">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-3 items-center pt-2">
              <Link to="/shop">
                <Button size="lg" className="rounded-full px-7 shadow-glow">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full px-7 glass">Explore</Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                onClick={toggleAudio}
                className="rounded-full px-5 glass border border-white/10 hover:bg-white/10 text-white flex items-center gap-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-primary" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
                <span className="text-xs font-medium">{isMuted ? "Unmute Sound" : "Mute Sound"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Controls (Prev / Next & Indicators) */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3 glass p-2 rounded-full border border-white/15 shadow-2xl backdrop-blur-md">
          <button
            onClick={prevSlide}
            className="h-10 w-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === currentSlide ? "w-6 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="h-10 w-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-surface/40">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            [Truck, "Free shipping", "On orders over ₹1,000"],
            [Shield, "2-year warranty", "On every product"],
            [RotateCcw, "30-day returns", "No questions asked"],
            [Sparkles, "Premium curation", "Hand-picked pieces"],
          ].map(([Icon, t, s]) => (
            <div key={t} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t}</p>
                <p className="text-xs text-muted-foreground">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Virtual Clothes Rail Showroom Experience (Replaced This Week's Pieces & Shop By Category) */}
      <VirtualClothesRail />

      {/* Trending */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">Trending</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Loved right now</h2>
          </div>
        </div>
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">What people say</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 rounded-lg border border-border bg-surface hover-lift">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed mb-6">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-20">
        <div className="rounded-lg p-10 md:p-16 bg-gradient-hero border border-border text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Get 10% off your first order</h2>
            <p className="text-muted-foreground">Join the Devora list — early access, drops, and quiet stories from our makers.</p>
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" required placeholder="your@email.com"
                className="flex-1 h-12 px-4 rounded-md bg-background border border-border outline-none focus:border-primary transition-smooth" />
              <Button type="submit" size="lg" className="rounded-md shadow-glow">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Clothes-Rail Cart */}
      <BottomCheckoutRail />
    </>
  );
};

export default Home;
