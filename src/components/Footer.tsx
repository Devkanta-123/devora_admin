import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import devoraLogo from "@/assets/devora.png";

const Footer = () => (
  <footer className="border-t border-border bg-surface/40 mt-24">
    <div className="container py-16 grid gap-12 md:grid-cols-4">
      <div className="space-y-4">
        <Link to="/" className="inline-block group">
          <img src={devoraLogo} alt="Devora Logo" className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <p className="text-sm text-muted-foreground max-w-xs">
          Premium essentials, designed for the modern life. Curated. Considered. Crafted.
        </p>
        <div className="flex gap-3">
          {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
            <a key={i} href="#" aria-label="Social" className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-smooth">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      {[
        { title: "Shop", links: [["All Products", "/shop"], ["Electronics", "/shop?category=electronics"], ["Fashion", "/shop?category=fashion"], ["Home", "/shop?category=home"]] },
        { title: "Company", links: [["About Us", "/about"], ["Contact", "/contact"]] },
        { title: "Account & Help", links: [["My Account", "/account"], ["My Orders", "/orders"], ["Order Tracking", "/order-tracking"], ["Register", "/register"]] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-semibold mb-4">{col.title}</h4>
          <ul className="space-y-3">
            {col.links.map(([label, to]) => (
              <li key={label}><Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-smooth">{label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border">
      <div className="container py-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Devora. All rights reserved.</p>
        <p>Crafted with care.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
