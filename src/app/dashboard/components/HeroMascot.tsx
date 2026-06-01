"use client";
import { motion } from "motion/react";
import GuruGuardian from "@/components/illustrations/GuruGuardian";

interface HeroMascotProps {
  xp: number;
  level: number;
  dayStreak: number;
  studyHours: number;
  tasksCompleted: number;
  sessionActive: boolean;
}

const NEXT_XP = 500;

const RANKS: Record<number, { name: string; emoji: string; color: string; minLevel: number }> = {
  1:  { name: "Bronze Scholar",   emoji: "🥉", color: "#CD7F32", minLevel: 1 },
  3:  { name: "Silver Scholar",   emoji: "🥈", color: "#A8A8A8", minLevel: 3 },
  5:  { name: "Gold Scholar",     emoji: "🥇", color: "#D9A441", minLevel: 5 },
  8:  { name: "Master Scholar",   emoji: "💎", color: "#1CB0F6", minLevel: 8 },
  12: { name: "Grandmaster",      emoji: "👑", color: "#CE82FF", minLevel: 12 },
  20: { name: "Legendary Scholar", emoji: "🌟", color: "#FFC800", minLevel: 20 },
};

const GROWTH_STAGES: Record<number, { name: string; emoji: string; color: string; mascotSize: number; desc: string }> = {
  1:  { name: "Seed",      emoji: "🌱", color: "#7BA65B",  mascotSize: 72,  desc: "Just planted. Water daily with focus." },
  3:  { name: "Sprout",    emoji: "🌿", color: "#58CC02",  mascotSize: 80,  desc: "First leaves. Getting stronger." },
  5:  { name: "Sapling",   emoji: "🪴", color: "#94A84D",  mascotSize: 88,  desc: "Roots run deep. Standing tall." },
  8:  { name: "Young Tree", emoji: "🌲", color: "#1CB0F6", mascotSize: 96, desc: "Branches spreading. Weathering storms." },
  12: { name: "Mighty Tree", emoji: "🌳", color: "#D9A441", mascotSize: 104, desc: "Full canopy. Bearing fruit." },
  20: { name: "Ancient Tree", emoji: "🏆", color: "#CE82FF", mascotSize: 112, desc: "A forest unto itself. Legendary." },
};

function getRank(lv: number) {
  let best = RANKS[1];
  for (const [k, v] of Object.entries(RANKS)) { if (lv >= parseInt(k)) best = v; }
  return best;
}

function getGrowth(lv: number) {
  let best = GROWTH_STAGES[1];
  for (const [k, v] of Object.entries(GROWTH_STAGES)) { if (lv >= parseInt(k)) best = v; }
  return best;
}

export default function HeroMascot({ xp, level, dayStreak, studyHours, tasksCompleted, sessionActive }: HeroMascotProps) {
  const xpInLevel = xp % NEXT_XP;
  const xpPct = Math.min((xpInLevel / NEXT_XP) * 100, 100);
  const rank = getRank(level);
  const growth = getGrowth(level);
  const nextGrowth = getGrowth(level + 1);
  const xpToNextGrowth = (Object.entries(GROWTH_STAGES).find(([k]) => parseInt(k) > level)?.[0]
    ? (parseInt(Object.entries(GROWTH_STAGES).find(([k]) => parseInt(k) > level)?.[0] ?? "0") - level) * NEXT_XP
    : NEXT_XP);

  const mentorState = sessionActive ? "active" : "idle";

  return (
    <motion.div
      className="rounded-[28px] overflow-hidden relative"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        background: "linear-gradient(170deg, #FDFDFC 0%, #F8FAF5 40%, #F0F5EB 100%)",
        border: "1.5px solid rgba(123,166,91,0.1)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.03)",
      }}
    >
      <div className="relative z-10 p-5 sm:p-6">
        {/* Top row: Rank badge */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ borderColor: `${rank.color}30`, background: `${rank.color}10` }}
            whileHover={{ scale: 1.03 }}
          >
            <span className="text-[16px]">{rank.emoji}</span>
            <span className="text-[11px] font-extrabold" style={{ color: rank.color, fontFamily: "var(--font-baloo)" }}>
              {rank.name}
            </span>
          </motion.div>

          {/* Streak pill */}
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: dayStreak > 0 ? "rgba(255,75,75,0.08)" : "rgba(0,0,0,0.03)" }}
            animate={dayStreak > 0 ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[16px]">{dayStreak > 0 ? "🔥" : "💤"}</span>
            <span className="text-[11px] font-extrabold" style={{ color: dayStreak > 0 ? "#FF4B4B" : "#9B8E84", fontFamily: "var(--font-baloo)" }}>
              {dayStreak > 0 ? `${dayStreak} DAY STREAK` : "Start your streak"}
            </span>
          </motion.div>
        </div>

        {/* Middle: Mascot + Growth Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
          {/* Mascot — LARGE */}
          <motion.div
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.06 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: growth.mascotSize + 40,
                height: growth.mascotSize + 40,
                background: `radial-gradient(circle, ${growth.color}20 0%, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <GuruGuardian size={growth.mascotSize} state={mentorState} />
          </motion.div>

          {/* Growth info + Stats */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            {/* Growth stage */}
            <div className="flex items-center gap-2">
              <span className="text-[24px]">{growth.emoji}</span>
              <div>
                <h2 className="text-[22px] font-extrabold leading-none" style={{ color: growth.color, fontFamily: "var(--font-baloo)" }}>
                  {growth.name}
                </h2>
                <p className="text-[12px] font-medium text-[#6B5D52]">{growth.desc}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.02)]">
                <span className="text-[14px]">⏱</span>
                <span className="text-[13px] font-bold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
                  {studyHours.toFixed(1)}h
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.02)]">
                <span className="text-[14px]">✅</span>
                <span className="text-[13px] font-bold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
                  {tasksCompleted} done
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.02)]">
                <span className="text-[14px]">📈</span>
                <span className="text-[13px] font-bold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
                  Lv.{level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* XP Bar — MASSIVE */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#9B8E84]">XP</span>
              <span className="text-[13px] font-extrabold text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>
                {xp}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#9B8E84]">
                Next: {nextGrowth.name} {nextGrowth.emoji}
              </span>
              <span className="text-[11px] font-bold text-[#1CB0F6]" style={{ fontFamily: "var(--font-baloo)" }}>
                ~{xpToNextGrowth} XP
              </span>
            </div>
          </div>
          <div className="relative h-4 w-full rounded-full overflow-hidden bg-[rgba(0,0,0,0.04)]">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #58CC02 0%, #7BA65B 60%, #FFC800 100%)",
                boxShadow: "0 0 14px rgba(88,204,2,0.3)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Pip markers */}
            {[25, 50, 75].map(p => (
              <div key={p} className="absolute top-0 bottom-0 w-px" style={{ left: `${p}%`, background: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
