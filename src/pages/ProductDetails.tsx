import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, Shield, RotateCcw, Rotate3d, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import Product360Viewer from "@/components/Product360Viewer";

const reviews = [
  { name: "Elena R.", rating: 5, date: "2 weeks ago", text: "Exceeds every expectation. The build quality is exquisite." },
  { name: "Tom H.", rating: 5, date: "1 month ago", text: "Worth every penny. Packaging alone made the unboxing unforgettable." },
  { name: "Priya M.", rating: 4, date: "1 month ago", text: "Beautiful piece. Slightly larger than I expected but absolutely lovely." },
];

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isWished } = useStore();
  const [qty, setQty] = useState(1);
  const [viewMode, setViewMode] = useState<"photos" | "360">("360");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!product) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/shop"><Button>Back to shop</Button></Link>
      </div>
    );
  }

  const wished = isWished(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Gallery photo variations
  const photoList = [
    { src: product.image, label: "Front Angle" },
    { src: product.image, label: "Close-up Detail", className: "scale-125 object-center" },
    { src: product.image, label: "Side Perspective", className: "scale-110 object-right" },
  ];

  return (
    <div className="container py-12">
      <nav className="text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {/* View Mode Switcher Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex p-1 rounded-lg bg-surface-elevated border border-border text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode("360")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-smooth relative font-semibold",
                  viewMode === "360"
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Rotate3d className="h-3.5 w-3.5" />
                <span>360° Angle View</span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75", viewMode === "360" ? "block" : "hidden")} />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("photos")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-smooth",
                  viewMode === "photos"
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Photos</span>
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span>Drag & scroll to rotate</span>
            </span>
          </div>

          {/* Main Visual Presentation: 360 Angle View or Photo Gallery */}
          {viewMode === "360" ? (
            <Product360Viewer product={product} />
          ) : (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-surface-elevated border border-border group">
              <img
                src={photoList[selectedPhotoIndex]?.src || product.image}
                alt={product.name}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                  photoList[selectedPhotoIndex]?.className
                )}
              />

              {/* Floating 360 Shortcut Button on Photo */}
              <button
                type="button"
                onClick={() => setViewMode("360")}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-background/85 hover:bg-background border border-primary/40 backdrop-blur-md text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-elevated transition-smooth hover:scale-105 group/btn"
              >
                <Rotate3d className="h-4 w-4 text-primary group-hover/btn:rotate-180 transition-transform duration-700" />
                <span>Open 360° View</span>
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </button>

              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border text-[11px] text-muted-foreground">
                {photoList[selectedPhotoIndex]?.label}
              </div>
            </div>
          )}

          {/* Thumbnails Row including 360° Angle View Thumbnail */}
          <div className="grid grid-cols-4 gap-3">
            {photoList.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setViewMode("photos");
                  setSelectedPhotoIndex(i);
                }}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden bg-surface-elevated border transition-smooth group",
                  viewMode === "photos" && selectedPhotoIndex === i
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img src={item.src} alt="" className={cn("h-full w-full object-cover", item.className)} />
                <span className="absolute bottom-1 inset-x-1 text-[9px] bg-background/80 backdrop-blur-sm text-foreground/80 rounded py-0.5 text-center font-medium line-clamp-1">
                  {item.label}
                </span>
              </button>
            ))}

            {/* Dedicated 360° Angle View Thumbnail */}
            <button
              type="button"
              onClick={() => setViewMode("360")}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden bg-gradient-to-br from-card via-surface-elevated to-primary/10 border transition-smooth flex flex-col items-center justify-center p-2 text-center group",
                viewMode === "360"
                  ? "border-primary ring-2 ring-primary/40 shadow-glow"
                  : "border-border hover:border-primary"
              )}
            >
              <div className="relative mb-1">
                <Rotate3d className={cn(
                  "h-6 w-6 text-primary transition-transform duration-700 group-hover:rotate-180",
                  viewMode === "360" && "animate-spin-slow"
                )} />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-ping" />
              </div>
              <span className="text-[10px] font-bold text-foreground leading-tight">360° VIEW</span>
              <span className="text-[8px] text-primary font-medium tracking-tight mt-0.5">Drag & Spin</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted")} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 flex items-center justify-center hover:bg-muted">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-11 w-11 flex items-center justify-center hover:bg-muted">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1 shadow-glow" onClick={() => addToCart(product.id, qty)}>
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to cart
            </Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
              <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setViewMode(viewMode === "360" ? "photos" : "360")}
            className="w-full border-primary/30 hover:border-primary hover:bg-primary/5 transition-smooth"
          >
            <Rotate3d className="h-4 w-4 mr-2 text-primary" />
            {viewMode === "360" ? "Switch to Photo Gallery" : "Explore 360° Angle View (Drag & Scroll)"}
          </Button>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            {[[Truck, "Free shipping"], [Shield, "2-year warranty"], [RotateCcw, "30-day returns"]].map(([Icon, t]) => (
              <div key={t} className="text-center">
                <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 max-w-3xl">
        <h2 className="font-display text-2xl font-bold mb-6">Reviews</h2>
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.name} className="p-5 rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3 w-3", i < r.rating ? "fill-primary text-primary" : "text-muted")} />
                ))}
              </div>
              <p className="text-sm text-foreground/90">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
