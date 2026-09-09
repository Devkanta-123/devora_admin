import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import adidasVideo from "@/assets/video/adidas.mp4";

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("category") || "all";
  const q = (params.get("q") || "").toLowerCase();

  const [category, setCategory] = useState(initialCat);
  const [price, setPrice] = useState<[number, number]>([0, 35000]);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    else r = [...r].sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [category, price, sort, q]);

  const setCat = (c: string) => {
    setCategory(c);
    if (c === "all") params.delete("category"); else params.set("category", c);
    setParams(params);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full Page Header Background Video (Adidas) */}
      <div className="absolute top-0 left-0 right-0 h-[48vh] overflow-hidden pointer-events-none -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-50 scale-105"
        >
          <source src={adidasVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      <div className="container py-12 relative z-10">
        {/* Page Header (Floating directly over background video, no card boundary) */}
        <div className="mb-12 max-w-2xl space-y-2">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">Shop all</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Explore our curated collection of objects you'll keep — not chase. Crafted by makers who care.
          </p>
          <p className="text-xs text-primary font-medium pt-1">
            {filtered.length} products available{q && ` matching "${q}"`}
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px,1fr] gap-10">
          {/* Filters */}
          <aside className={`${filtersOpen ? "fixed inset-0 z-40 bg-background p-6 overflow-auto" : "hidden lg:block"} space-y-8`}>
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Category</h3>
              <div className="space-y-2">
                {[{ slug: "all", name: "All" }, ...categories].map((c) => (
                  <button key={c.slug} onClick={() => setCat(c.slug)}
                    className={`block text-sm transition-smooth ${category === c.slug ? "text-primary font-medium" : "text-foreground/70 hover:text-foreground"}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Price</h3>
              <Slider value={price} onValueChange={(v) => setPrice(v as [number, number])} min={0} max={35000} step={500} />
              <div className="flex justify-between text-xs text-muted-foreground mt-3">
                <span>₹{price[0].toLocaleString("en-IN")}</span>
                <span>₹{price[1].toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="flex items-center justify-between mb-6 gap-3">
              <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
              </Button>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="ml-auto h-10 px-3 rounded-md bg-background border border-border text-sm outline-none focus:border-primary">
                <option value="popular">Most popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="py-24 text-center text-muted-foreground">No products match your filters.</div>
            ) : (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
