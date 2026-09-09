import hero from "@/assets/hero.jpg";
import p4 from "@/assets/p4.jpg";
import p7 from "@/assets/p7.jpg";

const About = () => (
  <>
    <section className="relative h-[60vh] flex items-center overflow-hidden">
      <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="container relative z-10">
        <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">Our Story</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold max-w-3xl">
          Objects worth keeping, made by people who care.
        </h1>
      </div>
    </section>

    <section className="container py-20 grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-5">
        <h2 className="font-display text-3xl font-bold">Slow design, in a fast world</h2>
        <p className="text-foreground/80 leading-relaxed">
          Devora began with a simple frustration — too much stuff, too little of it good. We wanted a place where each piece earned its space. Where a cup, a watch, or a pair of headphones felt like a quiet, lasting choice.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          We work directly with small ateliers and considered manufacturers across Europe and Asia. We meet them. We understand their craft. Then we curate — only what we'd own ourselves.
        </p>
      </div>
      <img src={p4} alt="Crafted leather" className="rounded-lg w-full aspect-square object-cover border border-border" />
    </section>

    <section className="container py-20 grid md:grid-cols-2 gap-16 items-center">
      <img src={p7} alt="Ceramic" className="rounded-lg w-full aspect-square object-cover border border-border md:order-2" />
      <div className="space-y-5">
        <h2 className="font-display text-3xl font-bold">Mission & vision</h2>
        <p className="text-foreground/80 leading-relaxed">
          Our mission is simple: replace disposable with durable. We believe in fewer, better things — products you'll happily live with for years, not months.
        </p>
        <ul className="space-y-3 text-sm">
          {["Curated by humans, never algorithms", "Materials you can trace", "Built to outlast trend cycles", "A two-year warranty on everything"].map((t) => (
            <li key={t} className="flex gap-3"><span className="text-primary">✦</span>{t}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="container py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {[["12k+", "Happy customers"], ["48", "Maker partners"], ["4.9", "Average rating"], ["2 yrs", "Warranty"]].map(([n, l]) => (
        <div key={l}>
          <p className="font-display text-4xl md:text-5xl font-bold text-gradient">{n}</p>
          <p className="text-sm text-muted-foreground mt-1">{l}</p>
        </div>
      ))}
    </section>
  </>
);

export default About;
