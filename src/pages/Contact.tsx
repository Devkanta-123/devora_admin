import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Clock, Navigation, ExternalLink, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [mapOnly, setMapOnly] = useState(false);

  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Google Map - Imphal East, Manipur */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <iframe
          title="Devora Studio Location Map - Imphal East, Manipur"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115915.22858172901!2d93.93153549999999!3d24.817011499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374927b7235222ef%3A0xbcf03a3d5fa66548!2sImphal%20East%2C%20Manipur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "contrast(1.05) saturate(1.15) brightness(0.7)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full object-cover"
        />

        {/* Dark Vignette & Glass Layer */}
        <div className={`absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90 transition-opacity duration-700 ${mapOnly ? "opacity-20 pointer-events-none" : "opacity-90"}`} />
      </div>

      {/* Floating Header & Toggle Controls */}
      <div className="container relative z-10 max-w-7xl mx-auto space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/40 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> Devora Flagship Studio & Customer Desk
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Get In Touch
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl mt-1">
              Store Address: Imphal East, Manipur, India — 795005
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapOnly(!mapOnly)}
              className="gap-2 text-xs border-emerald-500/40 bg-black/80 text-emerald-300 hover:text-white hover:border-emerald-400 rounded-full backdrop-blur-md transition-all duration-300"
            >
              {mapOnly ? <EyeOff className="h-3.5 w-3.5 text-emerald-400" /> : <Eye className="h-3.5 w-3.5 text-emerald-400" />}
              <span>{mapOnly ? "Show Form Overlay" : "Inspect Map Fullscreen"}</span>
            </Button>

            <a
              href="https://maps.google.com/?q=Imphal+East+Manipur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-black text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all duration-300"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Maps
            </a>
          </div>
        </div>

        {/* Content Form & Cards Grid Overlaying Map */}
        {!mapOnly && (
          <div className="grid lg:grid-cols-[1fr,380px] gap-8 animate-fade-in transition-all duration-500">
            
            {/* Contact Form Overlay Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent — we'll be in touch shortly!");
                (e.target as HTMLFormElement).reset();
              }}
              className="space-y-4 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-black/75 backdrop-blur-xl shadow-2xl transition-all duration-500"
            >
              <h2 className="font-display text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-xs text-zinc-400 mb-6">Our desk in Imphal East responds within a few hours.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Your Name</label>
                  <input required placeholder="Devkanta Singh" className="w-full h-11 px-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white outline-none focus:border-emerald-500 text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                  <input required type="email" placeholder="devkanta@example.com" className="w-full h-11 px-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white outline-none focus:border-emerald-500 text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Subject</label>
                <input placeholder="Order inquiry / General feedback" className="w-full h-11 px-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white outline-none focus:border-emerald-500 text-sm transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Message</label>
                <textarea required placeholder="How can we help you today?" rows={4} className="w-full p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white outline-none focus:border-emerald-500 text-sm resize-none transition-all" />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] px-8 py-6 rounded-xl">
                Send Message
              </Button>
            </form>

            {/* Sidebar Contact Info Cards */}
            <aside className="space-y-4">
              {[
                [Mail, "Email Support", "hello@devora.com", "24/7 Digital Desk"],
                [Phone, "Customer Hotline", "+91 98765 43210", "Mon - Sat (9am - 8pm IST)"],
                [MapPin, "Flagship Studio", "Imphal East, Manipur, India", "Pincode: 795005"],
                [Clock, "Store Hours", "10:00 AM – 8:00 PM IST", "Open All 7 Days"],
              ].map(([Icon, t, v, sub]) => (
                <div key={t} className="flex gap-4 p-5 rounded-2xl border border-emerald-500/30 bg-black/75 backdrop-blur-xl hover:border-emerald-500 transition-all duration-300 shadow-xl group">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold">{t}</p>
                    <p className="text-sm font-semibold mt-0.5 text-white">{v}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}

              {/* Quick Navigation Overlay Badge */}
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-xl flex items-center justify-between gap-3 text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span>Imphal East, Manipur Studio Marker</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Imphal+East+Manipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-white hover:text-emerald-400"
                >
                  Directions
                </a>
              </div>
            </aside>

          </div>
        )}

      </div>
    </div>
  );
};

export default Contact;
