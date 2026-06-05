"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import { LevelInfo } from "@/lib/levelSystem";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  levelInfo: LevelInfo;
  previousTitle?: string;
}

export default function AchievementUnlock({ isOpen, onClose, levelInfo, previousTitle }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial Scale Pop
      gsap.fromTo(badgeRef.current, 
        { scale: 0, rotation: -20 }, 
        { scale: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.5)", delay: 0.2 }
      );

      // 2. Shimmer / Glimmer Effect
      if (shimmerRef.current) {
        gsap.fromTo(shimmerRef.current,
          { x: "-150%" },
          { x: "150%", duration: 1.5, repeat: -1, repeatDelay: 1, ease: "power2.inOut" }
        );
      }

      // 3. Staggered Icon Burst
      if (iconsRef.current) {
        const icons = iconsRef.current.children;
        gsap.fromTo(icons,
          { opacity: 0, scale: 0, x: 0, y: 0 },
          { 
            opacity: 0.6, 
            scale: 0.8, 
            x: (i) => Math.cos(i * 0.8) * 160, 
            y: (i) => Math.sin(i * 0.8) * 160, 
            rotation: "random(-45, 45)",
            duration: 0.8, 
            stagger: 0.05, 
            ease: "back.out(1.5)",
            delay: 0.5 
          }
        );
      }

      // 4. Text Reveal
      gsap.from(".reveal-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.8
      });
    }, modalRef);

    return () => ctx.revert();
  }, [isOpen]);

  const SUBJECTS = ["physics", "maths", "chemistry", "biology", "history", "english", "geography", "economics"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#3D2E24]/60 backdrop-blur-md">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-[#FDF9F0] rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl border-4"
            style={{ borderColor: levelInfo.color }}
          >
            {/* Background Glow */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 40%, ${levelInfo.color} 0%, transparent 70%)` }}
            />

            {/* Subject Icon Burst */}
            <div ref={iconsRef} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              {SUBJECTS.map((s, i) => {
                const Icon = getSubjectIcon(s);
                return <div key={i} className="absolute w-12 h-12"><Icon /></div>;
              })}
            </div>

            {/* The Badge */}
            <div className="relative mb-8 flex justify-center">
              <div 
                ref={badgeRef}
                className="w-32 h-32 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-xl"
                style={{ background: levelInfo.color }}
              >
                <span className="text-[64px] relative z-10">{levelInfo.badge}</span>
                {/* Glimmer Overlay */}
                <div 
                  ref={shimmerRef}
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ 
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                    transform: "skewX(-25deg)" 
                  }}
                />
              </div>
              {/* Crown/Trophy Decoration */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-2 bg-[#FFC800] p-2.5 rounded-2xl shadow-lg border-2 border-white"
              >
                <Trophy size={20} color="white" fill="white" />
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="relative z-30">
              <span className="reveal-text block text-[12px] font-bold uppercase tracking-[0.2em] text-[#9B8E84] mb-2">New Achievement!</span>
              <h2 className="reveal-text text-[32px] font-extrabold leading-tight mb-4" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>
                You are now a <span style={{ color: levelInfo.color }}>{levelInfo.title}</span>
              </h2>
              
              <p className="reveal-text text-[15px] font-medium text-[#6B5D52] mb-8 leading-relaxed">
                {previousTitle ? `Farewell, ${previousTitle}. ` : ""}
                Your ecosystem has evolved! You've reached Level {levelInfo.level}. Keep planting knowledge!
              </p>

              <button 
                onClick={onClose}
                className="reveal-text w-full py-4 rounded-2xl text-[16px] font-extrabold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: levelInfo.color, boxShadow: `0 8px 0 ${levelInfo.color}40`, fontFamily: "var(--font-baloo)" }}
              >
                Amazing — Keep Going! <ArrowRight size={20} />
              </button>
            </div>

            {/* Decorative Sparkles */}
            <div className="absolute top-10 left-10 opacity-30"><Sparkles size={24} color={levelInfo.color} /></div>
            <div className="absolute bottom-20 right-8 opacity-30 rotate-45"><Sparkles size={20} color={levelInfo.color} /></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
