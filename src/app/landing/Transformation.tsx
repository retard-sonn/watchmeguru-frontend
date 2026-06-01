"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, UserX, MessageSquareText, CalendarCheck, Flame, Trophy, Star } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const SCENE = [
  { Icon: UserX, title: "You're stuck.", desc: "Missed sessions. Broken routines. Exam anxiety. Every day feels the same.", color: "#9B8E84" },
  { Icon: MessageSquareText, title: "Mentor arrives.", desc: "A WhatsApp message. \"Hey. You planned 4 hours today. Let's start.\"", color: "#25D366" },
  { Icon: CalendarCheck, title: "Schedule builds itself.", desc: "Your daily plan appears. Physics at 6. Math at 7:30. No thinking required.", color: "#1CB0F6" },
  { Icon: Flame, title: "Streaks begin.", desc: "Day 1. Day 3. Day 7. Day 14. Each day builds on the last. Your tree grows.", color: "#FF7A00" },
  { Icon: Trophy, title: "You level up.", desc: "Seedling → Sprout → Sapling → Tree → Forest. 7 ranks conquered.", color: "#D9A441" },
  { Icon: Star, title: "You're different now.", desc: "210 study hours. 87-day streak. Exam ready. Parents proud. You did this.", color: "#58CC02" },
];

export default function Transformation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", end: "top 20%", scrub: 0.6 } });
        tl.fromTo(el, { opacity: 0.25, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
        if (i < SCENE.length - 1) tl.to(el, { opacity: 0.35, scale: 0.97, duration: 0.4 }, "+=0.5");
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ background: "#FDF9F0" }}>
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="font-extrabold tracking-tight mb-3" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(26px, 3.5vw, 40px)", color: "#3D2E24" }}>
          Your <span style={{ color: "#58CC02" }}>transformation</span> starts here
        </h2>
        <p className="text-[14px] font-medium max-w-md mx-auto" style={{ color: "#6B5D52" }}>Scroll through your journey. No emojis. Real progress.</p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        {SCENE.map((s, i) => (
          <div key={i} ref={el => { sceneRefs.current[i] = el; }}
            className="rounded-2xl p-5 flex items-start gap-4 transition-all"
            style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 8px rgba(0,0,0,0.02)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}12` }}>
              <s.Icon size={22} style={{ color: s.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-extrabold mb-1" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>{s.title}</h3>
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#6B5D52" }}>{s.desc}</p>
            </div>
            {i < SCENE.length - 1 && (
              <div className="flex items-center flex-shrink-0"><ArrowRight size={18} style={{ color: "#9B8E84" }} /></div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto mt-10 text-center">
        <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(88,204,2,0.05), rgba(255,200,0,0.03))", border: "1px solid rgba(88,204,2,0.1)" }}>
          <Sparkles size={22} className="mx-auto mb-3" style={{ color: "#58CC02" }} />
          <h3 className="text-[16px] font-extrabold mb-2" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>This is your story. Write it.</h3>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-[15px] font-extrabold text-white mt-2"
            style={{ background: "linear-gradient(135deg, #58CC02, #46A302)", boxShadow: "0 4px 16px rgba(88,204,2,0.3)", fontFamily: "var(--font-baloo)" }}>
            Start Your Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}
