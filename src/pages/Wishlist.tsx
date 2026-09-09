import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, X } from "lucide-react";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-3xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save pieces you love for later.</p>
        <Link to="/shop"><Button size="lg" className="shadow-glow">Browse shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Wishlist</h1>
      <div className="grid gap-4">
        {items.map((p) => (
          <div key={p.id} className="flex gap-4 p-4 rounded-lg border border-border bg-surface">
            <Link to={`/product/${p.id}`} className="h-24 w-24 sm:h-28 sm:w-28 rounded-md overflow-hidden bg-surface-elevated flex-shrink-0">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
            </Link>
            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div>
                <Link to={`/product/${p.id}`} className="font-medium hover:text-primary">{p.name}</Link>
                <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                <p className="font-semibold mt-1">₹{p.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => addToCart(p.id)} className="shadow-glow">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add to cart
                </Button>
                <Button variant="outline" size="icon" onClick={() => toggleWishlist(p.id)} aria-label="Remove">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
