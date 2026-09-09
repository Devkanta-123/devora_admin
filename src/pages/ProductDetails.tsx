import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Gallery image views
  const galleryImages = [
    { src: product.image, label: "Main View" },
    { src: product.image, label: "Detail View", className: "scale-125 object-center" },
    { src: product.image, label: "Side Angle", className: "scale-110 object-right" },
    { src: product.image, label: "Alternate View", className: "scale-105 object-left" },
  ];

  return (
    <div className="container py-12">
      <nav className="text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Photos Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-surface-elevated border border-border group relative">
            <img
              src={galleryImages[selectedImageIndex]?.src || product.image}
              alt={product.name}
              className={cn(
                "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                galleryImages[selectedImageIndex]?.className
              )}
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border text-[11px] text-muted-foreground">
              {galleryImages[selectedImageIndex]?.label}
            </div>
          </div>

          {/* Interactive Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImageIndex(i)}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden bg-surface-elevated border transition-smooth",
                  selectedImageIndex === i
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img src={img.src} alt="" className={cn("h-full w-full object-cover", img.className)} />
                <span className="absolute bottom-1 inset-x-1 text-[9px] bg-background/80 backdrop-blur-sm text-foreground/80 rounded py-0.5 text-center font-medium line-clamp-1">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
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
