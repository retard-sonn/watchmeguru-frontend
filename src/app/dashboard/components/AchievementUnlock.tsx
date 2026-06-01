"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import InteractiveMascot from "@/components/InteractiveMascot";

interface AchievementUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: { label: string; Badge?: any; rarity: string; desc: string; color: string; } | null;
}

const RARITY = {
  common: { label: "Common", color: "#9B8E84", glow: "rgba(155,142,132,0.3)" },
  rare: { label: "Rare", color: "#1CB0F6", glow: "rgba(28,176,246,0.4)" },
  epic: { label: "Epic", color: "#CE82FF", glow: "rgba(206,130,255,0.4)" },
  legendary: { label: "Legendary", color: "#D9A441", glow: "rgba(217,164,65,0.5)" },
};

export default function AchievementUnlock({ isOpen, onClose, achievement }: AchievementUnlockProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isOpen || !achievement) return;
    setMounted(true);

    const ctx = gsap.context(() => {
      const r = RARITY[achievement.rarity as keyof typeof RARITY] || RARITY.common;
      const tl = gsap.timeline();

      // Stage 1: Backdrop darkens
      tl.to(backdropRef.current, { opacity: 1, duration: 0.3 });

      // Stage 2: Mascot jumps in from top
      tl.fromTo(mascotRef.current, { y: -200, scale: 0.5, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)",
      }, "+=0.1");

      // Stage 3: Badge scales in with rotation
      tl.fromTo(badgeRef.current, { scale: 0, rotate: -180, opacity: 0 }, {
        scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: "back.out(2)",
      }, "-=0.3");

      // Stage 4: Title + description
      tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.4, ease: "power3.out",
      }, "-=0.2");

      // Stage 5: Confetti burst
      for (let i = 0; i < 40; i++) {
        const dot = document.createElement("div");
        dot.className = "absolute rounded-full pointer-events-none";
        dot.style.cssText = `width:${4+Math.random()*8}px;height:${4+Math.random()*8}px;background:${r.color};top:50%;left:50%;box-shadow:0 0 6px ${r.glow};`;
        backdropRef.current?.appendChild(dot);

        gsap.to(dot, {
          x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400,
          opacity: 0, scale: 0, duration: 0.8 + Math.random() * 0.6,
          ease: "power2.out", delay: 1.5 + Math.random() * 0.3,
          onComplete: () => dot.remove(),
        });
      }

      // Stage 6: Mascot celebration wiggle
      tl.to(mascotRef.current, {
        rotation: -8, duration: 0.1, yoyo: true, repeat: 5, ease: "power1.inOut",
      }, "+=0.5");

    }, backdropRef);

    return () => ctx.revert();
  }, [isOpen, achievement]);

  if (!isOpen || !achievement || !mounted) return null;

  const r = RARITY[achievement.rarity as keyof typeof RARITY] || RARITY.common;

  return (
    <div ref={backdropRef} className="fixed inset-0 z-[150] flex items-center justify-center p-4" style={{ opacity: 0, background: "rgba(61,46,36,0.7)", backdropFilter: "blur(16px)" }}>
      <div ref={cardRef} className="text-center relative">
        {/* Mascot */}
        <div ref={mascotRef} className="flex justify-center mb-4">
          <InteractiveMascot size={160} />
        </div>

        {/* Badge */}
        <div ref={badgeRef} className="flex justify-center mb-4">
          {achievement.Badge && <achievement.Badge size={80} unlocked={true} />}
        </div>

        {/* Title */}
        <div ref={titleRef}>
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3"
            style={{ background: `${r.color}15`, color: r.color }}>Achievement Unlocked</span>
          <h2 className="text-[32px] font-extrabold leading-none mb-2" style={{ color: "#FDF9F0", fontFamily: "var(--font-baloo)" }}>
            {achievement.label}
          </h2>
          <p className="text-[13px] font-medium mb-2" style={{ color: r.color }}>{r.label} Tier</p>
          <p className="text-[14px] font-medium mb-8 opacity-70" style={{ color: "#FDF9F0" }}>{achievement.desc}</p>

          <button onClick={onClose}
            className="px-8 py-3 rounded-xl text-[14px] font-extrabold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}CC)`, boxShadow: `0 6px 24px ${r.glow}`, fontFamily: "var(--font-baloo)" }}>
            Continue Growing →
          </button>
        </div>
      </div>
    </div>
  );
}
