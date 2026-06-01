"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, Zap, Trophy, Star, Shield } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const RANKS = [
  { level: 1, name: "Beginner", icon: <Star size={18} />, color: "#9B8E84" },
  { level: 5, name: "Disciplined", icon: <Shield size={18} />, color: "#58CC02" },
  { level: 10, name: "Focused", icon: <Zap size={18} />, color: "#1CB0F6" },
  { level: 20, name: "Consistent", icon: <Flame size={18} />, color: "#D9A441" },
  { level: 30, name: "Elite", icon: <Trophy size={18} />, color: "#CE82FF" },
];

const STREAK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEMO_ACTIVE = [true, true, true, true, true, false, false];

export default function StreakEngine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Flame flicker
      gsap.to(flameRef.current, {
        scale: 1.08, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut",
      });

      // Streak counter
      const obj = { val: 0 };
      if (counterRef.current) {
        gsap.to(obj, {
          val: 14, duration: 2.5, ease: "power2.out",
          scrollTrigger: { trigger: counterRef.current, start: "top 85%", once: true },
          onUpdate: () => { if (counterRef.current) counterRef.current.textContent = Math.round(obj.val).toString(); },
        });
      }

      // XP bar fill
      gsap.fromTo(barRef.current, { width: "0%" }, {
        width: "65%", duration: 2,
        scrollTrigger: { trigger: barRef.current, start: "top 85%", once: true },
      });

      // Ranks stagger
      const rankEls = document.querySelectorAll(".rank-item");
      gsap.fromTo(rankEls, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".rank-row", start: "top 85%", once: true },
      });

      // Calendar dots
      const dots = document.querySelectorAll(".streak-dot");
      gsap.fromTo(dots, { scale: 0 }, {
        scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(2)",
        scrollTrigger: { trigger: ".streak-calendar", start: "top 90%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ background: "#FDF9F0" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4vw, 44px)", color: "#3D2E24" }}>
            The <span style={{ color: "#58CC02" }}>Streak Engine</span>
          </h2>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: "#6B5D52" }}>
            Gaming-level progression that keeps you coming back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Streak + Calendar */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6 text-center" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
              <div ref={flameRef} className="inline-block mb-3">
                <Flame size={48} style={{ color: "#58CC02" }} fill="#58CC0220" />
              </div>
              <div className="text-[48px] font-extrabold leading-none" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>
                <span ref={counterRef}>0</span>
              </div>
              <p className="text-[14px] font-bold uppercase tracking-widest mt-1" style={{ color: "#58CC02" }}>Day Streak</p>
              <p className="text-[13px] font-medium mt-2" style={{ color: "#6B5D52" }}>
                Keep it alive tomorrow 👊
              </p>
            </div>

            {/* Streak calendar */}
            <div className="streak-calendar rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="flex justify-between">
                {STREAK_DAYS.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#9B8E84" }}>{day}</span>
                    <div className={`streak-dot w-9 h-9 rounded-full flex items-center justify-center text-[14px]`}
                      style={{ background: DEMO_ACTIVE[i] ? "#58CC02" : "rgba(0,0,0,0.04)" }}>
                      {DEMO_ACTIVE[i] ? "🔥" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: XP + Ranks */}
          <div className="space-y-6">
            {/* XP bar */}
            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#9B8E84" }}>XP Progress</span>
                <span className="text-[14px] font-extrabold" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>3,250 / 5,000</span>
              </div>
              <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
                <div ref={barRef} className="h-full rounded-full" style={{
                  width: "0%",
                  background: "linear-gradient(90deg, #58CC02 0%, #7BA65B 60%, #FFC800 100%)",
                  boxShadow: "0 0 12px rgba(88,204,2,0.3)",
                }} />
              </div>
              <p className="text-[11px] font-medium mt-2 text-right" style={{ color: "#9B8E84" }}>
                1,750 XP to Level 6
              </p>
            </div>

            {/* Ranks */}
            <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)" }}>
              <h3 className="text-[13px] font-bold uppercase tracking-widest mb-4" style={{ color: "#9B8E84" }}>Your Journey</h3>
              <div className="rank-row space-y-2">
                {RANKS.map((r, i) => (
                  <div key={r.name} className="rank-item flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: i <= 2 ? `${r.color}08` : "transparent" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: i <= 2 ? `${r.color}15` : "rgba(0,0,0,0.04)", color: i <= 2 ? r.color : "#9B8E84" }}>
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold" style={{ color: i <= 2 ? "#3D2E24" : "#9B8E84" }}>{r.name}</p>
                      <p className="text-[10px] font-medium" style={{ color: "#9B8E84" }}>Level {r.level}{i <= 2 ? " ✓" : ""}</p>
                    </div>
                    {i <= 2 && <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
