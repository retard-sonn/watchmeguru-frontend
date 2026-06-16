"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fireStreak } from "@/lib/confetti";
import { playSound } from "@/lib/sound";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22S4 17.5 4 10V5L12 2L20 5V10C20 17.5 12 22 12 22Z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14H11.5L11 22L21 10H12.5L13 2Z" />
  </svg>
);

const CustomFlameIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3C16 3 10 9 10 16C10 21.5228 12.6863 26 16 28C19.3137 26 22 21.5228 22 16C22 9 16 3 16 3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 12C16 12 13 15.5 13 19C13 21.2091 14.3431 23 16 24C17.6569 23 19 21.2091 19 19C19 15.5 16 12 16 12Z" fill="#FDF9F0" />
    <circle cx="9" cy="8" r="1.5" fill="currentColor" />
    <circle cx="24" cy="13" r="2" fill="currentColor" />
    <circle cx="21" cy="6" r="1" fill="currentColor" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4H20V8C20 12.418 16.418 16 12 16C7.582 16 4 12.418 4 8V4Z" />
    <path d="M12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 8C2.5 8 1 7 1 5V4H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 8C21.5 8 23 7 23 5V4H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RANKS = [
  { level: 1, name: "Beginner", icon: <StarIcon />, color: "#6B8F5E" },
  { level: 5, name: "Disciplined", icon: <ShieldIcon />, color: "#58CC02" },
  { level: 10, name: "Focused", icon: <ZapIcon />, color: "#1CB0F6" },
  { level: 20, name: "Consistent", icon: <CustomFlameIcon />, color: "#58CC02" },
  { level: 30, name: "Elite", icon: <TrophyIcon />, color: "#CE82FF" },
];

const STREAK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEMO_ACTIVE = [true, true, true, true, true, false, false];

export default function StreakEngine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const streakBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
     
      gsap.to(flameRef.current, {
        scale: 1.08, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut",
      });

      const obj = { val: 0 };
      if (counterRef.current) {
        gsap.to(obj, {
          val: 14, duration: 2.5, ease: "power2.out",
          scrollTrigger: { trigger: counterRef.current, start: "top 85%", once: true },
          onUpdate: () => { if (counterRef.current) counterRef.current.textContent = Math.round(obj.val).toString(); },
          onComplete: () => { if (streakBoxRef.current) fireStreak(streakBoxRef.current); }
        });
      }

      gsap.fromTo(barRef.current, { width: "0%" }, {
        width: "65%", duration: 2,
        scrollTrigger: { trigger: barRef.current, start: "top 85%", once: true },
      });

      const rankEls = document.querySelectorAll(".rank-item");
      gsap.fromTo(rankEls, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".rank-row", start: "top 85%", once: true },
      });

      const dots = document.querySelectorAll(".streak-dot");
      gsap.fromTo(dots, { scale: 0 }, {
        scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(2)",
        scrollTrigger: { trigger: ".streak-calendar", start: "top 90%", once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 px-6" style={{ background: "#F0FDF4" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4vw, 44px)", color: "#1A3A0A" }}>
            The <span style={{ color: "#58CC02" }}>Streak Engine</span>
          </h2>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: "#3D6B2E" }}>
            Gaming-level progression that keeps you coming back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div ref={streakBoxRef} onMouseEnter={() => { if(streakBoxRef.current) gsap.to(streakBoxRef.current, {scale:1.03, duration:0.3, ease: "back.out(1.5)"}); playSound("pop"); }} onMouseLeave={() => { if (streakBoxRef.current) gsap.to(streakBoxRef.current, {scale: 1, duration: 0.3, ease: "power2.out"}) }} className="rounded-2xl p-6 text-center cursor-pointer transition-shadow hover:shadow-[0_8px_32px_rgba(88,204,2,0.15)]" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
              <div ref={flameRef} className="inline-block mb-3">
                <div style={{ color: "#58CC02" }}>
                  <CustomFlameIcon size={48} />
                </div>
              </div>
              <div className="text-[48px] font-extrabold leading-none" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>
                <span ref={counterRef}>0</span>
              </div>
              <p className="text-[14px] font-bold uppercase tracking-widest mt-1" style={{ color: "#58CC02" }}>Day Streak</p>
              <p className="text-[13px] font-medium mt-2" style={{ color: "#3D6B2E" }}>
                Keep it alive tomorrow 👊
              </p>
            </div>

            <div className="streak-calendar rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="flex justify-between">
                {STREAK_DAYS.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase" style={{ color: "#6B8F5E" }}>{day}</span>
                    <div className={`streak-dot w-9 h-9 rounded-full flex items-center justify-center text-[14px]`}
                      style={{ background: DEMO_ACTIVE[i] ? "#58CC02" : "rgba(0,0,0,0.04)" }}>
                      {DEMO_ACTIVE[i] ? "🔥" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#6B8F5E" }}>XP Progress</span>
                <span className="text-[14px] font-extrabold" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>3,250 / 5,000</span>
              </div>
              <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
                <div ref={barRef} className="h-full rounded-full" style={{
                  width: "0%",
                  background: "linear-gradient(90deg, #58CC02 0%, #FF9E1B 60%, #FFC800 100%)",
                  boxShadow: "0 0 12px rgba(88,204,2,0.3)",
                }} />
              </div>
              <p className="text-[11px] font-medium mt-2 text-right" style={{ color: "#6B8F5E" }}>
                1,750 XP to Level 6
              </p>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.04)" }}>
              <h3 className="text-[13px] font-bold uppercase tracking-widest mb-4" style={{ color: "#6B8F5E" }}>Your Journey</h3>
              <div className="rank-row space-y-2">
                {RANKS.map((r, i) => (
                  <div key={r.name} className="rank-item flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: i <= 2 ? `${r.color}08` : "transparent" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: i <= 2 ? `${r.color}15` : "rgba(0,0,0,0.04)", color: i <= 2 ? r.color : "#6B8F5E" }}>
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold" style={{ color: i <= 2 ? "#1A3A0A" : "#6B8F5E" }}>{r.name}</p>
                      <p className="text-[10px] font-medium" style={{ color: "#6B8F5E" }}>Level {r.level}{i <= 2 ? " ✓" : ""}</p>
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
