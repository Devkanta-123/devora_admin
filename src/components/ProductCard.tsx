import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleWishlist, isWished, addToCart } = useStore();
  const wished = isWished(product.id);

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-elevated border border-border">
          <img src={product.image} alt={product.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-fade opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            aria-label="Toggle wishlist"
            className={cn(
              "absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center transition-smooth",
              wished && "bg-primary text-primary-foreground border-primary"
            )}>
            <Heart className={cn("h-4 w-4", wished && "fill-current")} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product.id); }}
            className="absolute bottom-3 left-3 right-3 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-glow">
            <ShoppingBag className="h-4 w-4" /> Add to cart
          </button>
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
          <h3 className="font-medium text-sm leading-snug line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between pt-1">
            <p className="font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
