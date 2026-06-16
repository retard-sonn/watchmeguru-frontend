"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { playSound } from "@/lib/sound";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const GrowthIcon = ({ className, style, size = 22 }: { className?: string, style?: React.CSSProperties, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
  </svg>
);

const UserStuckIcon = ({ size = 22, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" y1="8" x2="23" y2="14" />
    <line x1="23" y1="8" x2="17" y2="14" />
  </svg>
);

const MessageIcon = ({ size = 22, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
    <path d="M12 10h.01" />
  </svg>
);

const CalendarIcon = ({ size = 22, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

const FlameIcon = ({ size = 22, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const TrophyIcon = ({ size = 22, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const ArrowRightIcon = ({ size = 18, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const SCENE = [
  { Icon: UserStuckIcon, title: "You're stuck.", desc: "Missed sessions. Broken routines. Exam anxiety. Every day feels the same.", color: "#6B8F5E" },
  { Icon: MessageIcon, title: "Mentor arrives.", desc: "A WhatsApp message. \"Hey. You planned 4 hours today. Let's start.\"", color: "#25D366" },
  { Icon: CalendarIcon, title: "Schedule builds itself.", desc: "Your daily plan appears. Physics at 6. Math at 7:30. No thinking required.", color: "#1CB0F6" },
  { Icon: FlameIcon, title: "Streaks begin.", desc: "Day 1. Day 3. Day 7. Day 14. Each day builds on the last. Your tree grows.", color: "#FF7A00" },
  { Icon: TrophyIcon, title: "You level up.", desc: "Seedling → Sprout → Sapling → Tree → Forest. 7 ranks conquered.", color: "#58CC02" },
  { Icon: GrowthIcon, title: "You're different now.", desc: "210 study hours. 87-day streak. Exam ready. Parents proud. You did this.", color: "#58CC02" },
];

export default function Transformation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", end: "top 20%", scrub: 0.6 } });
        tl.fromTo(el, { opacity: 0.25, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => { if (i > 0) playSound("whoosh"); } });
        if (i < SCENE.length - 1) tl.to(el, { opacity: 0.35, scale: 0.97, duration: 0.4 }, "+=0.5");
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 px-6" style={{ background: "#F0FDF4" }}>
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="font-extrabold tracking-tight mb-3" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(26px, 3.5vw, 40px)", color: "#1A3A0A" }}>
          Your <span style={{ color: "#58CC02" }}>transformation</span> starts here
        </h2>
        <p className="text-[14px] font-medium max-w-md mx-auto" style={{ color: "#3D6B2E" }}>Scroll through your journey. No emojis. Real progress.</p>
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
              <h3 className="text-[16px] font-extrabold mb-1" style={{ color: "#1A3A0A", fontFamily: "var(--font-baloo)" }}>{s.title}</h3>
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#3D6B2E" }}>{s.desc}</p>
            </div>
            {i < SCENE.length - 1 && (
              <div className="flex items-center flex-shrink-0"><ArrowRightIcon size={18} style={{ color: "#6B8F5E" }} /></div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto mt-10 text-center">
        <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(88,204,2,0.05), rgba(255,200,0,0.03))", border: "1px solid rgba(88,204,2,0.1)" }}>
          <GrowthIcon className="mx-auto mb-3" style={{ color: "#58CC02" }} />
          <h3 className="text-[16px] font-extrabold mb-2" style={{ color: "#1A3A0A", fontFamily: "var(--font-baloo)" }}>This is your story. Write it.</h3>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-[15px] font-extrabold text-white mt-2"
            style={{ background: "linear-gradient(135deg, #58CC02, #46A302)", boxShadow: "0 4px 16px rgba(88,204,2,0.3)", fontFamily: "var(--font-baloo)" }}>
            Start Your Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}
