"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SeedStage, SproutStage, SaplingStage, TreeStage, ForestStage, WorldTreeStage } from "@/components/illustrations/TreeStages";
import { ConsistencyBadge, DisciplineBadge, DeepFocusBadge, NightOwlBadge, EarlyBirdBadge } from "@/components/illustrations/AchievementBadges";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  { level: 1, name: "Seed", Illo: SeedStage, color: "#7BA65B", desc: "You start here. Plant your first session." },
  { level: 3, name: "Sprout", Illo: SproutStage, color: "#58CC02", desc: "First leaves appear. You're growing." },
  { level: 5, name: "Sapling", Illo: SaplingStage, color: "#94A84D", desc: "Roots run deep. Standing tall." },
  { level: 8, name: "Tree", Illo: TreeStage, color: "#1CB0F6", desc: "Branches spreading. Bearing fruit." },
  { level: 12, name: "Forest", Illo: ForestStage, color: "#D9A441", desc: "Full canopy. An ecosystem now." },
  { level: 20, name: "World Tree", Illo: WorldTreeStage, color: "#CE82FF", desc: "A legend. You are the mentor." },
];

const BADGES = [
  { at: 1, Badge: ConsistencyBadge, label: "Consistency", color: "#58CC02" },
  { at: 2, Badge: DisciplineBadge, label: "Discipline", color: "#1CB0F6" },
  { at: 3, Badge: DeepFocusBadge, label: "Deep Focus", color: "#CE82FF" },
  { at: 4, Badge: NightOwlBadge, label: "Night Owl", color: "#78A6D8" },
  { at: 5, Badge: EarlyBirdBadge, label: "Early Bird", color: "#D9A441" },
];

export default function LearningTree() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const illoRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section, scrub through stages
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
        },
      });

      STAGES.forEach((_, i) => {
        if (i === 0) return;
        tl.call(() => setActiveStage(i), [], i * 0.18);
      });

      // Progress path fill
      gsap.fromTo(".path-fill-line", { width: "0%" }, {
        width: "100%",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "+=250%", scrub: 1 },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Idle animation on illustration
  useEffect(() => {
    if (!illoRef.current) return;
    const ctx = gsap.context(() => {
      // Gentle float + sway
      gsap.to(illoRef.current, {
        y: -8, rotation: 1.5, duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut",
      });
      // Subtle scale breathing
      gsap.to(illoRef.current, {
        scale: 1.04, duration: 2.5, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 0.5,
      });
    }, illoRef);
    return () => ctx.revert();
  }, [activeStage]); // Re-trigger on stage change

  const s = STAGES[activeStage];
  const ActiveIllo = s.Illo;

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F4EEDB 0%, #EBE3C8 50%, #F4EEDB 100%)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="font-extrabold tracking-tight mb-2" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(24px, 3vw, 36px)", color: "#3D2E24" }}>
            Your <span style={{ color: "#58CC02" }}>growth journey</span>
          </h2>
          <p className="text-[13px] font-medium" style={{ color: "#6B5D52" }}>Scroll to unlock each stage</p>
        </div>

        {/* ─── CENTERED ACTIVE STAGE — The reward — large, animated, unmissable ─── */}
        <div ref={illoRef} className="flex flex-col items-center mb-8">
          <div className="mb-4" style={{ filter: `drop-shadow(0 16px 48px ${s.color}30)` }}>
            <ActiveIllo size={180} />
          </div>
          <h3 className="text-[32px] font-extrabold leading-none mb-1" style={{ color: s.color, fontFamily: "var(--font-baloo)" }}>{s.name}</h3>
          <p className="text-[14px] font-medium mb-2" style={{ color: "#6B5D52" }}>{s.desc}</p>
          <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full" style={{ background: `${s.color}10`, color: s.color }}>Level {s.level}+</span>
        </div>

        {/* ─── ANIMATED PROGRESS PATH — Glowing, premium ─── */}
        <div className="w-full max-w-md mb-8">
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-4 left-0 right-0 h-[3px] rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
              {/* Animated fill */}
              <div className="path-fill-line absolute top-0 left-0 h-full rounded-full" style={{
                background: `linear-gradient(90deg, ${STAGES[0].color}, ${STAGES[activeStage].color})`,
                boxShadow: `0 0 8px ${s.color}40`,
                width: `${((activeStage) / (STAGES.length - 1)) * 100}%`,
                transition: "width 1s ease",
              }} />
            </div>
            {/* Stage dots */}
            <div className="relative flex justify-between">
              {STAGES.map((st, i) => (
                <div key={st.level} className="flex flex-col items-center gap-1.5 z-10">
                  <div className="rounded-full transition-all duration-500"
                    style={{
                      width: i <= activeStage ? 14 : 9,
                      height: i <= activeStage ? 14 : 9,
                      background: i <= activeStage ? st.color : "rgba(0,0,0,0.1)",
                      boxShadow: i === activeStage ? `0 0 16px ${st.color}80` : i <= activeStage ? `0 0 6px ${st.color}30` : "none",
                    }} />
                  <span className="text-[9px] font-extrabold text-center leading-tight" style={{ color: i <= activeStage ? st.color : "#9B8E84", fontFamily: "var(--font-baloo)" }}>
                    {st.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── ACHIEVEMENT BADGES — Premium, interactive ─── */}
        <div className="w-full max-w-md">
          <div className="grid grid-cols-5 gap-2">
            {BADGES.map((b, i) => {
              const unlocked = activeStage >= b.at;
              return (
                <div key={b.label} className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-500 hover:scale-105"
                  style={{
                    background: unlocked ? `${b.color}08` : "transparent",
                    opacity: unlocked ? 1 : 0.3,
                    cursor: unlocked ? "pointer" : "default",
                  }}>
                  <b.Badge size={44} unlocked={unlocked} />
                  <span className="text-[9px] font-extrabold text-center leading-tight" style={{ color: unlocked ? "#3D2E24" : "#9B8E84", fontFamily: "var(--font-baloo)" }}>
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
