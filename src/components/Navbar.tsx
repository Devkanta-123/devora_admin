import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, Truck } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import devoraLogo from "@/assets/devora.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/order-tracking", label: "Order Tracking", icon: Truck },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { cartCount, wishlist } = useStore();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { nav(`/shop?q=${encodeURIComponent(q.trim())}`); setSearchOpen(false); setQ(""); }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="container flex h-20 sm:h-22 items-center justify-between gap-4 py-2">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={devoraLogo} alt="Devora Logo" className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary font-semibold" : "text-foreground/80"
                  }`
                }
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{l.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen((s) => !s)} aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/wishlist" aria-label="Wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </Button>
          </Link>
          <Link to="/account" aria-label="Account" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
          </Link>
          <Link to="/cart" aria-label="Cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border animate-slide-down">
          <form onSubmit={submit} className="container py-3">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-transparent outline-none text-base placeholder:text-muted-foreground" />
          </form>
        </div>
      )}

      {open && (
        <div className="md:hidden border-t border-border animate-slide-down">
          <nav className="container flex flex-col py-3">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 py-3 text-sm font-medium ${
                      isActive ? "text-primary font-semibold" : "text-foreground/80"
                    }`
                  }
                >
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  <span>{l.label}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 py-3 text-sm font-medium text-foreground/80"
            >
              <User className="h-4 w-4" />
              <span>Account & Orders</span>
            </NavLink>
            <NavLink
              to="/register"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-foreground/80"
            >
              Register
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
    {children}
  </span>
);

export default Navbar;
