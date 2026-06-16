"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { num: "1", icon: "📝", title: "Tell us your exam", desc: "Pick your exam, set your subjects, and share your daily routine. Takes 2 minutes.", color: "#58CC02" },
  { num: "2", icon: "📅", title: "Get your daily plan", desc: "We build a personalized study schedule. Every day has clear blocks with start times.", color: "#1CB0F6" },
  { num: "3", icon: "🔥", title: "Study, earn, grow", desc: "Complete sessions, upload proof, earn XP. Your learning tree grows with every streak.", color: "#58CC02" },
];

export default function Steps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(headingRef.current, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
      });

      // Cards stagger in from below with scale
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards, { y: 60, scale: 0.9, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1,
          duration: 0.7, stagger: 0.15, ease: "back.out(1.4)",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ background: "#F0FDF4" }}>
      <div className="max-w-4xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4vw, 44px)", color: "#1A3A0A" }}>
            How it <span style={{ color: "#58CC02" }}>works</span>
          </h2>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: "#3D6B2E" }}>
            Three simple steps. No complexity. Just results.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.num}
              className="rounded-3xl p-6 text-center transition-all hover:-translate-y-1"
              style={{ background: "#FFFFFF", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-[28px]"
                style={{ background: `${s.color}12` }}>{s.icon}</div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest mb-2" style={{ color: s.color }}>Step {s.num}</div>
              <h3 className="text-[18px] font-extrabold mb-2" style={{ color: "#1A3A0A", fontFamily: "var(--font-baloo)" }}>{s.title}</h3>
              <p className="text-[14px] leading-relaxed font-medium" style={{ color: "#3D6B2E" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
