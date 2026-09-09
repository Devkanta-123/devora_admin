import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { toast } from "sonner";
import { OrdersContent } from "./Orders";

const Account = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "profile" | "orders" | "addresses") || "profile";
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<"profile" | "orders" | "addresses">(initialTab);

  useEffect(() => {
    const urlTab = searchParams.get("tab") as "profile" | "orders" | "addresses";
    if (urlTab && ["profile", "orders", "addresses"].includes(urlTab)) {
      setTab(urlTab);
    }
  }, [searchParams]);

  if (!loggedIn) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto p-8 rounded-lg border border-border bg-surface shadow-soft">
          <div className="flex gap-2 mb-8 p-1 rounded-md bg-muted">
            <button className="flex-1 py-2 text-sm font-medium rounded transition-smooth bg-background shadow-soft">Sign in</button>
            <Link to="/register" className="flex-1 py-2 text-sm font-medium rounded transition-smooth text-center hover:bg-background/50">Create account</Link>
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>

          <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); toast.success("Signed in"); }} className="space-y-4">
            <input required type="email" placeholder="Email address" className="w-full h-11 px-4 rounded-md bg-background border border-border outline-none focus:border-primary transition-smooth" />
            <input required type="password" placeholder="Password" className="w-full h-11 px-4 rounded-md bg-background border border-border outline-none focus:border-primary transition-smooth" />
            <Button type="submit" size="lg" className="w-full shadow-glow">Sign in</Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground space-y-2">
            <p>Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register with Devo Assistant</Link></p>
            <p>By continuing you agree to our Terms.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold mb-10">My account</h1>
      <div className="grid lg:grid-cols-[260px,1fr] gap-10">
        <aside className="space-y-1">
          {[
            { id: "profile" as const, label: "Profile", icon: User },
            { id: "orders" as const, label: "Orders", icon: Package },
            { id: "addresses" as const, label: "Addresses", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-smooth ${tab === id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
          <button onClick={() => setLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-muted text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        <div className="p-6 rounded-lg border border-border bg-surface">
          {tab === "profile" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-semibold text-lg mb-2">Profile</h2>
              <input defaultValue="Alex Morgan" className="w-full h-11 px-4 rounded-md bg-background border border-border outline-none focus:border-primary" />
              <input defaultValue="alex@devora.com" className="w-full h-11 px-4 rounded-md bg-background border border-border outline-none focus:border-primary" />
              <Button>Save changes</Button>
            </div>
          )}
          {tab === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold mb-1">Your Orders & Deliveries</h2>
                <p className="text-xs text-muted-foreground">Manage your past purchases, real-time shipment updates, and returns.</p>
              </div>
              <OrdersContent compact />
            </div>
          )}
          {tab === "addresses" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-2">Saved addresses</h2>
              <div className="p-4 rounded-md border border-border">
                <p className="font-medium text-sm">Home</p>
                <p className="text-sm text-muted-foreground mt-1">42 Linden Avenue, Brooklyn, NY 11217, USA</p>
              </div>
              <Button variant="outline">Add new address</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
