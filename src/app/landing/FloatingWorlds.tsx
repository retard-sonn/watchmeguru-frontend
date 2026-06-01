"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TerrainBlock from "@/components/illustrations/TerrainBlock";
import Ornament from "@/components/illustrations/Ornament";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const WORLDS = [
  { label: "Consistency", variant: "consistency" as const, desc: "Repetition creates ecosystems. Every study session adds a new layer of growth to your terrain." },
  { label: "Focus", variant: "focus" as const, desc: "A protected sanctuary where nothing enters. We build a wall between you and distractions." },
  { label: "Momentum", variant: "momentum" as const, desc: "Once movement starts, it compounds. XP flows like rivers through connected study terrain." },
  { label: "Deep Work", variant: "deepwork" as const, desc: "An underground chamber. A lantern-lit cocoon. We know when you're truly locked in." },
  { label: "XP System", variant: "xp" as const, desc: "Structures upgrade. Bridges unlock. Towers rise. Your civilization becomes visible as you grow." },
  { label: "Community", variant: "community" as const, desc: "Islands connected. Signal towers blinking. Study groups strengthen ecosystems together." },
];

export default function FloatingWorlds() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
        y: 50, opacity: 0, duration: 0.8, ease: "power3.out",
      });
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
        y: 60, opacity: 0, duration: 0.7, stagger: 0.1, ease: "back.out(1.2)",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-28 px-6" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-20">
          <div className="flex justify-center mb-6"><Ornament variant="zigzag" /></div>
          <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(32px, 4.5vw, 50px)", color: "var(--earthy)" }}>
            Your study life is a<br /><span style={{ color: "var(--moss)" }}>growing world.</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Each habit, streak, and mission builds a distinct biome. Not icons — tiny living ecosystems.
          </p>
        </div>
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {WORLDS.map((world) => (
            <div key={world.label} className="card-terrain p-6 flex flex-col items-center text-center group">
              <div className="w-40 h-32 mb-5 relative transition-transform duration-500 group-hover:scale-110">
                <TerrainBlock variant={world.variant} />
              </div>
              <h3 className="text-[18px] font-bold mb-2 tracking-tight" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>{world.label}</h3>
              <p className="text-[14px] leading-relaxed font-medium" style={{ color: "var(--ink-light)" }}>{world.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
