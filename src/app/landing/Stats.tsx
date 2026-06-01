"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const GOALS = [
  { icon: "🔥", value: 30, suffix: " days", label: "Build a study streak", desc: "Students who track daily build consistency in 30 days" },
  { icon: "⏱", value: 120, suffix: " hours", label: "Focused study time", desc: "Average monthly deep work with guided sessions" },
  { icon: "📈", value: 94, suffix: "%", label: "Report feeling more disciplined", desc: "Based on early access student feedback" },
  { icon: "🌳", value: 5, suffix: " levels", label: "Tree growth stages", desc: "From Seedling to Ancient Tree — progress visualized" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: GOALS[i].value, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => { el!.textContent = Math.round(obj.val).toString(); },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: "#FDF9F0" }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(24px, 3.5vw, 36px)", color: "#3D2E24" }}>
          What you <span style={{ color: "#58CC02" }}>can achieve</span>
        </h2>
        <p className="text-[14px] font-medium mb-12 max-w-md mx-auto" style={{ color: "#6B5D52" }}>
          Real results from consistent study habits. Backed by student feedback.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GOALS.map((g, i) => (
            <div key={i} className="rounded-2xl p-5 text-center" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 8px rgba(0,0,0,0.02)" }}>
              <span className="text-[28px] block mb-2">{g.icon}</span>
              <div className="text-[32px] sm:text-[40px] font-extrabold leading-none mb-1" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>
                <span ref={el => { statRefs.current[i] = el; }}>0</span>{g.suffix}
              </div>
              <p className="text-[13px] font-extrabold mb-1" style={{ color: "#3D2E24" }}>{g.label}</p>
              <p className="text-[11px] font-medium" style={{ color: "#9B8E84" }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
